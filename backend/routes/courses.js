const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { protect, admin } = require('../middleware/authMiddleware');
const Notification = require('../models/Notification');
const User = require('../models/User');
const multer = require('multer');
const pdfParse = require('pdf-parse');

const upload = multer({ storage: multer.memoryStorage() });

// Fetch all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new course
router.post('/', protect, admin, async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    await newCourse.save();

    // Notify all students
    const students = await User.find({ role: 'student' }, '_id');
    const notifications = students.map(s => ({
      recipient: s._id,
      title: 'New Course Added',
      message: `A new course "${newCourse.title}" has been added!`,
      type: 'course',
      link: 'courses'
    }));
    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(201).json(newCourse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update an existing course (Syllabus/Modules)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCourse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a course
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload and Parse PDF Notes
router.post('/:id/upload-pdf', protect, admin, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded.' });
    }

    const data = await pdfParse(req.file.buffer);
    const text = data.text;

    // Split text by "Module X"
    // We assume the text has sections starting with "Module 1", "Module 2", etc.
    const moduleRegex = /(?:\n|^)(Module\s+\d+.*?)(?=(?:\n|^)Module\s+\d+|$)/gis;
    let match;
    const newModules = [];

    while ((match = moduleRegex.exec(text)) !== null) {
      const moduleContent = match[0].trim();
      // Extract title from the first line
      const firstLineBreak = moduleContent.indexOf('\n');
      let title = "Extracted Module";
      let content = moduleContent;
      if (firstLineBreak !== -1) {
        title = moduleContent.substring(0, firstLineBreak).trim();
        content = moduleContent.substring(firstLineBreak).trim();
      } else {
        title = moduleContent;
      }
      
      newModules.push({
        title: title,
        lessons: [{
          title: 'Module Notes',
          type: 'Notes',
          content: content
        }]
      });
    }

    if (newModules.length === 0) {
      // Fallback if no "Module" keyword is found: Just put everything in one module
      newModules.push({
        title: 'Course Notes',
        lessons: [{
          title: 'Full Notes',
          type: 'Notes',
          content: text.trim()
        }]
      });
    }

    // Find course and update
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    course.modules.push(...newModules);
    await course.save();

    res.json(course);
  } catch (err) {
    console.error('Error parsing PDF:', err);
    res.status(500).json({ error: 'Failed to process PDF' });
  }
});

module.exports = router;