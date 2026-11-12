import React, { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import {
  Plus,
  ArrowRight,
  ArrowUp,
  Star,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Trash2,
  Sparkles,
  Download,
  X,
  CheckCircle2,
  ListTodo,
  Layers,
  Lightbulb,
  MoreHorizontal,
  Pencil,
  Palette,
  Printer,
  Share,
  Share2,
  Bell,
  Calendar,
  CalendarDays,
  Clock,
  Sunrise,
  FileText,
  RefreshCw,
  RotateCcw,
  Search,
  Users,
  User,
  Flag,
  Home,
  List,
  FolderPlus,
  MessageSquare,
  Mail,
  Copy
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSound, warmupAudio } from './utils/sound';
import './App.css';

// SVG Icon for WhatsApp
function WhatsAppIcon({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

// SVG Icon for Instagram
function InstagramIcon({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

// Manual System Options (Above Underline in Lists drawer)
const SYSTEM_LISTS = [
  { id: 'my-day', title: 'My Day', icon: 'sun', color: '#94a3b8' },
  { id: 'starred', title: 'Important', icon: 'star', color: '#fb7185' },
  { id: 'planned', title: 'Planned', icon: 'calendar', color: '#2dd4bf' },
  { id: 'assigned', title: 'Assigned to me', icon: 'user', color: '#34d399' },
  { id: 'flagged', title: 'Flagged email', icon: 'flag', color: '#fb923c' },
  { id: 'tasks', title: 'Tasks', icon: 'tasks', color: '#818cf8' }
];

// User-Created Custom Lists (Below Underline - exactly matching user screenshot)
const DEFAULT_CUSTOM_LISTS = [
  { id: 'cl-landlord', name: 'Tasks for landlord', shared: true, count: 5 },
  { id: 'cl-groceries', name: 'Groceries', emoji: '🍞', shared: true, count: 14 },
  { id: 'cl-factory', name: 'Factory Supplies', shared: true, count: 0 },
  { id: 'cl-home', name: 'Household Essentials', shared: true, count: 0 },
  { id: 'cl-untitled', name: 'Untitled list', shared: false, count: 0 },
  { id: 'cl-janmashtami', name: 'Janmashtami', shared: false, count: 3 },
  { id: 'cl-untitled-1', name: 'Untitled list 1', shared: false, count: 0 }
];

// 100% Bulletproof safe list string and emoji helpers to permanently prevent React object-as-child crashes
const getSafeListName = (item) => {
  if (!item) return '';
  if (typeof item === 'string') return item.trim();
  if (typeof item === 'object') {
    if (typeof item.name === 'string') return item.name.trim();
    if (item.name && typeof item.name === 'object') return getSafeListName(item.name);
    if (typeof item.title === 'string') return item.title.trim();
    if (item.title && typeof item.title === 'object') return getSafeListName(item.title);
  }
  return '';
};

const getSafeListEmoji = (item) => {
  if (!item || typeof item !== 'object') return null;
  if (typeof item.emoji === 'string' && item.emoji.trim()) return item.emoji.trim();
  return null;
};

// Initial pre-populated sample tasks
const INITIAL_TASKS = [
  {
    id: 'task-3',
    title: 'Morning meditation and hydration check',
    completed: true,
    starred: true,
    list: 'My Day',
    createdAt: Date.now() - 14400000
  },
  {
    id: 'task-4',
    title: 'Submit weekly design draft',
    completed: true,
    starred: false,
    list: 'My Day',
    createdAt: Date.now() - 28800000
  },
  // Tasks for landlord (5 tasks)
  { id: 'll-1', title: 'Pay monthly maintenance fee', completed: false, starred: false, list: 'Tasks for landlord', createdAt: Date.now() - 5000000 },
  { id: 'll-2', title: 'Submit water meter reading copy', completed: false, starred: false, list: 'Tasks for landlord', createdAt: Date.now() - 4000000 },
  { id: 'll-3', title: 'Fix kitchen sink pipe leakage', completed: false, starred: true, list: 'Tasks for landlord', createdAt: Date.now() - 3000000 },
  { id: 'll-4', title: 'Check electricity sub-meter bill', completed: false, starred: false, list: 'Tasks for landlord', createdAt: Date.now() - 2000000 },
  { id: 'll-5', title: 'Renew rental lease agreement', completed: false, starred: false, list: 'Tasks for landlord', createdAt: Date.now() - 1000000 },
  // Groceries (14 items)
  { id: 'gr-1', title: 'Milk (1L packet)', completed: false, starred: false, list: 'Groceries', createdAt: Date.now() - 1400000 },
  { id: 'gr-2', title: 'Fresh Whole Wheat Bread', completed: false, starred: false, list: 'Groceries', createdAt: Date.now() - 1300000 },
  { id: 'gr-3', title: 'Farm Fresh Eggs (1 Dozen)', completed: false, starred: false, list: 'Groceries', createdAt: Date.now() - 1200000 },
  { id: 'gr-4', title: 'Bananas & Seasonal Apples', completed: false, starred: false, list: 'Groceries', createdAt: Date.now() - 1100000 },
  { id: 'gr-5', title: 'Tomatoes & Potatoes (2kg)', completed: false, starred: false, list: 'Groceries', createdAt: Date.now() - 1000000 },
  { id: 'gr-6', title: 'Cooking Oil / Olive Oil', completed: false, starred: false, list: 'Groceries', createdAt: Date.now() - 900000 },
  { id: 'gr-7', title: 'Wheat Flour (Atta 5kg)', completed: false, starred: false, list: 'Groceries', createdAt: Date.now() - 800000 },
  { id: 'gr-8', title: 'Basmati Rice (Pouch)', completed: false, starred: false, list: 'Groceries', createdAt: Date.now() - 700000 },
  { id: 'gr-9', title: 'Butter & Cheese Slices', completed: false, starred: false, list: 'Groceries', createdAt: Date.now() - 600000 },
  { id: 'gr-10', title: 'Tea bags & Coffee beans', completed: false, starred: false, list: 'Groceries', createdAt: Date.now() - 500000 },
  { id: 'gr-11', title: 'Dish soap & Scrub sponge', completed: false, starred: false, list: 'Groceries', createdAt: Date.now() - 400000 },
  { id: 'gr-12', title: 'Green Chillies & Fresh Coriander', completed: false, starred: false, list: 'Groceries', createdAt: Date.now() - 300000 },
  { id: 'gr-13', title: 'Salt & Turmeric powder', completed: false, starred: false, list: 'Groceries', createdAt: Date.now() - 200000 },
  { id: 'gr-14', title: 'Rolled Oats & Muesli', completed: false, starred: false, list: 'Groceries', createdAt: Date.now() - 100000 },
  // Festival preparations (3 tasks)
  { id: 'jm-1', title: 'Prayer essentials, incense & flowers', completed: false, starred: false, list: 'Janmashtami', createdAt: Date.now() - 300000 },
  { id: 'jm-2', title: 'Dry fruits & sweets offering', completed: false, starred: false, list: 'Janmashtami', createdAt: Date.now() - 200000 },
  { id: 'jm-3', title: 'Temple fairy lights & decoration', completed: false, starred: false, list: 'Janmashtami', createdAt: Date.now() - 100000 }
];

// Regularly purchased grocery & daily household essentials
const REGULAR_PURCHASES = [
  { id: 'rp-1', title: 'Milk (1L / Packet)', category: 'Dairy', emoji: '🥛' },
  { id: 'rp-2', title: 'Fresh Whole Wheat Bread', category: 'Bakery', emoji: '🍞' },
  { id: 'rp-3', title: 'Farm Fresh Eggs (Dozen)', category: 'Dairy', emoji: '🥚' },
  { id: 'rp-4', title: 'Coffee Beans / Tea Bags', category: 'Beverages', emoji: '☕' },
  { id: 'rp-5', title: 'Bananas & Seasonal Fruits', category: 'Fruits', emoji: '🍌' },
  { id: 'rp-6', title: 'Tomatoes, Onions & Potatoes', category: 'Vegetables', emoji: '🥔' },
  { id: 'rp-7', title: 'Cooking Oil / Olive Oil', category: 'Pantry', emoji: '🧴' },
  { id: 'rp-8', title: 'Wheat Flour (Atta) & Rice', category: 'Grains', emoji: '🌾' },
  { id: 'rp-9', title: 'Dish Soap & Scrub Sponge', category: 'Cleaning', emoji: '🧼' },
  { id: 'rp-10', title: 'Paper Towels & Napkins', category: 'Household', emoji: '🧻' },
  { id: 'rp-11', title: 'Butter & Cheese Slices', category: 'Dairy', emoji: '🧀' },
  { id: 'rp-12', title: 'Biscuits & Evening Snacks', category: 'Snacks', emoji: '🍪' }
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Custom Hut with check inside icon (Microsoft To Do style Tasks icon)
const HutCheckIcon = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M3 10L12 3l9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10z" />
    <polyline points="9 13 11 15 15 11" strokeWidth="2.2" />
  </svg>
);

// Interactive Calendar Component
const InteractiveCalendar = ({ selectedDate, onSelectDate }) => {
  const [viewDate, setViewDate] = useState(() => selectedDate || new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const prevMonth = (e) => {
    e.stopPropagation();
    setViewDate(new Date(year, month - 1, 1));
  };

  const nextMonth = (e) => {
    e.stopPropagation();
    setViewDate(new Date(year, month + 1, 1));
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const days = [];
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(new Date(year, month, d));
  }

  const today = new Date();
  const isSameDay = (d1, d2) =>
    d1 &&
    d2 &&
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  return (
    <div className="interactive-calendar">
      <div className="calendar-header-bar">
        <span className="calendar-month-title">
          {MONTHS[month]} {year}
        </span>
        <div className="calendar-nav-buttons">
          <button type="button" className="cal-nav-btn" onClick={prevMonth} aria-label="Previous month">
            <ChevronLeft size={18} />
          </button>
          <button type="button" className="cal-nav-btn" onClick={nextMonth} aria-label="Next month">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="calendar-weekdays-row">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((w, idx) => (
          <span key={idx} className="cal-weekday-label">
            {w}
          </span>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((d, idx) => {
          if (!d) return <div key={'empty-' + idx} className="cal-day-cell empty" />;
          const isToday = isSameDay(d, today);
          const isSelected = selectedDate && isSameDay(d, selectedDate);
          return (
            <button
              key={d.getTime()}
              type="button"
              className={`cal-day-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectDate(d)}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Interactive Time Picker Component
const InteractiveTimePicker = ({ selectedTime = '09:00 AM', onSelectTime }) => {
  const [hour, setHour] = useState('09');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState('AM');

  useEffect(() => {
    if (selectedTime) {
      const match = selectedTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (match) {
        setHour(match[1].padStart(2, '0'));
        setMinute(match[2]);
        setPeriod(match[3].toUpperCase());
      }
    }
  }, [selectedTime]);

  const updateTime = (h, m, p) => {
    setHour(h);
    setMinute(m);
    setPeriod(p);
    onSelectTime(`${h}:${m} ${p}`);
  };

  const presets = [
    { label: 'Morning', time: '09:00 AM' },
    { label: 'Afternoon', time: '01:00 PM' },
    { label: 'Evening', time: '06:00 PM' },
    { label: 'Night', time: '09:00 PM' }
  ];

  return (
    <div className="interactive-time-picker">
      <div className="time-presets-grid">
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            className={`time-preset-chip ${selectedTime === p.time ? 'active' : ''}`}
            onClick={() => {
              const match = p.time.match(/(\d{2}):(\d{2})\s*(AM|PM)/);
              if (match) updateTime(match[1], match[2], match[3]);
            }}
          >
            <span className="preset-label">{p.label}</span>
            <span className="preset-time">{p.time}</span>
          </button>
        ))}
      </div>

      <div className="time-wheels-container">
        <div className="time-wheel-col">
          <label>Hour</label>
          <select
            value={hour}
            onChange={(e) => updateTime(e.target.value, minute, period)}
            className="time-select-wheel"
          >
            {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>

        <span className="time-colon-separator">:</span>

        <div className="time-wheel-col">
          <label>Minute</label>
          <select
            value={minute}
            onChange={(e) => updateTime(hour, e.target.value, period)}
            className="time-select-wheel"
          >
            {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="time-period-toggle">
          <button
            type="button"
            className={`period-btn ${period === 'AM' ? 'active' : ''}`}
            onClick={() => updateTime(hour, minute, 'AM')}
          >
            AM
          </button>
          <button
            type="button"
            className={`period-btn ${period === 'PM' ? 'active' : ''}`}
            onClick={() => updateTime(hour, minute, 'PM')}
          >
            PM
          </button>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// Swipeable Task Item: Right-swipe to Add/Remove from My Day
// ----------------------------------------------------
function SwipeableTaskItem({
  task,
  activeList,
  toggleTaskComplete,
  toggleTaskStar,
  deleteTask,
  toggleTaskMyDay,
  isCompleting,
  isExiting
}) {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartPos = useRef({ x: 0, y: 0, startOffset: 0 });
  const isHorizontalSwipe = useRef(null);
  const isMouseDown = useRef(false);
  const hasMovedRef = useRef(false);

  const onTouchStart = (e) => {
    if (e.target.closest('button')) return;
    if (e.touches && e.touches.length === 1) {
      touchStartPos.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        startOffset: swipeOffset
      };
      isHorizontalSwipe.current = null;
      hasMovedRef.current = false;
    }
  };

  const onTouchMove = (e) => {
    if (!e.touches || e.touches.length !== 1) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartPos.current.x;
    const diffY = currentY - touchStartPos.current.y;

    if (isHorizontalSwipe.current === null) {
      const absX = Math.abs(diffX);
      const absY = Math.abs(diffY);
      if (absX > 7 || absY > 7) {
        if (absX > absY * 1.15) {
          isHorizontalSwipe.current = true;
          setIsSwiping(true);
        } else {
          isHorizontalSwipe.current = false;
        }
      }
    }

    if (isHorizontalSwipe.current === true) {
      if (e.cancelable) {
        e.preventDefault();
      }
      hasMovedRef.current = true;

      // Silky smooth natural rubber-band physics
      const absDiff = Math.abs(diffX);
      const threshold = 75;
      let offset = 0;
      if (absDiff <= threshold) {
        offset = absDiff;
      } else {
        offset = threshold + (absDiff - threshold) * 0.32;
      }
      const clamped = Math.min(offset, 125);
      setSwipeOffset(diffX > 0 ? clamped : -clamped);
    }
  };

  const onTouchEnd = () => {
    setIsSwiping(false);
    if (isHorizontalSwipe.current === true && hasMovedRef.current) {
      if (swipeOffset >= 60) {
        toggleTaskMyDay(task.id);
        setSwipeOffset(0);
      } else if (swipeOffset <= -35) {
        // Snap open revealing delete button (modal only opens when delete button is clicked)
        setSwipeOffset(-68);
      } else {
        setSwipeOffset(0);
      }
    } else if (swipeOffset < 0 && !hasMovedRef.current) {
      setSwipeOffset(0);
    }
    setTimeout(() => {
      isHorizontalSwipe.current = null;
      hasMovedRef.current = false;
    }, 120);
  };

  const onMouseDown = (e) => {
    if (e.button !== 0 || e.target.closest('button')) return;
    isMouseDown.current = true;
    touchStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      startOffset: swipeOffset
    };
    isHorizontalSwipe.current = null;
    hasMovedRef.current = false;
  };

  const onMouseMove = (e) => {
    if (!isMouseDown.current) return;
    const diffX = e.clientX - touchStartPos.current.x;
    const diffY = e.clientY - touchStartPos.current.y;

    if (isHorizontalSwipe.current === null) {
      const absX = Math.abs(diffX);
      const absY = Math.abs(diffY);
      if (absX > 7 || absY > 7) {
        if (absX > absY * 1.15) {
          isHorizontalSwipe.current = true;
          setIsSwiping(true);
        } else {
          isHorizontalSwipe.current = false;
        }
      }
    }

    if (isHorizontalSwipe.current === true) {
      hasMovedRef.current = true;
      const absDiff = Math.abs(diffX);
      const threshold = 75;
      let offset = 0;
      if (absDiff <= threshold) {
        offset = absDiff;
      } else {
        offset = threshold + (absDiff - threshold) * 0.32;
      }
      const clamped = Math.min(offset, 125);
      setSwipeOffset(diffX > 0 ? clamped : -clamped);
    }
  };

  const onMouseUp = () => {
    if (isMouseDown.current) {
      isMouseDown.current = false;
      setIsSwiping(false);
      if (isHorizontalSwipe.current === true && hasMovedRef.current) {
        if (swipeOffset >= 60) {
          toggleTaskMyDay(task.id);
          setSwipeOffset(0);
        } else if (swipeOffset <= -35) {
          setSwipeOffset(-68);
        } else {
          setSwipeOffset(0);
        }
      } else if (swipeOffset < 0 && !hasMovedRef.current) {
        setSwipeOffset(0);
      }
      setTimeout(() => {
        isHorizontalSwipe.current = null;
        hasMovedRef.current = false;
      }, 120);
    }
  };

  const isInMyDay = Boolean(task.addedToMyDay || task.list === 'My Day');

  return (
    <div
      className="task-swipe-wrapper"
      onMouseLeave={onMouseUp}
    >
      {/* Background action revealed on swipe right (Add to My Day) */}
      <div
        className={`task-swipe-action-bg swipe-right ${isInMyDay ? 'in-myday' : ''}`}
        style={{
          opacity: swipeOffset > 5 ? Math.min(1, swipeOffset / 40) : 0,
          pointerEvents: 'none'
        }}
      >
        <div
          className="task-swipe-action-content"
          style={{
            transform: `scale(${Math.min(1.08, 0.78 + (Math.max(0, swipeOffset) / 80) * 0.28)})`
          }}
        >
          <Sun size={19} color="#ffffff" strokeWidth={2.4} />
          <span>{isInMyDay ? 'Remove from My Day' : 'Add to My Day'}</span>
        </div>
      </div>

      {/* Front Task Card (The task div) */}
      <div
        className={`task-item-card ${task.completed ? 'completed-item' : ''} ${isCompleting ? 'is-completing' : ''} ${isExiting ? 'is-exiting' : ''}`}
        style={{
          transform: `translate3d(${Math.max(0, swipeOffset)}px, 0, 0)`,
          transition: isSwiping ? 'none' : 'transform 0.32s cubic-bezier(0.2, 0.95, 0.3, 1)'
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        {/* Inner Content Row (slides left inside the card div on swipe left) */}
        <div
          className="task-card-inner-row"
          style={{
            transform: `translate3d(${Math.min(0, swipeOffset)}px, 0, 0)`,
            transition: isSwiping ? 'none' : 'transform 0.32s cubic-bezier(0.2, 0.95, 0.3, 1)'
          }}
        >
          {/* Circle Checkbox: 1-click tick & untick */}
          <button
            type="button"
            className={`task-tick-btn ${(task.completed || isCompleting) ? 'checked' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleTaskComplete(task.id);
            }}
            title={(task.completed || isCompleting) ? 'Mark as uncompleted' : 'Mark as completed'}
            aria-label={(task.completed || isCompleting) ? 'Uncomplete task' : 'Mark task completed'}
          >
            {(task.completed || isCompleting) && (
              <Check size={13} strokeWidth={3.5} className="tick-check-icon animate-pop" />
            )}
          </button>

          {/* Task Content */}
          <div
            className="task-content"
            onClick={() => {
              if (swipeOffset < 0) {
                setSwipeOffset(0);
              }
            }}
          >
            <span className={`task-name ${(task.completed || isCompleting) ? 'cut' : ''}`}>
              {task.title}
            </span>
            <div className="task-meta-badges">
              {/* Show parent list name (e.g. "Tasks" in the screenshot) */}
              {(task.list || 'Tasks') && activeList !== 'tasks' && activeList !== task.list && (
                <span className="task-meta-tag list-name-badge">
                  {task.list || 'Tasks'}
                </span>
              )}

              {/* If task was added to My Day and we are viewing another category: show "☀️ My Day" */}
              {isInMyDay && activeList !== 'my-day' && (
                <span className="task-meta-tag myday-badge">
                  <Sun size={11} color="#38bdf8" strokeWidth={2.4} />
                  <span>My Day</span>
                </span>
              )}

              {task.dueDate && (
                <span className="task-meta-tag due">
                  <Calendar size={11} /> {task.dueDate.text || task.dueDate}
                </span>
              )}
              {task.reminder && (
                <span className="task-meta-tag reminder">
                  <Bell size={11} /> {task.reminder.text || task.reminder}
                </span>
              )}
              {task.note && (
                <span className="task-meta-tag note">
                  <FileText size={11} /> Note
                </span>
              )}
            </div>
          </div>

          {/* Star on the Right */}
          <button
            type="button"
            className={`task-star-btn ${task.starred ? 'starred' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleTaskStar(task.id, e);
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
            }}
            title={task.starred ? 'Unstar task' : 'Star task'}
            aria-label="Toggle star"
          >
            <Star
              size={19}
              fill={task.starred ? 'var(--accent-star)' : 'none'}
              stroke={task.starred ? 'var(--accent-star)' : 'currentColor'}
              strokeWidth={2}
            />
          </button>
        </div>

        {/* Delete Icon INSIDE the task div! Revealed when swiped left */}
        <div
          className="task-div-delete-slot"
          style={{
            opacity: swipeOffset < -6 ? 1 : 0,
            transform: `scale(${Math.min(1, 0.5 + (Math.abs(Math.min(0, swipeOffset)) / 50) * 0.5)})`,
            pointerEvents: swipeOffset <= -25 ? 'auto' : 'none'
          }}
        >
          <button
            type="button"
            className="swipe-delete-reveal-btn"
            onClick={(e) => {
              e.stopPropagation();
              deleteTask(task.id, e);
              setSwipeOffset(0);
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
            }}
            title="Delete task"
            aria-label="Delete task"
          >
            <Trash2 size={18} color="#ffffff" strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Direct URL-based List Initializer
// Enables WhatsApp links to directly open the intended list on initial paint!
// ----------------------------------------------------
const getInitialActiveListInfo = () => {
  if (typeof window === 'undefined') return { id: 'my-day', title: 'My Day' };
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const listParam = urlParams.get('list');
    const titleParam = urlParams.get('title') || urlParams.get('shareList');
    if (listParam || titleParam) {
      const rawTitle = decodeURIComponent(titleParam || listParam).trim();
      const lower = rawTitle.toLowerCase();
      if (lower === 'my day' || lower === 'my-day') return { id: 'my-day', title: 'My Day' };
      if (lower === 'important' || lower === 'starred') return { id: 'starred', title: 'Important' };
      if (lower === 'planned') return { id: 'planned', title: 'Planned' };
      if (lower === 'assigned to me' || lower === 'assigned') return { id: 'assigned', title: 'Assigned to me' };
      if (lower === 'flagged email' || lower === 'flagged') return { id: 'flagged', title: 'Flagged email' };
      if (lower === 'tasks') return { id: 'tasks', title: 'Tasks' };

      const match = DEFAULT_CUSTOM_LISTS.find(
        (c) => c.id === listParam || c.name.toLowerCase() === lower
      );
      if (match) {
        return { id: match.id, title: match.name };
      }
      return {
        id: listParam || 'cl-custom-' + lower.replace(/[^a-z0-9]/g, '-'),
        title: rawTitle
      };
    }
  } catch { }
  return { id: 'my-day', title: 'My Day' };
};

export default function App() {
  const initialListInfo = useRef(getInitialActiveListInfo()).current;

  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('myday_theme') || 'light';
  });

  // Tasks state
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('myday_tasks_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  // UI States
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isTaskInputActive, setIsTaskInputActive] = useState(false);
  const [taskDraftList, setTaskDraftList] = useState(null);
  const [taskDraftReminder, setTaskDraftReminder] = useState(null);
  const [taskDraftDue, setTaskDraftDue] = useState(null);
  const [taskDraftNote, setTaskDraftNote] = useState('');
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Task completion animation states (1s delay, tick sign, sound & confetti)
  const [completingTaskIds, setCompletingTaskIds] = useState(new Set());
  const [exitingTaskIds, setExitingTaskIds] = useState(new Set());
  const completionTimersRef = useRef({});

  // Cleanup pending completion timers on unmount
  useEffect(() => {
    return () => {
      Object.values(completionTimersRef.current).forEach((timers) => {
        if (timers?.exitTimer) clearTimeout(timers.exitTimer);
        if (timers?.finishTimer) clearTimeout(timers.finishTimer);
      });
    };
  }, []);

  // Active Bottom Sheet ('selectList' | 'reminder' | 'due' | 'note' | null)
  const [taskSheet, setTaskSheet] = useState(null);
  const [isTaskSheetClosing, setIsTaskSheetClosing] = useState(false);

  // Subviews for Reminder & Due
  const [reminderSubView, setReminderSubView] = useState('main'); // 'main' | 'calendar' | 'time'
  const [dueSubView, setDueSubView] = useState('main'); // 'main' | 'calendar'

  // Pickers state
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(() => new Date());
  const [selectedReminderTime, setSelectedReminderTime] = useState('09:00 AM');

  // Custom User Lists (Below Underline - defaults match screenshot)
  const [customLists, setCustomLists] = useState(() => {
    let lists = DEFAULT_CUSTOM_LISTS;
    try {
      const saved = localStorage.getItem('myday_custom_lists_v4') || localStorage.getItem('myday_custom_lists');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized = parsed.map((item, idx) => {
            const name = getSafeListName(item);
            if (!name) return null;
            const emoji = getSafeListEmoji(item);
            const id = (item && typeof item === 'object' && typeof item.id === 'string')
              ? item.id
              : 'cl-' + idx + '-' + Date.now();
            return {
              id,
              name,
              emoji,
              shared: item && typeof item === 'object' ? Boolean(item.shared) : false,
              count: item && typeof item === 'object' && typeof item.count === 'number' ? item.count : 0
            };
          }).filter(Boolean);

          if (sanitized.length > 0) {
            lists = sanitized;
          }
        }
      }
    } catch { }

    // If opening via shared URL, make sure the shared list exists in customLists so it displays in Drawer
    const isSystem =
      initialListInfo.title === 'My Day' ||
      initialListInfo.title === 'Tasks' ||
      initialListInfo.title === 'Important' ||
      initialListInfo.title === 'Planned' ||
      initialListInfo.title === 'Assigned to me' ||
      initialListInfo.title === 'Flagged email';

    if (!isSystem && !lists.some((item) => getSafeListName(item).toLowerCase() === initialListInfo.title.toLowerCase())) {
      lists = [
        ...lists,
        {
          id: initialListInfo.id,
          name: initialListInfo.title,
          emoji: '📋',
          shared: true,
          count: 0
        }
      ];
    }

    return lists;
  });
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [newListNameInput, setNewListNameInput] = useState('');
  const [drawerSearchQuery, setDrawerSearchQuery] = useState('');
  const [isDrawerSearchOpen, setIsDrawerSearchOpen] = useState(false);
  const [taskSearchQuery, setTaskSearchQuery] = useState('');
  const [isTaskSearchOpen, setIsTaskSearchOpen] = useState(false);
  const taskSearchInputRef = useRef(null);
  const drawerSearchInputRef = useRef(null);
  const lastInputFocusTimeRef = useRef(0);


  const [showCompleted, setShowCompleted] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDrawerClosing, setIsDrawerClosing] = useState(false);
  const [isListOptionsOpen, setIsListOptionsOpen] = useState(false);
  const [isListOptionsClosing, setIsListOptionsClosing] = useState(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [isSuggestionsClosing, setIsSuggestionsClosing] = useState(false);
  const suggestionSheetRef = useRef(null);
  const suggestionsListRef = useRef(null);
  const suggestionDragStartY = useRef(0);
  const suggestionDragCurrentY = useRef(0);
  const suggestionDragStartTime = useRef(0);
  const isSuggestionDragging = useRef(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [listTitle, setListTitle] = useState(() => initialListInfo.title);
  const [sortOrder, setSortOrder] = useState(null); // 'A-Z', 'Starred', 'Date'
  const [toastMessage, setToastMessage] = useState(null);
  const [activeList, setActiveList] = useState(() => initialListInfo.id); // 'my-day', 'starred', 'all', or custom list id
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isStandalone, setIsStandalone] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    }
    return false;
  });

  // Pre-warm and unlock audio hardware on very first user touch/click for instantaneous tick sound
  useEffect(() => {
    const handleInitialUnlock = () => {
      warmupAudio();
    };
    window.addEventListener('pointerdown', handleInitialUnlock, { once: true, passive: true });
    window.addEventListener('touchstart', handleInitialUnlock, { once: true, passive: true });
    window.addEventListener('click', handleInitialUnlock, { once: true, passive: true });
    return () => {
      window.removeEventListener('pointerdown', handleInitialUnlock);
      window.removeEventListener('touchstart', handleInitialUnlock);
      window.removeEventListener('click', handleInitialUnlock);
    };
  }, []);

  // ----------------------------------------------------
  // Share List Modal & Collaboration (Matching User Screenshot)
  // ----------------------------------------------------
  const [isShareListOpen, setIsShareListOpen] = useState(false);
  const [isShareListClosing, setIsShareListClosing] = useState(false);
  const [listMembers, setListMembers] = useState(() => {
    try {
      const saved = localStorage.getItem('todo_list_members_v2');
      if (saved) return JSON.parse(saved);
    } catch { }
    return [
      {
        id: 'member-1',
        name: 'ASHISH JAJORIA',
        email: 'ashish.jajoria@gmail.com',
        initials: 'AJ',
        color: '#8b1d24', // Red avatar matching screenshot
        role: 'Owner'
      },
      {
        id: 'member-2',
        name: 'pinkisummarwal@gmail.com',
        email: 'pinkisummarwal@gmail.com',
        initials: 'P',
        color: '#0d7a71', // Teal avatar matching screenshot
        role: 'Member'
      }
    ];
  });
  const [isInvitingEmail, setIsInvitingEmail] = useState(false);
  const [inviteEmailInput, setInviteEmailInput] = useState('');

  // Persist list members
  useEffect(() => {
    try {
      localStorage.setItem('todo_list_members_v2', JSON.stringify(listMembers));
    } catch { }
  }, [listMembers]);

  const closeShareList = () => {
    setIsShareListClosing(true);
    setTimeout(() => {
      setIsShareListOpen(false);
      setIsShareListClosing(false);
      setIsInvitingEmail(false);
      setInviteEmailInput('');
    }, 240);
  };

  const [isShareAppsOpen, setIsShareAppsOpen] = useState(false);
  const [isShareAppsClosing, setIsShareAppsClosing] = useState(false);

  const openShareAppsSheet = () => {
    setIsShareAppsClosing(false);
    setIsShareAppsOpen(true);
  };

  const closeShareAppsSheet = () => {
    setIsShareAppsClosing(true);
    setTimeout(() => {
      setIsShareAppsOpen(false);
      setIsShareAppsClosing(false);
    }, 240);
  };

  const getShareListUrl = () => {
    // Live GitHub Pages production URL - Accessible anywhere in the world!
    const GITHUB_PAGES_BASE = 'https://pinkijajoria.github.io/todo-app/';
    return `${GITHUB_PAGES_BASE}?list=${encodeURIComponent(listTitle)}`;
  };

  const getListSharePayload = () => {
    const shareUrl = getShareListUrl();
    const listObj = customLists.find(
      (c) =>
        (typeof c === 'object' ? c.id : c) === activeList ||
        getSafeListName(c) === listTitle
    );
    const emoji = listObj ? getSafeListEmoji(listObj) : '';
    const formattedTitle = emoji ? `${emoji} ${listTitle}` : listTitle;

    // Direct clickable link on its own line: Ensures WhatsApp parses it as clickable hyperlink
    const shareText = `Please join "${formattedTitle}", my shared list in My Day.\n\n${shareUrl}`;

    return {
      title: `${formattedTitle} - My Day`,
      text: shareText,
      url: shareUrl,
      formattedTitle
    };
  };

  const getShareListText = () => {
    return getListSharePayload().text;
  };

  // Specific User Request: Native iOS Share Sheet from video + options fallback
  const handleShareListLink = async () => {
    const payload = getListSharePayload();
    if (navigator.share) {
      try {
        // Critical iOS/WhatsApp fix: Pass only text containing the URL,
        // because iOS WhatsApp extension drops the separate url parameter if text is present!
        await navigator.share({
          title: payload.title,
          text: payload.text
        });
        return;
      } catch (err) {
        if (err && err.name === 'AbortError') {
          return; // User cancelled native share sheet
        }
      }
    }
    // Fallback if navigator.share not supported
    openShareAppsSheet();
  };

  const handleShareWhatsApp = () => {
    closeShareAppsSheet();
    const payload = getListSharePayload();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(payload.text)}`;
    window.location.href = url;
  };

  const handleShareSMS = () => {
    closeShareAppsSheet();
    const payload = getListSharePayload();
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const smsUrl = isIOS
      ? `sms:&body=${encodeURIComponent(payload.text)}`
      : `sms:?body=${encodeURIComponent(payload.text)}`;
    window.location.href = smsUrl;
  };

  const handleShareInstagram = async () => {
    closeShareAppsSheet();
    const shareUrl = getShareListUrl();
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('📋 Link copied! Opening Instagram to share...');
    } catch {
      showToast('Opening Instagram...');
    }
    setTimeout(() => {
      window.location.href = 'instagram://';
      setTimeout(() => {
        window.open('https://instagram.com/', '_blank');
      }, 1200);
    }, 350);
  };

  const handleShareEmailApp = () => {
    closeShareAppsSheet();
    const payload = getListSharePayload();
    const subject = `Join "${payload.formattedTitle}" in My Day`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(payload.text)}`;
  };

  const handleCopyLinkOnly = async () => {
    closeShareAppsSheet();
    const shareUrl = getShareListUrl();
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('📋 Invite link copied to clipboard!');
    } catch {
      showToast('Invite link: ' + shareUrl);
    }
  };

  const handleNativeSystemShare = async () => {
    closeShareAppsSheet();
    const payload = getListSharePayload();
    if (navigator.share) {
      try {
        await navigator.share({
          title: payload.title,
          text: payload.text
        });
      } catch (err) {
        if (err && err.name !== 'AbortError') {
          handleCopyLinkOnly();
        }
      }
    } else {
      handleCopyLinkOnly();
    }
  };

  const handleSendEmailInvite = (e) => {
    e.preventDefault();
    const email = inviteEmailInput.trim();
    if (!email) return;

    if (listMembers.some((m) => m.email.toLowerCase() === email.toLowerCase() || m.name.toLowerCase() === email.toLowerCase())) {
      showToast('This member is already in the list');
      return;
    }

    const initials = email.slice(0, 2).toUpperCase();
    const colors = ['#2563eb', '#7c3aed', '#d97706', '#059669', '#dc2626'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newMember = {
      id: `member-${Date.now()}`,
      name: email,
      email: email,
      initials: initials,
      color: randomColor,
      role: 'Member'
    };

    setListMembers((prev) => [...prev, newMember]);
    setInviteEmailInput('');
    setIsInvitingEmail(false);
    showToast(`Invite sent to ${email}`);
  };

  const handleLeaveList = () => {
    if (window.confirm(`Are you sure you want to leave "${listTitle}"?`)) {
      setListMembers((prev) =>
        prev.filter((m) => m.email !== userEmail && m.name !== userEmail)
      );
      closeShareList();
      showToast(`Left "${listTitle}"`);
    }
  };

  // User Account & Email (shown at top of Lists screen, defaults to pinkisummarwal@gmail.com from screenshot)
  const [userEmail, setUserEmail] = useState(() => {
    const saved = localStorage.getItem('myday_user_email');
    if (!saved || saved === 'pink1@gmail.com') {
      return 'pinkisummarwal@gmail.com';
    }
    return saved;
  });
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [tempEmail, setTempEmail] = useState('');

  // Persist tasks and customLists
  useEffect(() => {
    try {
      localStorage.setItem('myday_tasks_v4', JSON.stringify(tasks));
      localStorage.setItem('myday_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks', e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem('myday_custom_lists_v4', JSON.stringify(customLists));
    } catch (e) {
      console.error('Failed to save custom lists', e);
    }
  }, [customLists]);

  const inputRef = useRef(null);

  const handleToggleTaskSearch = () => {
    if (isTaskSearchOpen) {
      setIsTaskSearchOpen(false);
      setTaskSearchQuery('');
      taskSearchInputRef.current?.blur();
    } else {
      flushSync(() => {
        setIsTaskSearchOpen(true);
      });
      lastInputFocusTimeRef.current = Date.now();
      taskSearchInputRef.current?.focus();
    }
  };

  const handleToggleDrawerSearch = () => {
    if (isDrawerSearchOpen) {
      setIsDrawerSearchOpen(false);
      setDrawerSearchQuery('');
      drawerSearchInputRef.current?.blur();
    } else {
      flushSync(() => {
        setIsDrawerSearchOpen(true);
      });
      lastInputFocusTimeRef.current = Date.now();
      drawerSearchInputRef.current?.focus();
    }
  };
  const scrollAreaRef = useRef(null);
  const isUserScrollingRef = useRef(false);
  const scrollTimerRef = useRef(null);
  const doneBtnPointerStart = useRef({ x: 0, y: 0 });
  const isSelectingListForDraftRef = useRef(false);

  // Pull-to-refresh state (Native Mobile standard implementation)
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const pullDistanceRef = useRef(0);
  const isPullingRef = useRef(false);
  const isRefreshingRef = useRef(false);
  const touchStartYRef = useRef(0);
  const touchStartXRef = useRef(0);
  const isDraggingPullRef = useRef(false);
  const appContainerRef = useRef(null);
  const drawerTouchStartX = useRef(0);
  const drawerTouchStartY = useRef(0);

  useEffect(() => {
    isRefreshingRef.current = isRefreshing;
  }, [isRefreshing]);

  const isOverlayOpenRef = useRef(false);
  useEffect(() => {
    isOverlayOpenRef.current = !!(
      isSuggestionsOpen ||
      isDrawerOpen ||
      isListOptionsOpen ||
      isInstallModalOpen ||
      isShareListOpen ||
      isShareAppsOpen ||
      taskSheet ||
      isTaskInputActive
    );
  }, [isSuggestionsOpen, isDrawerOpen, isListOptionsOpen, isInstallModalOpen, isShareListOpen, isShareAppsOpen, taskSheet, isTaskInputActive]);

  useEffect(() => {
    const container = appContainerRef.current;
    if (!container) return;

    // Helper: find the nearest scrollable ancestor (or self) of a touch target
    const getNearestScrollEl = (el) => {
      let cur = el;
      while (cur && cur !== document.body) {
        const style = window.getComputedStyle(cur);
        const overflowY = style.overflowY;
        const isScrollable = (overflowY === 'auto' || overflowY === 'scroll') && cur.scrollHeight > cur.clientHeight;
        if (isScrollable) return cur;
        cur = cur.parentElement;
      }
      return scrollAreaRef.current;
    };

    const handleTouchStart = (e) => {
      if (isRefreshingRef.current || isTaskInputActive || isOverlayOpenRef.current) return;
      if (
        e.target.closest('.suggestions-sheet') ||
        e.target.closest('.suggestions-notch-zone') ||
        e.target.closest('.bottom-sheet-backdrop') ||
        e.target.closest('.list-options-sheet') ||
        e.target.closest('.install-app-sheet') ||
        e.target.closest('.share-list-sheet') ||
        e.target.closest('.task-bottom-sheet') ||
        e.target.closest('.lists-drawer') ||
        e.target.closest('.drawer-backdrop') ||
        e.target.closest('.delete-confirm-overlay') ||
        e.target.closest('.add-task-docked-container') ||
        e.target.closest('.bottom-sheet') ||
        e.target.closest('.subtask-modal') ||
        e.target.closest('.myday-search-bar-wrap') ||
        e.target.closest('.drawer-search-bar-wrap') ||
        e.target.closest('input') ||
        e.target.closest('button')
      ) return;

      const scrollEl = getNearestScrollEl(e.target);
      const atTop = !scrollEl || scrollEl.scrollTop <= 0;
      if (atTop) {
        touchStartYRef.current = e.touches[0].clientY;
        touchStartXRef.current = e.touches[0].clientX;
        isDraggingPullRef.current = false;
        touchStartYRef._scrollEl = scrollEl;
      } else {
        touchStartYRef.current = 0;
        touchStartYRef._scrollEl = null;
      }
    };

    const handleTouchMove = (e) => {
      if (touchStartYRef.current === 0 || isRefreshingRef.current || isTaskInputActive || isOverlayOpenRef.current) return;

      const scrollEl = touchStartYRef._scrollEl || scrollAreaRef.current;
      if (scrollEl && scrollEl.scrollTop > 0) {
        if (pullDistanceRef.current > 0) {
          pullDistanceRef.current = 0;
          setPullDistance(0);
          setIsPulling(false);
          isPullingRef.current = false;
        }
        return;
      }

      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const diffY = currentY - touchStartYRef.current;
      const diffX = Math.abs(currentX - touchStartXRef.current);

      // Cancel if user is swiping horizontally
      if (!isDraggingPullRef.current && diffX > Math.abs(diffY)) {
        touchStartYRef.current = 0;
        return;
      }

      if (diffY > 0) {
        isDraggingPullRef.current = true;
        isPullingRef.current = true;
        setIsPulling(true);

        // Native rubber-band resistance curve
        const damped = Math.min(80, Math.pow(diffY, 0.82) * 1.8);
        pullDistanceRef.current = damped;
        setPullDistance(damped);

        if (e.cancelable) {
          e.preventDefault();
        }
      } else {
        if (isDraggingPullRef.current) {
          isDraggingPullRef.current = false;
          isPullingRef.current = false;
          setIsPulling(false);
          pullDistanceRef.current = 0;
          setPullDistance(0);
        }
      }
    };

    const handleTouchEnd = () => {
      if (!isDraggingPullRef.current || isRefreshingRef.current) {
        touchStartYRef.current = 0;
        isDraggingPullRef.current = false;
        isPullingRef.current = false;
        setIsPulling(false);
        return;
      }

      isDraggingPullRef.current = false;
      isPullingRef.current = false;
      setIsPulling(false);
      touchStartYRef.current = 0;

      const dist = pullDistanceRef.current;
      if (dist >= 48) {
        isRefreshingRef.current = true;
        setIsRefreshing(true);
        pullDistanceRef.current = 54;
        setPullDistance(54);

        try {
          if (navigator.vibrate) navigator.vibrate(18);
        } catch (err) { }

        setTimeout(() => {
          // 1. Reload tasks from storage
          const savedTasks = localStorage.getItem('myday_tasks_v4') || localStorage.getItem('myday_tasks');
          if (savedTasks) {
            try {
              const parsedTasks = JSON.parse(savedTasks);
              if (Array.isArray(parsedTasks)) setTasks(parsedTasks);
            } catch (err) { }
          }
          // 2. Reload custom lists from storage
          const savedLists = localStorage.getItem('myday_custom_lists_v4');
          if (savedLists) {
            try {
              const parsedLists = JSON.parse(savedLists);
              if (Array.isArray(parsedLists)) {
                setCustomLists(
                  parsedLists.map((item, idx) => {
                    if (typeof item === 'string') {
                      return { id: 'cl-' + idx + '-' + Date.now(), name: item, shared: false, count: 0 };
                    }
                    return item;
                  })
                );
              }
            } catch (err) { }
          }
          // 3. Clear any stuck sheet state
          setTaskSheet(null);
          setIsTaskInputActive(false);

          isRefreshingRef.current = false;
          setIsRefreshing(false);
          pullDistanceRef.current = 0;
          setPullDistance(0);
        }, 700);
      } else {
        pullDistanceRef.current = 0;
        setPullDistance(0);
      }
    };

    // Mouse drag support for desktop testing
    const handleMouseDown = (e) => {
      if (e.button !== 0 || isRefreshingRef.current || isTaskInputActive || isOverlayOpenRef.current) return;
      if (
        e.target.closest('.suggestions-sheet') ||
        e.target.closest('.suggestions-notch-zone') ||
        e.target.closest('.bottom-sheet-backdrop') ||
        e.target.closest('.list-options-sheet') ||
        e.target.closest('.install-app-sheet') ||
        e.target.closest('.share-list-sheet') ||
        e.target.closest('.task-bottom-sheet') ||
        e.target.closest('.lists-drawer') ||
        e.target.closest('.drawer-backdrop') ||
        e.target.closest('.delete-confirm-overlay') ||
        e.target.closest('.add-task-docked-container') ||
        e.target.closest('.bottom-sheet') ||
        e.target.closest('.subtask-modal') ||
        e.target.closest('.myday-search-bar-wrap') ||
        e.target.closest('.drawer-search-bar-wrap') ||
        e.target.closest('input') ||
        e.target.closest('button') ||
        e.target.closest('.task-item-card')
      ) return;

      const scrollEl = getNearestScrollEl(e.target);
      const atTop = !scrollEl || scrollEl.scrollTop <= 0;
      if (atTop) {
        touchStartYRef.current = e.clientY;
        touchStartXRef.current = e.clientX;
        isDraggingPullRef.current = false;
        touchStartYRef._scrollEl = scrollEl;
        touchStartYRef._isMouse = true;
      }
    };

    const handleMouseMove = (e) => {
      if (!touchStartYRef._isMouse || touchStartYRef.current === 0 || isRefreshingRef.current || isOverlayOpenRef.current) return;
      const currentY = e.clientY;
      const currentX = e.clientX;
      const diffY = currentY - touchStartYRef.current;
      const diffX = Math.abs(currentX - touchStartXRef.current);

      if (!isDraggingPullRef.current && diffX > Math.abs(diffY)) {
        touchStartYRef.current = 0;
        touchStartYRef._isMouse = false;
        return;
      }

      if (diffY > 0) {
        isDraggingPullRef.current = true;
        isPullingRef.current = true;
        setIsPulling(true);
        const damped = Math.min(80, Math.pow(diffY, 0.82) * 1.8);
        pullDistanceRef.current = damped;
        setPullDistance(damped);
      }
    };

    const handleMouseUp = () => {
      if (touchStartYRef._isMouse) {
        touchStartYRef._isMouse = false;
        handleTouchEnd();
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    container.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);

      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isTaskInputActive]);


  // Dismiss mobile virtual keyboard ONLY when user intentionally scrolls/drags the background screen
  useEffect(() => {
    let startY = 0;
    let startX = 0;
    let isTrackingBackgroundScroll = false;

    const onTouchStart = (e) => {
      if (!e.touches || e.touches.length === 0) return;

      const activeEl = document.activeElement;
      if (!activeEl || (activeEl.tagName !== 'INPUT' && activeEl.tagName !== 'TEXTAREA')) {
        isTrackingBackgroundScroll = false;
        return;
      }

      const target = e.target;
      // Do not dismiss if the touch is inside the active input or its surrounding control containers
      if (
        target === activeEl ||
        activeEl.contains(target) ||
        target.closest('.myday-search-bar-wrap') ||
        target.closest('.drawer-search-bar-wrap') ||
        target.closest('.add-task-docked-container') ||
        target.closest('.top-action-bar') ||
        target.closest('button') ||
        target.closest('a')
      ) {
        isTrackingBackgroundScroll = false;
        return;
      }

      // Touch started on the background / task list outside input controls
      isTrackingBackgroundScroll = true;
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
    };

    const onTouchMove = (e) => {
      if (!isTrackingBackgroundScroll) return;
      if (!e.touches || e.touches.length === 0) return;

      const activeEl = document.activeElement;
      if (!activeEl || (activeEl.tagName !== 'INPUT' && activeEl.tagName !== 'TEXTAREA')) {
        isTrackingBackgroundScroll = false;
        return;
      }

      // Allow 500ms grace period after focusing to prevent any initial touch tap ripple
      if (Date.now() - lastInputFocusTimeRef.current < 500) {
        return;
      }

      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const diffY = Math.abs(currentY - startY);
      const diffX = Math.abs(currentX - startX);

      // If user drags finger > 10px on the background screen: that is an intentional user scroll
      if (diffY > 10 || diffX > 10) {
        isUserScrollingRef.current = true;
        activeEl.blur();
        isTrackingBackgroundScroll = false;
        if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
        scrollTimerRef.current = setTimeout(() => {
          isUserScrollingRef.current = false;
        }, 500);
      }
    };

    const onTouchEnd = () => {
      isTrackingBackgroundScroll = false;
    };

    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('touchend', onTouchEnd, { passive: true });
    document.addEventListener('touchcancel', onTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('touchcancel', onTouchEnd);
    };
  }, []);

  // Global scroll activity tracker to strictly prevent unintended task creation on scroll
  useEffect(() => {
    const handleScrollActivity = () => {
      isUserScrollingRef.current = true;
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => {
        isUserScrollingRef.current = false;
      }, 450);
    };

    const scrollEl = scrollAreaRef.current;
    if (scrollEl) {
      scrollEl.addEventListener('scroll', handleScrollActivity, { passive: true });
    }
    window.addEventListener('scroll', handleScrollActivity, { passive: true });
    window.addEventListener('touchmove', handleScrollActivity, { passive: true });

    return () => {
      if (scrollEl) {
        scrollEl.removeEventListener('scroll', handleScrollActivity);
      }
      window.removeEventListener('scroll', handleScrollActivity);
      window.removeEventListener('touchmove', handleScrollActivity);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);


  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('myday_theme', theme);
  }, [theme]);

  // Sync tasks to localStorage
  useEffect(() => {
    localStorage.setItem('myday_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Listen for PWA install prompt & standalone status
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsStandalone(true);
      setDeferredPrompt(null);
      setIsInstallModalOpen(false);
      showToast('My Day app installed! App icon added to home screen 📱✨');
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    };

    const checkStandalone = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
      setIsStandalone(standalone);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    try {
      mediaQuery.addEventListener('change', checkStandalone);
    } catch {
      mediaQuery.addListener?.(checkStandalone);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
      try {
        mediaQuery.removeEventListener('change', checkStandalone);
      } catch {
        mediaQuery.removeListener?.(checkStandalone);
      }
    };
  }, []);

  // Handle mobile virtual keyboard appearance & dynamic viewport height
  useEffect(() => {
    const updateKeyboardInset = () => {
      if (window.visualViewport) {
        const offset = Math.max(0, window.innerHeight - window.visualViewport.height);
        document.documentElement.style.setProperty('--keyboard-inset', `${offset}px`);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateKeyboardInset);
      window.visualViewport.addEventListener('scroll', updateKeyboardInset);
      updateKeyboardInset();
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateKeyboardInset);
        window.visualViewport.removeEventListener('scroll', updateKeyboardInset);
      }
    };
  }, []);

  // Lock background screen scroll completely ONLY when modal bottom sheets or drawer are open
  useEffect(() => {
    const isAnyActive = isSuggestionsOpen || isDrawerOpen || isListOptionsOpen || isInstallModalOpen || isShareListOpen || isShareAppsOpen || !!taskSheet;
    if (!isAnyActive) return;

    const preventBackgroundScroll = (e) => {
      // Allow scroll inside open scrollable contents & main task scroll area
      if (
        e.target.closest('.sheet-options-list') ||
        e.target.closest('.suggestions-list') ||
        e.target.closest('.suggestions-notch-zone') ||
        e.target.closest('.suggestions-header') ||
        e.target.closest('.drawer-list-menu') ||
        e.target.closest('.drawer-scroll-content') ||
        e.target.closest('.install-app-body') ||
        e.target.closest('.share-apps-sheet') ||
        e.target.closest('.tasks-main-scroll-area')
      ) {
        return;
      }
      if (e.cancelable) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', preventBackgroundScroll, { passive: false });
    return () => {
      document.removeEventListener('touchmove', preventBackgroundScroll);
    };
  }, [isSuggestionsOpen, isDrawerOpen, isListOptionsOpen, isInstallModalOpen, isShareListOpen, isShareAppsOpen, taskSheet]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2400);
  };

  // ----------------------------------------------------
  // Handle Opening Shared List directly from WhatsApp / Invite Link
  // Specific User Request: "whatsapp pe share krne pe link jana chahiye jise hum whatsapp se hi open kr ske"
  // ----------------------------------------------------
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const listParam = urlParams.get('list');
      const titleParam = urlParams.get('title') || urlParams.get('shareList');

      if (listParam || titleParam) {
        const decodedTitle = titleParam ? decodeURIComponent(titleParam) : decodeURIComponent(listParam);
        showToast(`✨ Opened shared list "${decodedTitle}"`);
        // Clean URL in browser bar so refresh remains clean
        try {
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch { }
      }
    } catch (err) {
      console.error('Error handling shared link:', err);
    }
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          showToast('Installing My Day... app icon added to your screen! 📲');
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
          setDeferredPrompt(null);
          setIsInstallModalOpen(false);
          return;
        }
      } catch (err) {
        console.log('Install prompt error:', err);
      }
    }
    setIsInstallModalOpen(true);
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    showToast(`Switched to ${next === 'light' ? 'Light' : 'Dark'} mode`);
  };

  // Date formatting: Current day and month (no year)
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }).format(new Date());

  // Task Options Sheet Helpers
  const openTaskSheet = (sheetName) => {
    if (inputRef.current) {
      inputRef.current.blur();
    }
    setIsTaskSheetClosing(false);
    setTaskSheet(sheetName);
    if (sheetName === 'reminder') {
      setReminderSubView('main');
      setSelectedCalendarDate(new Date());
    } else if (sheetName === 'due') {
      setDueSubView('main');
      setSelectedCalendarDate(new Date());
    }
  };

  const handleOpenListsFromTaskInput = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    isSelectingListForDraftRef.current = true;
    if (inputRef.current) {
      inputRef.current.blur();
    }
    if (taskSheet) {
      setTaskSheet(null);
      setIsTaskSheetClosing(false);
    }
    setIsDrawerClosing(false);
    setIsDrawerOpen(true);
  };

  const closeTaskSheet = (callback) => {
    if (isTaskSheetClosing) return;
    setIsTaskSheetClosing(true);
    setTimeout(() => {
      setTaskSheet(null);
      setIsTaskSheetClosing(false);
      if (typeof callback === 'function') callback();
      inputRef.current?.focus();
    }, 240);
  };

  const getRelativeDayName = (offsetDays = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return WEEKDAYS[d.getDay()];
  };

  const getNextWeekMondayInfo = () => {
    const d = new Date();
    const day = d.getDay();
    const daysUntilNextMon = ((1 - day + 7) % 7) || 7;
    d.setDate(d.getDate() + daysUntilNextMon);
    return `Mon, ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}`;
  };

  const formatShortDate = (d) => {
    if (!d) return '';
    return `${WEEKDAYS[d.getDay()]}, ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}`;
  };

  const handleCloseTaskInput = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    setIsTaskInputActive(false);
    setIsInputFocused(false);
    setNewTaskTitle('');
    setTaskDraftReminder(null);
    setTaskDraftDue(null);
    setTaskDraftNote('');
    setTaskDraftList(null);
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  // Task Handlers
  const handleAddTask = (eOrKeepOpen = true) => {
    // Critical Guard: Do NOT add task if user is scrolling or was recently scrolling
    if (isUserScrollingRef.current) return;

    let keepOpen = true;
    if (typeof eOrKeepOpen === 'boolean') {
      keepOpen = eOrKeepOpen;
    } else if (eOrKeepOpen && typeof eOrKeepOpen.preventDefault === 'function') {
      eOrKeepOpen.preventDefault();
    }
    const trimmedTitle = newTaskTitle.trim();
    if (!trimmedTitle) return;

    const d = new Date();
    const todayFormattedDate = {
      text: 'Today',
      date: d.toISOString().split('T')[0]
    };

    const isStarredList = activeList === 'starred' || activeList === 'Important';
    const isPlannedList = activeList === 'planned' || activeList === 'Planned';
    const isAssignedList = activeList === 'assigned' || activeList === 'Assigned to me';
    const isFlaggedList = activeList === 'flagged' || activeList === 'Flagged email';
    const isSmartList = isStarredList || isPlannedList || isAssignedList || isFlaggedList;

    const isMyDayList = activeList === 'my-day' || activeList === 'all';

    const targetListName =
      taskDraftList && taskDraftList !== 'none' && taskDraftList !== 'My Day' && taskDraftList !== 'Tasks'
        ? taskDraftList
        : taskDraftList === 'Tasks'
          ? 'Tasks'
          : isSmartList
            ? 'Tasks'
            : activeList !== 'my-day' && activeList !== 'tasks' && activeList !== 'all'
              ? listTitle
              : isMyDayList ? 'My Day' : 'Tasks';

    const newTask = {
      id: 'task-' + Date.now(),
      title: trimmedTitle,
      completed: false,
      starred: taskDraftList === 'Important' || isStarredList || isFlaggedList,
      assigned: taskDraftList === 'Assigned to me' || isAssignedList,
      flagged: taskDraftList === 'Flagged email' || isFlaggedList,
      dueDate: taskDraftDue || (taskDraftList === 'Planned' || isPlannedList ? todayFormattedDate : null),
      reminder: taskDraftReminder || null,
      list: targetListName,
      addedToMyDay: taskDraftList === 'My Day' || isMyDayList,
      note: taskDraftNote || '',
      createdAt: Date.now()
    };

    setTasks((prev) => [newTask, ...prev]);
    // Reset task title to blank for new task
    setNewTaskTitle('');
    setTaskDraftReminder(null);
    setTaskDraftDue(null);
    setTaskDraftNote('');
    setTaskDraftList(null);

    if (keepOpen) {
      // Keep input active and re-focus so keyboard stays open
      setIsTaskInputActive(true);
      if (inputRef.current) {
        inputRef.current.focus();
        requestAnimationFrame(() => {
          inputRef.current?.focus();
        });
      }
    } else {
      // Hide both add-task card and keyboard
      setIsTaskInputActive(false);
      setIsInputFocused(false);
      setTaskDraftList(null);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
    showToast(`Task added to ${targetListName}`);
  };

  const toggleTaskComplete = (taskId) => {
    // Warm up audio context on user gesture
    warmupAudio();

    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    // Case 1: Task is already in Completed section -> uncheck and return to active immediately
    if (task.completed) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed: false } : t))
      );
      return;
    }

    // Case 2: Already in completing state -> cancel/undo if clicked again within 1 second
    if (completingTaskIds.has(taskId)) {
      if (completionTimersRef.current[taskId]) {
        clearTimeout(completionTimersRef.current[taskId].exitTimer);
        clearTimeout(completionTimersRef.current[taskId].finishTimer);
        delete completionTimersRef.current[taskId];
      }
      setCompletingTaskIds((prev) => {
        const next = new Set(prev);
        next.delete(taskId);
        return next;
      });
      setExitingTaskIds((prev) => {
        const next = new Set(prev);
        next.delete(taskId);
        return next;
      });
      return;
    }

    // Case 3: Mark complete with instant tick sound & smooth 1s transition
    // Step 1: Immediately play chime sound right on tick ("tick krte hi sound ani chahiye")!
    playSound('complete');

    // Immediately show tick with sign and cut text
    setCompletingTaskIds((prev) => new Set(prev).add(taskId));

    // Step 2: At 720ms, begin smooth exit transition
    const exitTimer = setTimeout(() => {
      setExitingTaskIds((prev) => new Set(prev).add(taskId));
    }, 720);

    // Step 3: At 1000ms (1 full second):
    const finishTimer = setTimeout(() => {
      // Trigger celebratory confetti
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#2563eb', '#3b82f6', '#fbbf24', '#10b981']
      });

      // Move task to completed
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed: true } : t))
      );

      // Clean up animation states
      setCompletingTaskIds((prev) => {
        const next = new Set(prev);
        next.delete(taskId);
        return next;
      });
      setExitingTaskIds((prev) => {
        const next = new Set(prev);
        next.delete(taskId);
        return next;
      });
      delete completionTimersRef.current[taskId];
    }, 1000);

    completionTimersRef.current[taskId] = { exitTimer, finishTimer };
  };

  const toggleTaskStar = (taskId, e) => {
    if (e) e.stopPropagation();
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, starred: !t.starred } : t))
    );
  };

  const deleteTask = (taskId, e) => {
    if (e) e.stopPropagation();
    const t = tasks.find((item) => item.id === taskId);
    if (t) {
      setTaskToDelete(t);
    }
  };

  const handleConfirmDeleteTask = () => {
    if (!taskToDelete) return;
    if (completionTimersRef.current[taskToDelete.id]) {
      clearTimeout(completionTimersRef.current[taskToDelete.id].exitTimer);
      clearTimeout(completionTimersRef.current[taskToDelete.id].finishTimer);
      delete completionTimersRef.current[taskToDelete.id];
    }
    setCompletingTaskIds((prev) => {
      const next = new Set(prev);
      next.delete(taskToDelete.id);
      return next;
    });
    setExitingTaskIds((prev) => {
      const next = new Set(prev);
      next.delete(taskToDelete.id);
      return next;
    });
    setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
    showToast('Task deleted');
    setTaskToDelete(null);
  };

  // Toggle item in My Day on right swipe
  const toggleTaskMyDay = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const isCurrentlyInMyDay = Boolean(t.addedToMyDay || t.list === 'My Day');
          if (isCurrentlyInMyDay) {
            showToast('Removed from My Day');
            return {
              ...t,
              addedToMyDay: false,
              list: t.list === 'My Day' ? 'Tasks' : t.list
            };
          } else {
            showToast('Added to My Day ☀️');
            return {
              ...t,
              addedToMyDay: true
            };
          }
        }
        return t;
      })
    );
  };

  // Add suggestion task
  const handleAddSuggestion = (item) => {
    const exists = tasks.some(
      (t) => t.title.toLowerCase() === item.title.toLowerCase() && !t.completed
    );
    if (exists) {
      showToast(`"${item.title}" is already in your tasks`);
      return;
    }

    const newTask = {
      id: 'task-' + Date.now() + Math.random().toString(36).substr(2, 4),
      title: item.title,
      completed: false,
      starred: false,
      createdAt: Date.now()
    };

    setTasks((prev) => [newTask, ...prev]);
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#3b82f6', '#10b981', '#fbbf24']
    });
    showToast(`Added "${item.title}"`);
  };

  // Undo suggestion task
  const handleUndoSuggestion = (item) => {
    setTasks((prev) =>
      prev.filter(
        (t) => !(t.title.toLowerCase() === item.title.toLowerCase() && !t.completed)
      )
    );
    showToast(`Removed "${item.title}"`);
  };

  // Smooth closing helpers for bottom sheets
  const closeListOptions = (callback) => {
    if (isListOptionsClosing) return;
    setIsListOptionsClosing(true);
    setTimeout(() => {
      setIsListOptionsOpen(false);
      setIsListOptionsClosing(false);
      if (typeof callback === 'function') {
        callback();
      }
    }, 240);
  };

  const closeSuggestions = () => {
    if (isSuggestionsClosing) return;
    setIsSuggestionsClosing(true);
    if (suggestionSheetRef.current) {
      suggestionSheetRef.current.style.transition = 'transform 0.24s cubic-bezier(0.32, 0, 0.67, 0), opacity 0.24s ease-out';
      suggestionSheetRef.current.style.transform = 'translateY(100%)';
      suggestionSheetRef.current.style.opacity = '0.5';
    }
    setTimeout(() => {
      setIsSuggestionsOpen(false);
      setIsSuggestionsClosing(false);
      if (suggestionSheetRef.current) {
        suggestionSheetRef.current.style.transform = '';
        suggestionSheetRef.current.style.transition = '';
        suggestionSheetRef.current.style.opacity = '';
      }
    }, 240);
  };

  // Suggestion sheet swipe / drag down to dismiss handler (on notch & header)
  const handleSuggestionTouchStart = (e) => {
    e.stopPropagation();
    if (e.target.closest('.suggestions-done-btn')) return;
    const clientY = e.touches[0].clientY;
    suggestionDragStartY.current = clientY;
    suggestionDragCurrentY.current = clientY;
    suggestionDragStartTime.current = Date.now();
    isSuggestionDragging.current = true;
    if (suggestionSheetRef.current) {
      suggestionSheetRef.current.style.transition = 'none';
    }
  };

  const handleSuggestionTouchMove = (e) => {
    e.stopPropagation();
    if (!isSuggestionDragging.current) return;
    const clientY = e.touches[0].clientY;
    const diffY = clientY - suggestionDragStartY.current;
    suggestionDragCurrentY.current = clientY;
    if (diffY > 0) {
      if (e.cancelable) e.preventDefault();
      if (suggestionSheetRef.current) {
        suggestionSheetRef.current.style.transform = `translateY(${diffY}px)`;
      }
    } else if (suggestionSheetRef.current) {
      suggestionSheetRef.current.style.transform = 'translateY(0px)';
    }
  };

  const handleSuggestionTouchEnd = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (!isSuggestionDragging.current) return;
    isSuggestionDragging.current = false;
    const diffY = suggestionDragCurrentY.current - suggestionDragStartY.current;
    const duration = Date.now() - suggestionDragStartTime.current;
    const velocity = diffY / (duration || 1);

    if (diffY > 45 || (diffY > 20 && velocity > 0.35)) {
      closeSuggestions();
    } else if (suggestionSheetRef.current) {
      suggestionSheetRef.current.style.transition = 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)';
      suggestionSheetRef.current.style.transform = 'translateY(0px)';
    }
  };

  // When swiping down on the list while scrolled at the top, dismiss the sheet smoothly
  const handleSuggestionListTouchStart = (e) => {
    if (e.target.closest('button')) return;
    const list = suggestionsListRef.current;
    const atTop = !list || list.scrollTop <= 0;
    if (atTop) {
      const clientY = e.touches[0].clientY;
      suggestionDragStartY.current = clientY;
      suggestionDragCurrentY.current = clientY;
      suggestionDragStartTime.current = Date.now();
      isSuggestionDragging.current = true;
      if (suggestionSheetRef.current) {
        suggestionSheetRef.current.style.transition = 'none';
      }
    } else {
      isSuggestionDragging.current = false;
    }
  };

  const handleSuggestionListTouchMove = (e) => {
    if (!isSuggestionDragging.current) return;
    const list = suggestionsListRef.current;
    const clientY = e.touches[0].clientY;
    const diffY = clientY - suggestionDragStartY.current;
    suggestionDragCurrentY.current = clientY;

    if (diffY > 0 && (!list || list.scrollTop <= 0)) {
      if (e.cancelable) e.preventDefault();
      if (suggestionSheetRef.current) {
        suggestionSheetRef.current.style.transform = `translateY(${diffY}px)`;
      }
    } else {
      if (suggestionSheetRef.current && diffY <= 0) {
        suggestionSheetRef.current.style.transform = 'translateY(0px)';
      }
      if (list && list.scrollTop > 0) {
        isSuggestionDragging.current = false;
      }
    }
  };

  const handleSuggestionMouseDown = (e) => {
    e.stopPropagation();
    if (e.target.closest('.suggestions-done-btn')) return;
    suggestionDragStartY.current = e.clientY;
    suggestionDragCurrentY.current = e.clientY;
    suggestionDragStartTime.current = Date.now();
    isSuggestionDragging.current = true;
    if (suggestionSheetRef.current) {
      suggestionSheetRef.current.style.transition = 'none';
    }
    const onMouseMove = (moveEvent) => {
      moveEvent.stopPropagation();
      if (!isSuggestionDragging.current) return;
      const diffY = moveEvent.clientY - suggestionDragStartY.current;
      suggestionDragCurrentY.current = moveEvent.clientY;
      if (diffY > 0 && suggestionSheetRef.current) {
        suggestionSheetRef.current.style.transform = `translateY(${diffY}px)`;
      }
    };
    const onMouseUp = (upEvent) => {
      if (upEvent && upEvent.stopPropagation) upEvent.stopPropagation();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      handleSuggestionTouchEnd(upEvent);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const closeDrawer = (callback) => {
    if (isDrawerClosing) return;
    setIsDrawerClosing(true);
    setTimeout(() => {
      setIsDrawerOpen(false);
      setIsDrawerClosing(false);
      if (typeof callback === 'function') {
        callback();
      }
    }, 285);
  };

  // List Options Handlers
  const handleEditList = () => {
    closeListOptions(() => {
      setIsEditingTitle(true);
    });
  };

  const handleSortTasks = () => {
    let nextSort;
    if (!sortOrder || sortOrder === 'Date') {
      nextSort = 'A-Z';
      setTasks((prev) => [...prev].sort((a, b) => a.title.localeCompare(b.title)));
    } else if (sortOrder === 'A-Z') {
      nextSort = 'Starred';
      setTasks((prev) =>
        [...prev].sort((a, b) => (b.starred === a.starred ? 0 : b.starred ? 1 : -1))
      );
    } else {
      nextSort = 'Date';
      setTasks((prev) => [...prev].sort((a, b) => b.createdAt - a.createdAt));
    }
    setSortOrder(nextSort);
    showToast(`Sorted by: ${nextSort}`);
  };

  const handlePrintList = () => {
    closeListOptions(() => {
      setTimeout(() => {
        window.print();
      }, 100);
    });
  };

  const handleSendCopy = async () => {
    closeListOptions();
    const payload = getListSharePayload();
    if (navigator.share) {
      try {
        await navigator.share({
          title: payload.title,
          text: payload.text,
          url: payload.url
        });
        return;
      } catch (err) {
        if (err && err.name === 'AbortError') return;
      }
    }
    setTimeout(() => {
      openShareAppsSheet();
    }, 180);
  };

  // Filter tasks according to selected list
  const filteredTasks = tasks.filter((task) => {
    // If search query is active, filter tasks by query
    if (taskSearchQuery.trim()) {
      const q = taskSearchQuery.toLowerCase().trim();
      const matchTitle = task.title && task.title.toLowerCase().includes(q);
      const matchNote = task.note && task.note.toLowerCase().includes(q);
      if (!matchTitle && !matchNote) return false;
    }

    if (activeList === 'starred' || activeList === 'Important') {
      return task.starred || task.list === 'Important' || task.list === 'starred';
    }
    if (activeList === 'planned' || activeList === 'Planned') {
      return Boolean(task.dueDate || task.reminder || task.list === 'Planned' || task.list === 'planned');
    }
    if (activeList === 'assigned' || activeList === 'Assigned to me') {
      return Boolean(task.assigned || task.list === 'Assigned to me' || task.list === 'assigned');
    }
    if (activeList === 'flagged' || activeList === 'Flagged email') {
      return Boolean(task.flagged || task.list === 'Flagged email' || task.list === 'flagged');
    }
    if (activeList === 'tasks' || activeList === 'Tasks') {
      return true;
    }
    if (activeList === 'my-day' || activeList === 'all') {
      return !task.list || task.list === 'My Day' || Boolean(task.addedToMyDay);
    }
    // Custom user list (e.g. 'Groceries', 'Tasks for landlord', 'Janmashtami', etc.)
    return task.list === listTitle || task.list === activeList || task.listId === activeList;
  });

  const activeTasks = filteredTasks.filter((t) => !t.completed);
  const completedTasks = filteredTasks.filter((t) => t.completed);

  const indicatorY = isRefreshing
    ? 24
    : pullDistance > 0
      ? Math.min(34, -32 + pullDistance * 0.95)
      : -60;

  const indicatorScale = isRefreshing
    ? 1
    : pullDistance > 0
      ? Math.min(1, Math.max(0.4, pullDistance / 40))
      : 0.4;

  const indicatorOpacity = isRefreshing
    ? 1
    : pullDistance > 4
      ? Math.min(1, pullDistance / 18)
      : 0;

  const arrowRotation = isRefreshing ? 0 : pullDistance * 7;

  // Drawer helper functions for Microsoft To Do style Lists Page
  const handleSelectList = (listId, listTitleText) => {
    const safeTitle = getSafeListName(listTitleText) || 'Tasks';

    if (isSelectingListForDraftRef.current) {
      // User tapped Hut icon inside Add a task to choose destination list
      isSelectingListForDraftRef.current = false;
      setTaskDraftList(safeTitle);
      closeDrawer(() => {
        setIsTaskInputActive(true);
        inputRef.current?.focus();
      });
      showToast(`Selected "${safeTitle}" for task`);
    } else {
      // Normal list navigation from < Lists button
      setActiveList(listId);
      setListTitle(safeTitle);
      setTaskDraftList(listId === 'my-day' ? 'Tasks' : safeTitle);
      setIsTaskInputActive(false);
      setIsInputFocused(false);
      closeDrawer();
    }
  };

  const handleDeleteCustomList = (listIdToDelete) => {
    const listObj = customLists.find((cl) => {
      const id = typeof cl === 'object' ? cl.id : cl;
      return id === listIdToDelete || getSafeListName(cl) === listTitle;
    });
    const name = listObj ? getSafeListName(listObj) : listTitle;

    setCustomLists((prev) =>
      prev.filter((cl) => {
        const id = typeof cl === 'object' ? cl.id : cl;
        return id !== listIdToDelete && getSafeListName(cl) !== name;
      })
    );

    setActiveList('my-day');
    setListTitle('My Day');
    setTaskDraftList('Tasks');
    setIsTaskInputActive(false);
    showToast(`List "${name}" deleted`);
  };

  const handleCreateCustomList = (e) => {
    if (e) e.preventDefault();
    const trimmed = newListNameInput.trim();
    if (!trimmed) {
      setIsCreatingList(false);
      return;
    }
    const newList = {
      id: 'cl-' + Date.now(),
      name: trimmed,
      shared: false,
      count: 0
    };
    const updated = [...customLists, newList];
    setCustomLists(updated);
    setNewListNameInput('');
    setIsCreatingList(false);
    showToast(`List "${trimmed}" created!`);
    handleSelectList(newList.id, newList.name);
  };

  const renderSystemIcon = (iconType, color) => {
    switch (iconType) {
      case 'sun':
        return <Sun size={20} color={color} strokeWidth={1.8} />;
      case 'star':
        return <Star size={20} color={color} strokeWidth={1.8} />;
      case 'calendar':
        return <Calendar size={20} color={color} strokeWidth={1.8} />;
      case 'user':
        return <User size={20} color={color} strokeWidth={1.8} />;
      case 'flag':
        return <Flag size={20} color={color} strokeWidth={1.8} />;
      case 'tasks':
      default:
        return <HutCheckIcon size={20} color={color} />;
    }
  };

  const getPageIcon = (id) => {
    switch (id) {
      case 'my-day':
        return null; // Icon removed as requested
      case 'starred':
        return <Star size={24} color="#fb7185" fill="#fb7185" strokeWidth={2} />;
      case 'planned':
        return <Calendar size={24} color="#2dd4bf" strokeWidth={2.2} />;
      case 'assigned':
        return <User size={24} color="#34d399" strokeWidth={2.2} />;
      case 'flagged':
        return <Flag size={24} color="#fb923c" fill="#fb923c" strokeWidth={2} />;
      case 'tasks':
        return <CheckCircle2 size={24} color="#818cf8" strokeWidth={2.2} />;
      default:
        return <List size={24} color="#818cf8" strokeWidth={2.2} />;
    }
  };

  const getPageColor = (id) => {
    switch (id) {
      case 'planned':
        return '#2dd4bf'; // Vibrant Teal
      case 'assigned':
        return '#34d399'; // Vibrant Emerald Green
      case 'starred':
        return '#fb7185'; // Vibrant Rose Pink
      case 'flagged':
        return '#fb923c'; // Vibrant Warm Orange
      case 'tasks':
        return '#818cf8'; // Vibrant Indigo Blue
      case 'my-day':
        return '#f8fafc'; // Matches list text color
      default:
        return '#818cf8';
    }
  };

  const getPageSubtitle = (id) => {
    if (id === 'my-day') return todayFormatted;
    if (id === 'starred') return 'Marked as important';
    if (id === 'planned') return 'Tasks with due dates or reminders';
    if (id === 'assigned') return 'Tasks assigned to you';
    if (id === 'flagged') return 'Tasks from flagged email';
    if (id === 'tasks') return 'Tasks';
    return null;
  };

  const getSystemListCount = (id) => {
    if (id === 'my-day') {
      const c = tasks.filter((t) => !t.completed && (t.list === 'My Day' || !t.list || Boolean(t.addedToMyDay))).length;
      return c > 0 ? c : '';
    }
    if (id === 'starred') {
      const c = tasks.filter((t) => !t.completed && t.starred).length;
      return c > 0 ? c : '';
    }
    if (id === 'planned') {
      const c = tasks.filter((t) => !t.completed && (t.dueDate || t.reminder || t.list === 'Planned')).length;
      return c > 0 ? c : '';
    }
    if (id === 'assigned') {
      const c = tasks.filter((t) => !t.completed && (t.assigned || t.list === 'Assigned to me')).length;
      return c > 0 ? c : '';
    }
    if (id === 'flagged') {
      const c = tasks.filter((t) => !t.completed && (t.flagged || t.list === 'Flagged email')).length;
      return c > 0 ? c : '';
    }
    if (id === 'tasks') {
      const c = tasks.filter((t) => !t.completed).length;
      return c > 0 ? c : '';
    }
    return '';
  };

  const getCustomListCount = (item) => {
    const listName = getSafeListName(item);
    const listId = (item && typeof item === 'object' && typeof item.id === 'string') ? item.id : listName;
    const actualTasks = tasks.filter((t) => !t.completed && (t.list === listName || t.listId === listId));
    if (actualTasks.length > 0) return actualTasks.length;
    if (typeof item === 'object' && item?.count && item.count > 0) return item.count;
    return '';
  };

  const filteredSystemLists = SYSTEM_LISTS.filter((item) =>
    item.title.toLowerCase().includes(drawerSearchQuery.toLowerCase().trim())
  );

  const filteredCustomLists = customLists.filter((item) => {
    const name = getSafeListName(item);
    return name.toLowerCase().includes(drawerSearchQuery.toLowerCase().trim());
  });

  return (
    <>
      <div
        ref={appContainerRef}
        className={`myday-app-container ${activeList !== 'my-day' ? 'black-theme-page' : ''}`}
        style={activeList !== 'my-day' ? { backgroundColor: '#000000' } : undefined}
      >
        {/* ----------------------------------------------------
          Dynamic Parallax Wallpaper Background Layer
          (Shown on My Day, hidden on list pages so background matches the pure black list drawer)
          ---------------------------------------------------- */}
        {activeList === 'my-day' && (
          <div
            className="app-wallpaper-parallax-layer"
            style={{
              transform: `translate3d(0, ${isRefreshing ? 17 : pullDistance * 0.32}px, 0)`,
              transition: isPulling
                ? 'none'
                : 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)'
            }}
          />
        )}

        {/* Toast Notification */}
        {toastMessage && (
          <div className="toast-notification">
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Delete Confirmation Modal: "<Task>" will be permanently deleted. Left: Cancel, Right: Delete task */}
        {taskToDelete && (
          <div
            className="delete-confirm-overlay"
            onClick={() => setTaskToDelete(null)}
          >
            <div
              className="delete-confirm-dialog"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-dialog-title"
            >
              <p id="delete-dialog-title" className="delete-confirm-message">
                &quot;{taskToDelete.title}&quot; will be permanently deleted.
              </p>
              <div className="delete-confirm-actions">
                <button
                  type="button"
                  className="delete-cancel-btn"
                  onClick={() => setTaskToDelete(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="delete-action-btn"
                  onClick={handleConfirmDeleteTask}
                >
                  Delete task
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
          Native Mobile Style Pull-To-Refresh Indicator
          (Drops down smoothly from top edge, spins & retracts)
          ---------------------------------------------------- */}
        <div
          className="native-pull-refresh-indicator"
          style={{
            transform: `translate(-50%, ${indicatorY}px) scale(${indicatorScale})`,
            opacity: indicatorOpacity,
            transition: isPulling
              ? 'none'
              : 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.25s ease'
          }}
        >
          <div
            className={`pure-pull-circle-spinner ${isRefreshing ? 'spin-infinite' : ''}`}
            style={{
              transform: isRefreshing ? 'none' : `rotate(${arrowRotation}deg)`
            }}
          />
        </div>

        {/* ----------------------------------------------------
          Whole Page Main Flow
          (Smoothly slides down with native spring physics)
          ---------------------------------------------------- */}
        <div
          className="myday-page-main-flow"
          style={{
            transform: `translateY(${isRefreshing ? 54 : pullDistance}px)`,
            transition: isPulling
              ? 'none'
              : 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)'
          }}
        >
          {/* ----------------------------------------------------
            1. Top Action Bar:
            - Left: Lists button with arrow WITHOUT sleeping line (ChevronLeft)
            - Right: Suggestion bulb icon, 3 dots icon, PWA install (if available)
            ---------------------------------------------------- */}
          <div className="top-action-bar">
            {/* User Request: "list ke side se 3 lines hta ke arrow lga do without sleeping line wala" */}
            <button
              type="button"
              className="borderless-list-btn"
              onClick={() => {
                isSelectingListForDraftRef.current = false;
                setIsDrawerClosing(false);
                setIsDrawerOpen(true);
              }}
              title="Open Lists Drawer"
              aria-label="Lists"
            >
              <ChevronLeft size={22} strokeWidth={1.8} />
              <span>Lists</span>
            </button>

            {/* User Request:
            - "list ke right side me suggetion ka ek bulb type symbol lga do jiske click pe vo sabhi items ki list show hogi jo bhi hum regularly purchase krte hain"
            - "sbse right me 3 dots(...) lga do jiske click pe ek list option khulega niche side se" */}
            <div className="top-bar-right">
              {isTaskInputActive ? (
                <button
                  type="button"
                  className="top-bar-done-btn"
                  onPointerDown={(e) => {
                    doneBtnPointerStart.current = { x: e.clientX, y: e.clientY };
                  }}
                  onClick={(e) => {
                    if (isUserScrollingRef.current) return;
                    const diffX = Math.abs(e.clientX - doneBtnPointerStart.current.x);
                    const diffY = Math.abs(e.clientY - doneBtnPointerStart.current.y);
                    if (diffX > 8 || diffY > 8) return; // User was scrolling/dragging across top bar
                    if (newTaskTitle.trim()) {
                      handleAddTask(false);
                    } else {
                      handleCloseTaskInput();
                    }
                  }}
                  title="Done adding task"
                  aria-label="Done"
                >
                  Done
                </button>
              ) : (
                <>
                  {/* Download App Icon (Shown on My Day just like Suggestion icon) */}
                  {activeList === 'my-day' && (
                    <button
                      type="button"
                      className="icon-circle-btn"
                      onClick={handleInstallApp}
                      title="Download / Install My Day App"
                      aria-label="Download App"
                    >
                      <Download size={19} />
                    </button>
                  )}

                  {/* Suggestion Bulb Icon (Shown only on My Day) */}
                  {activeList === 'my-day' && (
                    <button
                      type="button"
                      className="icon-circle-btn"
                      onClick={() => {
                        setIsSuggestionsClosing(false);
                        setIsSuggestionsOpen(true);
                      }}
                      title="Regular Purchases & Suggestions"
                      aria-label="Suggestions"
                    >
                      <Lightbulb size={19} />
                    </button>
                  )}

                  {/* Share List Collaboration Icon (Hidden on My Day list) */}
                  {activeList !== 'my-day' && (
                    <button
                      type="button"
                      className="share-list-header-btn"
                      onClick={() => {
                        setIsShareListClosing(false);
                        setIsShareListOpen(true);
                      }}
                      title={`Share List (${listMembers.length} members)`}
                      aria-label={`Share List (${listMembers.length} members)`}
                    >
                      <Users size={18} strokeWidth={2.2} />
                      <span className="share-header-count">{listMembers.length}</span>
                    </button>
                  )}

                  {/* 3 Dots (...) Menu Icon - Removed from main page (My Day) as requested */}
                  {activeList !== 'my-day' && (
                    <button
                      type="button"
                      className="icon-circle-btn"
                      onClick={() => {
                        setIsListOptionsClosing(false);
                        setIsListOptionsOpen(true);
                      }}
                      title="List Option"
                      aria-label="List Option"
                    >
                      <MoreHorizontal size={20} />
                    </button>
                  )}

                  {/* Search Tasks Option - Hidden on main screen (My Day) as requested */}
                  {activeList !== 'my-day' && (
                    <button
                      type="button"
                      className={`icon-circle-btn ${isTaskSearchOpen ? 'active' : ''}`}
                      onClick={handleToggleTaskSearch}
                      title={`Search in ${listTitle}`}
                      aria-label="Search tasks"
                    >
                      <Search size={19} />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Task Search Bar (toggled on Search click, hidden on My Day) */}
          {isTaskSearchOpen && activeList !== 'my-day' && (
            <div className="myday-search-bar-wrap">
              <Search size={16} color="#94a3b8" />
              <input
                ref={taskSearchInputRef}
                type="text"
                placeholder={`Search in ${listTitle}...`}
                value={taskSearchQuery}
                onChange={(e) => setTaskSearchQuery(e.target.value)}
                onFocus={() => {
                  lastInputFocusTimeRef.current = Date.now();
                }}
                autoFocus
                className="myday-search-input"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck="false"
              />
              {taskSearchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setTaskSearchQuery('');
                    taskSearchInputRef.current?.focus();
                  }}
                  className="drawer-search-clear-btn"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
              <button
                type="button"
                className="search-cancel-btn"
                onClick={() => {
                  setIsTaskSearchOpen(false);
                  setTaskSearchQuery('');
                  taskSearchInputRef.current?.blur();
                }}
              >
                Cancel
              </button>
            </div>
          )}

          {/* ----------------------------------------------------
          2. Header Section: Title & Icon
          ---------------------------------------------------- */}
          <header className="myday-header">
            <div className="myday-header-title-row">
              {getPageIcon(activeList) && (
                <div className="myday-header-icon-wrap">
                  {getPageIcon(activeList)}
                </div>
              )}
              {isEditingTitle ? (
                <div className="title-edit-container">
                  <input
                    type="text"
                    className="title-edit-input"
                    style={{ color: getPageColor(activeList) }}
                    value={listTitle}
                    onChange={(e) => setListTitle(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setIsEditingTitle(false);
                    }}
                  />
                  <button
                    type="button"
                    className="title-save-btn"
                    onClick={() => setIsEditingTitle(false)}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <h1
                  className="myday-title"
                  style={{ color: getPageColor(activeList) }}
                >
                  {listTitle}
                </h1>
              )}
            </div>
            {getPageSubtitle(activeList) && (
              <div className="myday-date">
                <span>{getPageSubtitle(activeList)}</span>
              </div>
            )}
          </header>

          {/* ----------------------------------------------------
          3. Main Scrollable Tasks Content Area
          ---------------------------------------------------- */}
          <div
            ref={scrollAreaRef}
            className={`tasks-main-scroll-area ${isSuggestionsOpen ? 'scroll-locked' : ''}`}
          >
            {/* Dedicated empty state when no tasks exist on this page */}
            {activeTasks.length === 0 && completedTasks.length === 0 && !taskSearchQuery.trim() && (
              <div className="page-empty-state">
                {getPageIcon(activeList) && (
                  <div className="page-empty-icon-wrap">
                    {getPageIcon(activeList)}
                  </div>
                )}
                <h3
                  className="page-empty-title"
                  style={{ color: getPageColor(activeList) }}
                >
                  {activeList === 'planned' && 'No planned tasks'}
                  {activeList === 'starred' && 'No important tasks'}
                  {activeList === 'assigned' && 'No assigned tasks'}
                  {activeList === 'flagged' && 'No flagged tasks'}
                  {activeList === 'tasks' && 'No tasks yet'}
                  {activeList === 'my-day' && 'Focus on your day'}
                  {activeList !== 'my-day' && activeList !== 'starred' && activeList !== 'planned' && activeList !== 'assigned' && activeList !== 'flagged' && activeList !== 'tasks' && `No tasks in ${listTitle}`}
                </h3>
                <p className="page-empty-desc">
                  {activeList === 'planned' && 'Tasks with due dates or reminders will appear here.'}
                  {activeList === 'starred' && 'Tasks marked with a star will show up here.'}
                  {activeList === 'assigned' && 'Tasks assigned to you will show up here.'}
                  {activeList === 'flagged' && 'Tasks from flagged emails will show up here.'}
                  {activeList === 'tasks' && 'Add tasks below to keep track of what needs to be done.'}
                  {activeList === 'my-day' && 'Add a task below to get started, or check Suggestions.'}
                  {activeList !== 'my-day' && activeList !== 'starred' && activeList !== 'planned' && activeList !== 'assigned' && activeList !== 'flagged' && activeList !== 'tasks' && 'Add tasks below to this list.'}
                </p>
              </div>
            )}
            {taskSearchQuery.trim() && activeTasks.length === 0 && completedTasks.length === 0 && (
              <div className="search-empty-state">
                <Search size={32} color="#64748b" style={{ opacity: 0.6, marginBottom: '0.6rem' }} />
                <p className="mb-0 text-secondary" style={{ fontSize: '0.9rem' }}>
                  No tasks found matching &quot;{taskSearchQuery}&quot;
                </p>
              </div>
            )}
            {activeTasks.length > 0 && (
              <section className="tasks-section mb-3">
                <div className="tasks-list">
                  {activeTasks.map((task) => (
                    <SwipeableTaskItem
                      key={task.id}
                      task={task}
                      activeList={activeList}
                      toggleTaskComplete={toggleTaskComplete}
                      toggleTaskStar={toggleTaskStar}
                      deleteTask={deleteTask}
                      toggleTaskMyDay={toggleTaskMyDay}
                      isCompleting={completingTaskIds.has(task.id)}
                      isExiting={exitingTaskIds.has(task.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ----------------------------------------------------
          4. Completed Button
          Specific User Request: "ek completed ka button bnao jiska background black or text white hoga"
          ---------------------------------------------------- */}
            <section className="completed-section">
              <button
                type="button"
                className="completed-black-btn"
                onClick={() => setShowCompleted((prev) => !prev)}
                title="Toggle completed tasks"
                aria-expanded={showCompleted}
              >
                {/* Arrow shifted to left of Completed, numbers removed */}
                <ChevronDown
                  size={14}
                  className={`completed-chevron ${showCompleted ? 'open' : ''}`}
                />
                <span>Completed</span>
              </button>

              {/* ----------------------------------------------------
            5. Completed Tasks List
            User Request: "uske niche list hogi jo task complete ho chuke hain with tick or jo task ka naam dala tha usko cut krke dikhana hai or uske right me ek star bhi dikhao jisse pta chale starred h ya nhi"
            ---------------------------------------------------- */}
              {showCompleted && (
                <div className="completed-tasks-container">
                  {completedTasks.length === 0 ? (
                    <div className="empty-state">
                      <CheckCircle2 className="empty-state-icon" />
                      <p className="empty-state-text">No completed tasks yet. Finish a task to see it here!</p>
                    </div>
                  ) : (
                    completedTasks.map((task) => (
                      <SwipeableTaskItem
                        key={task.id}
                        task={task}
                        activeList={activeList}
                        toggleTaskComplete={toggleTaskComplete}
                        toggleTaskStar={toggleTaskStar}
                        deleteTask={deleteTask}
                        toggleTaskMyDay={toggleTaskMyDay}
                        isCompleting={false}
                        isExiting={false}
                      />
                    ))
                  )}
                </div>
              )}
            </section>
          </div>
        </div>

        {/* ----------------------------------------------------
          6. Bottom "Add a Task" Docked Bar & Expandable Form
          ---------------------------------------------------- */}
        {/* Click-outside backdrop when task input is active (only closes on actual outside click, not scroll) */}
        {isTaskInputActive && !taskSheet && (
          <div
            className="add-task-scrim"
            onClick={handleCloseTaskInput}
          />
        )}

        <div className={`add-task-docked-container ${isTaskInputActive ? 'active' : ''}`}>
          <div className="add-task-wrapper">
            <div
              className={`add-task-card ${isTaskInputActive ? 'active' : ''}`}
              onClick={(e) => {
                if (!isTaskInputActive) {
                  setIsTaskInputActive(true);
                  inputRef.current?.focus();
                }
              }}
            >
              {/* Top input row */}
              <div
                className="add-task-main-row"
                onClick={() => {
                  setIsTaskInputActive(true);
                  inputRef.current?.focus();
                }}
              >
                <button
                  type="button"
                  className="add-task-plus-icon"
                  style={{ color: getPageColor(activeList) }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsTaskInputActive(true);
                    inputRef.current?.focus();
                  }}
                  title="Add task"
                  aria-label="Add task"
                >
                  <Plus size={20} strokeWidth={2.4} />
                </button>

                <input
                  ref={inputRef}
                  type="text"
                  name="task_title_input"
                  id="task_title_input"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="sentences"
                  spellCheck="false"
                  data-lpignore="true"
                  data-form-type="other"
                  enterKeyHint="done"
                  className="add-task-input"
                  placeholder="Add a Task"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onFocus={() => {
                    setIsInputFocused(true);
                    setIsTaskInputActive(true);
                  }}
                  onBlur={() => setIsInputFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (isUserScrollingRef.current) return;
                      if (newTaskTitle.trim()) {
                        handleAddTask(false);
                      } else {
                        handleCloseTaskInput();
                      }
                    }
                  }}
                  aria-label="Add a Task"
                  style={{
                    color: isTaskInputActive ? '#ffffff' : getPageColor(activeList),
                    '--theme-color': getPageColor(activeList)
                  }}
                />
              </div>

              {/* Selected chips row & Toolbar (Matches Image 1) */}
              {isTaskInputActive && (() => {
                const currentEffectiveListName =
                  taskDraftList && taskDraftList !== 'none'
                    ? taskDraftList
                    : taskDraftList === 'none'
                      ? null
                      : activeList !== 'my-day' && activeList !== 'tasks' && activeList !== 'all'
                        ? listTitle
                        : null;
                const hasDraftList = Boolean(currentEffectiveListName);

                return (
                  <>
                    {(taskDraftReminder || taskDraftDue || taskDraftNote || hasDraftList) && (
                      <div className="add-task-chips-row">
                        {hasDraftList && (
                          <span
                            className="task-chip"
                            onClick={handleOpenListsFromTaskInput}
                          >
                            {currentEffectiveListName === 'Important' ? (
                              <Star size={13} color="#fb7185" fill="#fb7185" />
                            ) : currentEffectiveListName === 'Planned' ? (
                              <Calendar size={13} color="#2dd4bf" />
                            ) : currentEffectiveListName === 'Assigned to me' ? (
                              <User size={13} color="#34d399" />
                            ) : currentEffectiveListName === 'Flagged email' ? (
                              <Flag size={13} color="#fb923c" fill="#fb923c" />
                            ) : currentEffectiveListName === 'My Day' ? (
                              <Sun size={13} color="#f59e0b" />
                            ) : (
                              <HutCheckIcon size={13} />
                            )}
                            <span>{currentEffectiveListName}</span>
                            <X
                              size={12}
                              className="chip-remove"
                              onClick={(e) => {
                                e.stopPropagation();
                                setTaskDraftList('none');
                              }}
                            />
                          </span>
                        )}
                        {taskDraftDue && (
                          <span className="task-chip due" onClick={() => openTaskSheet('due')}>
                            <Calendar size={13} />
                            <span>{taskDraftDue.text}</span>
                            <X size={12} className="chip-remove" onClick={(e) => { e.stopPropagation(); setTaskDraftDue(null); }} />
                          </span>
                        )}
                        {taskDraftReminder && (
                          <span className="task-chip reminder" onClick={() => openTaskSheet('reminder')}>
                            <Bell size={13} />
                            <span>{taskDraftReminder.text}</span>
                            <X size={12} className="chip-remove" onClick={(e) => { e.stopPropagation(); setTaskDraftReminder(null); }} />
                          </span>
                        )}
                        {taskDraftNote && (
                          <span className="task-chip note" onClick={() => openTaskSheet('note')}>
                            <FileText size={13} />
                            <span>Note</span>
                            <X size={12} className="chip-remove" onClick={(e) => { e.stopPropagation(); setTaskDraftNote(''); }} />
                          </span>
                        )}
                      </div>
                    )}

                    {/* 4 Options Toolbar */}
                    <div className="add-task-toolbar">
                      <div className="add-task-actions-group">
                        {/* 1. Select a list: Hut with tick icon (Opens Lists Drawer) */}
                        <button
                          type="button"
                          className={`task-toolbar-btn ${hasDraftList ? 'selected' : ''}`}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={handleOpenListsFromTaskInput}
                          title="Select a list"
                          aria-label="Select a list"
                        >
                          <HutCheckIcon size={19} />
                        </button>

                        {/* 2. Reminder: Bell icon */}
                        <button
                          type="button"
                          className={`task-toolbar-btn ${taskDraftReminder ? 'selected' : ''}`}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openTaskSheet('reminder');
                          }}
                          title="Reminder"
                          aria-label="Reminder"
                        >
                          <Bell size={19} />
                        </button>

                        {/* 3. Due Date: Calendar icon */}
                        <button
                          type="button"
                          className={`task-toolbar-btn ${taskDraftDue ? 'selected' : ''}`}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openTaskSheet('due');
                          }}
                          title="Due date"
                          aria-label="Due date"
                        >
                          <Calendar size={19} />
                        </button>

                        {/* 4. Add Note: FileText icon */}
                        <button
                          type="button"
                          className={`task-toolbar-btn ${taskDraftNote ? 'selected' : ''}`}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openTaskSheet('note');
                          }}
                          title="Add note"
                          aria-label="Add note"
                        >
                          <FileText size={19} />
                        </button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------
          Task Options Bottom Sheets (Select a List, Reminder, Due, Note)
          ---------------------------------------------------- */}
        {taskSheet && (
          <>
            <div
              className={`bottom-sheet-backdrop ${isTaskSheetClosing ? 'closing' : ''}`}
              onClick={() => closeTaskSheet()}
            />
            <div
              className={`task-bottom-sheet ${isTaskSheetClosing ? 'closing' : ''}`}
              role="dialog"
              aria-modal="true"
            >
              <div className="sheet-drag-handle" />

              {/* 1. Select a List Sheet (Opens smoothly from bottom) */}
              {taskSheet === 'selectList' && (
                <div className="sheet-view-content">
                  <div className="sheet-top-bar">
                    <button
                      type="button"
                      className="sheet-text-btn cancel"
                      onClick={() => closeTaskSheet()}
                    >
                      Cancel
                    </button>
                    <h3 className="sheet-center-title">Select a List</h3>
                    <div style={{ width: 50 }} />
                  </div>

                  <div className="sheet-options-list">
                    {/* System Lists (Upper Section, matching main Lists Drawer) */}
                    {SYSTEM_LISTS.map((sItem) => {
                      const sTitle = getSafeListName(sItem.title);
                      const currentDraft = getSafeListName(taskDraftList) || 'Tasks';
                      const isSelected =
                        currentDraft === sTitle ||
                        (sItem.id === 'tasks' && currentDraft === 'Tasks');
                      return (
                        <button
                          key={sItem.id}
                          type="button"
                          className={`sheet-option-row ${isSelected ? 'selected' : ''}`}
                          onClick={() => {
                            setTaskDraftList(sTitle);
                            closeTaskSheet();
                          }}
                        >
                          <div className="sheet-option-left">
                            <div className="sheet-option-icon-wrap">
                              {renderSystemIcon(sItem.icon, sItem.color)}
                            </div>
                            <span className="sheet-option-label">{sTitle}</span>
                          </div>
                          {isSelected && <Check size={18} color="var(--accent-primary)" />}
                        </button>
                      );
                    })}

                    {/* Horizontal Divider (matching main Lists Drawer) */}
                    <div className="sheet-list-divider" />

                    {/* Custom Lists (Lower Section, matching main Lists Drawer) */}
                    {customLists.map((item, idx) => {
                      const listName = getSafeListName(item);
                      if (!listName) return null;
                      const listId = (item && typeof item === 'object' && typeof item.id === 'string')
                        ? item.id
                        : 'cl-' + idx;
                      const listEmoji = getSafeListEmoji(item);
                      const currentDraft = getSafeListName(taskDraftList) || 'Tasks';
                      const isSelected = currentDraft === listName;
                      return (
                        <button
                          key={listId}
                          type="button"
                          className={`sheet-option-row ${isSelected ? 'selected' : ''}`}
                          onClick={() => {
                            setTaskDraftList(listName);
                            closeTaskSheet();
                          }}
                        >
                          <div className="sheet-option-left">
                            <div className="sheet-option-icon-wrap">
                              {listEmoji ? (
                                <span style={{ fontSize: '1.15rem' }}>{listEmoji}</span>
                              ) : (
                                <ListTodo size={19} color="#38bdf8" />
                              )}
                            </div>
                            <span className="sheet-option-label">{listName}</span>
                          </div>
                          {isSelected && <Check size={18} color="var(--accent-primary)" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Inline creator for new custom list */}
                  <div className="new-list-creator-row">
                    <input
                      type="text"
                      className="new-list-input"
                      placeholder="Create new list..."
                      value={newCustomListName}
                      onChange={(e) => setNewCustomListName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const n = newCustomListName.trim();
                          if (n) {
                            const exists = customLists.some(
                              (cl) => (typeof cl === 'string' ? cl : cl?.name || '').toLowerCase() === n.toLowerCase()
                            );
                            if (!exists) {
                              const newList = {
                                id: 'cl-' + Date.now(),
                                name: n,
                                shared: false,
                                count: 0
                              };
                              const updated = [...customLists, newList];
                              setCustomLists(updated);
                              try {
                                localStorage.setItem('myday_custom_lists_v4', JSON.stringify(updated));
                              } catch { }
                            }
                            setTaskDraftList(n);
                            setNewCustomListName('');
                            closeTaskSheet();
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="new-list-add-btn"
                      onClick={() => {
                        const n = newCustomListName.trim();
                        if (n) {
                          const exists = customLists.some(
                            (cl) => getSafeListName(cl).toLowerCase() === n.toLowerCase()
                          );
                          if (!exists) {
                            const newList = {
                              id: 'cl-' + Date.now(),
                              name: n,
                              shared: false,
                              count: 0
                            };
                            const updated = [...customLists, newList];
                            setCustomLists(updated);
                            try {
                              localStorage.setItem('myday_custom_lists_v4', JSON.stringify(updated));
                            } catch { }
                          }
                          setTaskDraftList(n);
                          setNewCustomListName('');
                          closeTaskSheet();
                        }
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              {/* 2. Reminder Sheet */}
              {taskSheet === 'reminder' && (
                <>
                  {reminderSubView === 'main' && (
                    <div className="sheet-view-slide">
                      <div className="sheet-top-bar">
                        <div style={{ width: 44 }} />
                        <h3 className="sheet-center-title">Reminder</h3>
                        <button
                          type="button"
                          className="sheet-text-btn done"
                          onClick={() => closeTaskSheet()}
                        >
                          Done
                        </button>
                      </div>

                      <div className="sheet-options-list">
                        <button
                          type="button"
                          className="sheet-option-row"
                          onClick={() => {
                            setTaskDraftReminder({ text: 'Later Today (6:00 PM)', time: '6:00 PM' });
                            closeTaskSheet();
                          }}
                        >
                          <div className="sheet-option-left">
                            <div className="sheet-option-icon-wrap">
                              <Clock size={19} color="#38bdf8" />
                            </div>
                            <span className="sheet-option-label">Later Today</span>
                          </div>
                          <span className="sheet-option-right">Today, 6:00 PM</span>
                        </button>

                        <button
                          type="button"
                          className="sheet-option-row"
                          onClick={() => {
                            setTaskDraftReminder({ text: `Tomorrow (${getRelativeDayName(1)}, 9:00 AM)`, time: '9:00 AM' });
                            closeTaskSheet();
                          }}
                        >
                          <div className="sheet-option-left">
                            <div className="sheet-option-icon-wrap">
                              <Sunrise size={19} color="#fbbf24" />
                            </div>
                            <span className="sheet-option-label">Tomorrow</span>
                          </div>
                          <span className="sheet-option-right">{getRelativeDayName(1)}, 9:00 AM</span>
                        </button>

                        <button
                          type="button"
                          className="sheet-option-row"
                          onClick={() => {
                            setTaskDraftReminder({ text: `Next Week (${getNextWeekMondayInfo()}, 9:00 AM)`, time: '9:00 AM' });
                            closeTaskSheet();
                          }}
                        >
                          <div className="sheet-option-left">
                            <div className="sheet-option-icon-wrap">
                              <CalendarDays size={19} color="#a855f7" />
                            </div>
                            <span className="sheet-option-label">Next Week</span>
                          </div>
                          <span className="sheet-option-right">{getNextWeekMondayInfo()}, 9:00 AM</span>
                        </button>

                        <button
                          type="button"
                          className="sheet-option-row"
                          onClick={() => setReminderSubView('calendar')}
                        >
                          <div className="sheet-option-left">
                            <div className="sheet-option-icon-wrap">
                              <Calendar size={19} color="#94a3b8" />
                            </div>
                            <span className="sheet-option-label">Pick a date & time</span>
                          </div>
                          <div className="sheet-option-right">
                            <ChevronRight size={18} />
                          </div>
                        </button>
                      </div>
                    </div>
                  )}

                  {reminderSubView === 'calendar' && (
                    <div className="sheet-view-slide">
                      <div className="sheet-top-bar">
                        <button
                          type="button"
                          className="sheet-back-btn"
                          onClick={() => setReminderSubView('main')}
                        >
                          <ChevronLeft size={20} /> Back
                        </button>
                        <h3 className="sheet-center-title">Pick a Date & Time</h3>
                        <button
                          type="button"
                          className="sheet-text-btn done"
                          onClick={() => {
                            setTaskDraftReminder({
                              text: `${formatShortDate(selectedCalendarDate)}, ${selectedReminderTime}`,
                              time: selectedReminderTime
                            });
                            closeTaskSheet();
                          }}
                        >
                          Done
                        </button>
                      </div>

                      <InteractiveCalendar
                        selectedDate={selectedCalendarDate}
                        onSelectDate={(d) => setSelectedCalendarDate(d)}
                      />

                      {/* Choose time card */}
                      <div
                        className="choose-time-card"
                        onClick={() => setReminderSubView('time')}
                      >
                        <div className="choose-time-card-left">
                          <Clock size={18} color="#38bdf8" />
                          <span>Choose time</span>
                        </div>
                        <div className="choose-time-card-right">
                          <span className="time-display-pill">{selectedReminderTime}</span>
                          <ChevronRight size={18} />
                        </div>
                      </div>
                    </div>
                  )}

                  {reminderSubView === 'time' && (
                    <div className="sheet-view-slide">
                      <div className="sheet-top-bar">
                        <button
                          type="button"
                          className="sheet-back-btn"
                          onClick={() => setReminderSubView('calendar')}
                        >
                          <ChevronLeft size={20} /> Back
                        </button>
                        <h3 className="sheet-center-title">Choose time</h3>
                        <button
                          type="button"
                          className="sheet-text-btn set"
                          onClick={() => setReminderSubView('calendar')}
                        >
                          Set
                        </button>
                      </div>

                      <InteractiveTimePicker
                        selectedTime={selectedReminderTime}
                        onSelectTime={(t) => setSelectedReminderTime(t)}
                      />
                    </div>
                  )}
                </>
              )}

              {/* 3. Due Date Sheet */}
              {taskSheet === 'due' && (
                <>
                  {dueSubView === 'main' && (
                    <div className="sheet-view-slide">
                      <div className="sheet-top-bar">
                        <div style={{ width: 44 }} />
                        <h3 className="sheet-center-title">Due</h3>
                        <button
                          type="button"
                          className="sheet-text-btn done"
                          onClick={() => closeTaskSheet()}
                        >
                          Done
                        </button>
                      </div>

                      <div className="sheet-options-list">
                        <button
                          type="button"
                          className="sheet-option-row"
                          onClick={() => {
                            setTaskDraftDue({ text: `Today (${getRelativeDayName(0)})` });
                            closeTaskSheet();
                          }}
                        >
                          <div className="sheet-option-left">
                            <div className="sheet-option-icon-wrap">
                              <Calendar size={19} color="#38bdf8" />
                            </div>
                            <span className="sheet-option-label">Today</span>
                          </div>
                          <span className="sheet-option-right">{getRelativeDayName(0)}</span>
                        </button>

                        <button
                          type="button"
                          className="sheet-option-row"
                          onClick={() => {
                            setTaskDraftDue({ text: `Tomorrow (${getRelativeDayName(1)})` });
                            closeTaskSheet();
                          }}
                        >
                          <div className="sheet-option-left">
                            <div className="sheet-option-icon-wrap">
                              <Sunrise size={19} color="#fbbf24" />
                            </div>
                            <span className="sheet-option-label">Tomorrow</span>
                          </div>
                          <span className="sheet-option-right">{getRelativeDayName(1)}</span>
                        </button>

                        <button
                          type="button"
                          className="sheet-option-row"
                          onClick={() => {
                            setTaskDraftDue({ text: `Next Week (${getNextWeekMondayInfo()})` });
                            closeTaskSheet();
                          }}
                        >
                          <div className="sheet-option-left">
                            <div className="sheet-option-icon-wrap">
                              <CalendarDays size={19} color="#a855f7" />
                            </div>
                            <span className="sheet-option-label">Next Week</span>
                          </div>
                          <span className="sheet-option-right">{getNextWeekMondayInfo()}</span>
                        </button>

                        <button
                          type="button"
                          className="sheet-option-row"
                          onClick={() => setDueSubView('calendar')}
                        >
                          <div className="sheet-option-left">
                            <div className="sheet-option-icon-wrap">
                              <Calendar size={19} color="#94a3b8" />
                            </div>
                            <span className="sheet-option-label">Pick a date</span>
                          </div>
                          <div className="sheet-option-right">
                            <ChevronRight size={18} />
                          </div>
                        </button>
                      </div>
                    </div>
                  )}

                  {dueSubView === 'calendar' && (
                    <div className="sheet-view-slide">
                      <div className="sheet-top-bar">
                        <button
                          type="button"
                          className="sheet-back-btn"
                          onClick={() => setDueSubView('main')}
                        >
                          <ChevronLeft size={20} /> Back
                        </button>
                        <h3 className="sheet-center-title">Pick a Date</h3>
                        <button
                          type="button"
                          className="sheet-text-btn done"
                          onClick={() => {
                            setTaskDraftDue({ text: formatShortDate(selectedCalendarDate) });
                            closeTaskSheet();
                          }}
                        >
                          Done
                        </button>
                      </div>

                      <InteractiveCalendar
                        selectedDate={selectedCalendarDate}
                        onSelectDate={(d) => {
                          setSelectedCalendarDate(d);
                        }}
                      />
                    </div>
                  )}
                </>
              )}

              {/* 4. Add Note Sheet */}
              {taskSheet === 'note' && (
                <div className="sheet-view-slide">
                  <div className="sheet-top-bar">
                    <button
                      type="button"
                      className="sheet-text-btn cancel"
                      onClick={() => closeTaskSheet()}
                    >
                      Cancel
                    </button>
                    <h3 className="sheet-center-title">Add Note</h3>
                    <button
                      type="button"
                      className="sheet-text-btn done"
                      onClick={() => closeTaskSheet()}
                    >
                      Done
                    </button>
                  </div>

                  <textarea
                    autoFocus
                    className="sheet-note-textarea"
                    placeholder="Add note or details..."
                    value={taskDraftNote}
                    onChange={(e) => setTaskDraftNote(e.target.value)}
                  />
                </div>
              )}
            </div>
          </>
        )}

        {/* ----------------------------------------------------
          7. List Option Bottom Sheet
          User Request:
          - "sbse right me 3 dots(...) lga do jiske click pe ek list option khulega niche side se"
          - "jiska background greyish black hoga or uska text creemy white hoga"
          - "center me 'List Option' hoga or uske right corner pe 'Done' hoga blue color text me"
          - "left me options honge jisme:
             1. ek 'pencil icon ke sath Edit' text hoga,
             2. usse niche '3 dots 3alignment line or uper se niche arrow jaisa dikhne wala ek icon ke sath me Sort text' hoga,
             3. usse niche change theme ke icon ke sath Change Theme' text hoga,
             4. uske niche 'Printer symbol ke sath Print List' text hoga,
             5. last me 'send symbol ke sath Send a copy ' text hoga."
          ---------------------------------------------------- */}
        {isListOptionsOpen && (
          <>
            <div
              className={`bottom-sheet-backdrop ${isListOptionsClosing ? 'closing' : ''}`}
              onClick={() => closeListOptions()}
            />
            <div
              className={`list-options-sheet ${isListOptionsClosing ? 'closing' : ''}`}
              role="dialog"
              aria-modal="true"
              aria-label="List Option"
            >
              {/* Grab handle indicator */}
              <div className="sheet-drag-handle" />

              {/* Header: Center 'List Option', Right corner 'Done' in blue */}
              <div className="list-options-header">
                <div className="header-spacer" />
                <h3 className="list-options-title">List Option</h3>
                <button
                  type="button"
                  className="list-options-done-btn"
                  onClick={() => closeListOptions()}
                >
                  Done
                </button>
              </div>

              {/* Options list: left aligned */}
              <div className="list-options-menu">
                {/* Option 1: Edit with Pencil Icon */}
                <button
                  type="button"
                  className="list-option-item"
                  onClick={handleEditList}
                >
                  <div className="option-icon-wrap">
                    <Pencil size={19} />
                  </div>
                  <span className="option-text">Edit</span>
                </button>

                {/* Option 2: Sort (Original custom icon on left, right-side arrow instead of badge) */}
                <button
                  type="button"
                  className="list-option-item"
                  onClick={handleSortTasks}
                >
                  <div className="option-icon-wrap">
                    {/* Custom SVG: 3 dots, 3 alignment lines, top-to-bottom arrow */}
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="4" cy="6" r="1.3" fill="currentColor" />
                      <line x1="8" y1="6" x2="14" y2="6" />
                      <circle cx="4" cy="12" r="1.3" fill="currentColor" />
                      <line x1="8" y1="12" x2="13" y2="12" />
                      <circle cx="4" cy="18" r="1.3" fill="currentColor" />
                      <line x1="8" y1="18" x2="11" y2="18" />
                      <line x1="19" y1="5" x2="19" y2="19" />
                      <polyline points="16 16 19 19 22 16" />
                    </svg>
                  </div>
                  <span className="option-text">Sort</span>
                  <ChevronRight size={18} strokeWidth={1.8} className="option-right-arrow" />
                </button>

                {/* Option 3: Change Theme (Palette on left, right-side arrow instead of light button) */}
                <button
                  type="button"
                  className="list-option-item"
                  onClick={() => {
                    toggleTheme();
                  }}
                >
                  <div className="option-icon-wrap">
                    <Palette size={19} />
                  </div>
                  <span className="option-text">Change Theme</span>
                  <ChevronRight size={18} strokeWidth={1.8} className="option-right-arrow" />
                </button>

                {/* Option 4: Print List with Printer Symbol */}
                <button
                  type="button"
                  className="list-option-item"
                  onClick={handlePrintList}
                >
                  <div className="option-icon-wrap">
                    <Printer size={19} />
                  </div>
                  <span className="option-text">Print List</span>
                </button>

                {/* Option 5: Sharing options (Hidden on My Day list) */}
                {activeList !== 'my-day' && (
                  <button
                    type="button"
                    className="list-option-item"
                    onClick={() => {
                      closeListOptions();
                      setTimeout(() => {
                        setIsShareListClosing(false);
                        setIsShareListOpen(true);
                      }, 200);
                    }}
                  >
                    <div className="option-icon-wrap">
                      <Users size={19} />
                    </div>
                    <span className="option-text">Sharing options</span>
                    <ChevronRight size={18} strokeWidth={1.8} className="option-right-arrow" />
                  </button>
                )}

                {/* Option 6: Send a copy with Share icon (square with upward arrow) */}
                <button
                  type="button"
                  className="list-option-item"
                  onClick={handleSendCopy}
                >
                  <div className="option-icon-wrap">
                    <Share size={19} />
                  </div>
                  <span className="option-text">Send a copy</span>
                </button>

                {/* Option 7: Delete list (Shown only for custom user-created lists) */}
                {activeList !== 'my-day' && activeList !== 'starred' && activeList !== 'planned' && activeList !== 'assigned' && activeList !== 'flagged' && activeList !== 'tasks' && (
                  <button
                    type="button"
                    className="list-option-item delete-list-btn"
                    onClick={() => {
                      closeListOptions();
                      handleDeleteCustomList(activeList);
                    }}
                    style={{ color: '#ef4444' }}
                  >
                    <div className="option-icon-wrap" style={{ color: '#ef4444' }}>
                      <Trash2 size={19} />
                    </div>
                    <span className="option-text" style={{ color: '#ef4444' }}>Delete list</span>
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {/* ----------------------------------------------------
          Share List Bottom Sheet (Exact Match to User Screenshot)
          ---------------------------------------------------- */}
        {isShareListOpen && (
          <>
            <div
              className={`bottom-sheet-backdrop ${isShareListClosing ? 'closing' : ''}`}
              onClick={closeShareList}
            />
            <div
              className={`share-list-sheet ${isShareListClosing ? 'closing' : ''}`}
              role="dialog"
              aria-modal="true"
              aria-label="Share List"
            >
              {/* Grab handle indicator */}
              <div className="sheet-drag-handle" />

              {/* Header: Center 'Share List', Right corner 'Done' in blue */}
              <div className="share-list-header">
                <div className="header-spacer" />
                <h3 className="share-list-title">Share List</h3>
                <button
                  type="button"
                  className="share-list-done-btn"
                  onClick={closeShareList}
                >
                  Done
                </button>
              </div>

              {/* Content matching screenshot */}
              <div className="share-list-content">
                {/* Section Header: List members */}
                <div className="share-section-label">List members</div>

                {/* Members List */}
                <div className="share-members-list">
                  {listMembers.map((member) => (
                    <div key={member.id} className="share-member-item">
                      <div
                        className="share-member-avatar"
                        style={{ backgroundColor: member.color }}
                      >
                        {member.initials}
                      </div>
                      <div className="share-member-info">
                        <span className="share-member-name">{member.name}</span>
                      </div>
                      {member.role === 'Owner' && (
                        <span className="share-member-role">Owner</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Actions: Big White 'Invite via email' + Square White Share Icon Button */}
                <div className="share-action-buttons-row">
                  <button
                    type="button"
                    className="share-invite-btn"
                    onClick={() => setIsInvitingEmail((prev) => !prev)}
                  >
                    Invite via email
                  </button>
                  <button
                    type="button"
                    className="share-native-btn"
                    onClick={handleShareListLink}
                    title="Share invite link"
                    aria-label="Share invite link"
                  >
                    <Share size={20} strokeWidth={2.2} />
                  </button>
                </div>

                {/* Inline Email Invite Form */}
                {isInvitingEmail && (
                  <form
                    className="share-email-invite-form"
                    onSubmit={handleSendEmailInvite}
                  >
                    <input
                      type="email"
                      placeholder="Enter email to invite..."
                      value={inviteEmailInput}
                      onChange={(e) => setInviteEmailInput(e.target.value)}
                      className="share-email-input"
                      autoFocus
                      required
                    />
                    <button type="submit" className="share-email-send-btn">
                      Send
                    </button>
                  </form>
                )}

                {/* Description text matching screenshot */}
                <p className="share-list-disclaimer">
                  Anyone with this link and a Microsoft account can join and edit this list.
                </p>

                {/* Red destructive "Leave list" button */}
                <button
                  type="button"
                  className="share-leave-list-btn"
                  onClick={handleLeaveList}
                >
                  Leave list
                </button>
              </div>
            </div>
          </>
        )}

        {/* ----------------------------------------------------
          Share Options Modal: WhatsApp, Instagram, Messages, Email, Copy Link
          User Request: "iske click pe options me ana chahiye whatsapp instagram msg etc."
          ---------------------------------------------------- */}
        {isShareAppsOpen && (
          <>
            <div
              className={`bottom-sheet-backdrop ${isShareAppsClosing ? 'closing' : ''}`}
              style={{ zIndex: 185 }}
              onClick={closeShareAppsSheet}
            />
            <div
              className={`share-apps-sheet ${isShareAppsClosing ? 'closing' : ''}`}
              role="dialog"
              aria-modal="true"
              aria-label="Share via Apps"
            >
              <div className="sheet-drag-handle" />

              <div className="share-apps-header">
                <div className="share-apps-title-wrap">
                  <h3 className="share-apps-title">Share &quot;{listTitle}&quot;</h3>
                  <p className="share-apps-subtitle">Send invite link via your favorite app</p>
                </div>
                <button
                  type="button"
                  className="share-apps-close-btn"
                  onClick={closeShareAppsSheet}
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Grid of Apps: WhatsApp, Instagram, Messages, Email */}
              <div className="share-apps-grid">
                {/* 1. WhatsApp */}
                <button
                  type="button"
                  className="share-app-item"
                  onClick={handleShareWhatsApp}
                  title="Share on WhatsApp"
                >
                  <div className="share-app-icon-wrap whatsapp">
                    <WhatsAppIcon size={28} />
                  </div>
                  <span className="share-app-label">WhatsApp</span>
                </button>

                {/* 2. Instagram */}
                <button
                  type="button"
                  className="share-app-item"
                  onClick={handleShareInstagram}
                  title="Share on Instagram"
                >
                  <div className="share-app-icon-wrap instagram">
                    <InstagramIcon size={28} />
                  </div>
                  <span className="share-app-label">Instagram</span>
                </button>

                {/* 3. Messages / SMS */}
                <button
                  type="button"
                  className="share-app-item"
                  onClick={handleShareSMS}
                  title="Share via Messages / SMS"
                >
                  <div className="share-app-icon-wrap messages">
                    <MessageSquare size={26} strokeWidth={2.4} />
                  </div>
                  <span className="share-app-label">Messages</span>
                </button>

                {/* 4. Email */}
                <button
                  type="button"
                  className="share-app-item"
                  onClick={handleShareEmailApp}
                  title="Share via Email"
                >
                  <div className="share-app-icon-wrap email">
                    <Mail size={26} strokeWidth={2.2} />
                  </div>
                  <span className="share-app-label">Email</span>
                </button>
              </div>

              {/* Quick Link Preview & One-Tap Copy */}
              <div className="share-link-preview-box">
                <div className="share-link-info">
                  <span className="share-link-url-text">{getShareListUrl()}</span>
                </div>
                <button
                  type="button"
                  className="share-link-copy-btn"
                  onClick={handleCopyLinkOnly}
                  title="Copy link"
                >
                  <Copy size={16} />
                  <span>Copy</span>
                </button>
              </div>

              {/* More / System Share button if available */}
              {typeof navigator !== 'undefined' && navigator.share && (
                <button
                  type="button"
                  className="share-system-more-btn"
                  onClick={handleNativeSystemShare}
                >
                  <Share2 size={18} />
                  <span>More Sharing Options...</span>
                </button>
              )}

              {/* Cancel Button */}
              <button
                type="button"
                className="share-apps-cancel-btn"
                onClick={closeShareAppsSheet}
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {/* ----------------------------------------------------
          8. Suggestions Bottom Sheet (Regular Purchases)
          User Request: "or list ke right side me suggetion ka ek bulb type symbol lga do jiske click pe vo sabhi items ki list show hogi jo bhi hum regularly purchase krte hain"
          ---------------------------------------------------- */}
        {isSuggestionsOpen && (
          <>
            <div
              className={`bottom-sheet-backdrop ${isSuggestionsClosing ? 'closing' : ''}`}
              onClick={closeSuggestions}
              onTouchStart={(e) => {
                e.stopPropagation();
                if (e.cancelable) e.preventDefault();
              }}
              onTouchMove={(e) => {
                e.stopPropagation();
                if (e.cancelable) e.preventDefault();
              }}
            />
            <div
              ref={suggestionSheetRef}
              className={`suggestions-sheet ${isSuggestionsClosing ? 'closing' : ''}`}
              role="dialog"
              aria-modal="true"
              aria-label="Regular Purchases"
              onTouchStart={(e) => e.stopPropagation()}
            >
              {/* Notch Drag Area (Drag down to dismiss) */}
              <div
                className="suggestions-notch-zone"
                onTouchStart={handleSuggestionTouchStart}
                onTouchMove={handleSuggestionTouchMove}
                onTouchEnd={handleSuggestionTouchEnd}
                onTouchCancel={handleSuggestionTouchEnd}
                onMouseDown={handleSuggestionMouseDown}
              >
                <div className="sheet-drag-handle" />
              </div>

              <div
                className="suggestions-header"
                onTouchStart={handleSuggestionTouchStart}
                onTouchMove={handleSuggestionTouchMove}
                onTouchEnd={handleSuggestionTouchEnd}
                onTouchCancel={handleSuggestionTouchEnd}
                onMouseDown={handleSuggestionMouseDown}
              >
                <div className="suggestions-title-group">
                  <Lightbulb size={21} color="#fbbf24" fill="#fbbf24" />
                  <div>
                    <h3 className="suggestions-title">Regular Purchases</h3>
                    <p className="suggestions-subtitle">Quickly add items you regularly buy to My Day</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="suggestions-done-btn"
                  onClick={closeSuggestions}
                >
                  Done
                </button>
              </div>

              <div
                ref={suggestionsListRef}
                className="suggestions-list"
                onTouchStart={handleSuggestionListTouchStart}
                onTouchMove={handleSuggestionListTouchMove}
                onTouchEnd={handleSuggestionTouchEnd}
                onTouchCancel={handleSuggestionTouchEnd}
              >
                {REGULAR_PURCHASES.map((item) => {
                  const isAdded = tasks.some(
                    (t) => t.title.toLowerCase() === item.title.toLowerCase() && !t.completed
                  );
                  return (
                    <div key={item.id} className="suggestion-card">
                      <div className="suggestion-info">
                        <span className="suggestion-emoji">{item.emoji}</span>
                        <div>
                          <div className="suggestion-name">{item.title}</div>
                          <span className="suggestion-category">{item.category}</span>
                        </div>
                      </div>
                      {isAdded ? (
                        <div className="suggestion-added-group">
                          <span className="suggestion-added-badge">
                            <Check size={13} strokeWidth={3} /> Added
                          </span>
                          <button
                            type="button"
                            className="suggestion-undo-btn"
                            onClick={() => handleUndoSuggestion(item)}
                            title={`Undo / Remove ${item.title}`}
                            aria-label={`Undo adding ${item.title}`}
                          >
                            <RotateCcw size={12} strokeWidth={2.4} /> Undo
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="suggestion-add-btn"
                          onClick={() => handleAddSuggestion(item)}
                          title={`Add ${item.title}`}
                          aria-label={`Add ${item.title}`}
                        >
                          <Plus size={24} strokeWidth={2.4} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ----------------------------------------------------
          Download / Install App Bottom Sheet / Modal
          User Request: "mobile me download ka option do or jb download ho jaye to application ki tarah icon bnke dikhe screen pe."
          ---------------------------------------------------- */}
        {isInstallModalOpen && (
          <>
            <div
              className="bottom-sheet-backdrop"
              onClick={() => setIsInstallModalOpen(false)}
            />
            <div
              className="install-app-sheet"
              role="dialog"
              aria-modal="true"
              aria-label="Download My Day App"
            >
              <div className="sheet-drag-handle" />

              <div className="install-app-header">
                <div className="install-app-brand">
                  <img
                    src="/pwa-192x192.png"
                    alt="My Day App Icon"
                    className="install-app-icon-preview"
                  />
                  <div>
                    <h3 className="install-app-title">My Day App</h3>
                    <span className="install-app-badge">Installable Application</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="install-modal-close-btn"
                  onClick={() => setIsInstallModalOpen(false)}
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="install-app-body">
                <div className="install-icon-showcase">
                  <div className="home-screen-preview-card">
                    <div className="phone-mockup-icon-wrapper">
                      <img
                        src="/pwa-192x192.png"
                        alt="Home screen icon"
                        className="home-screen-app-icon"
                      />
                      <span className="home-screen-app-label">My Day</span>
                    </div>
                    <p className="home-screen-preview-note">
                      After downloading, the app icon will appear directly on your home screen! 📲
                    </p>
                  </div>
                </div>

                {deferredPrompt ? (
                  <div className="install-direct-action">
                    <button
                      type="button"
                      className="install-primary-submit-btn"
                      onClick={async () => {
                        try {
                          deferredPrompt.prompt();
                          const { outcome } = await deferredPrompt.userChoice;
                          if (outcome === 'accepted') {
                            showToast('Installing My Day... app icon added to your screen! 📲');
                            confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
                            setDeferredPrompt(null);
                            setIsInstallModalOpen(false);
                          }
                        } catch (err) {
                          console.error('Install error:', err);
                        }
                      }}
                    >
                      <Download size={18} strokeWidth={2.4} />
                      <span>Download / Install Now</span>
                    </button>
                    <p className="install-subtitle-hint">Installs directly to your home screen in 1 tap</p>
                  </div>
                ) : (
                  <div className="install-steps-container">
                    <h4 className="install-steps-heading">How to Install on Mobile:</h4>

                    <div className="install-step-card">
                      <div className="install-step-badge">📱 Android (Chrome)</div>
                      <ol className="install-step-list">
                        <li>Tap the <strong>three dots menu (⋮)</strong> at the top right of Chrome.</li>
                        <li>Select <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong> (📲).</li>
                        <li>Tap <strong>&quot;Install&quot;</strong> — the app icon will be added to your home screen!</li>
                      </ol>
                    </div>

                    <div className="install-step-card">
                      <div className="install-step-badge">🍎 iPhone / iPad (Safari)</div>
                      <ol className="install-step-list">
                        <li>Tap the <strong>Share button</strong> (⎋) at the bottom of Safari.</li>
                        <li>Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong> (➕).</li>
                        <li>Tap <strong>&quot;Add&quot;</strong> at the top right — the app icon will appear on your screen!</li>
                      </ol>
                    </div>
                  </div>
                )}
              </div>

              <div className="install-app-footer">
                <button
                  type="button"
                  className="install-got-it-btn"
                  onClick={() => setIsInstallModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}

      </div>

      {/* ----------------------------------------------------
          9. Full-Screen Lists Page (Modern Black Aesthetic)
          ---------------------------------------------------- */}
      {/* ----------------------------------------------------
          9. Full-Screen Lists Page (Microsoft To Do style)
          ---------------------------------------------------- */}
      {isDrawerOpen && (
        <aside
          className={`lists-drawer ${isDrawerClosing ? 'closing' : ''}`}
          style={{
            transform: `translateY(${isRefreshing ? 54 : pullDistance}px)`,
            transition: isPulling
              ? 'none'
              : isDrawerClosing ? undefined
                : 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)'
          }}
          onTouchStart={(e) => {
            drawerTouchStartX.current = e.touches[0].clientX;
            drawerTouchStartY.current = e.touches[0].clientY;
          }}
          onTouchEnd={(e) => {
            const diffX = e.changedTouches[0].clientX - drawerTouchStartX.current;
            const diffY = Math.abs(e.changedTouches[0].clientY - drawerTouchStartY.current);
            if (diffX < -50 && Math.abs(diffX) > diffY) {
              closeDrawer();
            }
          }}
        >

          {/* Header matching screenshot: Teal P avatar, email ID, search button, close button */}
          <div className="drawer-header">
            <div className="drawer-account-box">
              <div className="drawer-account-avatar">
                {userEmail.trim() ? userEmail.trim().charAt(0).toUpperCase() : 'P'}
              </div>
              <span className="drawer-account-email-title">{userEmail}</span>
            </div>
            <div className="drawer-header-actions">
              <button
                type="button"
                className="drawer-icon-btn"
                onClick={handleToggleDrawerSearch}
                title="Search lists"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              <button
                type="button"
                className="drawer-icon-btn"
                onClick={() => closeDrawer()}
                title="Close Lists"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Search Bar Input (toggled on Search click) */}
          {isDrawerSearchOpen && (
            <div className="drawer-search-bar-wrap">
              <Search size={16} color="#94a3b8" />
              <input
                ref={drawerSearchInputRef}
                type="text"
                placeholder="Search lists..."
                value={drawerSearchQuery}
                onChange={(e) => setDrawerSearchQuery(e.target.value)}
                onFocus={() => {
                  lastInputFocusTimeRef.current = Date.now();
                }}
                autoFocus
                className="drawer-search-input"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck="false"
              />
              {drawerSearchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setDrawerSearchQuery('');
                    drawerSearchInputRef.current?.focus();
                  }}
                  className="drawer-search-clear-btn"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          )}

          {/* Scrollable list container */}
          <div
            className="drawer-scroll-content"
          >
            {/* Upper Section: Manual System Options (Above the underline) */}
            <div className="drawer-section system-lists">
              {filteredSystemLists.map((item) => {
                const count = getSystemListCount(item.id);
                const isActive = activeList === item.id;
                return (
                  <div
                    key={item.id}
                    className={`drawer-list-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleSelectList(item.id, item.title)}
                  >
                    <div className="drawer-item-left">
                      {renderSystemIcon(item.icon, item.color)}
                      <span className="drawer-item-title">{item.title}</span>
                    </div>
                    {count !== '' && count !== 0 && (
                      <span className="drawer-item-count">{count}</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* The Horizontal Underline Divider */}
            <div className="drawer-divider" />

            {/* Lower Section: User Created Custom Lists (Below the underline) */}
            <div className="drawer-section custom-lists">
              {filteredCustomLists.map((item, idx) => {
                const listName = getSafeListName(item);
                if (!listName) return null;
                const listId = (item && typeof item === 'object' && typeof item.id === 'string')
                  ? item.id
                  : 'cl-' + idx;
                const listEmoji = getSafeListEmoji(item);
                const isShared = item && typeof item === 'object' ? Boolean(item.shared) : false;
                const count = getCustomListCount(item);
                const isActive = activeList === listId || listTitle === listName;
                return (
                  <div
                    key={listId}
                    className={`drawer-list-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleSelectList(listId, listName)}
                  >
                    <div className="drawer-item-left">
                      {listEmoji ? (
                        <span className="drawer-item-emoji">{listEmoji}</span>
                      ) : (
                        <List size={21} color="#818cf8" strokeWidth={1.9} />
                      )}
                      <span className="drawer-item-title">{listName}</span>
                      {isShared && (
                        <Users size={16} color="#94a3b8" className="drawer-shared-icon" />
                      )}
                    </div>
                    {count !== '' && count !== 0 && (
                      <span className="drawer-item-count">{count}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Bar: + New List and Group Icon */}
          <div className="drawer-bottom-bar">
            {isCreatingList ? (
              <form onSubmit={handleCreateCustomList} className="new-list-inline-form">
                <Plus size={22} color="#38bdf8" />
                <input
                  type="text"
                  placeholder="New list"
                  value={newListNameInput}
                  onChange={(e) => setNewListNameInput(e.target.value)}
                  onBlur={() => {
                    if (newListNameInput.trim()) {
                      handleCreateCustomList();
                    } else {
                      setIsCreatingList(false);
                    }
                  }}
                  autoFocus
                  className="new-list-inline-input"
                />
              </form>
            ) : (
              <div className="new-list-row">
                <button
                  type="button"
                  className="new-list-action-btn"
                  onClick={() => setIsCreatingList(true)}
                >
                  <Plus size={22} color="#ffffff" strokeWidth={2} />
                  <span>New List</span>
                </button>
                <button
                  type="button"
                  className="new-group-action-btn"
                  onClick={() => setIsCreatingList(true)}
                  title="Create new list / group"
                >
                  <FolderPlus size={22} color="#94a3b8" />
                </button>
              </div>
            )}
          </div>
        </aside>
      )}
    </>
  );
}
