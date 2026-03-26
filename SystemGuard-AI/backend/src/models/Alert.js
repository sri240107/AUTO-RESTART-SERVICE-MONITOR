const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['critical', 'warning', 'info', 'success'],
    default: 'info',
  },
  category: {
    type: String,
    enum: ['system', 'service', 'security', 'ai'],
    default: 'system',
  },
  isRead: { type: Boolean, default: false },
  metadata: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);
