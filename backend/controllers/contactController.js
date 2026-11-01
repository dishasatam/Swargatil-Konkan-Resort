const pool = require('../config/db');

// Submit contact / inquiry message
exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, msg } = req.body;

    if (!msg || msg.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please write a message before submitting.'
      });
    }

    const query = `
      INSERT INTO contacts (name, email, phone, message)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await pool.query(query, [
      name ? name.trim() : 'Guest',
      email ? email.trim() : '',
      phone ? phone.trim() : '',
      msg.trim()
    ]);

    res.status(201).json({
      success: true,
      contactId: result.insertId,
      message: 'Thank you for reaching out! We will contact you shortly.'
    });
  } catch (error) {
    console.error('Error submitting contact inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending inquiry: ' + error.message
    });
  }
};

// Retrieve all contact inquiries
exports.getAllContacts = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM contacts ORDER BY created_at DESC'
    );
    res.json({
      success: true,
      count: rows.length,
      contacts: rows
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts: ' + error.message
    });
  }
};

// Delete contact inquiry
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM contacts WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Contact not found.' });
    }

    res.json({ success: true, message: 'Inquiry deleted successfully.' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ success: false, message: 'Error deleting contact: ' + error.message });
  }
};
