import axios from "axios";

const OLLAMA_URL = "http://localhost:11434/api/generate";
const DEFAULT_MODEL = "llama3";

interface OllamaRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  format?: "json";
}

// Очередь запросов
class OllamaQueue {
  private queue: Array<() => Promise<any>> = [];
  private isProcessing = false;

  async add<T>(factory: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await factory();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;
    
    this.isProcessing = true;
    const task = this.queue.shift();
    
    if (task) {
      try {
        await task();
      } catch (error) {
        console.error("Queue task failed:", error);
      }
    }
    
    this.isProcessing = false;
    this.processQueue();
  }
}

const ollamaQueue = new OllamaQueue();

async function generateWithRetry(
  requestBody: OllamaRequest,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<string> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.post(OLLAMA_URL, requestBody, {
        headers: { "Content-Type": "application/json" },
        timeout: 60000, // Увеличил таймаут до 60 секунд
      });
      return response.data.response;
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      console.log(`Попытка ${attempt} не удалась, повтор через ${baseDelay * attempt}мс`);
      await new Promise(resolve => setTimeout(resolve, baseDelay * attempt));
    }
  }
  throw new Error("Все попытки не удались");
}

export default async function generateOllama(
  prompt: string,
  options?: { model?: string; formatJson?: boolean },
): Promise<string> {
  return ollamaQueue.add(async () => {
    const requestBody: OllamaRequest = {
      model: options?.model || DEFAULT_MODEL,
      prompt,
      stream: false,
    };
    if (options?.formatJson) {
      requestBody.format = "json";
    }

    return generateWithRetry(requestBody);
  });
}