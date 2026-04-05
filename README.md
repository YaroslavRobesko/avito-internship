# AI Assistant for Classified Ads

Сервис для автоматического улучшения описаний и определения рыночных цен объявлений с помощью локальной LLM.

## Требования

- Node.js 18+
- Ollama

## Установка

```bash
git clone <your-repo-url>
cd <project-folder>
npm install
```

## Настройка LLM (Ollama)

### Установка

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

или скачать с сайта:  
https://ollama.com/download

### Запуск сервера

```bash
ollama serve
```

### Загрузка модели

```bash
ollama pull llama3
```

### Проверка

```bash
curl http://localhost:11434/api/tags
```

## Запуск проекта

```bash
npm run dev
```

## Использование

```ts
import { generateImprovedDescription, generateMarketPrice } from "./aiService";

const description = await generateImprovedDescription(item);
const price = await generateMarketPrice(item);
```

## Переменные окружения

```env
OLLAMA_URL=http://localhost:11434/api/generate
DEFAULT_MODEL=llama3
```

## Возможные проблемы

### Ollama не отвечает

- Убедитесь, что запущен `ollama serve`
- Проверьте порт 11434
- Проверьте модель: `ollama list`

### Медленные ответы

- Используйте более лёгкую модель (например `phi3`)
- Проверьте ресурсы системы

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
