const { Server } = require('socket.io');
const si = require('systeminformation');
const SystemMetric = require('../models/SystemMetric');
const Alert = require('../models/Alert');
const logger = require('../utils/logger');

const METRICS_INTERVAL = parseInt(process.env.METRICS_INTERVAL_MS) || 2000;

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    logger.info(`⚡ Client connected: ${socket.id}`);

    // ── Live Metrics Stream ──────────────────────────────────────────────────
    const metricsInterval = setInterval(async () => {
      try {
        const [cpu, mem, disk, net] = await Promise.all([
          si.currentLoad(),
          si.mem(),
          si.fsSize(),
          si.networkStats(),
        ]);

        const cpuVal  = parseFloat(cpu.currentLoad.toFixed(1));
        const ramVal  = parseFloat(((mem.used / mem.total) * 100).toFixed(1));
        const diskVal = disk[0] ? parseFloat(((disk[0].used / disk[0].size) * 100).toFixed(1)) : 0;
        const netIn   = net[0] ? Math.round(net[0].rx_sec / 1024) : 0; // KB/s
        const netOut  = net[0] ? Math.round(net[0].tx_sec / 1024) : 0;

        const healthScore = Math.max(0, Math.round(
          100 - (cpuVal * 0.4) - (ramVal * 0.3) - (diskVal * 0.3)
        ));

        const metrics = {
          cpu: cpuVal, ram: ramVal, disk: diskVal,
          networkIn: netIn, networkOut: netOut,
          healthScore, timestamp: new Date(),
        };

        socket.emit('system:metrics', metrics);

        // Persist to DB (every 10 seconds to reduce writes)
        if (Date.now() % (10 * 1000) < METRICS_INTERVAL) {
          await SystemMetric.create(metrics);
        }

        // Auto-alert thresholds
        if (cpuVal > 90) await triggerAlert(io, 'High CPU Usage', `CPU at ${cpuVal}%`, 'critical', 'system');
        if (ramVal > 90) await triggerAlert(io, 'High RAM Usage', `RAM at ${ramVal}%`, 'critical', 'system');
        if (diskVal > 95) await triggerAlert(io, 'Disk Almost Full', `Disk at ${diskVal}%`, 'critical', 'system');

      } catch (err) {
        logger.error('Socket metrics error:', err.message);
      }
    }, METRICS_INTERVAL);

    socket.on('disconnect', () => {
      clearInterval(metricsInterval);
      logger.info(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Helper: create alert + broadcast
const triggerAlert = async (io, title, message, type = 'warning', category = 'system') => {
  try {
    // Avoid duplicate alerts within 5 minutes
    const recent = await Alert.findOne({
      title,
      createdAt: { $gt: new Date(Date.now() - 5 * 60 * 1000) },
    });
    if (recent) return;

    const alert = await Alert.create({ title, message, type, category });
    io.emit('alert:new', alert);
  } catch (err) {
    logger.error('Alert trigger error:', err.message);
  }
};

module.exports = initSocket;
