const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
});


const signup = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !name.trim()) return next(new ApiError(400, 'Name is required'));
  if (!email || !email.trim()) return next(new ApiError(400, 'Email is required'));
  if (!emailRegex.test(email)) return next(new ApiError(400, 'Enter a valid email address'));
  if (!password) return next(new ApiError(400, 'Password is required'));
  if (password.length < 6) return next(new ApiError(400, 'Password must be at least 6 characters'));

  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) return next(new ApiError(409, 'Email is already registered'));

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
  });

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: { user: sanitizeUser(user) },
  });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !email.trim()) return next(new ApiError(400, 'Email is required'));
  if (!password) return next(new ApiError(400, 'Password is required'));

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
  if (!user) return next(new ApiError(401, 'Invalid email or password'));

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return next(new ApiError(401, 'Invalid email or password'));

  const token = signToken(user._id);

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    data: { token, user: sanitizeUser(user) },
  });
});

module.exports = { signup, login };
