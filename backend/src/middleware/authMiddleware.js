// Verifies JWT from httpOnly cookie and attaches userId to req
const jwt = require('jsonwebtoken');

const cookieName = process.env.COOKIE_NAME || 'token';

exports.protect = (req, res, next) => {
  try {
    const token = req.cookies && req.cookies[cookieName];
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET not set');
      return res.status(500).json({ message: 'Server misconfiguration' });
    }
    const decoded = jwt.verify(token, secret);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};
