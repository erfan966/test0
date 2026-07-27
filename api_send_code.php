<?php
// =========================
// API ارسال کد یکبار مصرف (با نمایش در Termux)
// =========================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include 'config.php';

// دریافت داده‌های JSON
$data = json_decode(file_get_contents('php://input'), true);

if (!$data || empty($data['phone'])) {
    echo json_encode(['success' => false, 'message' => 'شماره تلفن ارسال نشده']);
    exit;
}

$phone = trim($data['phone']);

// تولید کد ۶ رقمی تصادفی
$code = rand(100000, 999999);

// ====== نمایش کد در Termux ======
error_log("📱 کد یکبار مصرف برای شماره " . $phone . ": " . $code);
// =================================

// ====== ذخیره کد در دیتابیس (برای تأیید بعدی) ======
// فعلاً کد رو در یک جدول موقت ذخیره می‌کنیم
// می‌تونی بعداً جدول verification_codes بسازی

// برای تست: کد رو برمی‌گردونیم
echo json_encode([
    'success' => true,
    'message' => 'کد با موفقیت ارسال شد',
    'code' => (string)$code  // برای تست، کد رو برگردون
]);
?>