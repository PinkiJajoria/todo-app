import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Default initial state
const DEFAULT_DATA = {
  users: [],
  lists: [],
  tasks: [],
  listMembers: []
};

let dbCache = null;
let writeQueue = Promise.resolve();

// Ensure data folder and db file exist
async function initDb() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      const content = await fs.readFile(DB_FILE, 'utf-8');
      dbCache = JSON.parse(content);
    } catch {
      dbCache = { ...DEFAULT_DATA };
      await saveDb();
    }
  } catch (err) {
    console.error('Error initializing database:', err);
    dbCache = { ...DEFAULT_DATA };
  }
}

// Thread-safe atomic write to disk
async function saveDb() {
  const current = JSON.stringify(dbCache, null, 2);
  const tempFile = `${DB_FILE}.${Date.now()}.tmp`;

  writeQueue = writeQueue.then(async () => {
    try {
      await fs.writeFile(tempFile, current, 'utf-8');
      await fs.rename(tempFile, DB_FILE);
    } catch (err) {
      console.error('Database write error:', err);
      try {
        await fs.unlink(tempFile);
      } catch { }
    }
  });

  return writeQueue;
}

// ----------------------------------------------------
// Database Operations
// ----------------------------------------------------
export const db = {
  async init() {
    if (!dbCache) {
      await initDb();
    }
    return dbCache;
  },

  // Users
  async getUsers() {
    await this.init();
    return dbCache.users;
  },

  async getUserById(id) {
    await this.init();
    return dbCache.users.find((u) => u.id === id) || null;
  },

  async getUserByEmail(email) {
    await this.init();
    if (!email) return null;
    return dbCache.users.find((u) => u.email?.toLowerCase() === email.toLowerCase()) || null;
  },

  async upsertUser({ id, email, name, avatar }) {
    await this.init();
    const existingIndex = dbCache.users.findIndex((u) => u.id === id);
    const user = {
      id,
      email: email || `${id}@todo.app`,
      name: name || email || 'User',
      avatar: avatar || (name || email || 'U').charAt(0).toUpperCase(),
      updatedAt: Date.now()
    };

    if (existingIndex >= 0) {
      dbCache.users[existingIndex] = {
        ...dbCache.users[existingIndex],
        ...user
      };
    } else {
      user.createdAt = Date.now();
      dbCache.users.push(user);
    }

    await saveDb();
    return existingIndex >= 0 ? dbCache.users[existingIndex] : user;
  },

  // Lists
  async getListsForUser(userId) {
    await this.init();
    // Return lists owned by user OR shared with user
    const sharedListIds = new Set(
      dbCache.listMembers
        .filter((m) => m.userId === userId || m.email === userId)
        .map((m) => m.listId)
    );

    return dbCache.lists.filter(
      (l) => l.ownerId === userId || sharedListIds.has(l.id)
    );
  },

  async getListById(id) {
    await this.init();
    return dbCache.lists.find((l) => l.id === id) || null;
  },

  async createList({ id, name, emoji, ownerId, shared = false }) {
    await this.init();
    const listId = id || `cl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newList = {
      id: listId,
      name,
      emoji: emoji || null,
      ownerId,
      shared: Boolean(shared),
      count: 0,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    dbCache.lists.push(newList);

    // Add owner to list members
    const owner = await this.getUserById(ownerId);
    dbCache.listMembers.push({
      id: `member-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      listId,
      userId: ownerId,
      name: owner?.name || 'Owner',
      email: owner?.email || '',
      initials: (owner?.name || owner?.email || 'O').charAt(0).toUpperCase(),
      color: '#0d7a71',
      role: 'Owner',
      joinedAt: Date.now()
    });

    await saveDb();
    return newList;
  },

  async updateList(id, updates) {
    await this.init();
    const index = dbCache.lists.findIndex((l) => l.id === id);
    if (index === -1) return null;

    dbCache.lists[index] = {
      ...dbCache.lists[index],
      ...updates,
      updatedAt: Date.now()
    };

    await saveDb();
    return dbCache.lists[index];
  },

  async deleteList(id) {
    await this.init();
    const index = dbCache.lists.findIndex((l) => l.id === id);
    if (index === -1) return false;

    dbCache.lists.splice(index, 1);
    // Remove tasks and members of this list
    dbCache.tasks = dbCache.tasks.filter((t) => t.listId !== id && t.list !== id);
    dbCache.listMembers = dbCache.listMembers.filter((m) => m.listId !== id);

    await saveDb();
    return true;
  },

  // List Members
  async getMembersForList(listId) {
    await this.init();
    return dbCache.listMembers.filter((m) => m.listId === listId);
  },

  async addListMember({ listId, userId, name, email, role = 'Member' }) {
    await this.init();
    const list = await this.getListById(listId);
    if (!list) return null;

    // Check if already member
    const existing = dbCache.listMembers.find(
      (m) => m.listId === listId && (m.userId === userId || (email && m.email === email))
    );
    if (existing) return existing;

    const colors = ['#2563eb', '#7c3aed', '#d97706', '#059669', '#dc2626'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const initials = (name || email || 'M').trim().slice(0, 2).toUpperCase();

    const member = {
      id: `member-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      listId,
      userId: userId || null,
      name: name || email,
      email: email || '',
      initials,
      color: randomColor,
      role,
      joinedAt: Date.now()
    };

    dbCache.listMembers.push(member);
    // Mark list as shared
    list.shared = true;
    list.updatedAt = Date.now();

    await saveDb();
    return member;
  },

  async removeListMember(listId, memberIdOrUserId) {
    await this.init();
    const beforeCount = dbCache.listMembers.length;
    dbCache.listMembers = dbCache.listMembers.filter(
      (m) => !(m.listId === listId && (m.id === memberIdOrUserId || m.userId === memberIdOrUserId))
    );

    const changed = dbCache.listMembers.length !== beforeCount;
    if (changed) {
      await saveDb();
    }
    return changed;
  },

  // Tasks
  async getTasksForUser(userId, filter = {}) {
    await this.init();
    const sharedListIds = new Set(
      dbCache.listMembers
        .filter((m) => m.userId === userId || m.email === userId)
        .map((m) => m.listId)
    );

    let tasks = dbCache.tasks.filter(
      (t) => t.userId === userId || (t.listId && sharedListIds.has(t.listId))
    );

    if (filter.list) {
      const lower = filter.list.toLowerCase();
      tasks = tasks.filter((t) => {
        if (t.list && t.list.toLowerCase() === lower) return true;
        if (t.listId && t.listId === filter.list) return true;
        return false;
      });
    }

    if (typeof filter.completed === 'boolean') {
      tasks = tasks.filter((t) => Boolean(t.completed) === filter.completed);
    }

    if (typeof filter.starred === 'boolean') {
      tasks = tasks.filter((t) => Boolean(t.starred) === filter.starred);
    }

    return tasks;
  },

  async getTaskById(id) {
    await this.init();
    return dbCache.tasks.find((t) => t.id === id) || null;
  },

  async createTask(task) {
    await this.init();
    const newTask = {
      id: task.id || `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: task.title || '',
      completed: Boolean(task.completed),
      starred: Boolean(task.starred),
      list: task.list || 'My Day',
      listId: task.listId || null,
      reminderTime: task.reminderTime || null,
      dueDate: task.dueDate || null,
      note: task.note || '',
      userId: task.userId,
      createdAt: task.createdAt || Date.now(),
      updatedAt: Date.now()
    };

    dbCache.tasks.push(newTask);
    await saveDb();
    return newTask;
  },

  async updateTask(id, updates) {
    await this.init();
    const index = dbCache.tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;

    dbCache.tasks[index] = {
      ...dbCache.tasks[index],
      ...updates,
      updatedAt: Date.now()
    };

    await saveDb();
    return dbCache.tasks[index];
  },

  async deleteTask(id) {
    await this.init();
    const index = dbCache.tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;

    dbCache.tasks.splice(index, 1);
    await saveDb();
    return true;
  },

  // Bulk sync for client-to-server sync
  async syncUserData(userId, { tasks = [], lists = [], members = [] }) {
    await this.init();

    // Upsert lists
    for (const l of lists) {
      const existing = dbCache.lists.find((x) => x.id === l.id);
      if (!existing) {
        dbCache.lists.push({
          id: l.id,
          name: l.name,
          emoji: l.emoji || null,
          ownerId: userId,
          shared: Boolean(l.shared),
          count: l.count || 0,
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
      }
    }

    // Upsert tasks
    for (const t of tasks) {
      const existing = dbCache.tasks.find((x) => x.id === t.id);
      if (!existing) {
        dbCache.tasks.push({
          ...t,
          userId: t.userId || userId,
          updatedAt: Date.now()
        });
      } else {
        Object.assign(existing, t, { updatedAt: Date.now() });
      }
    }

    await saveDb();
    return {
      tasks: await this.getTasksForUser(userId),
      lists: await this.getListsForUser(userId)
    };
  }
};

