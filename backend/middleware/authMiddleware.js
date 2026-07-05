const jwt = require('jsonwebtoken');

// This function runs before protected routes to verify the user is logged in
const protect = (req, res, next) => {
  let token;

  // Tokens are sent in the header like: "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      token = authHeader.split(' ')[1]; // extract just the token part

      // Verify the token is valid and not expired
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user's id to the request so later code knows who is making the request
      req.userId = decoded.id;

      next(); // move on to the actual route logic
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };