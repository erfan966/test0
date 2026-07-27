<?php
// =========================
// API ثبت پیش‌بینی
// =========================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

include 'config.php';

// دریافت توکن از هدر
$headers = getallheaders();
$token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;

if (!$token) {
    echo json_encode(['success' => false, 'message' => 'توکن ارسال نشده']);
    exit;
}

// پیدا کردن کاربر با توکن
$stmt = $pdo->prepare("SELECT id FROM users WHERE token = ?");
$stmt->execute([$token]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode(['success' => false, 'message' => 'کاربر یافت نشد']);
    exit;
}

$userId = $user['id'];

// دریافت داده‌های JSON
$data = json_decode(file_get_contents('php://input'), true);

if (!$data || empty($data['match_id']) || !isset($data['home_score']) || !isset($data['away_score'])) {
    echo json_encode(['success' => false, 'message' => 'داده‌های کامل ارسال نشده']);
    exit;
}

$matchId = (int)$data['match_id'];
$homeScore = (int)$data['home_score'];
$awayScore = (int)$data['away_score'];

try {
    // بررسی اینکه مسابقه وجود داره
    $stmt = $pdo->prepare("SELECT id, status FROM matches WHERE id = ?");
    $stmt->execute([$matchId]);
    $match = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$match) {
        echo json_encode(['success' => false, 'message' => 'مسابقه یافت نشد']);
        exit;
    }

    if ($match['status'] === 'finished') {
        echo json_encode(['success' => false, 'message' => 'این مسابقه به پایان رسیده']);
        exit;
    }

    // بررسی پیش‌بینی تکراری
    $stmt = $pdo->prepare("SELECT id FROM predictions WHERE user_id = ? AND match_id = ?");
    $stmt->execute([$userId, $matchId]);
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => false, 'message' => 'شما قبلاً برای این مسابقه پیش‌بینی کرده‌اید']);
        exit;
    }

    // ذخیره پیش‌بینی
    $stmt = $pdo->prepare("INSERT INTO predictions (user_id, match_id, home_score, away_score) VALUES (?, ?, ?, ?)");
    $stmt->execute([$userId, $matchId, $homeScore, $awayScore]);

    echo json_encode([
        'success' => true,
        'message' => 'پیش‌بینی با موفقیت ثبت شد'
    ]);

} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'خطا: ' . $e->getMessage()]);
}
?>