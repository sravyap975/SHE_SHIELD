const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { triggerSos, getSosHistory, updateSosStatus } = require('../controllers/sosController');

router.post('/', protect, triggerSos);
router.get('/', protect, getSosHistory);
router.put('/:id', protect, updateSosStatus);

module.exports = router;