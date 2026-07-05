const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { chatWithAI, detectMood } = require('../controllers/aiController');

router.post('/chat', protect, chatWithAI);
router.post('/mood', protect, detectMood);

module.exports = router;