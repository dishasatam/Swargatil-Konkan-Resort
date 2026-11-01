<?php
require_once __DIR__ . '/db.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $uname   = trim($_POST['uname'] ?? '');
    $email   = trim($_POST['email'] ?? '');
    $phone   = trim($_POST['phone'] ?? '');
    $satisfy = trim($_POST['satisfy'] ?? 'yes');
    $star    = intval($_POST['star'] ?? 5);
    $msg     = trim($_POST['msg'] ?? '');

    if (empty($uname) || empty($email) || empty($msg)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Name, email, and message are required.']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO feedbacks (uname, email, phone, satisfy, star_rating, message) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$uname, $email, $phone, $satisfy, $star, $msg]);

        echo json_encode([
            'success' => true,
            'feedbackId' => $pdo->lastInsertId(),
            'message' => 'Feedback submitted successfully!'
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?>
