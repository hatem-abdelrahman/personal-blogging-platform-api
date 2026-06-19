const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check if token is provided in the Authorization header (Bearer <token>)
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'You are not logged in. Please log in to get access.',
      });
    }

    // 2. Verify token signature and expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Check if user still exists in the database
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!currentUser) {
      return res.status(401).json({
        status: 'error',
        message: 'The user belonging to this token no longer exists.',
      });
    }

    // 4. Grant access to the protected route by attaching the user to the request
    req.user = currentUser;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);

    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token. Please log in again.',
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Your login session has expired. Please log in again.',
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Internal server error during authorization.',
    });
  }
};

module.exports = { protect };
