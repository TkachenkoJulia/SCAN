import React from "react";
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: unknown) {
    console.error(err);
  }
  render() {
    if (this.state.hasError)
      return <div>Что-то пошло не так. Обновите страницу.</div>;
    return this.props.children;
  }
}
