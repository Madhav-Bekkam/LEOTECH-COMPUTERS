const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  paymentId: { type: String, required: true, unique: true },
  requestId: { type: String, required: true },
  enrollmentId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  courseName: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  paymentMethod: { type: String, default: 'UPI' },
  transactionId: { type: String, required: true },
  paymentScreenshotUrl: { type: String, required: true }, // Base64 or URL
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Verification Pending', 'Approved', 'Rejected', 'Refunded'], 
    default: 'Verification Pending' 
  },
  verifiedByAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verificationDate: { type: Date },
  paymentDate: { type: Date, default: Date.now },
  notes: { type: String, default: '' },
  
  // Future Razorpay Fields
  razorpayOrderId: { type: String, default: '' },
  razorpayPaymentId: { type: String, default: '' },
  razorpaySignature: { type: String, default: '' },
  gatewayResponse: { type: mongoose.Schema.Types.Mixed },
  gatewayStatus: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
