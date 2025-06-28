const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getLoginPage = (req, res) => {
  res.render('auth/login', { error: null, pageTitle: 'Login' });
};

exports.getRegisterPage = (req, res) => {
  res.render('auth/register', { error: null, success: null, pageTitle: 'Register' });
};

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('auth/register', { error: 'User already exists', success: null, pageTitle: 'Register' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
      cart: { items: [] },
    });
    await user.save();
    res.render('auth/register', { error: null, success: 'Registration successful! Please login.', pageTitle: 'Register' });
  } catch (err) {
    res.render('auth/register', { error: 'Registration failed: ' + err.message, success: null, pageTitle: 'Register' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('auth/login', { error: 'Invalid credentials', pageTitle: 'Login' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('auth/login', { error: 'Invalid credentials', pageTitle: 'Login' });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'supersecret',
      { expiresIn: '2h' }
    );
    // Set token in cookie for browser auth
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/');
  } catch (err) {
    res.render('auth/login', { error: 'Login failed: ' + err.message, pageTitle: 'Login' });
  }
}; 