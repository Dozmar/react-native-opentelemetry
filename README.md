# @dozmar/react-native-opentelemetry

[![npm version](https://badge.fury.io/js/%40dozmar%2Freact-native-opentelemetry.svg)](https://badge.fury.io/js/%40dozmar%2Freact-native-opentelemetry)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Профессиональная интеграция OpenTelemetry для React Native приложений. Легко настраиваемая библиотека для сбора трейсов и метрик в ваших мобильных приложениях.

## ✨ Преимущества

- 🚀 **Простая интеграция** - Настройка за несколько минут с помощью React компонента-провайдера
- 📊 **Автоматическая инструментация** - Автоматический сбор трейсов для fetch и XMLHttpRequest запросов
- 🔧 **Гибкая конфигурация** - Полный контроль над настройками OpenTelemetry
- 📱 **Информация об устройстве** - Автоматический сбор информации об устройстве и ОС
- 🎯 **TypeScript поддержка** - Полная типизация для лучшего DX
- 🔒 **Production-ready** - Готово к использованию в production окружении

## 📦 Установка

```bash
# Используя npm
npm install @dozmar/react-native-opentelemetry

# Используя yarn
yarn add @dozmar/react-native-opentelemetry

```

### Дополнительные зависимости

Библиотека требует установки следующих peer dependencies:

```bash
npm install react-native-device-info
```

## 🚀 Быстрый старт

### 1. Оберните ваше приложение в провайдер

```tsx
import { OpenTelemetryProvider } from "@dozmar/react-native-opentelemetry";
import { App } from "./App";

export default function Root() {
  return (
    <OpenTelemetryProvider
      config={{
        endpoint: "https://your-otel-collector.com/v1/traces",
        serviceName: "my-react-native-app",
        serviceVersion: "1.0.0",
      }}
    >
      <App />
    </OpenTelemetryProvider>
  );
}
```

### 2. Используйте хук для доступа к tracer

```tsx
import { useOpenTelemetry, trace } from "@dozmar/react-native-opentelemetry";

function MyComponent() {
  const { initialized, getTracer } = useOpenTelemetry();
  const tracer = getTracer("my-component");

  const handleAction = () => {
    const span = tracer.startSpan("my-action");
    // Ваш код
    span.end();
  };

  return <Button onPress={handleAction} />;
}
```

## 📚 Документация

### Конфигурация

`OpenTelemetryProvider` принимает объект конфигурации со следующими параметрами:

```typescript
interface OpenTelemetryConfig {
  // URL для отправки трейсов в OTLP endpoint (обязательно)
  endpoint: string;

  // Имя сервиса для идентификации в трейсах (обязательно)
  serviceName: string;

  // Версия сервиса (опционально)
  serviceVersion?: string;

  // Дополнительные атрибуты ресурса (опционально)
  resourceAttributes?: DetectedResourceAttributes;

  // Задержка перед отправкой батча трейсов в миллисекундах (по умолчанию: 500)
  scheduledDelayMillis?: number;

  // URL паттерны для игнорирования при инструментации XMLHttpRequest (опционально)
  ignoreUrls?: (string | RegExp)[];

  // Дополнительные span процессоры (опционально)
  spanProcessors?: SpanProcessor[];

  // Дополнительные инструментации (опционально)
  instrumentations?: Instrumentation[];

  // Включить автоматическую инструментацию fetch (по умолчанию: true)
  enableFetchInstrumentation?: boolean;

  // Включить автоматическую инструментацию XMLHttpRequest (по умолчанию: true)
  enableXMLHttpRequestInstrumentation?: boolean;

  // Включить автоматический сбор информации об устройстве (по умолчанию: true)
  enableDeviceInfo?: boolean;
}
```

### Примеры использования

#### Базовое использование

```tsx
<OpenTelemetryProvider
  config={{
    endpoint: "http://localhost:4318/v1/traces",
    serviceName: "my-app",
  }}
>
  <App />
</OpenTelemetryProvider>
```

#### Расширенная конфигурация

```tsx
<OpenTelemetryProvider
  config={{
    endpoint: "https://otel-collector.example.com/v1/traces",
    serviceName: "my-app",
    serviceVersion: "1.2.3",
    scheduledDelayMillis: 1000,
    ignoreUrls: [/\/api\/health/],
    enableDeviceInfo: true,
    resourceAttributes: {
      "environment": "production",
      "team": "mobile",
    },
  }}
  loadingComponent={<LoadingScreen />}
  onError={(error) => console.error("OTel init error:", error)}
>
  <App />
</OpenTelemetryProvider>
```

#### Создание кастомных трейсов

```tsx
import { trace } from "@dozmar/react-native-opentelemetry";

function performOperation() {
  const tracer = trace.getTracer("my-tracer");
  const span = tracer.startSpan("operation-name");

  try {
    // Ваш код
    span.setStatus({ code: SpanStatusCode.OK });
  } catch (error) {
    span.setStatus({ 
      code: SpanStatusCode.ERROR,
      message: error.message 
    });
    span.recordException(error);
  } finally {
    span.end();
  }
}
```

## 🔧 API Reference

### `OpenTelemetryProvider`

React компонент-провайдер для инициализации OpenTelemetry.

**Props:**

- `config: OpenTelemetryConfig` - Конфигурация OpenTelemetry
- `children: ReactNode` - Дочерние компоненты
- `loadingComponent?: ReactNode` - Компонент, показываемый во время инициализации
- `onError?: (error: Error) => void` - Обработчик ошибок инициализации

### `useOpenTelemetry()`

Хук для доступа к контексту OpenTelemetry.

**Returns:**

```typescript
{
  initialized: boolean;
  getTracer: (name: string, version?: string) => Tracer;
}
```

### `initializeOpenTelemetry(config)`

Функция для программной инициализации OpenTelemetry (без использования провайдера).

## 🛠️ Разработка

### Требования

- Node.js >= 18
- Yarn >= 4.0
- React Native >= 0.70

### Установка зависимостей

```bash
yarn install
```

### Запуск линтера

```bash
yarn lint
```

### Запуск проверки типов

```bash
yarn typecheck
```

### Запуск тестов

```bash
yarn test
```

### Запуск примера

```bash
cd example
yarn install
yarn ios  # или yarn android
```

## 📝 Лицензия

MIT

## 🤝 Вклад

Мы приветствуем вклад! Пожалуйста, прочитайте [CONTRIBUTING.md](CONTRIBUTING.md) для деталей.

## 🔗 Полезные ссылки

- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [React Native Documentation](https://reactnative.dev/)
- [Пример использования](example/)

## 📄 Changelog

Смотрите [CHANGELOG.md](CHANGELOG.md) для списка изменений.
