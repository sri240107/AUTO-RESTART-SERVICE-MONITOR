const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ['http', 'tcp', 'process', 'database'],
    default: 'http',
  },
  endpoint: {
    type: String, // URL or host:port
  },
  processName: {
    type: String, // for process type
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'restarting', 'unknown'],
    default: 'unknown',
  },
  autoRestart: {
    type: Boolean,
    default: true,
  },
  restartCommand: {
    type: String, // e.g. "pm2 restart app"
  },
  restartCount: {
    type: Number,
    default: 0,
  },
  lastChecked: Date,
  lastRestarted: Date,
  responseTime: Number, // ms
  uptime: Number, // percentage
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
