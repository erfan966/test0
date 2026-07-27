// =========================
// apiform.js - ارتباط با سرور (مخصوص فرم)
// =========================

var API = {
    baseURL: 'https://api.babisnet.com/v1/',

    // ====== ارسال کد یکبار مصرف ======
    sendVerificationCode: function(phone) {
        return new Promise(function(resolve, reject) {
            if (phone.length < 11) {
                reject(new Error('شماره تلفن معتبر نیست (حداقل ۱۱ رقم).'));
                return;
            }

            // تولید کد ۶ رقمی تصادفی
            var code = Math.floor(100000 + Math.random() * 900000).toString();

            console.log('📱 کد یکبار مصرف برای ' + phone + ': ' + code);

            resolve({
                success: true,
                code: code,
                message: 'کد با موفقیت ارسال شد'
            });
        });
    },

    // ====== ثبت‌نام ======
    register: function(fullname, phone, password) {
        return new Promise(function(resolve, reject) {
            if (phone.length < 11) {
                reject(new Error('شماره تلفن باید حداقل ۱۱ رقم باشد.'));
                return;
            }
            if (password.length < 8) {  // ← تغییر به ۸
                reject(new Error('رمز عبور باید حداقل ۸ کاراکتر باشد.'));
                return;
            }
            if (!fullname) {
                reject(new Error('نام و نام خانوادگی الزامی است.'));
                return;
            }

            resolve({
                success: true,
                message: 'ثبت‌نام با موفقیت انجام شد',
                user: { fullname: fullname, phone: phone }
            });
        });
    },

    // ====== ورود ======
    login: function(phone, password) {
        return new Promise(function(resolve, reject) {
            if (phone === '09123456789' && password === '12345678') {  // ← مثال با ۸ کاراکتر
                resolve({
                    token: 'fake-token-12345',
                    user: { fullname: 'عرفان', phone: phone }
                });
            } else {
                reject(new Error('شماره تلفن یا رمز عبور اشتباه است.'));
            }
        });
    },

    // ====== خروج ======
    logout: function() {
        return new Promise(function(resolve) {
            resolve({ success: true });
        });
    },

    // ====== ابزارهای داخلی ======
    _getHeaders: function() {
        var token = localStorage.getItem('babisnet_token');
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? 'Bearer ' + token : ''
        };
    },

    setToken: function(token) {
        localStorage.setItem('babisnet_token', token);
    },

    clearToken: function() {
        localStorage.removeItem('babisnet_token');
    },

    isLoggedIn: function() {
        return !!localStorage.getItem('babisnet_token');
    }
};