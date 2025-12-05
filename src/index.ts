export type {
	Span,
	SpanKind,
	SpanOptions,
	SpanStatus,
	Tracer,
} from "@opentelemetry/api";

export { context, SpanStatusCode, trace } from "@opentelemetry/api";

export { useOpenTelemetry } from "./context";

export type { OpenTelemetryProviderProps } from "./OpenTelemetryProvider";
export { OpenTelemetryProvider } from "./OpenTelemetryProvider";
export type { OpenTelemetryConfig, OpenTelemetryContextValue } from "./types";
