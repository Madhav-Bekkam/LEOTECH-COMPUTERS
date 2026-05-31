const express = require('express');
const router = express.Router();
const EnrollmentRequest = require('../models/EnrollmentRequest');
const Course = require('../models/Course');
const crypto = require('crypto');
const Notification = require('../models/Notification');
const { protect, admin, verified } = require('../middleware/authMiddleware');

// Generate unique IDs
const generateId = (prefix) => `${prefix}_${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

// Student: Request Enrollment
router.post('/request', protect, verified, async (req, res) => {
  try {
    const { userId, courseId, fullName, email, phone, message } = req.body;
    
    // Check if duplicate request exists
    const existing = await EnrollmentRequest.findOne({ userId, courseId });
    if (existing) {
      return res.status(400).json({ error: 'Enrollment request already exists for this course.' });
    }

    const newRequest = new EnrollmentRequest({
      requestId: generateId('REQ'),
      enrollmentId: generateId('ENR'),
      userId,
      courseId,
      fullName,
      email,
      phone,
      message,
      requestStatus: 'Pending Payment'
    });

    await newRequest.save();
    
    // Notify admin
    const course = await Course.findById(courseId);
    await Notification.create({
      recipient: null,
      title: 'New Enrollment Request',
      message: `${fullName} wants to enroll in ${course ? course.title : 'a course'}.`,
      type: 'enrollment',
      link: 'enrollments'
    });

    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Student: Get My Requests
router.get('/my-requests/:userId', protect, async (req, res) => {
  // Ensure user can only fetch their own requests unless admin
  if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.userId) {
     return res.status(403).json({ error: 'Access denied.' });
  }
  try {
    const requests = await EnrollmentRequest.find({ userId: req.params.userId }).populate('courseId');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Get All Requests
router.get('/', protect, admin, async (req, res) => {
  try {
    const requests = await EnrollmentRequest.find().populate('courseId').populate('userId', 'name email');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Request Status
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { requestStatus, adminNotes } = req.body;
    const request = await EnrollmentRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (req.user.role !== 'admin') {
      if (requestStatus !== 'Cancelled') {
        return res.status(403).json({ error: 'Access denied: Admin privileges required to approve or change status to anything other than Cancelled.' });
      }
      if (request.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Access denied: You can only cancel your own requests.' });
      }
      request.requestStatus = 'Cancelled';
      await request.save();
      return res.json(request);
    }

    request.requestStatus = requestStatus;
    if (adminNotes !== undefined) request.adminNotes = adminNotes;
    await request.save();
    
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
