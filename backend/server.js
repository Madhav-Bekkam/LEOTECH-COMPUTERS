const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const assessmentRoutes = require('./routes/assessments');
const enrollmentRoutes = require('./routes/enrollments');
const paymentRoutes = require('./routes/payments');
const notificationRoutes = require('./routes/notifications');
const settingsRoutes = require('./routes/settings');
const User = require('./models/User'); 

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase limit for Base64 image uploads

connectDB().then(async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@leotechcomputers.com' });
    if (!adminExists) {
      await User.create({ name: 'Super Admin', email: 'admin@leotechcomputers.com', password: 'Admin@123', role: 'admin', city: 'Headquarters' });
      console.log('✅ Default Admin created');
    }
  } catch (err) { console.error('Error seeding admin:', err.message); }
});

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/settings', settingsRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running securely on port ${PORT}`));