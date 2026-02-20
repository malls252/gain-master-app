
import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    private handleReset = () => {
        localStorage.clear();
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 text-center">
                    <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>

                        <h1 className="text-2xl font-bold text-white mb-3">
                            Something went wrong
                        </h1>

                        <p className="text-gray-400 mb-6 text-sm">
                            The application encountered an unexpected error. This might be due to corrupted data.
                        </p>

                        {this.state.error && (
                            <div className="bg-gray-900 p-4 rounded-lg mb-6 text-left overflow-auto max-h-40 border border-gray-800">
                                <code className="text-xs text-red-400 font-mono break-all">
                                    {this.state.error.message}
                                </code>
                            </div>
                        )}

                        <button
                            onClick={this.handleReset}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group"
                        >
                            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                            Reset App Data & Reload
                        </button>

                        <p className="mt-4 text-xs text-gray-500">
                            This will clear your local progress to restore functionality.
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
