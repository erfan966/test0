<?php
// =========================
// API ورود کاربر
// =========================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || empty($data['phone']) || empty($data['password'])) {
    echo json_encode(['success' => false, 'message' => 'همه فیلدها الزامی هستند']);
    exit;
}

$phone = trim($data['phone']);
$password = trim($data['password']);

try {
    // پیدا کردن کاربر
    $stmt = $pdo->prepare("SELECT * FROM users WHERE phone = ?");
    $stmt->execute([$phone]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'کاربری با این شماره تلفن یافت نشد']);
        exit;
    }

    // بررسی رمز عبور
    if (!password_verify($password, $user['password'])) {
        echo json_encode(['success' => false, 'message' => 'رمز عبور اشتباه است']);
        exit;
    }

    // تولید و ذخیره توکن
    $token = bin2hex(random_bytes(32));
    $stmt = $pdo->prepare("UPDATE users SET token = ? WHERE id = ?");
    $stmt->execute([$token, $user['id']]);

    // حذف رمز عبور از خروجی
    unset($user['password']);

    echo json_encode([
        'success' => true,
        'message' => 'ورود موفق',
        'user' => $user,
        'token' => $token
    ]);

} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'خطا در ورود: ' . $e->getMessage()]);
}
?>