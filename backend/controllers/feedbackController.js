const pool = require('../config/db');

// Submit guest feedback & review
exports.submitFeedback = async (req, res) => {
  try {
    const { uname, email, phone, satisfy, star, msg } = req.body;

    if (!uname || !email || !msg) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and suggestions/feedback message are required.'
      });
    }

    let starRating = 5;
    if (star !== undefined) {
      if (typeof star === 'string' && star.startsWith('star')) {
        const idx = parseInt(star.replace('star', ''));
        starRating = isNaN(idx) ? 5 : idx + 1;
      } else {
        starRating = parseInt(star) || 5;
      }
    }

    const query = `
      INSERT INTO feedbacks (uname, email, phone, satisfy, star_rating, message)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(query, [
      uname.trim(),
      email.trim(),
      phone ? phone.trim() : '',
      satisfy === 'no' ? 'no' : 'yes',
      starRating,
      msg.trim()
    ]);

    const wantsJson = req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'));
    if (wantsJson) {
      return res.status(201).json({
        success: true,
        feedbackId: result.insertId,
        message: 'Thank you for your valuable feedback! We appreciate your support.'
      });
    }

    return res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Feedback Received</title>
        <link rel="stylesheet" href="/feedback.css">
        <style>
          .confirm-box {
            max-width: 500px;
            margin: 80px auto;
            background: #fff;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
            text-align: center;
            font-family: Arial, sans-serif;
          }
          .confirm-box h2 { color: #e65100; }
          .btn-nav {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background: #e65100;
            color: #fff;
            text-decoration: none;
            border-radius: 6px;
          }
        </style>
      </head>
      <body>
        <div class="confirm-box">
          <h2> Feedback Submitted!</h2>
          <p>Thank you <strong>${uname}</strong> for sharing your experience with Swargatil Konkan Resort.</p>
          <p>Your suggestions help us provide the finest hospitality experience.</p>
          <a class="btn-nav" href="/html/web.html">Return to Home</a>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record feedback: ' + error.message
    });
  }
};

// Retrieve all feedback entries
exports.getAllFeedbacks = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM feedbacks ORDER BY created_at DESC'
    );
    res.json({
      success: true,
      count: rows.length,
      feedbacks: rows
    });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching feedbacks: ' + error.message
    });
  }
};

// Delete feedback entry
exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM feedbacks WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Feedback not found.' });
    }

    res.json({ success: true, message: 'Feedback entry deleted.' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ success: false, message: 'Error deleting feedback: ' + error.message });
  }
};
