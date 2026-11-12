import React from 'react';
import { Trash2 } from 'lucide-react';
import { CATEGORIES } from '../utils/constants';

export default function TaskFilterBar({
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  hasCompletedTasks,
  onClearCompleted
}) {
  return (
    <div className="card shadow-sm mb-3 mb-md-4" style={{ overflow: 'hidden' }}>
      <div className="card-body p-3 p-sm-4" style={{ minWidth: 0 }}>
        {/* Top Controls: Sort & Clear */}
        <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
          {/* Sort Selector */}
          <div style={{ maxWidth: '240px', minWidth: '170px' }} className="flex-grow-1 flex-sm-grow-0">
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort tasks"
            >
              <option value="created-desc">📅 Newest First</option>
              <option value="created-asc">📅 Oldest First</option>
              <option value="dueDate-asc">⏰ Due Date</option>
              <option value="priority-desc">🔥 Highest Priority</option>
              <option value="alpha-asc">🔤 Alphabetical (A-Z)</option>
            </select>
          </div>

          {/* Clear Completed Action */}
          {hasCompletedTasks && (
            <div>
              <button
                type="button"
                className="btn btn-outline-danger d-flex align-items-center justify-content-center gap-1 px-3"
                onClick={onClearCompleted}
                title="Clear all completed tasks"
              >
                <Trash2 size={15} />
                <span className="small text-truncate">Clear Done</span>
              </button>
            </div>
          )}
        </div>

        {/* Category Horizontal Swipe / Scroll Pills */}
        <div
          className="category-scroll-container d-flex align-items-center gap-2 gap-sm-3 mt-3 pt-1 border-0"
          style={{
            width: '100%',
            maxWidth: '100%',
            minWidth: 0,
            overflowX: 'auto',
            overflowY: 'hidden',
            WebkitOverflowScrolling: 'touch',
            whiteSpace: 'nowrap',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <small className="text-secondary fw-semibold me-2 flex-shrink-0">
            Category:
          </small>
          <button
            type="button"
            className={`btn btn-sm text-nowrap rounded-pill px-3 py-1 flex-shrink-0 btn-outline-secondary category-all-btn ${
              selectedCategory === 'all' ? 'active' : ''
            }`}
            onClick={() => setSelectedCategory('all')}
            style={
              selectedCategory === 'all'
                ? {
                    backgroundColor: '#d1e7dd',
                    borderColor: 'var(--bs-secondary-color, #6c757d)',
                    color: 'var(--bs-body-color, #495057)'
                  }
                : {}
            }
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat.id}
              className={`btn btn-sm text-nowrap rounded-pill px-3 py-1 flex-shrink-0 ${
                selectedCategory === cat.id ? 'btn-primary' : 'btn-outline-secondary'
              }`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
