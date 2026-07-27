// =========================
// apiprofile.js - API پروفایل
// =========================

var APIProfile = {
    // ====== دریافت اطلاعات کاربر ======
    getUserData: function() {
        return new Promise(function(resolve) {
            var user = JSON.parse(localStorage.getItem('babisnet_user'));
            if (user) {
                resolve(user);
            } else {
                resolve(null);
            }
        });
    },

    // ====== به‌روزرسانی نام کاربر ======
    updateUsername: function(newName) {
        return new Promise(function(resolve) {
            var user = JSON.parse(localStorage.getItem('babisnet_user'));
            if (user) {
                user.username = newName;
                localStorage.setItem('babisnet_user', JSON.stringify(user));
                resolve({ success: true, username: newName });
            } else {
                resolve({ success: false });
            }
        });
    },

    // ====== دریافت مدال‌های کاربر ======
    getUserMedals: function() {
        return new Promise(function(resolve) {
            var medals = JSON.parse(localStorage.getItem('babisnet_medals')) || [];
            resolve(medals);
        });
    },

    // ====== ذخیره مدال‌های کاربر ======
    saveUserMedals: function(medals) {
        return new Promise(function(resolve) {
            localStorage.setItem('babisnet_medals', JSON.stringify(medals));
            resolve({ success: true });
        });
    },

    // ====== دریافت سابقه پیش‌بینی ======
    getPredictionHistory: function() {
        return new Promise(function(resolve) {
            var history = JSON.parse(localStorage.getItem('babisnet_prediction_history')) || [];
            resolve(history);
        });
    },

    // ====== ذخیره سابقه پیش‌بینی ======
    savePredictionHistory: function(history) {
        return new Promise(function(resolve) {
            localStorage.setItem('babisnet_prediction_history', JSON.stringify(history));
            resolve({ success: true });
        });
    },

    // ====== دریافت خریدهای کاربر ======
    getUserPurchases: function() {
        return new Promise(function(resolve) {
            var purchases = JSON.parse(localStorage.getItem('babisnet_purchases')) || {};
            resolve(purchases);
        });
    },

    // ====== تولید UID یکتا ======
    generateUID: function() {
        var random = Math.floor(10000 + Math.random() * 90000);
        return 'BABIS-' + random;
    },

    // ====== دریافت UID کاربر ======
    getUserUID: function() {
        return new Promise(function(resolve) {
            var uid = localStorage.getItem('babisnet_uid');
            if (!uid) {
                uid = APIProfile.generateUID();
                localStorage.setItem('babisnet_uid', uid);
            }
            resolve(uid);
        });
    },

    // ====== جستجوی کاربر با UID ======
    searchUserByUID: function(uid) {
        return new Promise(function(resolve) {
            // شبیه‌سازی - بعداً به API واقعی وصل میشه
            if (uid === 'BABIS-12345') {
                resolve({ found: true, name: 'عرفان', uid: uid });
            } else {
                resolve({ found: false });
            }
        });
    },

    // ====== دریافت کد معرف ======
    getReferralCode: function() {
        return new Promise(function(resolve) {
            var uid = localStorage.getItem('babisnet_uid');
            if (!uid) {
                uid = APIProfile.generateUID();
                localStorage.setItem('babisnet_uid', uid);
            }
            resolve(uid);
        });
    }
};