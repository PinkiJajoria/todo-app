import React, { useRef } from 'react';
import {
  CheckCircle2,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Download,
  Upload,
  DownloadCloud
} from 'lucide-react';

export default function Header({
  theme,
  toggleTheme,
  soundEnabled,
  toggleSound,
  tasks,
  onImportTasks,
  installPrompt,
  onInstallApp,
  showToast
}) {
  const fileInputRef = useRef(null);

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).format(new Date());

  const handleExport = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `taskflow-backup-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Tasks exported successfully! 📁');
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
          showToast(`Successfully imported ${imported.length} tasks! 🚀`);
        } else {
          showToast('Invalid JSON file', 'error');
        }
      } catch {
        showToast('Error parsing file', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <nav className="navbar navbar-expand bg-body-tertiary border-bottom shadow-sm mb-3 mb-md-4 sticky-top">
      <div className="container-fluid container-md px-3">
        {/* Brand */}
        <div className="navbar-brand d-flex align-items-center gap-2 mb-0 me-auto">
          <CheckCircle2 className="text-primary flex-shrink-0" size={24} strokeWidth={2.4} />
          <span className="fw-bold tracking-tight">TaskFlow</span>
          <span className="badge text-bg-primary-subtle text-primary border border-primary-subtle rounded-pill small">
            PWA
          </span>
        </div>

        {/* Right side controls */}
        <div className="d-flex align-items-center gap-1 gap-sm-2">
          {/* PWA Install Button (shows when installable) */}
          {installPrompt && (
            <button
              className="btn btn-primary btn-sm d-flex align-items-center gap-1 fw-semibold px-2 px-sm-3"
              onClick={onInstallApp}
              title="Install TaskFlow PWA on this device"
            >
              <DownloadCloud size={16} />
              <span className="d-none d-sm-inline">Install App</span>
            </button>
          )}

          <span className="text-secondary small d-none d-lg-inline me-2">
            📅 {todayFormatted}
          </span>

          {/* Export JSON */}
          <button
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1 px-2 px-sm-2"
            onClick={handleExport}
            title="Export tasks to JSON"
            aria-label="Export tasks"
          >
            <Download size={15} />
            <span className="d-none d-md-inline">Export</span>
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
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1 px-2 px-sm-2"
            onClick={() => fileInputRef.current?.click()}
            title="Import tasks from JSON"
            aria-label="Import tasks"
          >
            <Upload size={15} />
            <span className="d-none d-md-inline">Import</span>
          </button>

          {/* Sound Toggle */}
          <button
            className={`btn btn-sm px-2 ${soundEnabled ? 'btn-outline-primary' : 'btn-outline-secondary'}`}
            onClick={toggleSound}
            title={soundEnabled ? 'Sound Enabled' : 'Sound Muted'}
            aria-label="Toggle sound"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Dark/Light Mode */}
          <button
            className="btn btn-outline-secondary btn-sm px-2 d-flex align-items-center"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} className="text-warning" /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
