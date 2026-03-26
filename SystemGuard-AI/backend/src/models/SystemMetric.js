const mongoose = require('mongoose');

const systemMetricSchema = new mongoose.Schema({
  cpu: { type: Number, required: true },       // percentage
  ram: { type: Number, required: true },       // percentage
  disk: { type: Number, required: true },      // percentage
  networkIn: { type: Number, default: 0 },     // bytes/s
  networkOut: { type: Number, default: 0 },    // bytes/s
  healthScore: { type: Number, default: 100 }, // AI computed 0-100
  timestamp: { type: Date, default: Date.now },
});

// Auto-delete metrics older than 24 hours
systemMetricSchema.index({ timestamp: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('SystemMetric', systemMetricSchema);
