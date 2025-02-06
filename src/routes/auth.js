const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register
router.post('/register',
  [
    body('username').trim().isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, email, password } = req.body;

      const existingUser = await User.findOne({ 
        $or: [{ email }, { username }] 
      });

      if (existingUser) {
        return res.status(400).json({ 
          message: 'User already exists' 
        });
      }

      const user = new User({ username, email, password });
      await user.save();

      const token = jwt.sign(
        { userId: user._id }, 
        process.env.JWT_SECRET, 
        { expiresIn: '24h' }
      );

      res.status(201).json({ user, token });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Login
router.post('/login',
  [
    body('email').isEmail(),
    body('password').exists()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ 
          message: 'Invalid credentials' 
        });
      }

      const token = jwt.sign(
        { userId: user._id }, 
        process.env.JWT_SECRET, 
        { expiresIn: '24h' }
      );

      res.json({ user, token });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;