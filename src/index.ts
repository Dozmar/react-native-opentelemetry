export type {
	Span,
	SpanKind,
	SpanOptions,
	SpanStatus,
	Tracer,
} from "@opentelemetry/api";
// Re-export OpenTelemetry API для удобства использования
export { context, SpanStatusCode, trace } from "@opentelemetry/api";

export { useOpenTelemetry } from "./context";

export { initializeOpenTelemetry } from "./initializer";
export type { OpenTelemetryProviderProps } from "./OpenTelemetryProvider";
export { OpenTelemetryProvider } from "./OpenTelemetryProvider";
export type { OpenTelemetryConfig, OpenTelemetryContextValue } from "./types";
