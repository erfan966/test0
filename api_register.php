<?php
// =========================
// API ثبت‌نام کاربر
// =========================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include 'config.php';

// دریافت داده‌های JSON
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'داده‌ای ارسال نشده']);
    exit;
}

// دریافت فیلدها
$username = trim($data['username'] ?? '');
$phone = trim($data['phone'] ?? '');
$password = trim($data['password'] ?? '');

// اعتبارسنجی
if (empty($username) || empty($phone) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'همه فیلدها الزامی هستند']);
    exit;
}

if (strlen($password) < 8) {
    echo json_encode(['success' => false, 'message' => 'رمز عبور باید حداقل ۸ کاراکتر باشد']);
    exit;
}

// هش کردن رمز عبور
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// تولید UID یکتا
$uid = 'BABIS-' . rand(10000, 99999);

try {
    // بررسی وجود شماره تلفن
    $stmt = $pdo->prepare("SELECT id FROM users WHERE phone = ?");
    $stmt->execute([$phone]);
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => false, 'message' => 'این شماره تلفن قبلاً ثبت شده است']);
        exit;
    }

    // ذخیره کاربر
    $stmt = $pdo->prepare("INSERT INTO users (username, phone, password, uid) VALUES (?, ?, ?, ?)");
    $stmt->execute([$username, $phone, $hashedPassword, $uid]);

    echo json_encode([
        'success' => true,
        'message' => 'ثبت‌نام با موفقیت انجام شد',
        'user' => [
            'username' => $username,
            'phone' => $phone,
            'uid' => $uid
        ]
    ]);

} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'خطا در ثبت‌نام: ' . $e->getMessage()]);
}
?>