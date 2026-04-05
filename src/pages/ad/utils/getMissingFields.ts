import type {
  AdById,
  AutoItemParams,
  RealEstateItemParams,
  ElectronicsItemParams,
} from "../../../types/types";

// Конфиг с полями для проверки (включая стандартные)
const importantFields: Record<string, string[]> = {
  auto: ["title", "description", "price", "brand", "model", "yearOfManufacture", "transmission", "mileage", "enginePower"],
  real_estate: ["title", "description", "price", "type", "address", "area", "floor"],
  electronics: ["title", "description", "price", "type", "brand", "model", "condition", "color"],
};

// Человеческие названия полей (для вывода)
const fieldNames: Record<string, string> = {
  // Стандартные поля
  title: "Название",
  description: "Описание",
  price: "Цена",
  
  // Auto
  brand: "Бренд",
  model: "Модель",
  yearOfManufacture: "Год выпуска",
  transmission: "Коробка передач",
  mileage: "Пробег",
  enginePower: "Мощность двигателя",
  
  // Real Estate
  type: "Тип",
  address: "Адрес",
  area: "Площадь",
  floor: "Этаж",
  
  // Electronics
  condition: "Состояние",
  color: "Цвет",
};

// Проверка, является ли поле пустым
const isEmpty = (value: unknown): boolean => {
  return value === undefined || value === null || value === "";
};

// Получение значения поля (работает и для стандартных полей, и для params)
const getFieldValue = (item: AdById, field: string): unknown => {
  // Сначала проверяем стандартные поля
  if (field === "title") return item.title;
  if (field === "description") return item.description;
  if (field === "price") return item.price;
  
  // Если не стандартное - ищем в params
  const { category, params } = item;
  if (!params) return undefined;
  
  switch (category) {
    case "auto":
      return (params as AutoItemParams)[field as keyof AutoItemParams];
    case "real_estate":
      return (params as RealEstateItemParams)[field as keyof RealEstateItemParams];
    case "electronics":
      return (params as ElectronicsItemParams)[field as keyof ElectronicsItemParams];
    default:
      return undefined;
  }
};

// Получение незаполненных полей
const getMissingFields = (item: AdById): string[] => {
  const { category } = item;
  
  // Получаем список полей для этой категории
  const fieldsToCheck = importantFields[category];
  if (!fieldsToCheck) return [];
  
  const missingFields: string[] = [];
  
  for (const field of fieldsToCheck) {
    const value = getFieldValue(item, field);
    
    // Если поле пустое - добавляем человеческое название
    if (isEmpty(value)) {
      const fieldName = fieldNames[field] || field;
      missingFields.push(fieldName);
    }
  }
  
  return missingFields;
};

export default getMissingFields;