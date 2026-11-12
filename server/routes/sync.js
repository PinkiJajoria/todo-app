import { Router } from 'express';
import { db } from '../db.js';

export const syncRouter = Router();

// Bulk sync endpoint
syncRouter.post('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || req.body.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: missing x-user-id header' });
    }

    const { tasks = [], lists = [], email, name } = req.body;

    // Ensure user exists
    await db.upsertUser({ id: userId, email, name });

    // Sync tasks and lists
    const synced = await db.syncUserData(userId, { tasks, lists });

    res.json({
      success: true,
      tasks: synced.tasks,
      lists: synced.lists
    });
  } catch (err) {
    console.error('Error during data sync:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

