const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  recipient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    default: null // null implies it's a notification for all admins
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, required: true }, // 'registration', 'enrollment', 'payment', 'access', 'course'
  link: { type: String, required: true }, // The currentView it should redirect to
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
