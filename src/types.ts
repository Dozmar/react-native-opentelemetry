import type { Instrumentation } from "@opentelemetry/instrumentation";
import type { FetchInstrumentationConfig } from "@opentelemetry/instrumentation-fetch";
import type { XMLHttpRequestInstrumentationConfig } from "@opentelemetry/instrumentation-xml-http-request";
import type { DetectedResourceAttributes } from "@opentelemetry/resources";
import type { SpanProcessor } from "@opentelemetry/sdk-trace-base";

export interface DeviceInfo {
	/**
	 * Operating system name (e.g., 'ios', 'android', 'web')
	 */
	OS?: string;

	/**
	 * Operating system version
	 */
	version?: string;

	/**
	 * Unique device identifier
	 */
	deviceId?: string;
}

export interface OpenTelemetryConfig {
	/**
	 * OTLP endpoint URL for sending traces
	 */
	endpoint: string;

	/**
	 * Service name for trace identification
	 */
	serviceName: string;

	/**
	 * Service version
	 */
	serviceVersion?: string;

	/**
	 * Additional resource attributes
	 */
	resourceAttributes?: DetectedResourceAttributes;

	/**
	 * Delay before sending trace batch in milliseconds
	 * @default 500
	 */
	scheduledDelayMillis?: number;

	/**
	 * URL patterns to ignore during XMLHttpRequest instrumentation
	 */
	ignoreUrls?: (string | RegExp)[];

	/**
	 * Additional span processors
	 */
	spanProcessors?: SpanProcessor[];

	/**
	 * Additional instrumentations
	 */
	instrumentations?: Instrumentation[];

	/**
	 * Enable automatic fetch instrumentation
	 * @default true
	 */
	enableFetchInstrumentation?: boolean;

	/**
	 * Configuration options for fetch instrumentation
	 */
	fetchInstrumentationConfig?: Partial<FetchInstrumentationConfig>;

	/**
	 * Enable automatic XMLHttpRequest instrumentation
	 * @default true
	 */
	enableXMLHttpRequestInstrumentation?: boolean;

	/**
	 * Configuration options for XMLHttpRequest instrumentation
	 */
	xmlHttpRequestInstrumentationConfig?: Partial<XMLHttpRequestInstrumentationConfig>;

	/**
	 * Device information to include in resource attributes
	 * If provided, will be added to traces as device-related attributes
	 */
	deviceInfo?: DeviceInfo;

	/**
	 * Enable debug logging for OpenTelemetry operations
	 * @default false
	 */
	debug?: boolean;
}

export interface OpenTelemetryContextValue {
	/**
	 * Flag indicating that OpenTelemetry is initialized
	 */
	initialized: boolean;

	/**
	 * Function to get a tracer instance
	 */
	getTracer: (name: string, version?: string) => import("@opentelemetry/api").Tracer;
}
