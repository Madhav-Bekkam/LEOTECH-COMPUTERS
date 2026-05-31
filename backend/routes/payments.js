const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const EnrollmentRequest = require('../models/EnrollmentRequest');
const User = require('../models/User');
const crypto = require('crypto');
const Notification = require('../models/Notification');
const { protect, admin, verified } = require('../middleware/authMiddleware');

const generateId = (prefix) => `${prefix}_${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

// Student: Submit Payment Proof
router.post('/submit-proof', protect, verified, async (req, res) => {
  try {
    const { requestId, enrollmentId, userId, courseId, courseName, amount, transactionId, paymentScreenshotUrl } = req.body;

    const newPayment = new Payment({
      paymentId: generateId('PAY'),
      requestId,
      enrollmentId,
      userId,
      courseId,
      courseName,
      amount,
      transactionId,
      paymentScreenshotUrl,
      paymentStatus: 'Verification Pending'
    });

    await newPayment.save();

    // Update the EnrollmentRequest to 'Verification Pending'
    await EnrollmentRequest.findOneAndUpdate(
      { requestId },
      { requestStatus: 'Verification Pending' }
    );

    // Notify admin
    const user = await User.findById(userId);
    await Notification.create({
      recipient: null,
      title: 'New Payment Submitted',
      message: `${user ? user.name : 'A student'} has submitted a payment of ₹${amount} for ${courseName}.`,
      type: 'payment',
      link: 'payments'
    });

    res.status(201).json(newPayment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Get All Payments
router.get('/', protect, admin, async (req, res) => {
  try {
    const payments = await Payment.find().populate('userId', 'name email').populate('courseId', 'title');
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Verify Payment & Approve Access
router.put('/:id/verify', protect, admin, async (req, res) => {
  try {
    const { paymentStatus, notes, adminId } = req.body; // 'Approved' or 'Rejected'
    
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { paymentStatus, notes, verifiedByAdmin: adminId, verificationDate: new Date() },
      { new: true }
    );

    if (paymentStatus === 'Approved') {
      // 1. Update Enrollment Request
      await EnrollmentRequest.findOneAndUpdate(
        { requestId: payment.requestId },
        { requestStatus: 'Approved' }
      );

      // 2. Grant Access to Course (Add to User.enrolledCourses)
      await User.findByIdAndUpdate(payment.userId, {
        $addToSet: { enrolledCourses: payment.courseId }
      });
    } else if (paymentStatus === 'Rejected') {
      await EnrollmentRequest.findOneAndUpdate(
        { requestId: payment.requestId },
        { requestStatus: 'Rejected', adminNotes: notes }
      );
    }
    
    // Notify student
    await Notification.create({
      recipient: payment.userId,
      title: `Payment ${paymentStatus}`,
      message: `Your payment of ₹${payment.amount} for ${payment.courseName} has been ${paymentStatus.toLowerCase()}.`,
      type: 'payment',
      link: 'my-courses'
    });

    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
