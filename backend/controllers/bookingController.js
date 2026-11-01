const pool = require('../config/db');

// Create a new resort booking
exports.createBooking = async (req, res) => {
  try {
    const {
      visitor_name,
      email,
      mobile,
      total_adults,
      total_children,
      checkin,
      checkout,
      room_preference,
      visitor_message
    } = req.body;

    if (!visitor_name || !email || !mobile || !checkin || !checkout) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, mobile, check-in, and check-out dates.'
      });
    }

    const query = `
      INSERT INTO bookings (
        visitor_name, email, mobile, total_adults, total_children,
        checkin, checkout, room_preference, visitor_message, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Confirmed')
    `;

    const [result] = await pool.query(query, [
      visitor_name.trim(),
      email.trim(),
      mobile.trim(),
      parseInt(total_adults) || 1,
      parseInt(total_children) || 0,
      checkin,
      checkout,
      room_preference || 'standard',
      visitor_message ? visitor_message.trim() : ''
    ]);

    // Also mirror to legacy 'book' database/table if it exists
    try {
      await pool.query(
        `INSERT INTO \`book\`.\`book\` (visitor_name, email, mobile, total_adults, total_children, checkin, checkout, room_preference, visitor_message)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          visitor_name.trim(),
          email.trim(),
          mobile.trim(),
          parseInt(total_adults) || 1,
          parseInt(total_children) || 0,
          checkin,
          checkout,
          room_preference || 'standard',
          visitor_message ? visitor_message.trim() : ''
        ]
      );
    } catch (ignoreErr) {
      // Legacy table mirror is non-blocking
    }

    // Return HTML confirmation or JSON based on request headers
    const wantsJson = req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'));
    if (wantsJson) {
      return res.status(201).json({
        success: true,
        bookingId: result.insertId,
        message: 'Thank you for booking with Swargatil Konkan Resort! Your booking is confirmed.',
        booking: {
          id: result.insertId,
          visitor_name,
          email,
          mobile,
          checkin,
          checkout,
          room_preference
        }
      });
    }

    // Direct Form POST response with auto-redirect back
    return res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Booking Confirmed</title>
        <link rel="stylesheet" href="/book.css">
        <style>
          .confirm-card {
            max-width: 600px;
            margin: 80px auto;
            background: #fff;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
            text-align: center;
            font-family: Arial, sans-serif;
          }
          .confirm-card h2 { color: #2e7d32; }
          .btn-home {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 24px;
            background: #2e7d32;
            color: #fff;
            text-decoration: none;
            border-radius: 6px;
          }
        </style>
      </head>
      <body bgcolor="ivory">
        <div class="confirm-card">
          <h2> Booking Confirmed!</h2>
          <p>Thank you <strong>${visitor_name}</strong> for booking with <strong>Swargatil Konkan Resort</strong>.</p>
          <p>Your Booking Reference ID is: <strong>#SKR-${result.insertId}</strong></p>
          <p>Check-in: <strong>${checkin}</strong> | Check-out: <strong>${checkout}</strong></p>
          <p>We look forward to welcoming you to the paradise of Konkan!</p>
          <a class="btn-home" href="/html/web.html">Back to Home</a>
          <a class="btn-home" style="background:#555;" href="/html/Booked.html">New Booking</a>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error in createBooking:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to save booking. Database error: ' + error.message
    });
  }
};

// Retrieve all bookings (for Admin Dashboard)
exports.getAllBookings = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM bookings ORDER BY created_at DESC'
    );
    res.json({
      success: true,
      count: rows.length,
      bookings: rows
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings: ' + error.message
    });
  }
};

// Update booking status (Confirmed, Cancelled, Completed)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Confirmed', 'Pending', 'Cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Allowed: Confirmed, Pending, Cancelled'
      });
    }

    const [result] = await pool.query(
      'UPDATE bookings SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.'
      });
    }

    res.json({
      success: true,
      message: `Booking #SKR-${id} status updated to ${status}.`
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating status: ' + error.message
    });
  }
};

// Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM bookings WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.'
      });
    }

    res.json({
      success: true,
      message: `Booking #SKR-${id} deleted successfully.`
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting booking: ' + error.message
    });
  }
};

// Cancel booking by ID or Phone/Email
exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId, email, mobile } = req.body;

    let query = '';
    let params = [];

    if (bookingId) {
      query = 'UPDATE bookings SET status = "Cancelled" WHERE id = ?';
      params = [bookingId];
    } else if (email && mobile) {
      query = 'UPDATE bookings SET status = "Cancelled" WHERE email = ? AND mobile = ?';
      params = [email, mobile];
    } else {
      return res.status(400).json({
        success: false,
        message: 'Provide booking ID or both email and mobile to cancel booking.'
      });
    }

    const [result] = await pool.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'No active booking found matching the provided details.'
      });
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully.'
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking: ' + error.message
    });
  }
};

// Aggregated Dashboard Statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const [[bookingCounts]] = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Confirmed' THEN 1 ELSE 0 END) as confirmed,
        SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) as cancelled
      FROM bookings
    `);

    const [[feedbackCounts]] = await pool.query(`
      SELECT 
        COUNT(*) as total,
        IFNULL(AVG(star_rating), 5) as avgRating
      FROM feedbacks
    `);

    const [[contactCounts]] = await pool.query(`
      SELECT COUNT(*) as total FROM contacts
    `);

    res.json({
      success: true,
      stats: {
        totalBookings: bookingCounts.total || 0,
        confirmedBookings: bookingCounts.confirmed || 0,
        cancelledBookings: bookingCounts.cancelled || 0,
        totalFeedbacks: feedbackCounts.total || 0,
        avgRating: Number(feedbackCounts.avgRating).toFixed(1),
        totalContacts: contactCounts.total || 0
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stats: ' + error.message
    });
  }
};
