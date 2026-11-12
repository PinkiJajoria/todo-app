import React, { useRef } from 'react';
import {
  Smartphone,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Info,
  CheckCircle2
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

export default function SettingsView({
  theme,
  toggleTheme,
  soundEnabled,
  toggleSound,
  tasks,
  onImportTasks,
  onResetTasks,
  onClearCompleted,
  installPrompt,
  onInstallApp,
  showToast
}) {
  const fileInputRef = useRef(null);

  const handleExport = () => {
    triggerHaptic('light');
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `taskflow-backup-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Backup saved to downloads! 📁');
    } catch {
      showToast('Export failed', 'error');
    }
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          onImportTasks(imported);
          triggerHaptic('success');
          showToast(`Imported ${imported.length} tasks! 🚀`);
        } else {
          showToast('Invalid backup file', 'error');
        }
      } catch {
        showToast('Error reading file', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="settings-view pb-4">
      {/* App Branding Card */}
      <div className="card shadow-sm mb-3">
        <div className="card-body text-center py-4">
          <div
            className="d-inline-flex p-3 rounded-4 bg-primary text-white shadow-sm mb-2"
            style={{ width: 64, height: 64, alignItems: 'center', justifyContent: 'center' }}
          >
            <CheckCircle2 size={36} strokeWidth={2.5} />
          </div>
          <h4 className="fw-bold mb-0">TaskFlow Mobile</h4>
          <p className="text-secondary small mb-2">v1.0.0 • React + Capacitor + PWA</p>
          <span className="badge text-bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1">
            Native App Ready
          </span>
        </div>
      </div>

      {/* PWA Direct Installation Card (if installable) */}
      {installPrompt && (
        <div className="card shadow-sm border-primary mb-3 bg-primary-subtle">
          <div className="card-body d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <Smartphone size={24} className="text-primary" />
              <div>
                <h6 className="fw-bold mb-0 text-primary-emphasis">Install App on Phone</h6>
                <small className="text-secondary">Add app to your Home Screen</small>
              </div>
            </div>
            <button className="btn btn-primary btn-sm px-3 fw-semibold" onClick={onInstallApp}>
              Install
            </button>
          </div>
        </div>
      )}

      {/* Preferences Section */}
      <div className="card shadow-sm mb-3">
        <div className="card-header bg-body-tertiary fw-semibold small text-secondary">
          PREFERENCES
        </div>
        <div className="list-group list-group-flush">
          {/* Theme Mode */}
          <div className="list-group-item d-flex align-items-center justify-content-between py-3">
            <div className="d-flex align-items-center gap-2">
              {theme === 'dark' ? <Moon size={20} className="text-warning" /> : <Sun size={20} className="text-warning" />}
              <div>
                <div className="fw-semibold small">Appearance</div>
                <small className="text-secondary">
                  {theme === 'dark' ? 'Dark Mode (Active)' : 'Light Mode (Active)'}
                </small>
              </div>
            </div>
            <button
              className="btn btn-outline-secondary btn-sm px-3"
              onClick={() => {
                triggerHaptic('light');
                toggleTheme();
              }}
            >
              {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            </button>
          </div>

          {/* Sound Effects */}
          <div className="list-group-item d-flex align-items-center justify-content-between py-3">
            <div className="d-flex align-items-center gap-2">
              {soundEnabled ? <Volume2 size={20} className="text-primary" /> : <VolumeX size={20} className="text-secondary" />}
              <div>
                <div className="fw-semibold small">Sound Chimes</div>
                <small className="text-secondary">Audio effects for task completion</small>
              </div>
            </div>
            <button
              className={`btn btn-sm px-3 ${soundEnabled ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => {
                triggerHaptic('light');
                toggleSound();
              }}
            >
              {soundEnabled ? 'Enabled' : 'Muted'}
            </button>
          </div>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="card shadow-sm mb-3">
        <div className="card-header bg-body-tertiary fw-semibold small text-secondary">
          DATA MANAGEMENT
        </div>
        <div className="list-group list-group-flush">
          {/* Export JSON */}
          <button
            type="button"
            className="list-group-item list-group-item-action d-flex align-items-center justify-content-between py-3"
            onClick={handleExport}
          >
            <div className="d-flex align-items-center gap-2">
              <Download size={18} className="text-primary" />
              <span className="small fw-semibold">Export Backup (JSON)</span>
            </div>
            <span className="badge text-bg-light border text-secondary">{tasks.length} tasks</span>
          </button>

          {/* Import JSON */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".json"
            onChange={handleImport}
          />
          <button
            type="button"
            className="list-group-item list-group-item-action d-flex align-items-center justify-content-between py-3"
            onClick={() => {
              triggerHaptic('light');
              fileInputRef.current?.click();
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <Upload size={18} className="text-success" />
              <span className="small fw-semibold">Import Backup (JSON)</span>
            </div>
            <span className="small text-secondary">Choose file ›</span>
          </button>

          {/* Clear Done */}
          <button
            type="button"
            className="list-group-item list-group-item-action d-flex align-items-center justify-content-between py-3 text-danger"
            onClick={() => {
              triggerHaptic('warning');
              onClearCompleted();
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <Trash2 size={18} />
              <span className="small fw-semibold">Clear Completed Tasks</span>
            </div>
          </button>

          {/* Reset Demo Tasks */}
          <button
            type="button"
            className="list-group-item list-group-item-action d-flex align-items-center justify-content-between py-3 text-secondary"
            onClick={() => {
              triggerHaptic('light');
              onResetTasks();
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <RefreshCw size={18} />
              <span className="small fw-semibold">Reset Starter Tasks</span>
            </div>
          </button>
        </div>
      </div>

      {/* Android Native Info Card */}
      <div className="card shadow-sm border-0 bg-body-tertiary">
        <div className="card-body p-3 small text-secondary">
          <div className="d-flex gap-2">
            <Info size={16} className="text-primary flex-shrink-0 mt-1" />
            <div>
              <strong className="text-body">Android Studio Ready:</strong> Native Android project
              files have been generated in the `android/` directory. Run `npx cap open android`
              to open in Android Studio and build an APK!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
