<?php
// =========================
// API دریافت اطلاعات کاربر
// =========================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

include 'config.php';

// دریافت توکن از هدر
$headers = getallheaders();
$token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;

if (!$token) {
    echo json_encode(['success' => false, 'message' => 'توکن ارسال نشده']);
    exit;
}

try {
    // پیدا کردن کاربر با توکن
    $stmt = $pdo->prepare("SELECT * FROM users WHERE token = ?");
    $stmt->execute([$token]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'کاربر یافت نشد']);
        exit;
    }

    // حذف رمز عبور از خروجی
    unset($user['password']);

    echo json_encode([
        'success' => true,
        'user' => $user
    ]);

} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'خطا: ' . $e->getMessage()]);
}
?>