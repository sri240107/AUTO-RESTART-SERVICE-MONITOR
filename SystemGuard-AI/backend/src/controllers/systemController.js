const si = require('systeminformation');
const SystemMetric = require('../models/SystemMetric');
const logger = require('../utils/logger');

// @GET /api/system/metrics — current snapshot
exports.getCurrentMetrics = async (req, res) => {
  try {
    const [cpu, mem, disk, network] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.networkStats(),
    ]);

    const metrics = {
      cpu: parseFloat(cpu.currentLoad.toFixed(1)),
      ram: parseFloat(((mem.used / mem.total) * 100).toFixed(1)),
      disk: disk[0] ? parseFloat(((disk[0].used / disk[0].size) * 100).toFixed(1)) : 0,
      networkIn: network[0] ? network[0].rx_sec : 0,
      networkOut: network[0] ? network[0].tx_sec : 0,
      timestamp: new Date(),
    };

    // AI health score: simple weighted formula
    metrics.healthScore = Math.max(0, Math.round(
      100 - (metrics.cpu * 0.4) - (metrics.ram * 0.3) - (metrics.disk * 0.3)
    ));

    res.json({ success: true, data: metrics });
  } catch (error) {
    logger.error('Metrics error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch metrics' });
  }
};

// @GET /api/system/history — last 100 records
exports.getMetricsHistory = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const metrics = await SystemMetric.find()
      .sort({ timestamp: -1 })
      .limit(limit)
      .select('-__v');

    res.json({ success: true, data: metrics.reverse() });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch history' });
  }
};

// @GET /api/system/info — static system info
exports.getSystemInfo = async (req, res) => {
  try {
    const [os, cpu, mem] = await Promise.all([
      si.osInfo(),
      si.cpu(),
      si.mem(),
    ]);

    res.json({
      success: true,
      data: {
        os: `${os.distro} ${os.release}`,
        platform: os.platform,
        hostname: os.hostname,
        cpuModel: `${cpu.manufacturer} ${cpu.brand}`,
        cpuCores: cpu.cores,
        totalRAM: (mem.total / 1024 / 1024 / 1024).toFixed(1) + ' GB',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch system info' });
  }
};
