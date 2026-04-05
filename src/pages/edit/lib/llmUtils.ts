import type {
  ItemUpdateIn,
  AutoItemParams,
  RealEstateItemParams,
  ElectronicsItemParams,
} from "../../../types/types";
import generateOllama from "./ollamaClient";

function formatItemDetails(item: ItemUpdateIn): string {
  const { category, title, params, price } = item;
  let details = `Категория: ${category}\nНазвание: ${title}\nЦена: ${price} руб.\n`;

  if (category === "auto") {
    const p = params as AutoItemParams;
    details += `Бренд: ${p.brand || "не указан"}\nМодель: ${p.model || "не указана"}\nГод выпуска: ${p.yearOfManufacture || "не указан"}\nПробег: ${p.mileage || "не указан"} км\nКоробка передач: ${p.transmission === "automatic" ? "Автомат" : p.transmission === "manual" ? "Механика" : "не указана"}\nМощность: ${p.enginePower ? `${p.enginePower} л.с.` : "не указана"}`;
  } else if (category === "real_estate") {
    const p = params as RealEstateItemParams;
    const typeMap: Record<string, string> = {
      flat: "Квартира",
      house: "Дом",
      room: "Комната",
    };
    details += `Тип: ${p.type ? typeMap[p.type] : "не указан"}\nАдрес: ${p.address || "не указан"}\nПлощадь: ${p.area ? `${p.area} м²` : "не указана"}\nЭтаж: ${p.floor ? `${p.floor}` : "не указан"}`;
  } else if (category === "electronics") {
    const p = params as ElectronicsItemParams;
    const typeMap: Record<string, string> = {
      phone: "Телефон",
      laptop: "Ноутбук",
      misc: "Разное",
    };
    details += `Тип устройства: ${p.type ? typeMap[p.type] : "не указан"}\nБренд: ${p.brand || "не указан"}\nМодель: ${p.model || "не указана"}\nСостояние: ${p.condition === "new" ? "Новое" : p.condition === "used" ? "Б/У" : "не указано"}\nЦвет: ${p.color || "не указан"}`;
  }
  return details;
}

function cleanAndParseJSON(response: string): any {
  // Убираем markdown-разметку
  let cleaned = response.replace(/```json\s*/g, "").replace(/```\s*/g, "");
  
  // Убираем возможные пояснения перед JSON
  const jsonStart = cleaned.indexOf("{");
  const jsonEnd = cleaned.lastIndexOf("}");
  
  if (jsonStart !== -1 && jsonEnd !== -1) {
    cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
  }
  
  return JSON.parse(cleaned);
}

export async function generateImprovedDescription(
  item: ItemUpdateIn,
): Promise<{ improvedDescription: string; suggestion: string }> {
  const itemDetails = formatItemDetails(item);
  const currentDescription = item.description?.trim() || "отсутствует";

  const prompt = `Ты — профессиональный копирайтер для сайта объявлений. Напиши привлекательное, информативное описание для товара на основе следующих данных. Описание должно быть грамотным, продающим, но без излишнего спама. Длина — 2-4 предложения. Используй выгоды и характеристики.
ВАЖНО: ОТВЕЧАЙ ТОЛЬКО НА РУССКОМ ЯЗЫКЕ. Никаких английских слов или фраз. ВСЕ поля JSON должны быть на русском языке.
Данные товара:
${itemDetails}

Текущее описание (если есть): ${currentDescription}

Твоя задача: улучшить описание, сделать его более привлекательным и полным. Если текущее описание пустое, создай новое.

Верни результат строго в формате JSON:
{
  "improvedDescription": "текст улучшенного описания на русском",
  "suggestion": "краткое пояснение на русском (одна фраза), что именно улучшено (например, 'Добавлены ключевые характеристики' или 'Создано продающее описание с нуля')"
}`;

  try {
    const response = await generateOllama(prompt, { formatJson: true });
    const parsed = cleanAndParseJSON(response);
    return {
      improvedDescription: parsed.improvedDescription || "",
      suggestion: parsed.suggestion || "Описание улучшено с помощью AI",
    };
  } catch (error) {
    console.error("Failed to generate description:", error);
    return {
      improvedDescription:
        currentDescription !== "отсутствует" ? currentDescription : "",
      suggestion: "Не удалось связаться с AI-ассистентом",
    };
  }
}

export async function generateMarketPrice(
  item: ItemUpdateIn,
): Promise<{ suggestedPrice: number; reasoning: string }> {
  const itemDetails = formatItemDetails(item);

  const prompt = `Ты — аналитик рынка на сайте объявлений. На основе предоставленных характеристик товара определи рыночную цену (в рублях) для быстрой продажи. Учти категорию, бренд, состояние, пробег/площадь и другие параметры. Дай конкретную цифру и короткое обоснование.
ВАЖНО: ОТВЕЧАЙ ТОЛЬКО НА РУССКОМ ЯЗЫКЕ. Никаких английских слов или фраз. reasoning должен быть на русском языке.
Данные товара:
${itemDetails}

Верни ответ строго в формате JSON:
{
  "suggestedPrice": число (только цифры),
  "reasoning": "одно предложение с пояснением на русском (например, 'С учётом года выпуска и пробега оптимальная цена — ...')"
}`;

  try {
    const response = await generateOllama(prompt, { formatJson: true });
    const parsed = cleanAndParseJSON(response);
    const price =
      typeof parsed.suggestedPrice === "number"
        ? parsed.suggestedPrice
        : Number(parsed.suggestedPrice);
    return {
      suggestedPrice: isNaN(price) ? item.price : price,
      reasoning: parsed.reasoning || "Цена предложена AI-ассистентом",
    };
  } catch (error) {
    console.error("Failed to generate price:", error);
    return {
      suggestedPrice: item.price,
      reasoning: "Не удалось определить рыночную цену",
    };
  }
}