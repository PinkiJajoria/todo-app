import React from 'react';
import { Star, Edit3, Copy, Trash2, Calendar } from 'lucide-react';
import { CATEGORIES, PRIORITIES } from '../utils/constants';

export default function TaskItem({
  task,
  onToggleComplete,
  onTogglePin,
  onEdit,
  onDuplicate,
  onDelete
}) {
  const categoryInfo = CATEGORIES.find((c) => c.id === task.category) || CATEGORIES[0];
  const priorityInfo = PRIORITIES[task.priority] || PRIORITIES.medium;

  const getDueStatus = (dateStr) => {
    if (!dateStr) return null;
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    if (dateStr < today) {
      return { label: 'Overdue', badgeClass: 'text-bg-danger' };
    }
    if (dateStr === today) {
      return { label: 'Today', badgeClass: 'text-bg-warning' };
    }
    if (dateStr === tomorrow) {
      return { label: 'Tomorrow', badgeClass: 'text-bg-secondary' };
    }
    return {
      label: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(
        new Date(dateStr + 'T00:00:00')
      ),
      badgeClass: 'bg-body-secondary text-body-secondary border'
    };
  };

  const dueStatus = getDueStatus(task.dueDate);

  return (
    <div
      className={`list-group-item list-group-item-action d-flex align-items-start gap-2 gap-sm-3 p-3 task-item ${
        task.completed ? 'completed' : ''
      } ${task.pinned ? 'pinned' : ''}`}
    >
      {/* Bootstrap Form Check Input */}
      <input
        type="checkbox"
        className="form-check-input task-check-input flex-shrink-0"
        checked={task.completed}
        onChange={() => onToggleComplete(task.id)}
        aria-label="Toggle task status"
      />

      {/* Task Content */}
      <div className="flex-grow-1 min-w-0">
        <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-1 mb-1">
          <h6 className="mb-0 task-title fw-semibold text-break">
            {task.title}
          </h6>

          {/* Action Button Group */}
          <div className="btn-group btn-group-sm flex-shrink-0 align-self-end align-self-sm-auto mt-1 mt-sm-0">
            <button
              type="button"
              className={`btn btn-star task-btn-action ${task.pinned ? 'active' : ''}`}
              onClick={() => onTogglePin(task.id)}
              title={task.pinned ? 'Unstar task' : 'Star task'}
              aria-label="Star task"
            >
              <Star
                size={16}
                fill={task.pinned ? '#ffc107' : 'none'}
                stroke={task.pinned ? '#ffc107' : 'currentColor'}
              />
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary task-btn-action"
              onClick={() => onEdit(task)}
              title="Edit task"
              aria-label="Edit task"
            >
              <Edit3 size={15} />
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary task-btn-action"
              onClick={() => onDuplicate(task)}
              title="Duplicate task"
              aria-label="Duplicate task"
            >
              <Copy size={15} />
            </button>
            <button
              type="button"
              className="btn btn-outline-danger task-btn-action"
              onClick={() => onDelete(task.id)}
              title="Delete task"
              aria-label="Delete task"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="mb-2 text-secondary small text-break">
            {task.description}
          </p>
        )}

        {/* Metadata Badges */}
        <div className="d-flex flex-wrap align-items-center gap-1 gap-sm-2 mt-1">
          <span className={`badge rounded-pill ${categoryInfo.badgeClass}`}>
            {categoryInfo.label}
          </span>

          <span className={`badge rounded-pill ${priorityInfo.badgeClass}`}>
            {priorityInfo.icon} {priorityInfo.label}
          </span>

          {dueStatus && (
            <span className={`badge rounded-pill ${dueStatus.badgeClass} d-inline-flex align-items-center`}>
              <Calendar size={12} className="me-1" />
              {dueStatus.label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
