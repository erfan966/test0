<?php
// =========================
// اتصال به دیتابیس - بابیس نت
// =========================

// روش TCP/IP با مشخص کردن پورت (رفع خطای No such file or directory)
$host = '127.0.0.1';
$port = 3306;          // پورت پیش‌فرض MySQL
$dbname = 'babisnet_db';
$username = 'root';
$password = '';        // در Termux پسورد root خالی است

try {
    // اتصال با host + port (استفاده از TCP/IP به جای سوکت)
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$dbname;charset=utf8", $username, $password);
    
    // تنظیم حالت خطا به Exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // (اختیاری) برای تست اتصال - در صورت نیاز کامنت را بردارید
    // echo "✅ اتصال به دیتابیس با موفقیت برقرار شد!";
    
} catch(PDOException $e) {
    // نمایش خطا (در محیط توسعه)
    die("❌ خطا در اتصال به دیتابیس: " . $e->getMessage());
}

// =========================
// توابع کمکی (اختیاری)
// =========================

// تابع برای اجرای کوئری‌های SELECT و برگرداندن نتایج
function fetchAll($pdo, $sql, $params = []) {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// تابع برای اجرای کوئری‌های INSERT/UPDATE/DELETE
function executeQuery($pdo, $sql, $params = []) {
    $stmt = $pdo->prepare($sql);
    return $stmt->execute($params);
}
?>