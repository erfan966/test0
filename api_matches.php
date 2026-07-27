<?php
// =========================
// API دریافت مسابقات
// =========================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

include 'config.php';

// دریافت نوع درخواست (today, tomorrow, all)
$type = isset($_GET['type']) ? $_GET['type'] : 'today';

try {
    // فعلاً داده‌های ساختگی برمی‌گردونیم
    // بعداً از دیتابیس می‌خونیم
    $matches = [];

    if ($type === 'today') {
        $matches = [
            [
                'id' => 1,
                'home_team' => 'پرسپولیس',
                'away_team' => 'استقلال',
                'home_logo' => 'per.webp',
                'away_logo' => 'est.webp',
                'time' => '21:00',
                'date' => '۱۴۰۴/۰۵/۰۱',
                'league' => 'لیگ برتر',
                'status' => 'upcoming'
            ],
            [
                'id' => 2,
                'home_team' => 'رئال مادرید',
                'away_team' => 'بارسلونا',
                'home_logo' => 'real.webp',
                'away_logo' => 'barca.png',
                'time' => '23:30',
                'date' => '۱۴۰۴/۰۵/۰۱',
                'league' => 'لالیگا',
                'status' => 'upcoming'
            ]
        ];
    } elseif ($type === 'tomorrow') {
        $matches = [
            [
                'id' => 3,
                'home_team' => 'بایرن مونیخ',
                'away_team' => 'دورتموند',
                'home_logo' => 'bayern.webp',
                'away_logo' => 'dort.webp',
                'time' => '22:15',
                'date' => '۱۴۰۴/۰۵/۰۲',
                'league' => 'بوندسلیگا',
                'status' => 'upcoming'
            ]
        ];
    }

    echo json_encode([
        'success' => true,
        'matches' => $matches
    ]);

} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'خطا: ' . $e->getMessage()]);
}
?>