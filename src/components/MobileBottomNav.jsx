import React from 'react';
import { ListTodo, BarChart2, Plus, Search, Settings } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

export default function MobileBottomNav({ activeTab, setActiveTab, onOpenNewTask }) {
  const handleTabChange = (tabId) => {
    triggerHaptic('light');
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFabClick = () => {
    triggerHaptic('medium');
    onOpenNewTask();
  };

  return (
    <nav className="mobile-bottom-nav d-md-none bg-body border-top shadow-lg">
      <div className="d-flex align-items-center justify-content-around py-1">
        {/* Tab 1: Tasks */}
        <button
          type="button"
          className={`nav-tab-btn btn ${activeTab === 'tasks' ? 'active text-primary' : 'text-secondary'}`}
          onClick={() => handleTabChange('tasks')}
        >
          <ListTodo size={20} strokeWidth={activeTab === 'tasks' ? 2.5 : 1.8} />
          <span className="tab-label">Tasks</span>
        </button>

        {/* Tab 2: Dashboard/Stats */}
        <button
          type="button"
          className={`nav-tab-btn btn ${activeTab === 'stats' ? 'active text-primary' : 'text-secondary'}`}
          onClick={() => handleTabChange('stats')}
        >
          <BarChart2 size={20} strokeWidth={activeTab === 'stats' ? 2.5 : 1.8} />
          <span className="tab-label">Stats</span>
        </button>

        {/* Central Floating Action Button (FAB) */}
        <div className="fab-container">
          <button
            type="button"
            className="btn btn-primary rounded-circle shadow-lg fab-btn d-flex align-items-center justify-content-center"
            onClick={handleFabClick}
            title="Create New Task"
            aria-label="Add task"
          >
            <Plus size={26} strokeWidth={2.8} />
          </button>
        </div>

        {/* Tab 3: Search & Filter */}
        <button
          type="button"
          className={`nav-tab-btn btn ${activeTab === 'search' ? 'active text-primary' : 'text-secondary'}`}
          onClick={() => handleTabChange('search')}
        >
          <Search size={20} strokeWidth={activeTab === 'search' ? 2.5 : 1.8} />
          <span className="tab-label">Search</span>
        </button>

        {/* Tab 4: Settings */}
        <button
          type="button"
          className={`nav-tab-btn btn ${activeTab === 'settings' ? 'active text-primary' : 'text-secondary'}`}
          onClick={() => handleTabChange('settings')}
        >
          <Settings size={20} strokeWidth={activeTab === 'settings' ? 2.5 : 1.8} />
          <span className="tab-label">Settings</span>
        </button>
      </div>
    </nav>
  );
}
