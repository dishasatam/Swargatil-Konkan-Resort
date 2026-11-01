<?php
require_once __DIR__ . '/db.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $visitor_name    = trim($_POST['visitor_name'] ?? '');
    $email           = trim($_POST['email'] ?? '');
    $mobile          = trim($_POST['mobile'] ?? '');
    $total_adults    = intval($_POST['total_adults'] ?? 1);
    $total_children  = intval($_POST['total_children'] ?? 0);
    $checkin         = trim($_POST['checkin'] ?? '');
    $checkout        = trim($_POST['checkout'] ?? '');
    $room_preference = trim($_POST['room_preference'] ?? 'standard');
    $visitor_message = trim($_POST['visitor_message'] ?? '');

    if (empty($visitor_name) || empty($email) || empty($mobile) || empty($checkin) || empty($checkout)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Please fill all required fields.']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO bookings (visitor_name, email, mobile, total_adults, total_children, checkin, checkout, room_preference, visitor_message, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Confirmed')");
        $stmt->execute([$visitor_name, $email, $mobile, $total_adults, $total_children, $checkin, $checkout, $room_preference, $visitor_message]);
        
        echo json_encode([
            'success' => true,
            'bookingId' => $pdo->lastInsertId(),
            'message' => 'Booking successfully confirmed!'
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?>
