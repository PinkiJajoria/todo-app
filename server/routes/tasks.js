import { Router } from 'express';
import { db } from '../db.js';

export const tasksRouter = Router();

// GET all tasks for user
tasksRouter.get('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: missing x-user-id header' });
    }

    const { list, completed, starred } = req.query;
    const filter = {};
    if (list) filter.list = list;
    if (completed !== undefined) filter.completed = completed === 'true';
    if (starred !== undefined) filter.starred = starred === 'true';

    const tasks = await db.getTasksForUser(userId, filter);
    res.json({ success: true, tasks });
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST new task
tasksRouter.post('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: missing x-user-id header' });
    }

    const { id, title, completed, starred, list, listId, reminderTime, dueDate, note, priority, category, subtasks } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const task = await db.createTask({
      id,
      title: title.trim(),
      completed: Boolean(completed),
      starred: Boolean(starred),
      list: list || 'My Day',
      listId: listId || null,
      reminderTime: reminderTime || null,
      dueDate: dueDate || null,
      note: note || '',
      priority: priority || null,
      category: category || null,
      subtasks: Array.isArray(subtasks) ? subtasks : [],
      userId
    });

    // Broadcast change via WebSocket
    req.app.get('broadcastWs')?.({
      type: 'TASK_CREATED',
      payload: { task, userId }
    });

    res.status(201).json({ success: true, task });
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH update task
tasksRouter.patch('/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: missing x-user-id header' });
    }

    const { id } = req.params;
    const existing = await db.getTaskById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const task = await db.updateTask(id, req.body);

    // Broadcast change via WebSocket
    req.app.get('broadcastWs')?.({
      type: 'TASK_UPDATED',
      payload: { task, userId }
    });

    res.json({ success: true, task });
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE task
tasksRouter.delete('/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: missing x-user-id header' });
    }

    const { id } = req.params;
    const deleted = await db.deleteTask(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Broadcast change via WebSocket
    req.app.get('broadcastWs')?.({
      type: 'TASK_DELETED',
      payload: { taskId: id, userId }
    });

    res.json({ success: true, deleted: true });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

