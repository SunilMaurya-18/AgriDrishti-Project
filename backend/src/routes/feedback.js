const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Feedback = require('../models/Feedback');

// POST /api/feedback — submit feedback
router.post('/feedback', protect, async (req, res) => {
  try {
    const { category, rating, subject, message } = req.body;

    if (!rating || !subject || !message) {
      return res.status(400).json({ error: 'Rating, subject, and message are required.' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
    }

    if (subject.length > 200) {
      return res.status(400).json({ error: 'Subject must be under 200 characters.' });
    }

    if (message.length > 2000) {
      return res.status(400).json({ error: 'Message must be under 2000 characters.' });
    }

    const feedback = await Feedback.create({
      user: req.user._id,
      category: category || 'general',
      rating,
      subject,
      message,
    });

    res.status(201).json({ message: 'Feedback submitted successfully!', feedback });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit feedback.' });
  }
});

// GET /api/feedback — get user's own feedback history
router.get('/feedback', protect, async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    res.json({ feedbacks });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch feedback.' });
  }
});

module.exports = router;
