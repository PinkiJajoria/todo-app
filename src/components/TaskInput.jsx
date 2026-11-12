import React, { useState, useRef, useEffect } from 'react';
import { Plus, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { CATEGORIES, PRIORITIES } from '../utils/constants';

export default function TaskInput({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('work');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const contentRef = useRef(null);
  const [drawerHeight, setDrawerHeight] = useState('0px');
  const [isFullyOpen, setIsFullyOpen] = useState(false);

  useEffect(() => {
    let timer;
    if (isExpanded) {
      if (contentRef.current) {
        const fullHeight = contentRef.current.scrollHeight + 12;
        setDrawerHeight(`${fullHeight}px`);
        timer = setTimeout(() => {
          setIsFullyOpen(true);
          setDrawerHeight('auto');
        }, 440);
      }
    } else {
      setIsFullyOpen(false);
      if (contentRef.current) {
        setDrawerHeight(`${contentRef.current.scrollHeight + 12}px`);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setDrawerHeight('0px');
          });
        });
      } else {
        setDrawerHeight('0px');
      }
    }
    return () => clearTimeout(timer);
  }, [isExpanded]);

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
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isExpanded) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const setDatePreset = (daysOffset) => {
    const target = new Date(Date.now() + daysOffset * 86400000);
    setDueDate(target.toISOString().split('T')[0]);
  };

  return (
    <div className="card mb-3 mb-md-4 task-input-card">
      <div className="card-body p-3 p-sm-4">
        <form onSubmit={handleSubmit}>
          {/* Main Input Group */}
          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control task-title-input rounded"
              placeholder={isFocused ? '' : 'Add a new task...'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              style={{
                outline: isFocused ? '1px solid #ced4da' : 'none',
                borderColor: '#ced4da',
                boxShadow: isFocused ? '0 2px 6px rgba(0, 0, 0, 0.04)' : 'none'
              }}
            />

            <button
              type="button"
              className={`btn task-options-btn rounded d-flex align-items-center gap-1 px-2 px-sm-3 ${isExpanded ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setIsExpanded((prev) => !prev);
              }}
              title="More options"
              aria-label="Toggle task options"
              aria-expanded={isExpanded}
              style={{
                backgroundColor: '#c7f9cc',
                borderColor: '#57cc99',
                color: '#0b5d1e',
                borderWidth: '1.5px',
                borderStyle: 'solid'
              }}
            >
              <small className="d-none d-sm-inline">Options</small>
              <ChevronDown
                size={16}
                style={{
                  transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              />
            </button>

            <button
              type="submit"
              className="btn btn-primary task-add-btn d-flex align-items-center gap-1 fw-semibold px-3 rounded"
              aria-label="Add task"
            >
              <Plus size={18} />
              <span>Add</span>
            </button>
          </div>

          {/* Expandable Details Drawer with Ultra-Smooth Scroll / Slide Animation */}
          <div
            className={`task-options-drawer ${isExpanded ? 'open' : ''}`}
            style={{
              height: drawerHeight,
              opacity: isExpanded ? 1 : 0,
              visibility: isExpanded || drawerHeight !== '0px' ? 'visible' : 'hidden',
              overflow: isFullyOpen ? 'visible' : 'hidden',
              transition: isFullyOpen ? 'none' : 'height 0.44s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease, visibility 0.44s'
            }}
          >
            <div
              ref={contentRef}
              className="task-options-drawer-inner pt-3 mt-2 border-top pb-2"
            >
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary mb-1">
                    Description / Notes (Optional)
                  </label>
                  <textarea
                    className="form-control form-control-sm"
                    rows={2}
                    placeholder="Task ke baare me additional details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="row g-2 g-sm-3">
                  {/* Category select */}
                  <div className="col-12 col-sm-6 col-md-4">
                    <label className="form-label small fw-semibold text-secondary mb-1">Category</label>
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

                  {/* Priority select */}
                  <div className="col-12 col-sm-6 col-md-4">
                    <label className="form-label small fw-semibold text-secondary mb-1">Priority</label>
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

                  {/* Due Date & Presets */}
                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold text-secondary mb-1">Due Date</label>
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
              </div>
            </div>
        </form>
      </div>
    </div>
  );
}
