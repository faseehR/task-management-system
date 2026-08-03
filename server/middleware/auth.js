const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return next(new ApiError(401, 'Not authorized. No token provided.'));
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new ApiError(401, 'Not authorized. Invalid or expired token.'));
  }

  
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new ApiError(401, 'Not authorized. This account no longer exists.'));
  }

  req.userId = decoded.id;
  next();
});

module.exports = protect;