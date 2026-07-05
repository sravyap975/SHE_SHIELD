const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createReport, getMyReports } = require('../controllers/reportController');

// Anyone can submit a report (no protect middleware) - supports true anonymous reporting
router.post('/', createReport);

// Only logged-in users can view their own report history
router.get('/my-reports', protect, getMyReports);

module.exports = router;