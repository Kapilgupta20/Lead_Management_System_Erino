const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function createToken(payload) {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN;
  return jwt.sign(payload, secret, { expiresIn });
}

// helper: cookie options to use when setting and clearing cookie
function cookieOptions() {
  const raw = process.env.JWT_EXPIRES_IN;
  let maxAgeMs = 60 * 60 * 1000;
  if (raw.endsWith('h')) {
    const hours = parseInt(raw.slice(0, -1), 10) || 1;
    maxAgeMs = hours * 60 * 60 * 1000;
  } else if (raw.endsWith('d')) {
    const days = parseInt(raw.slice(0, -1), 10) || 1;
    maxAgeMs = days * 24 * 60 * 60 * 1000;
  }
  return {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: maxAgeMs,
  };
}

// POST /auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    const token = createToken({ id: user._id.toString() });
    res.cookie(process.env.COOKIE_NAME || 'token', token, cookieOptions());

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (err) {
    next(err);
  }
};

// POST /auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = createToken({ id: user._id.toString() });
    res.cookie(process.env.COOKIE_NAME, token, cookieOptions());

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (err) {
    next(err);
  }
};

// POST /auth/logout
exports.logout = async (req, res, next) => {
  try {
    const name = process.env.COOKIE_NAME;
    res.clearCookie(name, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    res.json({ message: 'Logged out' });
  } catch (err) {
    next(err);
  }
};

// GET /auth/me
exports.getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (err) {
    next(err);
  }
};
