import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function Toast({ toast, onUndo }) {
  if (!toast) return null;

  return (
    <div
      className="toast-container position-fixed bottom-0 start-50 translate-middle-x start-sm-auto end-sm-0 translate-middle-sm-none p-3"
      style={{ zIndex: 1100, width: 'max-content', maxWidth: 'calc(100vw - 1.5rem)' }}
    >
      <div
        className={`toast show align-items-center ${
          toast.type === 'error' ? 'text-bg-danger' : 'text-bg-dark'
        } border-0 shadow-lg`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="d-flex p-2">
          <div className="toast-body d-flex align-items-center gap-2">
            {toast.type === 'error' ? (
              <AlertCircle size={18} className="text-warning flex-shrink-0" />
            ) : (
              <CheckCircle2 size={18} className="text-success flex-shrink-0" />
            )}
            <span className="small">{toast.message}</span>
            {toast.undoAction && (
              <button
                type="button"
                className="btn btn-sm btn-outline-warning ms-2 py-0 px-2 fw-bold"
                onClick={onUndo}
              >
                Undo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
