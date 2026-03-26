const mongoose = require('mongoose');

const securityLogSchema = new mongoose.Schema({
  ip: { type: String, required: true },
  event: {
    type: String,
    enum: ['failed_login', 'ip_blocked', 'ip_unblocked', 'suspicious_activity', 'brute_force'],
    required: true,
  },
  email: String,
  attempts: { type: Number, default: 1 },
  isBlocked: { type: Boolean, default: false },
  blockedAt: Date,
  blockedUntil: Date,
  userAgent: String,
  details: String,
}, { timestamps: true });

module.exports = mongoose.model('SecurityLog', securityLogSchema);
