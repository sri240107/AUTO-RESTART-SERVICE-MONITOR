const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SecurityLog = require('../models/SecurityLog');
const logger = require('../utils/logger');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    logger.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// @POST /api/auth/login
exports.login = async (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    // Check if IP is blocked
    const blockedEntry = await SecurityLog.findOne({
      ip,
      isBlocked: true,
      blockedUntil: { $gt: new Date() },
    });

    if (blockedEntry) {
      return res.status(403).json({
        success: false,
        message: `IP blocked due to too many failed attempts. Try again after ${blockedEntry.blockedUntil.toLocaleTimeString()}`,
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      // Log failed attempt
      const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5;
      const existing = await SecurityLog.findOne({ ip, event: 'failed_login', isBlocked: false });

      if (existing) {
        existing.attempts += 1;
        if (existing.attempts >= maxAttempts) {
          existing.isBlocked = true;
          existing.event = 'ip_blocked';
          existing.blockedAt = new Date();
          const blockDuration = parseInt(process.env.BLOCK_DURATION_MINUTES) || 30;
          existing.blockedUntil = new Date(Date.now() + blockDuration * 60 * 1000);
          logger.warn(`🔒 IP ${ip} blocked after ${maxAttempts} failed attempts`);
        }
        await existing.save();
      } else {
        await SecurityLog.create({ ip, event: 'failed_login', email, userAgent: req.headers['user-agent'] });
      }

      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Clear failed login records on success
    await SecurityLog.deleteOne({ ip, event: 'failed_login' });

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// @GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
