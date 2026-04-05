import { Input, Typography, Flex, Dropdown, Button, message } from "antd";
import { DownOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback, useMemo } from "react";
import server from "../../api/server";
import type {
  AdById,
  ItemUpdateIn,
  AutoItemParams,
  RealEstateItemParams,
  ElectronicsItemParams,
} from "../../types/types";
import TextArea from "antd/es/input/TextArea";
import AIPriceButton from "./components/AIPriceButton/AIPriceButton";
import AIDescriptionButton from "./components/AIDescriptionButton/AIDescriptionButton";

const { Title, Text } = Typography;

// Конфиг для полей характеристик (порядок и типы элементов управления)
const fieldsConfig: Record<
  string,
  Array<{
    key: string;
    label: string;
    type: "input" | "dropdown";
    options?: { label: string; value: string }[];
  }>
> = {
  auto: [
    { key: "brand", label: "Бренд", type: "input" },
    { key: "model", label: "Модель", type: "input" },
    { key: "yearOfManufacture", label: "Год выпуска", type: "input" },
    {
      key: "transmission",
      label: "Коробка передач",
      type: "dropdown",
      options: [
        { label: "Автомат", value: "automatic" },
        { label: "Механика", value: "manual" },
      ],
    },
    { key: "mileage", label: "Пробег", type: "input" },
    { key: "enginePower", label: "Мощность двигателя", type: "input" },
  ],
  real_estate: [
    {
      key: "type",
      label: "Тип недвижимости",
      type: "dropdown",
      options: [
        { label: "Квартира", value: "flat" },
        { label: "Дом", value: "house" },
        { label: "Комната", value: "room" },
      ],
    },
    { key: "address", label: "Адрес", type: "input" },
    { key: "area", label: "Площадь", type: "input" },
    { key: "floor", label: "Этаж", type: "input" },
  ],
  electronics: [
    {
      key: "type",
      label: "Тип устройства",
      type: "dropdown",
      options: [
        { label: "Телефон", value: "phone" },
        { label: "Ноутбук", value: "laptop" },
        { label: "Разное", value: "misc" },
      ],
    },
    { key: "brand", label: "Бренд", type: "input" },
    { key: "model", label: "Модель", type: "input" },
    {
      key: "condition",
      label: "Состояние",
      type: "dropdown",
      options: [
        { label: "Новый", value: "new" },
        { label: "Б/У", value: "used" },
      ],
    },
    { key: "color", label: "Цвет", type: "input" },
  ],
};

// Поля, которые считаются обязательными (блокируют сохранение)
const requiredFields = ["title", "price"];

// Числовые поля для каждой категории
const numericFieldsByCategory = {
  auto: ['yearOfManufacture', 'mileage', 'enginePower'],
  real_estate: ['area', 'floor'],
  electronics: []
};

export default function Edit(): React.ReactNode {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState<ItemUpdateIn | null>(null);

  // Преобразование числовых полей из строк в числа
  const convertNumericFields = useCallback((data: ItemUpdateIn): ItemUpdateIn => {
    const category = data.category;
    const numericFields = numericFieldsByCategory[category as keyof typeof numericFieldsByCategory] || [];
    
    if (numericFields.length === 0) return data;
    
    const newData = { ...data };
    const params = { ...newData.params } as any;
    let hasChanges = false;
    
    numericFields.forEach(field => {
      if (params[field] !== undefined && params[field] !== null && params[field] !== '') {
        const numValue = Number(params[field]);
        if (!isNaN(numValue)) {
          params[field] = numValue;
          hasChanges = true;
        }
      }
    });
    
    if (hasChanges) {
      newData.params = params;
    }
    
    return newData;
  }, []);

  // Загрузка данных: сначала из localStorage, потом с бэка
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(false);
      try {
        const draftKey = `edit_draft_${id}`;
        const savedDraft = localStorage.getItem(draftKey);
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          // Конвертируем числовые поля при загрузке из черновика
          const convertedData = convertNumericFields(parsed);
          setFormData(convertedData);
          setLoading(false);
          return;
        }

        const response = await server.get<AdById>(`/items/${id}`);
        const ad = response.data;
        const { createdAt, updatedAt, needsRevision, ...updateData } = ad;
        setFormData(updateData);
      } catch {
        setError(true);
        message.error("Не удалось загрузить объявление");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, convertNumericFields]);

  // Сохранение любой части формы в localStorage
  const saveToLocalStorage = useCallback(
    (newData: ItemUpdateIn) => {
      const draftKey = `edit_draft_${id}`;
      localStorage.setItem(draftKey, JSON.stringify(newData));
    },
    [id],
  );

  // Обновление конкретного поля (общие поля)
  const updateField = useCallback(
    <K extends keyof ItemUpdateIn>(field: K, value: ItemUpdateIn[K]) => {
      if (!formData) return;
      const newData = { ...formData, [field]: value };
      setFormData(newData);
      saveToLocalStorage(newData);
    },
    [formData, saveToLocalStorage],
  );

  // Обновление поля внутри params
  const updateParam = useCallback(
    (paramKey: string, value: any) => {
      if (!formData) return;
      
      // Определяем, нужно ли преобразовать в число
      const category = formData.category;
      const numericFields = numericFieldsByCategory[category as keyof typeof numericFieldsByCategory] || [];
      let processedValue = value;
      
      if (numericFields.includes(paramKey) && value !== '' && value !== null && value !== undefined) {
        processedValue = Number(value);
        if (isNaN(processedValue)) {
          processedValue = '';
        }
      }
      
      const newParams = { ...formData.params, [paramKey]: processedValue };
      const newData = { ...formData, params: newParams };
      setFormData(newData);
      saveToLocalStorage(newData);
    },
    [formData, saveToLocalStorage],
  );

  // Смена категории: сбрасываем params на пустой объект
  const handleCategoryChange = useCallback(
    (newCategory: ItemUpdateIn["category"]) => {
      if (!formData) return;
      let newParams:
        | AutoItemParams
        | RealEstateItemParams
        | ElectronicsItemParams;
      switch (newCategory) {
        case "auto":
          newParams = {};
          break;
        case "real_estate":
          newParams = {};
          break;
        case "electronics":
          newParams = {};
          break;
        default:
          newParams = {};
      }
      const newData = { ...formData, category: newCategory, params: newParams };
      setFormData(newData);
      saveToLocalStorage(newData);
    },
    [formData, saveToLocalStorage],
  );

  // Валидация обязательных полей
  const isFormValid = useMemo(() => {
    if (!formData) return false;
    return requiredFields.every((field) => {
      const value = formData[field as keyof ItemUpdateIn];
      if (field === "price") {
        return typeof value === "number" && value > 0;
      }
      return value !== undefined && value !== null && value !== "";
    });
  }, [formData]);

  // Отмена: загружаем исходные данные с сервера, затем удаляем черновик
  const handleCancel = useCallback(async () => {
    setLoading(true);
    try {
      localStorage.removeItem(`edit_draft_${id}`);
      navigate(`/ads/${id}`);
    } catch {
      message.error("Не удалось очистить данные.");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  // Сохранение на сервер
  const handleSubmit = useCallback(async () => {
    if (!formData || !isFormValid) return;
    setLoading(true);
    try {
      // Конвертируем числовые поля перед отправкой на сервер
      const dataToSend = convertNumericFields(formData);
      await server.put(`/items/${id}`, dataToSend);
      localStorage.removeItem(`edit_draft_${id}`);
      message.success("Объявление сохранено");
      navigate(`/ads/${id}`);
    } catch (error: any) {
      console.error('Save error:', error);
      message.error(
        "Ошибка сохранения. При попытке сохранить изменения произошла ошибка. " +
        "Попробуйте ещё раз или зайдите позже."
      );
    } finally {
      setLoading(false);
    }
  }, [formData, id, isFormValid, navigate, convertNumericFields]);

  if (loading && !formData) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка загрузки</div>;
  if (!formData) return null;

  const { category, title, price, description } = formData;
  const currentFields = fieldsConfig[category] || [];

  // Вспомогательная функция для получения стиля рамки для необязательного поля
  const getOptionalFieldBorderStyle = (value: any) => {
    return value ? {} : { borderColor: "#FFA940" };
  };

  // Проверка, является ли поле числовым
  const isNumericField = (key: string) => {
    const numericFields = numericFieldsByCategory[category as keyof typeof numericFieldsByCategory] || [];
    return numericFields.includes(key);
  };

  // Рендер input с крестиком и оранжевой рамкой (для необязательных полей)
  const renderInputWithClear = (
    key: string,
    value: any,
    placeholder: string,
  ) => {
    const isNumeric = isNumericField(key);
    
    return (
      <Input
        type={isNumeric ? "number" : "text"}
        value={value ?? ""}
        onChange={(e) => {
          const val = e.target.value;
          if (isNumeric && val !== '') {
            updateParam(key, Number(val));
          } else {
            updateParam(key, val);
          }
        }}
        placeholder={placeholder}
        style={{
          fontSize: "14px",
          width: 456,
          ...getOptionalFieldBorderStyle(value),
        }}
        suffix={
          <div
            style={{
              width: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {value !== undefined && value !== null && value !== '' && (
              <CloseCircleOutlined
                onClick={() => updateParam(key, "")}
                style={{ color: "#bfbfbf", cursor: "pointer" }}
              />
            )}
          </div>
        }
      />
    );
  };

  // Рендер полей характеристик
  const renderCharacteristics = () => {
    return currentFields.map((field) => {
      const value = (formData.params as any)[field.key];
      if (field.type === "input") {
        return (
          <div key={field.key}>
            <Title
              level={5}
              style={{ fontSize: "14px", fontWeight: 400, margin: 0 }}
            >
              {field.label}
            </Title>
            {renderInputWithClear(field.key, value, field.label)}
          </div>
        );
      } else if (field.type === "dropdown" && field.options) {
        const selectedLabel =
          field.options.find((opt) => opt.value === value)?.label || "Выберите";
        const borderStyle = getOptionalFieldBorderStyle(value);
        return (
          <div key={field.key}>
            <Title
              level={5}
              style={{ fontSize: "14px", fontWeight: 400, margin: 0 }}
            >
              {field.label}
            </Title>
            <Dropdown
              menu={{
                items: field.options.map((opt) => ({
                  key: opt.value,
                  label: opt.label,
                  onClick: () => updateParam(field.key, opt.value),
                })),
              }}
              trigger={["click"]}
              placement="bottomLeft"
            >
              <div
                style={{
                  display: "inline-block",
                  borderRadius: 8,
                  border: "1px solid #D9D9D9",
                  width: "456px",
                  padding: "4px 12px",
                  boxSizing: "border-box",
                  cursor: "pointer",
                  ...borderStyle,
                }}
              >
                <Flex justify="space-between">
                  <Text style={{ color: "#000000", fontSize: 14 }}>
                    {selectedLabel}
                  </Text>
                  <DownOutlined style={{ fontSize: 10, color: "#707176" }} />
                </Flex>
              </div>
            </Dropdown>
          </div>
        );
      }
      return null;
    });
  };

  return (
    <div
      style={{
        margin: "0 auto",
        width: "1335px",
        padding: "8px 0",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <Title level={5} style={{ fontSize: 30, fontWeight: 500, margin: 0 }}>
        Редактирование объявления
      </Title>

      <Flex gap={8} vertical>
        {/* Категория */}
        <div style={{ padding: "16px 0", borderBottom: "1px solid #F0F0F0" }}>
          <Title
            level={5}
            style={{ fontSize: "16px", fontWeight: 600, margin: 0 }}
          >
            Категория
          </Title>
          <Dropdown
            menu={{
              items: [
                {
                  key: "auto",
                  label: "Автомобиль",
                  onClick: () => handleCategoryChange("auto"),
                },
                {
                  key: "real_estate",
                  label: "Недвижимость",
                  onClick: () => handleCategoryChange("real_estate"),
                },
                {
                  key: "electronics",
                  label: "Электроника",
                  onClick: () => handleCategoryChange("electronics"),
                },
              ],
            }}
            trigger={["click"]}
            placement="bottomLeft"
          >
            <div
              style={{
                display: "inline-block",
                borderRadius: 8,
                border: "1px solid #D9D9D9",
                width: "256px",
                padding: "4px 12px",
                cursor: "pointer",
              }}
            >
              <Flex justify="space-between">
                <Text style={{ color: "#000000", fontSize: 14 }}>
                  {category === "auto" && "Автомобиль"}
                  {category === "real_estate" && "Недвижимость"}
                  {category === "electronics" && "Электроника"}
                </Text>
                <DownOutlined style={{ fontSize: 10, color: "#707176" }} />
              </Flex>
            </div>
          </Dropdown>
        </div>

        {/* Название (обязательное) */}
        <div style={{ padding: "16px 0", borderBottom: "1px solid #F0F0F0" }}>
          <Title
            level={5}
            style={{ fontSize: "16px", fontWeight: 600, margin: 0 }}
          >
            <span style={{ color: "#EC221F", paddingRight: "4px" }}>*</span>
            Название
          </Title>
          <Input
            type="text"
            value={title ?? ""}
            onChange={(e) => updateField("title", e.target.value)}
            style={{
              fontSize: "14px",
              width: 456,
              ...(!(title !== undefined && title !== null && title !== "")
                ? { borderColor: "#EC221F" }
                : {}),
            }}
            placeholder="Название"
            status={
              !(title !== undefined && title !== null && title !== "")
                ? "error"
                : ""
            }
            suffix={
              <div
                style={{
                  width: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {title && (
                  <CloseCircleOutlined
                    onClick={() => updateField("title", "")}
                    style={{ color: "#bfbfbf", cursor: "pointer" }}
                  />
                )}
              </div>
            }
          />
          {!(title !== undefined && title !== null && title !== "") && (
            <div
              style={{ color: "#EC221F", fontSize: "12px", marginTop: "4px" }}
            >
              Название должно быть заполнено
            </div>
          )}
        </div>

        {/* Цена (обязательная) */}
        <div style={{ padding: "16px 0", borderBottom: "1px solid #F0F0F0" }}>
          <Title
            level={5}
            style={{ fontSize: "16px", fontWeight: 600, margin: 0 }}
          >
            <span style={{ color: "#EC221F", paddingRight: "4px" }}>*</span>
            Цена
          </Title>
          <Flex gap={8} align="center">
            <div>
              <Input
                type="number"
                value={price ?? ""}
                onChange={(e) => updateField("price", Number(e.target.value))}
                style={{
                  fontSize: "14px",
                  width: 456,
                  ...(!(typeof price === "number" && price > 0)
                    ? { borderColor: "#EC221F" }
                    : {}),
                }}
                placeholder="1000"
                status={
                  !(typeof price === "number" && price > 0) ? "error" : ""
                }
                suffix={
                  <div
                    style={{
                      width: 16,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {(price !== undefined && price !== null && price !== 0) ? (
                      <CloseCircleOutlined
                        onClick={() => updateField("price", 0)}
                        style={{ color: "#bfbfbf", cursor: "pointer" }}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                }
              />
              {!(typeof price === "number" && price > 0) && (
                <div
                  style={{
                    color: "#EC221F",
                    fontSize: "12px",
                    marginTop: "4px",
                  }}
                >
                  Цена должна быть больше 0
                </div>
              )}
            </div>
            <AIPriceButton formData={formData} setFormData={setFormData} />
          </Flex>
        </div>

        {/* Характеристики */}
        <div style={{ padding: "16px 0", borderBottom: "1px solid #F0F0F0" }}>
          <Title
            level={5}
            style={{ fontSize: "16px", fontWeight: 600, margin: 0 }}
          >
            Характеристики
          </Title>
          <Flex vertical gap={8}>
            {renderCharacteristics()}
          </Flex>
        </div>

        {/* Описание (необязательное, оранжевая рамка) */}
        <Flex vertical gap={8} align="start">
          <Title
            level={5}
            style={{ fontSize: "16px", fontWeight: 600, margin: 0 }}
          >
            Описание
          </Title>
          <TextArea
            value={description || ""}
            onChange={(e) => updateField("description", e.target.value)}
            maxLength={1000}
            showCount
            style={{
              minHeight: "60px",
              width: "100%",
              fontSize: "14px",
              ...getOptionalFieldBorderStyle(description),
            }}
            placeholder="Опишите товар подробнее..."
          />
          <AIDescriptionButton formData={formData} setFormData={setFormData} />
        </Flex>

        <Flex gap={10} style={{ paddingTop: 8 }}>
          <Button
            type="primary"
            onClick={handleSubmit}
            disabled={!isFormValid}
            loading={loading}
            style={{
              padding: "8px 12px",
              fontSize: "14px",
              height: "auto",
              ...(!isFormValid && {
                backgroundColor: "#D9D9D9",
                color: "#F3F3F3",
                borderColor: "#D9D9D9",
              }),
            }}
          >
            Сохранить
          </Button>
          <Button
            onClick={handleCancel}
            style={{
              padding: "8px 12px",
              backgroundColor: "#D9D9D9",
              color: "#5A5A5A",
              fontSize: "14px",
              border: "none",
              height: "auto",
            }}
          >
            Отменить
          </Button>
        </Flex>
      </Flex>
    </div>
  );
}