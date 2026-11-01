<?php
// Database configuration for PHP / MySQL
$host = 'localhost';
$user = 'root';
$pass = '';
$dbname = 'swargatil_konkan_db';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    try {
        $pdo = new PDO("mysql:host=$host;dbname=book;charset=utf8mb4", $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);
    } catch (PDOException $e2) {
        die(json_encode(['success' => false, 'message' => 'Database connection failed: ' . $e2->getMessage()]));
    }
}
?>
