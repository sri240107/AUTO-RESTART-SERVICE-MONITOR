# 🛡️ SystemGuard AI

> **Auto Restart Service Monitor & Cybersecurity Platform**

![SystemGuard AI Banner](https://img.shields.io/badge/SystemGuard-AI-blue?style=for-the-badge&logo=shield)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=flat&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-6-47A248?style=flat&logo=mongodb)
![Socket.io](https://img.shields.io/badge/Socket.io-4-010101?style=flat&logo=socket.io)

---

## 📌 Overview

SystemGuard AI is a **full-stack real-time monitoring platform** that watches your server health, auto-restarts failed services, detects cybersecurity threats, and uses AI to predict system failures — all displayed on a live animated dashboard.

Think of it as your own **Datadog + Zabbix + CrowdStrike** — in one open-source platform.

---

## ✨ Features

| Module | Description |
|--------|-------------|
| 📊 **Live Dashboard** | Real-time CPU, RAM, Disk, Network charts |
| 🔄 **Auto-Restart** | Detects service crashes and restarts automatically |
| 🛡️ **Cybersecurity** | Brute-force detection, IP blocking, security logs |
| 🤖 **AI Engine** | Anomaly detection, failure prediction, health scoring |
| 🔔 **Alerts System** | Instant alerts for critical events |
| 🔐 **JWT Auth** | Secure login/register with token-based auth |
| ⚡ **Real-Time** | Socket.io for live dashboard updates |
| 📝 **Logging** | Full audit trail stored in MongoDB |

---

## 🏗️ Tech Stack

```
Frontend  →  React 18 + Vite + Tailwind CSS + Recharts
Backend   →  Node.js + Express.js
Database  →  MongoDB + Mongoose
Real-Time →  Socket.io
Auth      →  JWT (JSON Web Tokens)
Monitoring→  systeminformation (npm)
```

---

## 📁 Project Structure

```
SystemGuard-AI/
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── api/            # Axios API config
│   │   ├── components/     # UI components (Dashboard, Charts, etc.)
│   │   ├── context/        # Auth context
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Page components
│   │   └── utils/          # Utility functions
│   ├── index.html
│   └── package.json
│
├── backend/                # Node.js + Express backend
│   ├── src/
│   │   ├── config/         # DB config
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/      # Auth middleware
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── socket/         # Socket.io handlers
│   │   └── utils/          # Utility helpers
│   └── package.json
│
├── docs/                   # Documentation
├── scripts/                # Setup/seed scripts
└── docker-compose.yml      # Docker setup
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- MongoDB running locally or MongoDB Atlas URI
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/SystemGuard-AI.git
cd SystemGuard-AI
```

### 2. Setup Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run seed    # Seed initial data
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

### 4. Open Dashboard
```
http://localhost:5173
```

Login with seeded credentials:
- **Email:** admin@systemguard.ai
- **Password:** Admin@123

---

## 🔧 Environment Variables

### Backend `.env`
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/systemguard
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & get token |
| GET | `/api/auth/me` | Get current user |

### System Monitoring
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/system/metrics` | Current CPU/RAM/Disk |
| GET | `/api/system/history` | Historical metrics |

### Services
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services` | All services |
| POST | `/api/services` | Add service |
| PUT | `/api/services/:id/restart` | Restart service |
| DELETE | `/api/services/:id` | Remove service |

### Security
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/security/logs` | Security logs |
| GET | `/api/security/blocked-ips` | Blocked IPs |
| DELETE | `/api/security/unblock/:ip` | Unblock IP |

### Alerts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/alerts` | All alerts |
| PUT | `/api/alerts/:id/read` | Mark as read |

---

## ⚡ Socket.io Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `system:metrics` | Server → Client | Live metrics every 2s |
| `service:status` | Server → Client | Service status update |
| `alert:new` | Server → Client | New alert triggered |
| `security:event` | Server → Client | Security event detected |

---

## 🐳 Docker Setup

```bash
docker-compose up --build
```

This starts MongoDB, backend, and frontend together.

---

## 📸 Screenshots

> Dashboard, Charts, Security Panel screenshots go here.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -m 'Add my feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**SystemGuard AI Team**

---

⭐ **Star this repo if it helped you!**
