export const CATEGORIES = [
  { id: 'work', label: 'Work', badgeClass: 'text-bg-primary' },
  { id: 'personal', label: 'Personal', badgeClass: 'text-bg-success' },
  { id: 'coding', label: 'Coding', badgeClass: 'badge-category-coding text-white' },
  { id: 'study', label: 'Study', badgeClass: 'badge-category-study text-white' },
  { id: 'health', label: 'Health', badgeClass: 'text-bg-warning' },
  { id: 'shopping', label: 'Shopping', badgeClass: 'text-bg-info' }
];

export const PRIORITIES = {
  high: { id: 'high', label: 'High Priority', badgeClass: 'text-bg-danger', icon: '🔥' },
  medium: { id: 'medium', label: 'Medium', badgeClass: 'text-bg-warning', icon: '⚡' },
  low: { id: 'low', label: 'Low', badgeClass: 'text-bg-success', icon: '🌿' }
};

const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const nextWeek = new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0];

export const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'React Todo App with Bootstrap UI kit',
    description: 'Clean Bootstrap 5 cards, list-groups, form controls, and dark/light mode.',
    category: 'coding',
    priority: 'high',
    dueDate: today,
    completed: true,
    pinned: true,
    createdAt: Date.now() - 3600000 * 4
  },
  {
    id: 'task-2',
    title: 'Team sprint backlog review and planning meeting',
    description: 'Review pending pull requests and finalize user stories.',
    category: 'work',
    priority: 'high',
    dueDate: today,
    completed: false,
    pinned: true,
    createdAt: Date.now() - 3600000 * 2
  },
  {
    id: 'task-3',
    title: 'Evening workout & 5km running session',
    description: 'Fitness target and hydration check.',
    category: 'health',
    priority: 'medium',
    dueDate: today,
    completed: false,
    pinned: false,
    createdAt: Date.now() - 3600000
  },
  {
    id: 'task-4',
    title: 'Bootstrap 5 components documentation study',
    description: 'Explore modals, badges, list-groups, and color modes.',
    category: 'study',
    priority: 'low',
    dueDate: tomorrow,
    completed: false,
    pinned: false,
    createdAt: Date.now() - 1800000
  },
  {
    id: 'task-5',
    title: 'Weekly grocery store shopping list',
    description: 'Fresh fruits, vegetables, almond milk, and oats.',
    category: 'shopping',
    priority: 'low',
    dueDate: nextWeek,
    completed: false,
    pinned: false,
    createdAt: Date.now() - 900000
  }
];
