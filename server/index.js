import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import { db } from './db.js';
import { usersRouter } from './routes/users.js';
import { tasksRouter } from './routes/tasks.js';
import { listsRouter } from './routes/lists.js';
import { syncRouter } from './routes/sync.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));
app.use(express.json());

// Initialize Database
await db.init();
console.log('✅ Local Database initialized');

// WebSocket Server for Real-Time Sync Across Devices
const wss = new WebSocketServer({ server });
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'PING') {
        ws.send(JSON.stringify({ type: 'PONG' }));
      }
    } catch { }
  });

  ws.on('close', () => {
    clients.delete(ws);
  });

  ws.on('error', () => {
    clients.delete(ws);
  });
});

// Broadcast helper
function broadcastWs(data) {
  const message = JSON.stringify(data);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}

app.set('broadcastWs', broadcastWs);

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'My Day Backend API',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/users', usersRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/lists', listsRouter);
app.use('/api/sync', syncRouter);

// Optional: Serve frontend static build in production
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) next();
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`🚀 My Day Backend Server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket server active on ws://localhost:${PORT}`);
});
