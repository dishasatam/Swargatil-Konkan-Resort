const pool = require('../config/db');

// Login authentication for guest and resort admin
exports.login = async (req, res) => {
  try {
    const { uname, psw, portal } = req.body;

    if (!uname || !psw) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both username and password.'
      });
    }

    const trimmedUser = uname.trim();

    // Find by username OR email
    const [users] = await pool.query(
      'SELECT id, username, full_name, email, phone, password, role FROM users WHERE username = ? OR email = ?',
      [trimmedUser, trimmedUser]
    );

    if (users.length === 0) {
      if (portal === 'admin') {
        return res.status(401).json({
          success: false,
          message: 'Admin account not found. Please verify your credentials.'
        });
      }

      // If portal is guest and user does not exist, return clear error prompting to register
      return res.status(401).json({
        success: false,
        message: 'Account not found. Please click "Register New Guest" to create your account.'
      });
    }

    const user = users[0];

    // Password check (plain text matching as used in project)
    if (user.password !== psw) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password. Please check your credentials and try again.'
      });
    }

    // Role check for Admin portal
    if (portal === 'admin' && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: This account does not have Admin / Operations privileges.'
      });
    }

    const redirectUrl = user.role === 'admin' ? '/html/admin.html' : '/html/web.html';

    return res.json({
      success: true,
      message: `Welcome back, ${user.full_name || user.username}!`,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name || user.username,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      redirectUrl
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.'
    });
  }
};

// Guest registration
exports.register = async (req, res) => {
  try {
    const { username, full_name, email, phone, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required.'
      });
    }

    const trimmedUser = username.trim();

    // Check if username already exists
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE username = ?',
      [trimmedUser]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'This username is already taken. Please choose another username or log in.'
      });
    }

    // Insert new guest user
    const [insertResult] = await pool.query(
      'INSERT INTO users (username, full_name, email, phone, password, role) VALUES (?, ?, ?, ?, ?, "user")',
      [trimmedUser, full_name ? full_name.trim() : null, email ? email.trim() : null, phone ? phone.trim() : null, password]
    );

    const newUser = {
      id: insertResult.insertId,
      username: trimmedUser,
      full_name: full_name || trimmedUser,
      email: email || null,
      phone: phone || null,
      role: 'user'
    };

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Please log in with your credentials to access the resort.',
      user: newUser,
      redirectUrl: '/html/Login.html?mode=login'
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration.'
    });
  }
};
