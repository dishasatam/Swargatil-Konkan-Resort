const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// POST /api/contacts - Submit contact message
router.post('/', contactController.submitContact);

// GET /api/contacts - List inquiries
router.get('/', contactController.getAllContacts);

// DELETE /api/contacts/:id - Delete inquiry
router.delete('/:id', contactController.deleteContact);

module.exports = router;
