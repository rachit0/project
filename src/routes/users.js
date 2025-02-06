const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get all users
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id, '-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user
router.patch('/:id', auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['username', 'email'];
    const isValidOperation = updates.every(update => 
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    updates.forEach(update => user[update] = req.body[update]);
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/:id', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;