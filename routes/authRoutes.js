const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to check if the email is in lowercase
const isLowerCaseEmail = (email) => /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(email);

router.post("/register", async (req, res) => {
  try {
    let { email, password } = req.body;

    // Check if email is in lowercase
    if (email !== email.toLowerCase()) {
      return res.status(400).json({ message: 'Email must be in lowercase' });
    }

    // Validate input data
    const { error } = User.validateUser(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Create new user
    const user = new User({ email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;

    // Check if email is in lowercase
    if (email !== email.toLowerCase()) {
      return res.status(400).json({ message: 'Email must be in lowercase' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const userId = user._id

    res.status(200).json({ message: 'Login successful', token, userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
