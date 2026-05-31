const nodemailer = require('nodemailer');
const handlebars = require('handlebars');

// Configure Nodemailer transporter (Using a mock ethereal account for dev, or SMTP vars)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER || 'leotech-dev@example.com',
    pass: process.env.SMTP_PASS || 'password123'
  }
});

// Handlebars template compiler
const compileTemplate = (source, context) => {
  const template = handlebars.compile(source);
  return template(context);
};

// Base styles for the dark glassmorphism theme
const baseStyles = `
  body { font-family: 'Inter', sans-serif; background-color: #0A0F1E; color: #ffffff; padding: 40px 20px; text-align: center; }
  .container { max-width: 600px; margin: 0 auto; background: rgba(255,255,255,0.05); padding: 40px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); }
  .logo { font-size: 24px; font-weight: bold; color: #00C2FF; margin-bottom: 30px; letter-spacing: 2px; }
  .title { font-size: 28px; margin-bottom: 20px; font-weight: 800; }
  .text { font-size: 16px; color: #94a3b8; line-height: 1.6; margin-bottom: 30px; }
  .btn { display: inline-block; background: linear-gradient(to right, #00C2FF, #8B5CF6); color: #ffffff !important; text-decoration: none; padding: 15px 30px; border-radius: 12px; font-weight: bold; font-size: 16px; margin-bottom: 30px; }
  .footer { margin-top: 40px; font-size: 12px; color: #475569; border-top: 1px solid rgba(255,255,255,0.1); pt: 20px; }
`;

// Templates
const verificationTemplate = `
<!DOCTYPE html>
<html>
<head>
  <style>{{baseStyles}}</style>
</head>
<body>
  <div class="container">
    <div class="logo">LEOTECH COMPUTERS</div>
    <h1 class="title">Verify Your Email</h1>
    <p class="text">Hi {{name}},<br/><br/>Welcome to Leotech Computers! Please verify your email address to activate your account and start your learning journey.</p>
    <a href="{{verifyLink}}" class="btn">Verify Email Address</a>
    <p class="text" style="font-size: 14px;">If the button doesn't work, copy and paste this link:<br/>{{verifyLink}}</p>
    <div class="footer">&copy; 2026 Leotech Computers. All rights reserved.</div>
  </div>
</body>
</html>
`;

const passwordResetTemplate = `
<!DOCTYPE html>
<html>
<head>
  <style>{{baseStyles}}</style>
</head>
<body>
  <div class="container">
    <div class="logo">LEOTECH COMPUTERS</div>
    <h1 class="title">Reset Your Password</h1>
    <p class="text">Hi {{name}},<br/><br/>We received a request to reset your password. Click the button below to choose a new one. This link will expire in 1 hour.</p>
    <a href="{{resetLink}}" class="btn">Reset Password</a>
    <p class="text" style="font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
    <div class="footer">&copy; 2026 Leotech Computers. All rights reserved.</div>
  </div>
</body>
</html>
`;

// Exported Sender Functions
exports.sendVerificationEmail = async (email, name, token) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const verifyLink = `${frontendUrl}/verify-email/${token}`;
  const html = compileTemplate(verificationTemplate, { baseStyles, name, verifyLink });
  
  await transporter.sendMail({
    from: '"Leotech Computers" <noreply@leotechcomputers.com>',
    to: email,
    subject: 'Action Required: Verify Your Email',
    html
  });
};

exports.sendPasswordResetEmail = async (email, name, token) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetLink = `${frontendUrl}/reset-password/${token}`;
  const html = compileTemplate(passwordResetTemplate, { baseStyles, name, resetLink });
  
  await transporter.sendMail({
    from: '"Leotech Computers" <support@leotechcomputers.com>',
    to: email,
    subject: 'Password Reset Request',
    html
  });
};
