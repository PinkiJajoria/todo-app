// ====================================================
// My Day Backend API Client (Local-First with Cloud Sync)
// Gracefully falls back to offline localStorage if backend is unreachable
// ====================================================

const getApiBase = () => {
  if (typeof window === 'undefined') return '';
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL.replace(/\/$/, '');
  
  // If running locally in development, default to local backend port 3001
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3001';
  }
  
  // If hosted on GitHub Pages or custom domain, check if API endpoint configured
  return '';
};

export const API_BASE = getApiBase();

const getHeaders = (userId) => ({
  'Content-Type': 'application/json',
  ...(userId ? { 'x-user-id': userId } : {})
});

export const api = {
  // Check if backend is available
  async checkHealth() {
    if (!API_BASE) return false;
    try {
      const res = await fetch(`${API_BASE}/api/health`, { method: 'GET', signal: AbortSignal.timeout(2000) });
      return res.ok;
    } catch {
      return false;
    }
  },

  // User session
  async registerSession(userId, email, name) {
    if (!API_BASE || !userId) return null;
    try {
      const res = await fetch(`${API_BASE}/api/users/session`, {
        method: 'POST',
        headers: getHeaders(userId),
        body: JSON.stringify({ userId, email, name }),
        signal: AbortSignal.timeout(3000)
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async updateProfile(userId, { email, name }) {
    if (!API_BASE || !userId) return null;
    try {
      const res = await fetch(`${API_BASE}/api/users/profile`, {
        method: 'PATCH',
        headers: getHeaders(userId),
        body: JSON.stringify({ email, name }),
        signal: AbortSignal.timeout(3000)
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // Tasks
  async getTasks(userId, filter = {}) {
    if (!API_BASE || !userId) return null;
    try {
      const params = new URLSearchParams();
      if (filter.list) params.append('list', filter.list);
      const url = `${API_BASE}/api/tasks${params.toString() ? '?' + params.toString() : ''}`;
      const res = await fetch(url, {
        headers: getHeaders(userId),
        signal: AbortSignal.timeout(3500)
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.tasks || [];
    } catch {
      return null;
    }
  },

  async createTask(userId, task) {
    if (!API_BASE || !userId) return null;
    try {
      const res = await fetch(`${API_BASE}/api/tasks`, {
        method: 'POST',
        headers: getHeaders(userId),
        body: JSON.stringify(task),
        signal: AbortSignal.timeout(3000)
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.task || null;
    } catch {
      return null;
    }
  },

  async updateTask(userId, taskId, updates) {
    if (!API_BASE || !userId) return null;
    try {
      const res = await fetch(`${API_BASE}/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: getHeaders(userId),
        body: JSON.stringify(updates),
        signal: AbortSignal.timeout(3000)
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.task || null;
    } catch {
      return null;
    }
  },

  async deleteTask(userId, taskId) {
    if (!API_BASE || !userId) return null;
    try {
      const res = await fetch(`${API_BASE}/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: getHeaders(userId),
        signal: AbortSignal.timeout(3000)
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Lists
  async getLists(userId) {
    if (!API_BASE || !userId) return null;
    try {
      const res = await fetch(`${API_BASE}/api/lists`, {
        headers: getHeaders(userId),
        signal: AbortSignal.timeout(3500)
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.lists || [];
    } catch {
      return null;
    }
  },

  async createList(userId, list) {
    if (!API_BASE || !userId) return null;
    try {
      const res = await fetch(`${API_BASE}/api/lists`, {
        method: 'POST',
        headers: getHeaders(userId),
        body: JSON.stringify(list),
        signal: AbortSignal.timeout(3000)
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.list || null;
    } catch {
      return null;
    }
  },

  async updateList(userId, listId, updates) {
    if (!API_BASE || !userId) return null;
    try {
      const res = await fetch(`${API_BASE}/api/lists/${listId}`, {
        method: 'PATCH',
        headers: getHeaders(userId),
        body: JSON.stringify(updates),
        signal: AbortSignal.timeout(3000)
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.list || null;
    } catch {
      return null;
    }
  },

  async deleteList(userId, listId) {
    if (!API_BASE || !userId) return null;
    try {
      const res = await fetch(`${API_BASE}/api/lists/${listId}`, {
        method: 'DELETE',
        headers: getHeaders(userId),
        signal: AbortSignal.timeout(3000)
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // List Members
  async getMembers(listId) {
    if (!API_BASE || !listId) return null;
    try {
      const res = await fetch(`${API_BASE}/api/lists/${listId}/members`, {
        signal: AbortSignal.timeout(3000)
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.members || [];
    } catch {
      return null;
    }
  },

  async inviteMember(listId, { email, name, role }) {
    if (!API_BASE || !listId) return null;
    try {
      const res = await fetch(`${API_BASE}/api/lists/${listId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, role }),
        signal: AbortSignal.timeout(3000)
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.member || null;
    } catch {
      return null;
    }
  },

  // Bulk Sync
  async syncAll(userId, { tasks, lists, email, name }) {
    if (!API_BASE || !userId) return null;
    try {
      const res = await fetch(`${API_BASE}/api/sync`, {
        method: 'POST',
        headers: getHeaders(userId),
        body: JSON.stringify({ userId, tasks, lists, email, name }),
        signal: AbortSignal.timeout(4000)
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // WebSocket Live Sync
  connectWebSocket(onEvent) {
    if (!API_BASE || typeof window === 'undefined') return () => {};
    let ws = null;
    let isDisposed = false;
    let reconnectTimer = null;

    const connect = () => {
      if (isDisposed) return;
      try {
        const wsUrl = API_BASE.replace(/^http/, 'ws');
        ws = new WebSocket(wsUrl);

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data && onEvent) {
              onEvent(data);
            }
          } catch { }
        };

        ws.onclose = () => {
          if (!isDisposed) {
            reconnectTimer = setTimeout(connect, 4000);
          }
        };

        ws.onerror = () => {
          ws?.close();
        };
      } catch { }
    };

    connect();

    return () => {
      isDisposed = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (ws) {
        try {
          ws.close();
        } catch { }
      }
    };
  }
};

