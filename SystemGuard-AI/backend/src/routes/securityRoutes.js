const express = require('express');
const router = express.Router();
const SecurityLog = require('../models/SecurityLog');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);

// GET all security logs
router.get('/logs', async (req, res) => {
  try {
    const logs = await SecurityLog.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET blocked IPs
router.get('/blocked-ips', async (req, res) => {
  try {
    const blocked = await SecurityLog.find({
      isBlocked: true,
      blockedUntil: { $gt: new Date() },
    }).select('ip attempts blockedAt blockedUntil email');
    res.json({ success: true, data: blocked });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE unblock IP
router.delete('/unblock/:ip', adminOnly, async (req, res) => {
  try {
    await SecurityLog.updateMany(
      { ip: req.params.ip },
      { isBlocked: false, blockedUntil: null }
    );
    res.json({ success: true, message: `IP ${req.params.ip} unblocked` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
