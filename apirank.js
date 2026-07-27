// =========================
// apirank.js - API رتبه‌بندی
// =========================

var APIRank = {
    // ====== دریافت لیست کاربران (با داده‌های ساختگی) ======
    getRanking: function() {
        return new Promise(function(resolve) {
            // داده‌های ساختگی (بعداً با API واقعی جایگزین میشه)
            var users = [
                { id: 1, name: 'عرفان', avatar: 'hich.png', ballpoint: 1250, predictions: 18, accuracy: 72, level: 12 },
                { id: 2, name: 'علی', avatar: 'hich.png', ballpoint: 1100, predictions: 15, accuracy: 68, level: 10 },
                { id: 3, name: 'سارا', avatar: 'hich.png', ballpoint: 980, predictions: 14, accuracy: 65, level: 9 },
                { id: 4, name: 'محمد', avatar: 'hich.png', ballpoint: 850, predictions: 12, accuracy: 58, level: 7 },
                { id: 5, name: 'زهرا', avatar: 'hich.png', ballpoint: 720, predictions: 10, accuracy: 55, level: 6 },
                { id: 6, name: 'رضا', avatar: 'hich.png', ballpoint: 650, predictions: 9, accuracy: 50, level: 5 },
                { id: 7, name: 'مریم', avatar: 'hich.png', ballpoint: 580, predictions: 8, accuracy: 48, level: 4 },
                { id: 8, name: 'حسین', avatar: 'hich.png', ballpoint: 500, predictions: 7, accuracy: 45, level: 4 },
                { id: 9, name: 'فاطمه', avatar: 'hich.png', ballpoint: 420, predictions: 6, accuracy: 40, level: 3 },
                { id: 10, name: 'امیر', avatar: 'hich.png', ballpoint: 350, predictions: 5, accuracy: 35, level: 3 },
                { id: 11, name: 'نگار', avatar: 'hich.png', ballpoint: 280, predictions: 4, accuracy: 30, level: 2 },
                { id: 12, name: 'کیان', avatar: 'hich.png', ballpoint: 200, predictions: 3, accuracy: 25, level: 2 },
                { id: 13, name: 'یلدا', avatar: 'hich.png', ballpoint: 150, predictions: 2, accuracy: 20, level: 1 },
                { id: 14, name: 'آرین', avatar: 'hich.png', ballpoint: 100, predictions: 1, accuracy: 10, level: 1 },
                { id: 15, name: 'سام', avatar: 'hich.png', ballpoint: 50, predictions: 0, accuracy: 0, level: 1 }
            ];
            resolve(users);
        });
    },

    // ====== دریافت اطلاعات یک کاربر با ID ======
    getUserById: function(userId) {
        return new Promise(function(resolve) {
            // در آینده از سرور گرفته میشه
            APIRank.getRanking().then(function(users) {
                var user = users.find(function(u) { return u.id === userId; });
                resolve(user || null);
            });
        });
    },

    // ====== دریافت کاربر فعلی ======
    getCurrentUser: function() {
        return new Promise(function(resolve) {
            var user = JSON.parse(localStorage.getItem('babisnet_user'));
            resolve(user || null);
        });
    }
};