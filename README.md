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

## 📚 Documentation

For detailed API documentation and examples, see:

- **[English Documentation](README.en.md)** - Complete API reference and usage examples
- **[Русская Документация](README.ru.md)** - Полная документация API и примеры использования

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
