/**
 * SystemGuard AI - Main Server Entry Point
 */

require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/database');
const initSocket = require('./socket/socketHandler');
const logger = require('./utils/logger');

// Route imports
const authRoutes = require('./routes/authRoutes');
const systemRoutes = require('./routes/systemRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const securityRoutes = require('./routes/securityRoutes');
const alertRoutes = require('./routes/alertRoutes');

// Middleware imports
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();
const server = http.createServer(app);

// ─── Connect Database ───────────────────────────────────────────────────────
connectDB();

// ─── Global Middleware ──────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Rate Limiting ──────────────────────────────────────────────────────────
app.use('/api/', apiLimiter);

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/alerts', alertRoutes);

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Error Handler ───────────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Socket.io ───────────────────────────────────────────────────────────────
const io = initSocket(server);
app.set('io', io);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info(`🚀 SystemGuard AI Server running on port ${PORT}`);
  logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
  logger.info(`🔗 API: http://localhost:${PORT}/api`);
});

module.exports = { app, server };
