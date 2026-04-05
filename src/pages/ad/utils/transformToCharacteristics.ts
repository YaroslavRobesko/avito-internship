import config from "../assets/characteristicsConfig.json";
import type {
  AdById,
  AutoItemParams,
  RealEstateItemParams,
  ElectronicsItemParams,
} from "../../../types/types";

interface Characteristic {
  label: string;
  value: string;
}

// Типизация конфига
interface Config {
  categoryNames: {
    auto: string;
    real_estate: string;
    electronics: string;
  };
  realEstateTypeNames: {
    flat: string;
    house: string;
    room: string;
  };
  electronicsTypeNames: {
    phone: string;
    laptop: string;
    misc: string;
  };
  fieldLabels: Record<string, string>;
  formatRules: Record<string, { template: string; useLocale: boolean }>;
  valueMappings: Record<string, Record<string, string>>;
  fieldOrder: {
    auto: string[];
    real_estate: string[];
    electronics: string[];
  };
}

const typedConfig = config as Config;

// Форматирование значения на основе правил из конфига
const formatValue = (key: string, value: unknown): string => {
  if (value === undefined || value === null || value === "") return "";

  // Применяем маппинг значений если есть
  const valueMapping = typedConfig.valueMappings[key];
  if (valueMapping && typeof value === "string" && valueMapping[value]) {
    return valueMapping[value];
  }

  // Применяем правила форматирования
  const formatRule = typedConfig.formatRules[key];
  if (formatRule) {
    let formattedValue = String(value);
    if (formatRule.useLocale && typeof value === "number") {
      formattedValue = value.toLocaleString();
    }
    return formatRule.template.replace("{{value}}", formattedValue);
  }

  return String(value);
};

// Получение читаемого типа товара
const getDisplayType = (item: AdById): string => {
  const { category, params, title } = item;

  if (category === "auto") {
    const autoParams = params as AutoItemParams;
    if (autoParams?.brand && autoParams?.model) {
      return `${autoParams.brand} ${autoParams.model}`;
    }
    if (autoParams?.brand) return autoParams.brand;
    if (autoParams?.model) return autoParams.model;
    return typedConfig.categoryNames.auto;
  }

  if (category === "real_estate") {
    const realEstateParams = params as RealEstateItemParams;
    const type = realEstateParams?.type;
    if (type && typedConfig.realEstateTypeNames[type]) {
      return typedConfig.realEstateTypeNames[type];
    }
    return typedConfig.categoryNames.real_estate;
  }

  if (category === "electronics") {
    const electronicsParams = params as ElectronicsItemParams;
    const type = electronicsParams?.type;
    if (type && typedConfig.electronicsTypeNames[type]) {
      return typedConfig.electronicsTypeNames[type];
    }
    // Fallback: пытаемся угадать по заголовку
    const lowerTitle = title?.toLowerCase() || "";
    if (lowerTitle.includes("ноут") || lowerTitle.includes("laptop"))
      return "Ноутбук";
    if (
      lowerTitle.includes("телефон") ||
      lowerTitle.includes("iphone") ||
      lowerTitle.includes("phone")
    )
      return "Телефон";
    return typedConfig.categoryNames.electronics;
  }

  return "Товар";
};

// Безопасное получение значения параметра с проверкой типа
const getSafeParamValue = (item: AdById, key: string): unknown => {
  const { category, params } = item;

  if (!params) return undefined;

  switch (category) {
    case "auto":
      return (params as AutoItemParams)[key as keyof AutoItemParams];
    case "real_estate":
      return (params as RealEstateItemParams)[
        key as keyof RealEstateItemParams
      ];
    case "electronics":
      return (params as ElectronicsItemParams)[
        key as keyof ElectronicsItemParams
      ];
    default:
      return undefined;
  }
};

// Основная функция трансформации
const transformToCharacteristics = (item: AdById): Characteristic[] => {
  const characteristics: Characteristic[] = [];
  const { category } = item;

  // 1. Добавляем тип товара
  const displayType = getDisplayType(item);
  characteristics.push({
    label: "Тип",
    value: displayType,
  });

  // 3. Добавляем параметры в соответствии с порядком из конфига
  const fieldOrder = typedConfig.fieldOrder[category];

  if (fieldOrder) {
    for (const key of fieldOrder) {
      const value = getSafeParamValue(item, key);

      if (value !== undefined && value !== null && value !== "") {
        let displayValue = formatValue(key, value);

        // Особый случай: для type в electronics/real_estate используем красивое название
        if (key === "type") {
          if (category === "electronics" && typeof value === "string") {
            displayValue =
              typedConfig.electronicsTypeNames[
                value as keyof typeof typedConfig.electronicsTypeNames
              ] || value;
          } else if (category === "real_estate" && typeof value === "string") {
            displayValue =
              typedConfig.realEstateTypeNames[
                value as keyof typeof typedConfig.realEstateTypeNames
              ] || value;
          }
        }

        if (key === "type") continue;

        characteristics.push({
          label: typedConfig.fieldLabels[key] || key,
          value: displayValue,
        });
      }
    }
  }

  return characteristics;
};

export default transformToCharacteristics;
