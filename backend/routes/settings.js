const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { protect, admin } = require('../middleware/authMiddleware');

// Get global settings (Public)
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne({ singletonId: 'global' });
    if (!settings) {
      settings = new Settings({ singletonId: 'global' });
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update global settings (Admin only)
router.put('/', protect, admin, async (req, res) => {
  try {
    const updateData = req.body;
    let settings = await Settings.findOneAndUpdate(
      { singletonId: 'global' },
      updateData,
      { new: true, upsert: true }
    );
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
