"use client";

import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (typeof window !== "undefined") {
      console.error(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          level: "error",
          service: "ecomonitor",
          msg: "React component error",
          error: error.message,
          stack: error.stack,
          componentStack: info.componentStack,
        })
      );
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="error-boundary">
          <h2>Щось пішло не так</h2>
          <p>Виникла непередбачена помилка у цьому блоці сторінки.</p>
          <button
            className="btn"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Спробувати ще раз
          </button>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <pre className="error-boundary-detail">{this.state.error.message}</pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
