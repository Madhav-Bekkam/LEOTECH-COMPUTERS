const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for Google OAuth
  profileImage: { type: String, default: '' },
  provider: { type: String, enum: ['email', 'google'], default: 'email' },
  googleId: { type: String, default: null },
  emailVerified: { type: Boolean, default: false },
  accountStatus: { type: String, enum: ['active', 'suspended', 'blocked'], default: 'active' },
  lastLogin: { type: Date, default: null },
  verificationToken: { type: String, default: null },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
  role: { type: String, enum: ['admin', 'student'], default: 'student' },
  phone: { type: String, default: '' },
  city: { type: String, default: 'Unknown' },
  attendance: { type: Number, default: 100 },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  enrolledAssessments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assessment' }]
}, { timestamps: true });

UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', UserSchema);