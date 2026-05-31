const mongoose = require('mongoose');

const EnrollmentRequestSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true },
  enrollmentId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, default: '' },
  requestStatus: { 
    type: String, 
    enum: ['Pending Payment', 'Verification Pending', 'Approved', 'Rejected', 'Cancelled'], 
    default: 'Pending Payment' 
  },
  adminNotes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('EnrollmentRequest', EnrollmentRequestSchema);
