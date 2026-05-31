const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/authMiddleware');

// Get notifications for current user
router.get('/', protect, async (req, res) => {
  try {
    const query = req.user.role === 'admin' 
      ? { $or: [{ recipient: null }, { recipient: req.user._id }] }
      : { recipient: req.user._id };
      
    const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(50);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark all as read
router.put('/read-all', protect, async (req, res) => {
  try {
    const query = req.user.role === 'admin' 
      ? { $or: [{ recipient: null }, { recipient: req.user._id }] }
      : { recipient: req.user._id };
      
    await Notification.updateMany(query, { isRead: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
