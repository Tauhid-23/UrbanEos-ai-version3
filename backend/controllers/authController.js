import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import { formatErrorMessage, successResponse, errorResponse } from '../utils/helpers.js';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      location,
      gardenType,
      spaceSize,
      experience,
      plants
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 'User with this email already exists', 400);
    }

    // Create user
    const user = await User.create({
      fullName,
      email,
      password,
      location,
      gardenType,
      spaceSize,
      experience,
      plants
    });

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    user.password = undefined;

    successResponse(res, {
      token,
      user
    }, 'User registered successfully', 201);

  } catch (error) {
    console.error('Register error:', error);
    errorResponse(res, formatErrorMessage(error), 500);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return errorResponse(res, 'Please provide email and password', 400);
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      return errorResponse(res, 'Account has been deactivated', 401);
    }

    // Verify password
    const isPasswordMatch = await user.comparePassword(password);
    
    if (!isPasswordMatch) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    user.password = undefined;

    successResponse(res, {
      token,
      user
    }, 'Login successful');

  } catch (error) {
    console.error('Login error:', error);
    errorResponse(res, 'Server error during login', 500);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    successResponse(res, { user }, 'User profile fetched successfully');
  } catch (error) {
    console.error('Get me error:', error);
    errorResponse(res, 'Error fetching user profile', 500);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  try {
    // In a stateless JWT system, logout is handled on the client side
    // by removing the token. This endpoint is just for confirmation.
    successResponse(res, null, 'Logout successful');
  } catch (error) {
    console.error('Logout error:', error);
    errorResponse(res, 'Error during logout', 500);
  }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return errorResponse(res, 'Please provide current and new password', 400);
    }

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return errorResponse(res, 'Current password is incorrect', 401);
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Generate new token
    const token = generateToken(user._id);

    successResponse(res, { token }, 'Password updated successfully');

  } catch (error) {
    console.error('Update password error:', error);
    errorResponse(res, 'Error updating password', 500);
  }
};
