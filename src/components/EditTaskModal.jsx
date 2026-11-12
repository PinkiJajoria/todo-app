import React, { useState, useEffect } from 'react';
import { CATEGORIES, PRIORITIES } from '../utils/constants';

export default function EditTaskModal({ task, isOpen, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('work');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setCategory(task.category || 'work');
      setPriority(task.priority || 'medium');
      setDueDate(task.dueDate || '');
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      ...task,
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      dueDate
    });
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)' }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-dialog-scrollable px-3 px-sm-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content shadow border-0">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">Edit Task</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">
                  Task Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Task title"
                  required
                  autoFocus
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">
                  Description / Notes
                </label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional task details..."
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold text-secondary">
                    Category
                  </label>
                  <select
                    className="form-select form-select-sm"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold text-secondary">
                    Priority
                  </label>
                  <select
                    className="form-select form-select-sm"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    {Object.values(PRIORITIES).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.icon} {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-2">
                <label className="form-label small fw-semibold text-secondary">
                  Due Date
                </label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-footer bg-body-tertiary">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm px-3 fw-semibold">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
