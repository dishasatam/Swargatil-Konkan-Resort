-- ========================================================
-- Swargatil Konkan Resort - Database Schema
-- DBMS: MySQL / MariaDB
-- ========================================================

CREATE DATABASE IF NOT EXISTS `swargatil_konkan_db` 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `swargatil_konkan_db`;

-- Table: Bookings
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `visitor_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `mobile` VARCHAR(25) NOT NULL,
  `total_adults` INT NOT NULL DEFAULT 1,
  `total_children` INT NOT NULL DEFAULT 0,
  `checkin` DATE NOT NULL,
  `checkout` DATE NOT NULL,
  `room_preference` VARCHAR(50) NOT NULL,
  `visitor_message` TEXT,
  `status` ENUM('Confirmed', 'Pending', 'Cancelled') NOT NULL DEFAULT 'Confirmed',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: Feedbacks
CREATE TABLE IF NOT EXISTS `feedbacks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `uname` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(25),
  `satisfy` ENUM('yes', 'no') NOT NULL DEFAULT 'yes',
  `star_rating` INT NOT NULL DEFAULT 5,
  `message` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: Contact Inquiries
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) DEFAULT 'Guest',
  `email` VARCHAR(150),
  `phone` VARCHAR(25),
  `message` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: Users (Admin & Resort Staff)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `full_name` VARCHAR(150),
  `email` VARCHAR(100),
  `phone` VARCHAR(25),
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert Default Admin User (admin / Admin@123)
INSERT INTO `users` (`username`, `password`, `email`, `role`)
VALUES ('admin', 'Admin@123', 'admin@swargatilkokan.com', 'admin')
ON DUPLICATE KEY UPDATE `username`=`username`;

-- Insert Sample Demo Booking for Testing
INSERT INTO `bookings` (`visitor_name`, `email`, `mobile`, `total_adults`, `total_children`, `checkin`, `checkout`, `room_preference`, `visitor_message`, `status`)
SELECT 'Rohan Deshmukh', 'rohan@example.com', '9836543624', 2, 1, CURDATE() + INTERVAL 2 DAY, CURDATE() + INTERVAL 5 DAY, 'connecting', 'Sea view room requested', 'Confirmed'
WHERE NOT EXISTS (SELECT 1 FROM `bookings` LIMIT 1);

-- Compatibility Database 'book' (Matches original booking-form.php)
CREATE DATABASE IF NOT EXISTS `book`
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `book`;

CREATE TABLE IF NOT EXISTS `book` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `visitor_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `mobile` VARCHAR(25) NOT NULL,
  `total_adults` INT NOT NULL DEFAULT 1,
  `total_children` INT NOT NULL DEFAULT 0,
  `checkin` DATE NOT NULL,
  `checkout` DATE NOT NULL,
  `room_preference` VARCHAR(50) NOT NULL,
  `visitor_message` TEXT,
  `status` ENUM('Confirmed', 'Pending', 'Cancelled') NOT NULL DEFAULT 'Confirmed',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
