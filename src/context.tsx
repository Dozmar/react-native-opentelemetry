import { createContext, useContext } from "react";
import type { OpenTelemetryContextValue } from "./types";

export const OpenTelemetryContext = createContext<OpenTelemetryContextValue | null>(null);

export function useOpenTelemetry(): OpenTelemetryContextValue {
	const context = useContext(OpenTelemetryContext);

	if (!context) {
		throw new Error("useOpenTelemetry must be used within an OpenTelemetryProvider");
	}

	return context;
}
