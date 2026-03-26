# SystemGuard AI — API Documentation

Base URL: `http://localhost:5000/api`

All protected routes require: `Authorization: Bearer <token>`

---

## Authentication

### POST /auth/register
Register a new user.

**Body:**
```json
{ "name": "John Doe", "email": "john@example.com", "password": "secret123" }
```
**Response:** `201` — `{ success, token, user }`

---

### POST /auth/login
Login and receive JWT token.

**Body:**
```json
{ "email": "admin@systemguard.ai", "password": "Admin@123" }
```
**Response:** `200` — `{ success, token, user }`

Locked after 5 failed attempts from same IP.

---

### GET /auth/me *(Protected)*
Returns current authenticated user.

---

## System Metrics *(Protected)*

### GET /system/metrics
Returns current CPU, RAM, Disk, Network snapshot.

### GET /system/history?limit=100
Returns historical metrics (last N records, auto-expires after 24h).

### GET /system/info
Returns static OS/CPU/RAM info.

---

## Services *(Protected)*

### GET /services
List all monitored services.

### POST /services *(Admin)*
Add a new service.

**Body:**
```json
{
  "name": "My API",
  "type": "http",
  "endpoint": "http://localhost:3000/health",
  "autoRestart": true,
  "restartCommand": "pm2 restart my-api"
}
```

### PUT /services/:id/restart *(Admin)*
Trigger a restart for a service.

### DELETE /services/:id *(Admin)*
Remove a service.

---

## Security *(Protected)*

### GET /security/logs
Returns last 100 security events.

### GET /security/blocked-ips
Returns currently active IP blocks.

### DELETE /security/unblock/:ip *(Admin)*
Unblocks a specific IP address.

---

## Alerts *(Protected)*

### GET /alerts
Returns last 50 alerts.

### GET /alerts/unread-count
Returns count of unread alerts.

### PUT /alerts/:id/read
Mark a single alert as read.

### PUT /alerts/read-all
Mark all alerts as read.

### DELETE /alerts/:id *(Admin)*
Delete an alert.

---

## Socket.io Events

Connect to: `http://localhost:5000`

| Event | Direction | Payload |
|-------|-----------|---------|
| `system:metrics` | Server→Client | `{ cpu, ram, disk, networkIn, networkOut, healthScore, timestamp }` |
| `alert:new` | Server→Client | Alert document |
| `service:status` | Server→Client | Updated service document |

---

## Health Check

### GET /health
No auth required. Returns server uptime and status.
