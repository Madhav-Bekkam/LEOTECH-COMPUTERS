const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');
const { protect, admin } = require('../middleware/authMiddleware');

// Fetch all assessments
router.get('/', async (req, res) => {
  try {
    const assessments = await Assessment.find();
    res.json(assessments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new assessment
router.post('/', protect, admin, async (req, res) => {
  try {
    const newAssessment = new Assessment(req.body);
    await newAssessment.save();
    res.status(201).json(newAssessment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update an existing assessment
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const updatedAssessment = await Assessment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedAssessment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete assessment
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await Assessment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Assessment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;