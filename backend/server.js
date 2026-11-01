const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const pool = require('./config/db');
const bookingRoutes = require('./routes/bookingRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const bookingController = require('./controllers/bookingController');
const feedbackController = require('./controllers/feedbackController');

const app = express();
const PORT = process.env.PORT || 3000;
const rootDir = path.join(__dirname, '..');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/auth', authRoutes);

// Legacy form compatibility routes
app.post('/booking-form.php', bookingController.createBooking);
app.post('/feedback.php', feedbackController.submitFeedback);

// System health check
app.get('/api/health', async (req, res) => {
  try {
    const [result] = await pool.query('SELECT 1 as isAlive');
    res.json({
      status: 'online',
      service: 'Swargatil Konkan Resort API',
      database: 'MySQL connected',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      service: 'Swargatil Konkan Resort API',
      database: 'MySQL error: ' + err.message
    });
  }
});

// Serve classified static folders
app.use('/html', express.static(path.join(rootDir, 'html')));
app.use('/css', express.static(path.join(rootDir, 'css')));
app.use('/js', express.static(path.join(rootDir, 'js')));
app.use('/images', express.static(path.join(rootDir, 'images')));
app.use('/docs', express.static(path.join(rootDir, 'docs')));

// Root static fallback
app.use(express.static(rootDir));

// Intelligent fallback resolver for any direct root references
app.use((req, res, next) => {
  const reqPath = decodeURIComponent(req.path);
  const baseName = path.basename(reqPath);

  // HTML fallback
  const htmlFile = path.join(rootDir, 'html', baseName);
  if (fs.existsSync(htmlFile) && fs.statSync(htmlFile).isFile()) {
    return res.sendFile(htmlFile);
  }

  // CSS fallback
  const cssFile = path.join(rootDir, 'css', baseName);
  if (fs.existsSync(cssFile) && fs.statSync(cssFile).isFile()) {
    return res.sendFile(cssFile);
  }

  // JS fallback
  const jsFile = path.join(rootDir, 'js', baseName);
  if (fs.existsSync(jsFile) && fs.statSync(jsFile).isFile()) {
    return res.sendFile(jsFile);
  }

  // Image fallback
  const imgFile = path.join(rootDir, 'images', baseName);
  if (fs.existsSync(imgFile) && fs.statSync(imgFile).isFile()) {
    return res.sendFile(imgFile);
  }

  next();
});

// Default root route serves the Resort Homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(rootDir, 'html', 'web.html'));
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` Swargatil Konkan Resort Server is running!`);
  console.log(` Preview URL:     http://localhost:${PORT}`);
  console.log(` Home Page:       http://localhost:${PORT}/html/web.html`);
  console.log(` Admin Dashboard: http://localhost:${PORT}/html/admin.html`);
  console.log(` MySQL DB:        swargatil_konkan_db`);
  console.log(` Classified Dirs: html/ | css/ | js/ | images/ | docs/`);
  console.log(`=======================================================`);
});

module.exports = app;
