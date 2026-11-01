const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool for MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'swargatil_konkan_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Auto-initialize schema if tables are missing
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    console.log(' connected to MySQL database: swargatil_konkan_db');

    // Ensure tables exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`bookings\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`visitor_name\` VARCHAR(150) NOT NULL,
        \`email\` VARCHAR(150) NOT NULL,
        \`mobile\` VARCHAR(25) NOT NULL,
        \`total_adults\` INT NOT NULL DEFAULT 1,
        \`total_children\` INT NOT NULL DEFAULT 0,
        \`checkin\` DATE NOT NULL,
        \`checkout\` DATE NOT NULL,
        \`room_preference\` VARCHAR(50) NOT NULL,
        \`visitor_message\` TEXT,
        \`status\` ENUM('Confirmed', 'Pending', 'Cancelled') NOT NULL DEFAULT 'Confirmed',
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`feedbacks\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`uname\` VARCHAR(150) NOT NULL,
        \`email\` VARCHAR(150) NOT NULL,
        \`phone\` VARCHAR(25),
        \`satisfy\` ENUM('yes', 'no') NOT NULL DEFAULT 'yes',
        \`star_rating\` INT NOT NULL DEFAULT 5,
        \`message\` TEXT NOT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`contacts\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`name\` VARCHAR(150) DEFAULT 'Guest',
        \`email\` VARCHAR(150),
        \`phone\` VARCHAR(25),
        \`message\` TEXT NOT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`users\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`username\` VARCHAR(50) NOT NULL UNIQUE,
        \`password\` VARCHAR(255) NOT NULL,
        \`email\` VARCHAR(100),
        \`role\` ENUM('admin', 'user') NOT NULL DEFAULT 'user',
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Ensure default admin exists
    await connection.query(`
      INSERT INTO \`users\` (\`username\`, \`password\`, \`email\`, \`role\`)
      VALUES ('admin', 'Admin@123', 'admin@swargatilkokan.com', 'admin')
      ON DUPLICATE KEY UPDATE \`username\`=\`username\`;
    `);

    connection.release();
  } catch (error) {
    console.error(' MySQL Initialization Warning:', error.message);
  }
}

initializeDatabase();

module.exports = pool;
