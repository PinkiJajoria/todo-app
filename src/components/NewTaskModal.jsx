import React, { useState } from 'react';
import { X, Calendar, Plus } from 'lucide-react';
import { CATEGORIES, PRIORITIES } from '../utils/constants';

export default function NewTaskModal({ isOpen, onClose, onAddTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('work');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      dueDate: dueDate || new Date().toISOString().split('T')[0]
    });

    setTitle('');
    setDescription('');
    setDueDate('');
    onClose();
  };

  const setDatePreset = (daysOffset) => {
    const target = new Date(Date.now() + daysOffset * 86400000);
    setDueDate(target.toISOString().split('T')[0]);
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
            <h5 className="modal-title fw-bold">Naya Task Banayein</h5>
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
                  Task Title *
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Task ka naam likhein..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">
                  Notes / Description (Optional)
                </label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="Additional details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold text-secondary">Category</label>
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

                <div className="col-6">
                  <label className="form-label small fw-semibold text-secondary">Priority</label>
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
                <label className="form-label small fw-semibold text-secondary">Due Date</label>
                <div className="input-group input-group-sm mb-1">
                  <span className="input-group-text">
                    <Calendar size={14} />
                  </span>
                  <input
                    type="date"
                    className="form-control"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
                <div className="d-flex gap-1 w-100">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm flex-fill py-0"
                    style={{ fontSize: '0.75rem' }}
                    onClick={() => setDatePreset(0)}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm flex-fill py-0"
                    style={{ fontSize: '0.75rem' }}
                    onClick={() => setDatePreset(1)}
                  >
                    Tomorrow
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm flex-fill py-0"
                    style={{ fontSize: '0.75rem' }}
                    onClick={() => setDatePreset(7)}
                  >
                    +7 Days
                  </button>
                </div>
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
              <button
                type="submit"
                className="btn btn-primary btn-sm px-3 fw-semibold d-flex align-items-center gap-1"
              >
                <Plus size={16} />
                <span>Save Task</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
