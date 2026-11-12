import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ErrorBoundary } from './ErrorBoundary.jsx';

// Register Service Worker for PWA Offline Functionality
if ('serviceWorker' in navigator && (import.meta.env.PROD || window.location.protocol === 'http:' || window.location.protocol === 'https:')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('My Day PWA service worker registered:', reg.scope);
      })
      .catch((err) => {
        console.log('SW registration note:', err);
      });
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
