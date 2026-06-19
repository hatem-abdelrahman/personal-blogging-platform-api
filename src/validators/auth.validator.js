const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address format'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(1, 'Password is required'),
});

module.exports = {
  registerSchema,
  loginSchema,
};
