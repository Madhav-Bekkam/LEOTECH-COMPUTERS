const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/email');
const { protect, admin } = require('../middleware/authMiddleware');
const Notification = require('../models/Notification');

const JWT_SECRET = process.env.JWT_SECRET || 'leotech_super_secret_key_2026';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'dummy_client_id'; // User will set this in prod
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '1d' });
};

// Seed Admin Route (Unchanged but improved)
router.post('/seed-admin', async (req, res) => {
  try {
    let adminUser = await User.findOne({ email: 'admin@leotechcomputers.com' });
    if (adminUser) return res.json({ message: 'Admin already seeded' });
    await User.create({ 
      name: 'Super Admin', 
      email: 'admin@leotechcomputers.com', 
      password: 'Admin@123', 
      role: 'admin', 
      city: 'Headquarters',
      emailVerified: true,
      provider: 'email'
    });
    res.status(201).json({ message: 'Admin seeded successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 1. Email Registration
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: 'User already exists with this email' });
    
    const newUser = new User({ 
      name, 
      email, 
      password, 
      provider: 'email',
      verificationToken: null,
      emailVerified: true, // Auto-verify for local dev/testing
      role: 'student',
      city: 'Unknown'
    });
    
    await newUser.save();
    
    const token = generateToken(newUser._id, newUser.role);
    
    // Notify admin
    await Notification.create({
      recipient: null, // Admin
      title: 'New Student Registration',
      message: `${newUser.name} joined LEOTECH COMPUTERS.`,
      type: 'registration',
      link: 'students'
    });

    res.status(201).json({ token, user: newUser });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. Verify Email
router.get('/verify-email/:token', async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });
    if (!user) return res.status(400).json({ error: 'Invalid or expired verification token.' });

    user.emailVerified = true;
    user.verificationToken = null;
    await user.save();

    res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 3. Email/Password Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).populate('enrolledCourses').populate('enrolledAssessments');
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });
    
    if (user.provider !== 'email') {
      return res.status(400).json({ error: `Please log in using ${user.provider}.` });
    }

    if (user.accountStatus !== 'active') {
      return res.status(403).json({ error: 'Your account is suspended or blocked.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id, user.role);
    
    res.json({ 
      token, 
      user: { 
        id: user._id, name: user.name, email: user.email, role: user.role, 
        profilePic: user.profileImage, city: user.city, phone: user.phone, 
        emailVerified: user.emailVerified,
        enrolledCourseIds: user.enrolledCourses.map(c => c._id),
        enrolledAssessmentIds: user.enrolledAssessments.map(a => a._id)
      }
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 4. Google OAuth Login/Registration
router.post('/google', async (req, res) => {
  const { credential } = req.body;
  try {
    // Validate Google Token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture, email_verified } = payload;

    let user = await User.findOne({ email }).populate('enrolledCourses').populate('enrolledAssessments');
    
    if (user) {
      // Existing User Logic
      if (user.accountStatus !== 'active') {
        return res.status(403).json({ error: 'Your account is suspended or blocked.' });
      }
      if (!user.googleId) {
        // Link Google ID if they initially signed up with Email
        user.googleId = googleId;
        user.profileImage = user.profileImage || picture;
      }
      user.emailVerified = user.emailVerified || email_verified;
      user.lastLogin = new Date();
      await user.save();
    } else {
      // Create new Google User
      user = new User({
        name,
        email,
        googleId,
        provider: 'google',
        profileImage: picture,
        emailVerified: email_verified,
        role: 'student',
        city: 'Unknown',
        lastLogin: new Date()
      });
      await user.save();
      
      // Notify admin
      await Notification.create({
        recipient: null, // Admin
        title: 'New Student Registration',
        message: `${user.name} joined LEOTECH COMPUTERS via Google.`,
        type: 'registration',
        link: 'students'
      });
    }

    const token = generateToken(user._id, user.role);

    res.json({ 
      token, 
      user: { 
        id: user._id, name: user.name, email: user.email, role: user.role, 
        profilePic: user.profileImage, city: user.city, phone: user.phone, 
        emailVerified: user.emailVerified,
        enrolledCourseIds: user.enrolledCourses?.map(c => c._id) || [],
        enrolledAssessmentIds: user.enrolledAssessments?.map(a => a._id) || []
      }
    });
  } catch (err) { 
    console.error("Google Auth Error:", err);
    res.status(500).json({ error: 'Google Authentication failed.' }); 
  }
});

// 5. Password Reset Request
router.post('/forgot-password', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ error: 'No user found with that email address.' });
    if (user.provider === 'google') return res.status(400).json({ error: 'This account uses Google Login. Password reset is not applicable.' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    await sendPasswordResetEmail(user.email, user.name, resetToken);
    res.json({ message: 'Password reset link sent to your email.' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 6. Password Reset Confirmation
router.post('/reset-password/:token', async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ 
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ error: 'Token is invalid or has expired.' });

    user.password = req.body.password; // Pre-save hook will hash it
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: 'Password has been successfully reset. You can now log in.' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 7. Change Password (Protected)
router.post('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.provider === 'google') return res.status(400).json({ error: 'Cannot change password for Google accounts.' });
    
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Incorrect current password' });
    
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Get All Students (Protected - Admin Only)
router.get('/students', protect, admin, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.json(students);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 9. Update Student Profile (Protected)
router.put('/students/:id', protect, async (req, res) => {
  try {
    // Basic authorization: Only the user themselves or an admin can update
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
       return res.status(403).json({ error: 'Not authorized to update this profile.' });
    }

    const updateData = {};
    // Only admins can update enrollments
    if (req.user.role === 'admin') {
       if (req.body.enrolledCourseIds !== undefined) updateData.enrolledCourses = req.body.enrolledCourseIds;
       if (req.body.enrolledAssessmentIds !== undefined) updateData.enrolledAssessments = req.body.enrolledAssessmentIds;
       if (req.body.accountStatus !== undefined) updateData.accountStatus = req.body.accountStatus;
    }
    
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.phone !== undefined) updateData.phone = req.body.phone;
    if (req.body.city !== undefined) updateData.city = req.body.city;
    if (req.body.profilePic !== undefined) updateData.profileImage = req.body.profilePic;
    
    const updatedStudent = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
    
    // Notify student about access changes if admin is doing it
    if (req.user.role === 'admin' && (req.body.enrolledCourseIds !== undefined || req.body.enrolledAssessmentIds !== undefined)) {
      await Notification.create({
        recipient: updatedStudent._id,
        title: 'Course Access Updated',
        message: `Your course/assessment access has been updated by the administration.`,
        type: 'access',
        link: 'courses'
      });
    }

    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 10. Delete Student (Protected - Admin Only)
router.delete('/students/:id', protect, admin, async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ error: 'Student not found.' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student removed successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;