const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getNearbyPlaces } = require('../controllers/nearbyController');

router.get('/', protect, getNearbyPlaces);

module.exports = router;