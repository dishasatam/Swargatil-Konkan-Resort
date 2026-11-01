const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// POST /api/feedbacks - Submit guest feedback
router.post('/', feedbackController.submitFeedback);

// GET /api/feedbacks - List all feedbacks
router.get('/', feedbackController.getAllFeedbacks);

// DELETE /api/feedbacks/:id - Delete feedback
router.delete('/:id', feedbackController.deleteFeedback);

module.exports = router;
