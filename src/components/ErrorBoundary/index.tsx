import { Component } from "react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError)
      return (
        this.props.fallback ?? (
          <div role="alert" style={{ padding: "2rem", textAlign: "center" }}>
            <p>Something went wrong. Please refresh and try again.</p>
          </div>
        )
      );

    return this.props.children;
  }
}
