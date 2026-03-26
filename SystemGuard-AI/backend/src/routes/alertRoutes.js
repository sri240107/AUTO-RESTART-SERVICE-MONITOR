const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);

// GET all alerts
router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET unread count
router.get('/unread-count', async (req, res) => {
  const count = await Alert.countDocuments({ isRead: false });
  res.json({ success: true, count });
});

// PUT mark single alert as read
router.put('/:id/read', async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!alert) return res.status(404).json({ success: false, message: 'Alert not found' });
    res.json({ success: true, data: alert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT mark all as read
router.put('/read-all', async (req, res) => {
  await Alert.updateMany({ isRead: false }, { isRead: true });
  res.json({ success: true, message: 'All alerts marked as read' });
});

// DELETE alert
router.delete('/:id', adminOnly, async (req, res) => {
  await Alert.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Alert deleted' });
});

module.exports = router;
