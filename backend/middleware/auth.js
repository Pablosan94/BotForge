require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET ?? 'jwt-secret-sauce';

module.exports = async (req, res, next) => {
  const token = req.header('authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const user = jwt.verify(token, JWT_SECRET);
    if (user.id) {
      next();
    } else {
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong!' });
  }
};
