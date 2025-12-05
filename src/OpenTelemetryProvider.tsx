import { trace } from "@opentelemetry/api";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { OpenTelemetryContext } from "./context";
import { initializeOpenTelemetry } from "./initializer";
import type { OpenTelemetryConfig, OpenTelemetryContextValue } from "./types";

export interface OpenTelemetryProviderProps {
	/**
	 * OpenTelemetry configuration
	 */
	config: OpenTelemetryConfig;

	/**
	 * Child components
	 */
	children: ReactNode;

	/**
	 * Component to show during initialization
	 */
	loadingComponent?: ReactNode;

	/**
	 * Initialization error handler
	 */
	onError?: (error: Error) => void;
}

export function OpenTelemetryProvider({
	config,
	children,
	loadingComponent,
	onError,
}: OpenTelemetryProviderProps) {
	const [initialized, setInitialized] = useState(false);

	useEffect(() => {
		let mounted = true;

		initializeOpenTelemetry(config)
			.then(() => {
				if (mounted) {
					setInitialized(true);
				}
			})
			.catch((error) => {
				console.warn("Failed to initialize OpenTelemetry:", error);
				if (onError) {
					onError(error);
				}
				if (mounted) {
					setInitialized(true); // Show UI even on error
				}
			});

		return () => {
			mounted = false;
		};
	}, [config, onError]);

	const getTracer = useCallback((name: string, version?: string) => {
		return trace.getTracer(name, version);
	}, []);

	const contextValue: OpenTelemetryContextValue = {
		initialized,
		getTracer,
	};

	if (!initialized && loadingComponent) {
		return <>{loadingComponent}</>;
	}

	return (
		<OpenTelemetryContext.Provider value={contextValue}>{children}</OpenTelemetryContext.Provider>
	);
}
