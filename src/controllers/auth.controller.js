const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

// POST /auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'A user with this email address already exists.',
      });
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3. Save to database
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // 4. Return new user (excluding password)
    return res.status(201).json({
      status: 'success',
      message: 'User registered successfully!',
      data: {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          createdAt: newUser.createdAt,
        },
      },
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error occurred.',
    });
  }
};

// POST /auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password.',
      });
    }

    // 2. Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password.',
      });
    }

    // 3. Generate JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // 4. Respond with token and user details
    return res.status(200).json({
      status: 'success',
      message: 'Logged in successfully!',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error occurred.',
    });
  }
};

module.exports = {
  register,
  login,
};
