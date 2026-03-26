# SystemGuard AI — Setup Guide

## Quick Start (Local Development)

### Step 1 — Clone
```bash
git clone https://github.com/YOUR_USERNAME/SystemGuard-AI.git
cd SystemGuard-AI
```

### Step 2 — Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env: set MONGODB_URI and JWT_SECRET
npm install
npm run seed        # Creates admin user + sample data
npm run dev         # Starts on http://localhost:5000
```

### Step 3 — Frontend Setup
```bash
cd ../frontend
cp .env.example .env
npm install
npm run dev         # Starts on http://localhost:5173
```

### Step 4 — Login
Open `http://localhost:5173`

| Field    | Value                    |
|----------|--------------------------|
| Email    | admin@systemguard.ai     |
| Password | Admin@123                |

---

## Docker Setup (One Command)

```bash
# From project root
docker-compose up --build
```

Then open: `http://localhost:5173`

---

## Project Structure Explained

```
SystemGuard-AI/
│
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection
│   │   ├── controllers/     # Business logic for each route
│   │   ├── middleware/      # Auth, error handling, rate limiting
│   │   ├── models/          # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Service.js
│   │   │   ├── Alert.js
│   │   │   ├── SecurityLog.js
│   │   │   └── SystemMetric.js
│   │   ├── routes/          # Express route definitions
│   │   ├── socket/          # Socket.io real-time handlers
│   │   └── utils/           # Logger, helpers
│   ├── scripts/seed.js      # Database seeder
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios config + Socket.io client
│   │   ├── components/
│   │   │   ├── AI/          # AIHealthScore
│   │   │   ├── Alerts/      # AlertsPanel
│   │   │   ├── Charts/      # LiveChart (Recharts)
│   │   │   ├── Dashboard/   # Sidebar, Header, MetricCard
│   │   │   ├── Security/    # SecurityPanel
│   │   │   └── Services/    # ServicesPanel
│   │   ├── context/         # AuthContext (JWT state)
│   │   ├── pages/           # LoginPage, RegisterPage, DashboardPage
│   │   ├── App.jsx          # Router setup
│   │   └── main.jsx         # React entry point
│   ├── .env.example
│   └── package.json
│
├── docs/                    # API.md, SETUP.md
├── .github/workflows/       # CI/CD pipeline
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## Environment Variables Reference

### Backend
| Variable               | Default                    | Description               |
|------------------------|----------------------------|---------------------------|
| PORT                   | 5000                       | API server port            |
| MONGODB_URI            | mongodb://localhost/sg     | MongoDB connection string  |
| JWT_SECRET             | (required)                 | JWT signing secret         |
| JWT_EXPIRES_IN         | 7d                         | Token expiry               |
| NODE_ENV               | development                | Environment mode           |
| FRONTEND_URL           | http://localhost:5173      | CORS allowed origin        |
| MAX_LOGIN_ATTEMPTS     | 5                          | Before IP block            |
| BLOCK_DURATION_MINUTES | 30                         | IP block duration          |
| METRICS_INTERVAL_MS    | 2000                       | Socket metrics interval    |

### Frontend
| Variable          | Default                 | Description             |
|-------------------|-------------------------|-------------------------|
| VITE_API_URL      | http://localhost:5000   | Backend API base URL    |
| VITE_SOCKET_URL   | http://localhost:5000   | Socket.io server URL    |

---

## Troubleshooting

**Blank dashboard / 401 errors**
→ Make sure you're logged in. Token stored in `localStorage` as `sg_token`.

**MongoDB not connecting**
→ Ensure MongoDB is running: `sudo systemctl start mongod`

**Socket shows "Disconnected"**
→ Check backend is running on port 5000. Check CORS `FRONTEND_URL` in `.env`.

**Charts not rendering**
→ Recharts needs data. Wait a few seconds for Socket.io to stream live metrics.

**CORS errors in browser**
→ Set `FRONTEND_URL=http://localhost:5173` in backend `.env` exactly.
