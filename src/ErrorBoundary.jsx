import React from 'react';

/**
 * Robust ErrorBoundary to prevent black screen crashes on mobile & desktop.
 * If any unexpected runtime error occurs, displays a clean recovery view
 * with a one-tap refresh button and pull-to-refresh support to safely reopen the page.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
    this.touchStartY = 0;
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    try {
      // Clear any temporary broken active sheet state if present
      sessionStorage.clear();
      window.location.reload();
    } catch {
      window.location.href = window.location.href;
    }
  };

  handleTouchStart = (e) => {
    if (e.touches && e.touches.length > 0) {
      this.touchStartY = e.touches[0].clientY;
    }
  };

  handleTouchEnd = (e) => {
    if (e.changedTouches && e.changedTouches.length > 0) {
      const diffY = e.changedTouches[0].clientY - this.touchStartY;
      if (diffY > 60) {
        // User swiped/pulled down to refresh on error screen
        this.handleReload();
      }
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="crash-recovery-screen"
          onTouchStart={this.handleTouchStart}
          onTouchEnd={this.handleTouchEnd}
        >
          <div className="crash-recovery-card">
            <div className="crash-recovery-icon">🔄</div>
            <h2 className="crash-recovery-title">Page Recovery</h2>
            <p className="crash-recovery-desc">
              A temporary issue occurred. Tap below or swipe down to refresh and reopen your page safely.
            </p>
            <button
              type="button"
              className="crash-recovery-btn"
              onClick={this.handleReload}
            >
              Refresh & Reopen Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
