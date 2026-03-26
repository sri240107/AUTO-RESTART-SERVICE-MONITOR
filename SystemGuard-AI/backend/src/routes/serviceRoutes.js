const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);

// GET all services
router.get('/', async (req, res) => {
  const services = await Service.find().sort({ name: 1 });
  res.json({ success: true, data: services });
});

// POST add service
router.post('/', adminOnly, async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT restart service
router.put('/:id/restart', adminOnly, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { status: 'restarting', lastRestarted: new Date(), $inc: { restartCount: 1 } },
      { new: true }
    );
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE service
router.delete('/:id', adminOnly, async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Service removed' });
});

module.exports = router;
