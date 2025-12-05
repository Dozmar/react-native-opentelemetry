import {
	CompositePropagator,
	W3CBaggagePropagator,
	W3CTraceContextPropagator,
} from "@opentelemetry/core";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { type Instrumentation, registerInstrumentations } from "@opentelemetry/instrumentation";
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch";
import { XMLHttpRequestInstrumentation } from "@opentelemetry/instrumentation-xml-http-request";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchSpanProcessor, type SpanProcessor } from "@opentelemetry/sdk-trace-base";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import {
	ATTR_DEVICE_ID,
	ATTR_OS_NAME,
	ATTR_OS_VERSION,
	ATTR_SERVICE_NAME,
	ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions/incubating";
import type { OpenTelemetryConfig } from "./types";

function buildResourceAttributes(
	serviceName: string,
	serviceVersion?: string,
	resourceAttributes: import("@opentelemetry/resources").DetectedResourceAttributes = {},
	deviceInfo?: OpenTelemetryConfig["deviceInfo"]
): Record<string, string> {
	const resourceAttrs: Record<string, string> = {
		[ATTR_SERVICE_NAME]: serviceName,
	};

	for (const [key, value] of Object.entries(resourceAttributes)) {
		if (value !== undefined) {
			resourceAttrs[key] = String(value);
		}
	}

	if (serviceVersion) {
		resourceAttrs[ATTR_SERVICE_VERSION] = serviceVersion;
	}

	if (deviceInfo) {
		if (deviceInfo.OS) {
			resourceAttrs[ATTR_OS_NAME] = deviceInfo.OS;
		}
		if (deviceInfo.version) {
			resourceAttrs[ATTR_OS_VERSION] = deviceInfo.version;
		}
		if (deviceInfo.deviceId) {
			resourceAttrs[ATTR_DEVICE_ID] = deviceInfo.deviceId;
		}
	}

	return resourceAttrs;
}

function createInstrumentationList(
	enableFetchInstrumentation: boolean,
	fetchInstrumentationConfig: Partial<
		import("@opentelemetry/instrumentation-fetch").FetchInstrumentationConfig
	>,
	enableXMLHttpRequestInstrumentation: boolean,
	xmlHttpRequestInstrumentationConfig: Partial<
		import("@opentelemetry/instrumentation-xml-http-request").XMLHttpRequestInstrumentationConfig
	>,
	ignoreUrls: (string | RegExp)[],
	instrumentations: Instrumentation[],
	debug: boolean
): Instrumentation[] {
	const instrumentationList: Instrumentation[] = [];

	if (enableFetchInstrumentation) {
		if (debug) {
			console.log("🔧 Registering FetchInstrumentation...");
		}
		instrumentationList.push(
			new FetchInstrumentation({
				propagateTraceHeaderCorsUrls: /.*/,
				clearTimingResources: false,
				...fetchInstrumentationConfig,
			})
		);
	}

	if (enableXMLHttpRequestInstrumentation) {
		if (debug) {
			console.log("🔧 Registering XMLHttpRequestInstrumentation...");
		}
		instrumentationList.push(
			new XMLHttpRequestInstrumentation({
				ignoreUrls: ignoreUrls.map((url) => (typeof url === "string" ? new RegExp(url) : url)),
				...xmlHttpRequestInstrumentationConfig,
			})
		);
	}

	instrumentationList.push(...instrumentations);
	return instrumentationList;
}

export async function initializeOpenTelemetry(config: OpenTelemetryConfig): Promise<void> {
	const {
		endpoint,
		serviceName,
		serviceVersion,
		resourceAttributes = {},
		scheduledDelayMillis = 500,
		ignoreUrls = [],
		spanProcessors = [],
		instrumentations = [],
		enableFetchInstrumentation = true,
		fetchInstrumentationConfig = {},
		enableXMLHttpRequestInstrumentation = true,
		xmlHttpRequestInstrumentationConfig = {},
		deviceInfo,
		debug = false,
	} = config;

	const resourceAttrs = buildResourceAttributes(
		serviceName,
		serviceVersion,
		resourceAttributes,
		deviceInfo
	);

	const resource = resourceFromAttributes(resourceAttrs);

	const exporter = new OTLPTraceExporter({
		url: endpoint,
	});

	const processors: Array<SpanProcessor> = [
		new BatchSpanProcessor(exporter, {
			scheduledDelayMillis,
		}),
		...spanProcessors,
	];

	const provider = new WebTracerProvider({
		resource,
		spanProcessors: processors,
	});

	provider.register({
		propagator: new CompositePropagator({
			propagators: [new W3CBaggagePropagator(), new W3CTraceContextPropagator()],
		}),
	});

	const instrumentationList = createInstrumentationList(
		enableFetchInstrumentation,
		fetchInstrumentationConfig,
		enableXMLHttpRequestInstrumentation,
		xmlHttpRequestInstrumentationConfig,
		ignoreUrls,
		instrumentations,
		debug
	);

	if (instrumentationList.length > 0) {
		if (debug) {
			console.log(`🔧 Registering ${instrumentationList.length} instrumentations...`);
		}
		registerInstrumentations({
			instrumentations: instrumentationList,
		});
		if (debug) {
			console.log("✅ Instrumentations registered successfully");
		}
	}

	if (debug) {
		console.log("✅ OpenTelemetry initialized successfully");
	}
}
