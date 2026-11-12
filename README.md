# My Day (To-Do & List Management App)

A modern, mobile-first task and list collaboration app with real-time sync, local-first offline support, and multi-user data isolation.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Backend Server
```bash
npm run server
```
- REST API: `http://localhost:3001`
- WebSocket Server: `ws://localhost:3001`
- Health check: `http://localhost:3001/api/health`

### 3. Start the Frontend Development Server
```bash
npm run dev
```

---

## 🏗️ Architecture & Features

### 1. Local-First with Background Cloud Sync
- Works **100% offline** via scoped `localStorage`.
- When the backend is running, state seamlessly syncs to the server database.
- Zero network blocking or crashes if offline.

### 2. Real-Time Collaboration & Multi-Device Sync
- Built-in **WebSocket server** broadcasts task & list updates in real time.
- Changes made on Phone A instantly reflect on Phone B without page reloads.

### 3. Complete User Isolation
- Every user gets their own session ID (`x-user-id`).
- Tasks and lists are strictly scoped per user or shared list members.
- Shared link recipients get clean fresh app sessions.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Service health status |
| `POST` | `/api/users/session` | Register / fetch user session |
| `PATCH` | `/api/users/profile` | Update user name / email |
| `GET` | `/api/tasks` | Get tasks (supports `?list=...`, `?completed=...`) |
| `POST` | `/api/tasks` | Create a new task |
| `PATCH` | `/api/tasks/:id` | Update task (toggle status, due date, note, etc.) |
| `DELETE` | `/api/tasks/:id` | Delete task |
| `GET` | `/api/lists` | Get user custom lists |
| `POST` | `/api/lists` | Create a new custom list |
| `PATCH` | `/api/lists/:id` | Rename / update list |
| `DELETE` | `/api/lists/:id` | Delete list and its tasks |
| `GET` | `/api/lists/:id/members` | Get members of a shared list |
| `POST` | `/api/lists/:id/members` | Invite member by email |
| `POST` | `/api/sync` | Bulk sync offline changes |

---

## 📦 Deploying Backend to Cloud (Render / Railway / Fly.io)

1. Push your repository to GitHub.
2. In **Render** or **Railway**:
   - Create a new **Web Service**.
   - Build Command: `npm install`
   - Start Command: `npm run start`
   - Set Environment Variable: `PORT=3001` (or provided by host)
3. Set `VITE_API_URL=https://your-backend-app.onrender.com` in your frontend environment if hosting frontend separately.
