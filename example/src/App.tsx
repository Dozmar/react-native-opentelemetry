import { OpenTelemetryProvider, useOpenTelemetry } from "@dozmar/react-native-opentelemetry";
import * as Device from "expo-device";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

function AppContent() {
	const { initialized, getTracer } = useOpenTelemetry();
	const [fetchResult, setFetchResult] = useState("");
	const [loading, setLoading] = useState(false);

	const createTestTrace = () => {
		if (!initialized) return;

		const tracer = getTracer("example-app", "1.0.0");
		const span = tracer.startSpan("test-operation");

		span.setAttributes({
			"user.action": "button_click",
			component: "test-button",
			timestamp: new Date().toISOString(),
		});

		setTimeout(() => {
			span.setStatus({ code: 1 });
			span.end();
		}, 100);

		console.log("Test trace created!");
	};

	const createErrorTrace = () => {
		if (!initialized) return;

		const tracer = getTracer("example-app", "1.0.0");
		const span = tracer.startSpan("error-operation");

		span.setAttributes({
			"user.action": "error_simulation",
			component: "error-button",
		});

		setTimeout(() => {
			span.recordException(new Error("Test error for tracing"));
			span.setStatus({ code: 2, message: "Test error occurred" }); // ERROR status
			span.end();
		}, 50);

		console.log("Error trace created!");
	};

	const fetchUserData = async () => {
		if (!initialized) return;

		setLoading(true);
		setFetchResult("Loading user data...");

		try {
			const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
			const userData = (await response.json()) as { name: string; email: string };

			setFetchResult(`User: ${userData.name} (${userData.email})`);
			console.log("User data fetched successfully!");
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			setFetchResult(`Error: ${errorMessage}`);
			console.error("Failed to fetch user data:", error);
		} finally {
			setLoading(false);
		}
	};
	const fetchPostsData = async () => {
		if (!initialized) return;

		setLoading(true);
		setFetchResult("Loading posts...");

		try {
			const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
			const postsData = (await response.json()) as Array<{ title: string }>;

			const postTitles = postsData.map((post) => post.title).join(", ");
			setFetchResult(`Posts (${postsData.length}): ${postTitles.substring(0, 100)}...`);
			console.log("Posts data fetched successfully!");
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			setFetchResult(`Error: ${errorMessage}`);
			console.error("Failed to fetch posts data:", error);
		} finally {
			setLoading(false);
		}
	};
	const fetchWithError = async () => {
		if (!initialized) return;

		setLoading(true);
		setFetchResult("Attempting to fetch from invalid URL...");

		try {
			const response = await fetch("https://jsonplaceholder.typicode.com/invalid-endpoint");

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			await response.json();
			setFetchResult("Unexpected success!");
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			setFetchResult(`Expected Error: ${errorMessage}`);
			console.log("Error automatically traced by FetchInstrumentation!");
		} finally {
			setLoading(false);
		}
	};

	return (
		<ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
			<Text style={styles.title}>OpenTelemetry Example</Text>
			<Text style={styles.status}>
				Status: {initialized ? "✅ Initialized" : "❌ Not Initialized"}
			</Text>

			{initialized && (
				<View style={styles.buttonContainer}>
					<Text style={styles.sectionTitle}>Manual Traces</Text>
					<TouchableOpacity style={styles.button} onPress={createTestTrace}>
						<Text style={styles.buttonText}>Create Test Trace</Text>
					</TouchableOpacity>

					<TouchableOpacity style={[styles.button, styles.errorButton]} onPress={createErrorTrace}>
						<Text style={styles.buttonText}>Create Error Trace</Text>
					</TouchableOpacity>

					<Text style={styles.sectionTitle}>
						HTTP Requests (Auto-traced by FetchInstrumentation)
					</Text>
					<TouchableOpacity
						style={[styles.button, styles.fetchButton]}
						onPress={fetchUserData}
						disabled={loading}
					>
						<Text style={styles.buttonText}>{loading ? "Loading..." : "Fetch User Data"}</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[styles.button, styles.fetchButton]}
						onPress={fetchPostsData}
						disabled={loading}
					>
						<Text style={styles.buttonText}>{loading ? "Loading..." : "Fetch Posts Data"}</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[styles.button, styles.errorButton]}
						onPress={fetchWithError}
						disabled={loading}
					>
						<Text style={styles.buttonText}>{loading ? "Loading..." : "Fetch with Error"}</Text>
					</TouchableOpacity>

					{fetchResult ? (
						<View style={styles.resultContainer}>
							<Text style={styles.resultTitle}>Last Result:</Text>
							<Text style={styles.resultText}>{fetchResult}</Text>
						</View>
					) : null}
				</View>
			)}
		</ScrollView>
	);
}

export default function App() {
	return (
		<OpenTelemetryProvider
			config={{
				endpoint: "EXPO_PUBLIC_OPEN_TELEMETRY_URL",
				serviceName: "example-app",
				serviceVersion: "1.0.0",
				deviceInfo: {
					deviceId: Device.modelId,
					OS: Device.osName || "unknown-os",
					version: Device.osVersion || "unknown-version",
				},
				enableFetchInstrumentation: true,
				enableXMLHttpRequestInstrumentation: true,
				debug: true,
			}}
		>
			<AppContent />
		</OpenTelemetryProvider>
	);
}

const styles = StyleSheet.create({
	scrollContainer: {
		flex: 1,
		backgroundColor: "#f5f5f5",
	},
	container: {
		alignItems: "center",
		justifyContent: "center",
		padding: 20,
		minHeight: "100%",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
		color: "#333",
	},
	status: {
		fontSize: 16,
		marginBottom: 30,
		color: "#666",
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginTop: 20,
		marginBottom: 10,
		color: "#333",
		textAlign: "center",
	},
	buttonContainer: {
		gap: 15,
		width: "100%",
		alignItems: "center",
	},
	button: {
		backgroundColor: "#007AFF",
		paddingHorizontal: 20,
		paddingVertical: 12,
		borderRadius: 8,
		minWidth: 200,
		alignItems: "center",
		opacity: 1,
	},
	errorButton: {
		backgroundColor: "#FF3B30",
	},
	fetchButton: {
		backgroundColor: "#34C759",
	},
	buttonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "600",
	},
	resultContainer: {
		marginTop: 20,
		padding: 15,
		backgroundColor: "#fff",
		borderRadius: 8,
		width: "100%",
		borderWidth: 1,
		borderColor: "#ddd",
	},
	resultTitle: {
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 8,
		color: "#333",
	},
	resultText: {
		fontSize: 14,
		color: "#666",
		lineHeight: 20,
	},
});
