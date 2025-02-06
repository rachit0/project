const express = require('express');
const auth = require('../middleware/auth');
const Task = require('../models/Task');

const router = express.Router();

// Create task
router.post('/', auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      createdBy: req.user._id
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all tasks with filters
router.get('/', auth, async (req, res) => {
  try {
    const match = {};
    const sort = {};

    // Status filter
    if (req.query.status) {
      match.status = req.query.status;
    }

    // Priority filter
    if (req.query.priority) {
      match.priority = req.query.priority;
    }

    // Due date filter
    if (req.query.dueDate) {
      match.dueDate = { $lte: new Date(req.query.dueDate) };
    }

    // Assigned to filter
    if (req.query.assignedTo) {
      match.assignedTo = req.query.assignedTo;
    }

    // Sorting
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    const tasks = await Task.find(match)
      .populate('assignedTo', 'username email')
      .populate('createdBy', 'username email')
      .sort(sort);

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get task by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'username email')
      .populate('createdBy', 'username email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task
router.patch('/:id', auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      'title', 
      'description', 
      'status', 
      'priority', 
      'dueDate', 
      'assignedTo'
    ];
    
    const isValidOperation = updates.every(update => 
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    updates.forEach(update => task[update] = req.body[update]);
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;