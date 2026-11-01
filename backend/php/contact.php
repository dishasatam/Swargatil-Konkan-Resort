<?php
require_once __DIR__ . '/db.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name  = trim($_POST['name'] ?? 'Guest');
    $email = trim($_POST['email'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $msg   = trim($_POST['msg'] ?? '');

    if (empty($msg)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Message cannot be empty.']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)");
        $stmt->execute([$name, $email, $phone, $msg]);

        echo json_encode([
            'success' => true,
            'contactId' => $pdo->lastInsertId(),
            'message' => 'Your message has been sent successfully!'
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?>
