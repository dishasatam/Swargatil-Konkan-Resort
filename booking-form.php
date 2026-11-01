<?php
// Swargatil Konkan Resort - PHP Booking Handler
header('Content-Type: text/html; charset=utf-8');

$host = 'localhost';
$user = 'root';
$pass = '';
$dbname = 'swargatil_konkan_db';

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    // Try fallback database 'book'
    $conn = new mysqli($host, $user, $pass, 'book');
    if ($conn->connect_error) {
        die('Database Connection Failed: ' . $conn->connect_error);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $visitor_name   = isset($_POST['visitor_name']) ? trim($_POST['visitor_name']) : '';
    $email          = isset($_POST['email']) ? trim($_POST['email']) : '';
    $mobile         = isset($_POST['mobile']) ? trim($_POST['mobile']) : '';
    $total_adults   = isset($_POST['total_adults']) ? intval($_POST['total_adults']) : 1;
    $total_children = isset($_POST['total_children']) ? intval($_POST['total_children']) : 0;
    $checkin        = isset($_POST['checkin']) ? trim($_POST['checkin']) : '';
    $checkout       = isset($_POST['checkout']) ? trim($_POST['checkout']) : '';
    $room_preference = isset($_POST['room_preference']) ? trim($_POST['room_preference']) : 'standard';
    $visitor_message = isset($_POST['visitor_message']) ? trim($_POST['visitor_message']) : '';

    if (empty($visitor_name) || empty($email) || empty($mobile) || empty($checkin) || empty($checkout)) {
        die('Please fill in all required fields.');
    }

    $stmt = $conn->prepare("INSERT INTO bookings (visitor_name, email, mobile, total_adults, total_children, checkin, checkout, room_preference, visitor_message, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Confirmed')");
    
    if (!$stmt) {
        // Fallback for table 'book'
        $stmt = $conn->prepare("INSERT INTO book (visitor_name, email, mobile, total_adults, total_children, checkin, checkout, room_preference, visitor_message) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssiissss", $visitor_name, $email, $mobile, $total_adults, $total_children, $checkin, $checkout, $room_preference, $visitor_message);
    } else {
        $stmt->bind_param("sssiissss", $visitor_name, $email, $mobile, $total_adults, $total_children, $checkin, $checkout, $room_preference, $visitor_message);
    }

    if ($stmt->execute()) {
        echo "<!DOCTYPE html>
        <html>
        <head>
          <title>Booking Confirmed</title>
          <link rel='stylesheet' href='book.css'>
          <style>
            .card { max-width: 600px; margin: 80px auto; background: #fff; padding: 30px; border-radius: 10px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-family: Arial, sans-serif; }
            .card h2 { color: #2e7d32; }
            .btn { display: inline-block; margin-top: 20px; padding: 10px 20px; background: #2e7d32; color: #fff; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body bgcolor='ivory'>
          <div class='card'>
            <h2>Booking Confirmed!</h2>
            <p>Thank you <strong>" . htmlspecialchars($visitor_name) . "</strong> for choosing Swargatil Konkan Resort.</p>
            <p>Check-in: <strong>" . htmlspecialchars($checkin) . "</strong> | Check-out: <strong>" . htmlspecialchars($checkout) . "</strong></p>
            <p>Have a wonderful stay!</p>
            <a class='btn' href='web.html'>Return to Home</a>
          </div>
        </body>
        </html>";
    } else {
        echo "Error saving booking: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>
