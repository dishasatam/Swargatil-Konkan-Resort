const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// GET /api/bookings/stats/overview - Overview statistics
router.get('/stats/overview', bookingController.getDashboardStats);

// POST /api/bookings - Create new booking
router.post('/', bookingController.createBooking);

// GET /api/bookings - Get all bookings
router.get('/', bookingController.getAllBookings);

// POST /api/bookings/cancel - Cancel booking by ID / phone
router.post('/cancel', bookingController.cancelBooking);

// PATCH or POST /api/bookings/:id/status - Update booking status
router.patch('/:id/status', bookingController.updateBookingStatus);
router.post('/:id/status', bookingController.updateBookingStatus);

// DELETE /api/bookings/:id - Delete booking
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;
