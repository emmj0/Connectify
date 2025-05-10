const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');

const requireAuth = async (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.header('Authorization');
    const token = authHeader && (authHeader.startsWith('Bearer ') || authHeader.startsWith('bearer '))
      ? authHeader.split(' ')[1]  // Get the token after 'Bearer ' or 'bearer '
      : null;

    console.log('Token:', token); // Log the token for debugging
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Decode and verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user based on the decoded token ID
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    req.user = { id: user._id }; // Attach the user ID to the request
    next();
  } catch (err) {
    console.error('JWT Error:', err); // Log the error to understand what went wrong
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = requireAuth;
