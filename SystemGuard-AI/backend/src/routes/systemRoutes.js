const express = require('express');
const router = express.Router();
const { getCurrentMetrics, getMetricsHistory, getSystemInfo } = require('../controllers/systemController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/metrics', getCurrentMetrics);
router.get('/history', getMetricsHistory);
router.get('/info', getSystemInfo);

module.exports = router;
