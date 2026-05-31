const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'leotech_super_secret_key_2026';

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized to access this route. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ error: 'The user belonging to this token no longer exists.' });
    }
    
    if (user.accountStatus !== 'active') {
       return res.status(403).json({ error: 'Account is suspended or blocked.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Not authorized to access this route. Invalid token.' });
  }
};

exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
};

exports.verified = (req, res, next) => {
  if (req.user && req.user.emailVerified) {
    next();
  } else {
    res.status(403).json({ error: 'Email address is not verified. Please verify your email to access this resource.' });
  }
};
