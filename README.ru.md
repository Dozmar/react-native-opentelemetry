# @dozmar/react-native-opentelemetry

[![npm version](https://badge.fury.io/js/%40dozmar%2Freact-native-opentelemetry.svg)](https://badge.fury.io/js/%40dozmar%2Freact-native-opentelemetry)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Профессиональная интеграция OpenTelemetry для React Native приложений. Легко настраиваемая библиотека для сбора трейсов и метрик в ваших мобильных приложениях.

## ✨ Преимущества

- 🚀 **Простая интеграция** - Настройка за несколько минут с помощью React компонента-провайдера
- 📊 **Автоматическая инструментация** - Автоматический сбор трейсов для fetch и XMLHttpRequest запросов
- 🔧 **Гибкая конфигурация** - Полный контроль над настройками OpenTelemetry
- 📱 **Информация об устройстве** - Поддержка автоматического сбора информации об устройстве и ОС
- 🎯 **TypeScript поддержка** - Полная типизация для лучшего DX
- 🔒 **Production-ready** - Готово к использованию в production окружении
- 🐛 **Отладочный режим** - Встроенная поддержка отладочного логирования

## 📦 Установка

```bash
# Используя npm
npm install @dozmar/react-native-opentelemetry

# Используя yarn
yarn add @dozmar/react-native-opentelemetry

# Используя pnpm
pnpm add @dozmar/react-native-opentelemetry
```

### Дополнительные зависимости

Библиотека требует установки следующих peer dependencies:

```bash
npm install react react-native
```

Для сбора информации об устройстве (опционально):

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

  // Конфигурация инструментации fetch (опционально)
  fetchInstrumentationConfig?: Partial<FetchInstrumentationConfig>;

  // Включить автоматическую инструментацию XMLHttpRequest (по умолчанию: true)
  enableXMLHttpRequestInstrumentation?: boolean;

  // Конфигурация инструментации XMLHttpRequest (опционально)
  xmlHttpRequestInstrumentationConfig?: Partial<XMLHttpRequestInstrumentationConfig>;

  // Информация об устройстве для добавления в ресурсные атрибуты (опционально)
  deviceInfo?: {
    OS?: string;        // Название ОС (например, 'ios', 'android', 'web')
    version?: string;   // Версия ОС
    deviceId?: string;  // Уникальный идентификатор устройства
  };

  // Включить отладочное логирование (по умолчанию: false)
  debug?: boolean;
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
import DeviceInfo from "react-native-device-info";

<OpenTelemetryProvider
  config={{
    endpoint: "https://otel-collector.example.com/v1/traces",
    serviceName: "my-app",
    serviceVersion: "1.2.3",
    scheduledDelayMillis: 1000,
    ignoreUrls: [/\/api\/health/, /\/api\/metrics/],
    deviceInfo: {
      OS: DeviceInfo.getSystemName(),
      version: DeviceInfo.getSystemVersion(),
      deviceId: DeviceInfo.getUniqueId(),
    },
    resourceAttributes: {
      "environment": "production",
      "team": "mobile",
    },
    enableFetchInstrumentation: true,
    fetchInstrumentationConfig: {
      propagateTraceHeaderCorsUrls: [/https:\/\/api\.example\.com/],
    },
    enableXMLHttpRequestInstrumentation: true,
    xmlHttpRequestInstrumentationConfig: {
      ignoreUrls: [/\/internal\//],
    },
    debug: true,
  }}
  loadingComponent={<LoadingScreen />}
  onError={(error) => console.error("OTel init error:", error)}
>
  <App />
</OpenTelemetryProvider>
```

#### Создание кастомных трейсов

```tsx
import { trace, SpanStatusCode } from "@dozmar/react-native-opentelemetry";

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

#### Использование с хуком useOpenTelemetry

```tsx
import { useOpenTelemetry } from "@dozmar/react-native-opentelemetry";

function MyComponent() {
  const { initialized, getTracer } = useOpenTelemetry();

  if (!initialized) {
    return <LoadingIndicator />;
  }

  const tracer = getTracer("my-component");
  
  const handleAsyncOperation = async () => {
    const span = tracer.startSpan("async-operation");
    try {
      const result = await fetch("/api/data");
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.setStatus({ 
        code: SpanStatusCode.ERROR,
        message: error.message 
      });
      span.recordException(error);
      throw error;
    } finally {
      span.end();
    }
  };

  return <Button onPress={handleAsyncOperation} />;
}
```

## 🔧 API Reference

### `OpenTelemetryProvider`

React компонент-провайдер для инициализации OpenTelemetry.

**Props:**

- `config: OpenTelemetryConfig` - Конфигурация OpenTelemetry (обязательно)
- `children: ReactNode` - Дочерние компоненты (обязательно)
- `loadingComponent?: ReactNode` - Компонент, показываемый во время инициализации (опционально)
- `onError?: (error: Error) => void` - Обработчик ошибок инициализации (опционально)

**Пример:**

```tsx
<OpenTelemetryProvider
  config={config}
  loadingComponent={<LoadingScreen />}
  onError={(error) => console.error("OTel error:", error)}
>
  <App />
</OpenTelemetryProvider>
```

### `useOpenTelemetry()`

Хук для доступа к контексту OpenTelemetry. Должен использоваться внутри `OpenTelemetryProvider`.

**Returns:**

```typescript
{
  initialized: boolean;  // Флаг инициализации OpenTelemetry
  getTracer: (name: string, version?: string) => Tracer;  // Функция для получения tracer
}
```

**Пример:**

```tsx
const { initialized, getTracer } = useOpenTelemetry();
const tracer = getTracer("my-tracer", "1.0.0");
```

### Экспортируемые типы и функции

Библиотека также экспортирует следующие типы и функции из `@opentelemetry/api`:

- `trace` - Глобальный объект для работы с трейсами
- `context` - API для работы с контекстом
- `SpanStatusCode` - Коды статусов для span
- `Span`, `Tracer`, `SpanKind`, `SpanOptions`, `SpanStatus` - TypeScript типы

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

### Автоматическое исправление ошибок линтера

```bash
yarn lint:fix
```

### Форматирование кода

```bash
yarn format
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
- [GitHub Repository](https://github.com/Dozmar/react-native-opentelemetry)

## 📄 Changelog

Смотрите [CHANGELOG.md](CHANGELOG.md) для списка изменений.
