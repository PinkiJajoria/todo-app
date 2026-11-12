import React, { useRef } from 'react';
import { CheckCircle2, Clock, Star, ListTodo, Search, X, ChevronRight } from 'lucide-react';

export default function StatsDashboard({
  tasks,
  activeFilter,
  setActiveFilter,
  searchQuery = '',
  setSearchQuery = () => {}
}) {
  const searchInputRef = useRef(null);
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const active = total - completed;
  const starred = tasks.filter((t) => t.pinned).length;

  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  const activePercentage = total === 0 ? 0 : Math.round((active / total) * 100);

  return (
    <div className="card shadow-sm mb-3 mb-md-4">
      <div className="card-body p-3 p-sm-4">
        {/* Daily Completion & Search Task - Perfectly Aligned Row */}
        <div className="d-flex align-items-center justify-content-between gap-2 gap-sm-3 mb-2">
          {/* Left: Daily Completion Title & Stats Badge */}
          <div className="d-flex align-items-center gap-2 flex-shrink-0">
            <span className="fw-semibold small fs-sm-6 text-nowrap">Daily Completion</span>
            <span className={`badge ${percentage === 100 ? 'text-bg-success' : 'text-bg-primary'}`}>
              <span className="d-none d-sm-inline">{completed}/{total} • </span>{percentage}%
            </span>
            <small className="text-secondary d-none d-md-inline">
              ({completed} of {total} done)
            </small>
          </div>

          {/* Right: Search Task Input - Perfectly Centered & Aligned on Right */}
          <div style={{ maxWidth: '240px', minWidth: '140px' }} className="flex-grow-1 flex-sm-grow-0">
            <div className="input-group input-group-sm">
              <span
                className="input-group-text search-icon-elevated px-2 text-secondary"
                onClick={() => searchInputRef.current?.focus()}
                title="Search tasks"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    searchInputRef.current?.focus();
                  }
                }}
              >
                <Search size={14} className="search-icon-svg" />
              </span>
              <input
                ref={searchInputRef}
                type="text"
                className="form-control"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search tasks"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="btn btn-outline-secondary px-2"
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bootstrap Progress Bar */}
        <div className="progress mb-3" style={{ height: '8px' }}>
          <div
            className={`progress-bar ${percentage === 100 ? 'bg-success' : 'bg-primary'}`}
            role="progressbar"
            style={{ width: `${percentage}%` }}
            aria-valuenow={percentage}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>

        {/* 4 Clickable Quick Filter Cards - Responsive Grid Layout */}
        <div className="row g-2 g-sm-3">
          {/* Total Card */}
          <div className="col-6 col-md-3">
            <button
              type="button"
              className={`btn w-100 stat-card-btn p-2 p-sm-3 text-start border rounded-3 h-100 d-flex flex-column justify-content-between ${
                activeFilter === 'all'
                  ? 'btn-primary shadow-sm active-stat-card'
                  : 'bg-primary-subtle border-primary-subtle text-primary-emphasis'
              }`}
              onClick={() => setActiveFilter('all')}
            >
              <div className="d-flex align-items-center justify-content-between w-100 mb-2">
                <span className="fw-semibold small">Total</span>
                <div
                  className={`rounded-2 p-1 d-flex align-items-center justify-content-center ${
                    activeFilter === 'all' ? 'bg-white text-primary shadow-sm' : 'bg-primary text-white shadow-sm'
                  }`}
                  style={{ width: '28px', height: '28px' }}
                >
                  <ListTodo size={16} strokeWidth={2.2} />
                </div>
              </div>
              <div>
                <div className="fs-3 fw-bold stat-num lh-1 mb-1">{total}</div>
                <div
                  className={`small text-truncate ${
                    activeFilter === 'all' ? 'text-white-50' : 'text-secondary'
                  }`}
                  style={{ fontSize: '0.72rem' }}
                >
                  All tasks
                </div>
              </div>
            </button>
          </div>

          {/* Active Card */}
          <div className="col-6 col-md-3">
            <button
              type="button"
              className={`btn w-100 stat-card-btn p-2 p-sm-3 text-start border rounded-3 h-100 d-flex flex-column justify-content-between ${
                activeFilter === 'active'
                  ? 'btn-warning shadow-sm text-dark active-stat-card'
                  : 'bg-warning-subtle border-warning-subtle text-warning-emphasis'
              }`}
              onClick={() => setActiveFilter('active')}
            >
              <div className="d-flex align-items-center justify-content-between w-100 mb-2">
                <span className="fw-semibold small">Active</span>
                <div
                  className={`rounded-2 p-1 d-flex align-items-center justify-content-center ${
                    activeFilter === 'active' ? 'bg-dark text-warning shadow-sm' : 'bg-warning text-dark shadow-sm'
                  }`}
                  style={{ width: '28px', height: '28px' }}
                >
                  <Clock size={16} strokeWidth={2.2} />
                </div>
              </div>
              <div>
                <div className="fs-3 fw-bold stat-num lh-1 mb-1">{active}</div>
                <div
                  className={`small text-truncate ${
                    activeFilter === 'active' ? 'text-dark-50' : 'text-secondary'
                  }`}
                  style={{ fontSize: '0.72rem' }}
                >
                  {activePercentage}% pending
                </div>
              </div>
            </button>
          </div>

          {/* Done Card */}
          <div className="col-6 col-md-3">
            <button
              type="button"
              className={`btn w-100 stat-card-btn p-2 p-sm-3 text-start border rounded-3 h-100 d-flex flex-column justify-content-between ${
                activeFilter === 'completed'
                  ? 'btn-success shadow-sm text-white active-stat-card'
                  : 'bg-success-subtle border-success-subtle text-success-emphasis'
              }`}
              onClick={() => setActiveFilter('completed')}
            >
              <div className="d-flex align-items-center justify-content-between w-100 mb-2">
                <span className="fw-semibold small">Done</span>
                <div
                  className={`rounded-2 p-1 d-flex align-items-center justify-content-center ${
                    activeFilter === 'completed' ? 'bg-white text-success shadow-sm' : 'bg-success text-white shadow-sm'
                  }`}
                  style={{ width: '28px', height: '28px' }}
                >
                  <CheckCircle2 size={16} strokeWidth={2.2} />
                </div>
              </div>
              <div>
                <div className="fs-3 fw-bold stat-num lh-1 mb-1">{completed}</div>
                <div
                  className={`small text-truncate ${
                    activeFilter === 'completed' ? 'text-white-50' : 'text-secondary'
                  }`}
                  style={{ fontSize: '0.72rem' }}
                >
                  {percentage}% finished
                </div>
              </div>
            </button>
          </div>

          {/* Starred Card */}
          <div className="col-6 col-md-3">
            <button
              type="button"
              className={`btn w-100 stat-card-btn p-2 p-sm-3 text-start border rounded-3 h-100 d-flex flex-column justify-content-between ${
                activeFilter === 'starred'
                  ? 'btn-info shadow-sm text-dark active-stat-card'
                  : 'bg-info-subtle border-info-subtle text-info-emphasis'
              }`}
              onClick={() => setActiveFilter('starred')}
            >
              <div className="d-flex align-items-center justify-content-between w-100 mb-2">
                <span className="fw-semibold small">Starred</span>
                <div
                  className={`rounded-2 p-1 d-flex align-items-center justify-content-center ${
                    activeFilter === 'starred' ? 'bg-dark text-info shadow-sm' : 'bg-info text-dark shadow-sm'
                  }`}
                  style={{ width: '28px', height: '28px' }}
                >
                  <Star size={16} strokeWidth={2.2} />
                </div>
              </div>
              <div>
                <div className="fs-3 fw-bold stat-num lh-1 mb-1">{starred}</div>
                <div
                  className={`small text-truncate ${
                    activeFilter === 'starred' ? 'text-dark-50' : 'text-secondary'
                  }`}
                  style={{ fontSize: '0.72rem' }}
                >
                  Pinned focus
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
