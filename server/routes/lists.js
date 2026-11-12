import { Router } from 'express';
import { db } from '../db.js';

export const listsRouter = Router();

// GET all lists for user
listsRouter.get('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: missing x-user-id header' });
    }

    const lists = await db.getListsForUser(userId);
    res.json({ success: true, lists });
  } catch (err) {
    console.error('Error fetching lists:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create custom list
listsRouter.post('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: missing x-user-id header' });
    }

    const { id, name, emoji, shared } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'List name is required' });
    }

    const list = await db.createList({
      id,
      name: name.trim(),
      emoji: emoji || null,
      ownerId: userId,
      shared: Boolean(shared)
    });

    req.app.get('broadcastWs')?.({
      type: 'LIST_CREATED',
      payload: { list, userId }
    });

    res.status(201).json({ success: true, list });
  } catch (err) {
    console.error('Error creating list:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH rename or update list
listsRouter.patch('/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: missing x-user-id header' });
    }

    const { id } = req.params;
    const { name, emoji } = req.body;

    const list = await db.updateList(id, {
      ...(name ? { name: name.trim() } : {}),
      ...(emoji !== undefined ? { emoji } : {})
    });

    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    req.app.get('broadcastWs')?.({
      type: 'LIST_UPDATED',
      payload: { list, userId }
    });

    res.json({ success: true, list });
  } catch (err) {
    console.error('Error updating list:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE list
listsRouter.delete('/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: missing x-user-id header' });
    }

    const { id } = req.params;
    const deleted = await db.deleteList(id);
    if (!deleted) {
      return res.status(404).json({ error: 'List not found' });
    }

    req.app.get('broadcastWs')?.({
      type: 'LIST_DELETED',
      payload: { listId: id, userId }
    });

    res.json({ success: true, deleted: true });
  } catch (err) {
    console.error('Error deleting list:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET members for list
listsRouter.get('/:id/members', async (req, res) => {
  try {
    const { id } = req.params;
    const members = await db.getMembersForList(id);
    res.json({ success: true, members });
  } catch (err) {
    console.error('Error fetching list members:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST invite member to list
listsRouter.post('/:id/members', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name, role } = req.body;

    if (!email && !name) {
      return res.status(400).json({ error: 'Member email or name is required' });
    }

    const member = await db.addListMember({
      listId: id,
      email: email?.trim(),
      name: name?.trim() || email?.trim(),
      role: role || 'Member'
    });

    req.app.get('broadcastWs')?.({
      type: 'MEMBER_ADDED',
      payload: { listId: id, member }
    });

    res.status(201).json({ success: true, member });
  } catch (err) {
    console.error('Error adding list member:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST join shared list
listsRouter.post('/:id/join', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: missing x-user-id header' });
    }

    const { id } = req.params;
    const user = await db.getUserById(userId);

    const member = await db.addListMember({
      listId: id,
      userId,
      email: user?.email || '',
      name: user?.name || 'Collaborator',
      role: 'Member'
    });

    res.json({ success: true, member });
  } catch (err) {
    console.error('Error joining list:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE remove or leave list
listsRouter.delete('/:id/members/:memberId', async (req, res) => {
  try {
    const { id, memberId } = req.params;
    const removed = await db.removeListMember(id, memberId);
    if (!removed) {
      return res.status(404).json({ error: 'Member not found in list' });
    }

    req.app.get('broadcastWs')?.({
      type: 'MEMBER_REMOVED',
      payload: { listId: id, memberId }
    });

    res.json({ success: true, removed: true });
  } catch (err) {
    console.error('Error removing list member:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

