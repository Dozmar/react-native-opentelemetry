# @dozmar/react-native-opentelemetry

[![npm version](https://badge.fury.io/js/%40dozmar%2Freact-native-opentelemetry.svg)](https://badge.fury.io/js/%40dozmar%2Freact-native-opentelemetry)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Professional OpenTelemetry integration for React Native applications. An easily configurable library for collecting traces and metrics in your mobile applications.

## ✨ Features

- 🚀 **Easy Integration** - Set up in minutes with a React provider component
- 📊 **Automatic Instrumentation** - Automatic trace collection for fetch and XMLHttpRequest requests
- 🔧 **Flexible Configuration** - Full control over OpenTelemetry settings
- 📱 **Device Information** - Support for automatic collection of device and OS information
- 🎯 **TypeScript Support** - Full typing for better DX
- 🔒 **Production-ready** - Ready for use in production environments
- 🐛 **Debug Mode** - Built-in support for debug logging

## 📦 Installation

```bash
# Using npm
npm install @dozmar/react-native-opentelemetry

# Using yarn
yarn add @dozmar/react-native-opentelemetry

# Using pnpm
pnpm add @dozmar/react-native-opentelemetry
```

### Peer Dependencies

The library requires the following peer dependencies:

```bash
npm install react react-native
```

For device information collection (optional):

```bash
npm install react-native-device-info
```

## 🚀 Quick Start

### 1. Wrap your application with the provider

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

### 2. Use the hook to access the tracer

```tsx
import { useOpenTelemetry, trace, SpanStatusCode } from "@dozmar/react-native-opentelemetry";

function MyComponent() {
  const { initialized, getTracer } = useOpenTelemetry();
  const tracer = getTracer("my-component");

  const handleAction = () => {
    const span = tracer.startSpan("my-action");
    try {
      // Your code
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

## 📚 API Reference

### Configuration

`OpenTelemetryProvider` accepts a configuration object with the following parameters:

```typescript
interface OpenTelemetryConfig {
  // URL for sending traces to OTLP endpoint (required)
  endpoint: string;

  // Service name for trace identification (required)
  serviceName: string;

  // Service version (optional)
  serviceVersion?: string;

  // Additional resource attributes (optional)
  resourceAttributes?: DetectedResourceAttributes;

  // Delay before sending trace batch in milliseconds (default: 500)
  scheduledDelayMillis?: number;

  // URL patterns to ignore during XMLHttpRequest instrumentation (optional)
  ignoreUrls?: (string | RegExp)[];

  // Additional span processors (optional)
  spanProcessors?: SpanProcessor[];

  // Additional instrumentations (optional)
  instrumentations?: Instrumentation[];

  // Enable automatic fetch instrumentation (default: true)
  enableFetchInstrumentation?: boolean;

  // Fetch instrumentation configuration (optional)
  fetchInstrumentationConfig?: Partial<FetchInstrumentationConfig>;

  // Enable automatic XMLHttpRequest instrumentation (default: true)
  enableXMLHttpRequestInstrumentation?: boolean;

  // XMLHttpRequest instrumentation configuration (optional)
  xmlHttpRequestInstrumentationConfig?: Partial<XMLHttpRequestInstrumentationConfig>;

  // Device information to include in resource attributes (optional)
  deviceInfo?: {
    OS?: string;        // Operating system name (e.g., 'ios', 'android', 'web')
    version?: string;   // Operating system version
    deviceId?: string;  // Unique device identifier
  };

  // Enable debug logging (default: false)
  debug?: boolean;
}
```

### `OpenTelemetryProvider`

React provider component for initializing OpenTelemetry.

**Props:**

- `config: OpenTelemetryConfig` - OpenTelemetry configuration
- `children: ReactNode` - Child components
- `loadingComponent?: ReactNode` - Component shown during initialization
- `onError?: (error: Error) => void` - Initialization error handler

### `useOpenTelemetry()`

Hook for accessing the OpenTelemetry context. Must be used inside `OpenTelemetryProvider`.

**Returns:**

```typescript
{
  initialized: boolean;
  getTracer: (name: string, version?: string) => Tracer;
}
```

### Usage Examples

#### Basic Usage

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

#### Advanced Configuration

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

#### Creating Custom Traces

```tsx
import { trace, SpanStatusCode } from "@dozmar/react-native-opentelemetry";

function performOperation() {
  const tracer = trace.getTracer("my-tracer");
  const span = tracer.startSpan("operation-name");

  try {
    // Your code
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

## 🛠️ Development

### Requirements

- Node.js >= 18
- Yarn >= 4.0
- React Native >= 0.70

### Installing Dependencies

```bash
yarn install
```

### Running Linter

```bash
yarn lint
```

### Auto-fixing Linter Errors

```bash
yarn lint:fix
```

### Formatting Code

```bash
yarn format
```

### Running Type Check

```bash
yarn typecheck
```

### Running Tests

```bash
yarn test
```

### Running Example

```bash
cd example
yarn install
yarn ios  # or yarn android
```

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 🔗 Useful Links

- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [React Native Documentation](https://reactnative.dev/)
- [Usage Example](example/)
- [GitHub Repository](https://github.com/Dozmar/react-native-opentelemetry)

## 📄 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes.
