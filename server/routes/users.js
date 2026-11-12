import { Router } from 'express';
import { db } from '../db.js';

export const usersRouter = Router();

// Get or register user session
usersRouter.post('/session', async (req, res) => {
  try {
    const { userId, email, name, avatar } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const user = await db.upsertUser({ id: userId, email, name, avatar });
    res.json({ success: true, user });
  } catch (err) {
    console.error('Error in /api/users/session:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile (name or email)
usersRouter.patch('/profile', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || req.body.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: missing x-user-id header' });
    }

    const { email, name, avatar } = req.body;
    const user = await db.upsertUser({ id: userId, email, name, avatar });
    res.json({ success: true, user });
  } catch (err) {
    console.error('Error in /api/users/profile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user profile
usersRouter.get('/me', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: missing x-user-id header' });
    }

    const user = await db.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error('Error in /api/users/me:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

