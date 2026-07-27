// =========================
// api.js - ارتباط با سرور بابیس نت
// =========================

var API = {
    // ====== تنظیمات ======
    baseURL: 'https://api.babisnet.com/v1/', // بعداً آدرس واقعی رو میذاری
    
    // ====== توابع کاربر ======
    
    // دریافت اطلاعات کاربر فعلی
    getUser: function() {
        // فعلاً داده‌های ساختگی برمی‌گردونه
        return new Promise(function(resolve) {
            resolve({
                username: "عرفان",
                proball: 50,
                ballpoint: 1240,
                streak: 5,
                dailyPredictions: 1
            });
        });
        
        // ====== بعداً که سرور آماده شد، این بخش رو فعال کن ======
        /*
        return fetch(this.baseURL + 'user/me', {
            headers: this._getHeaders()
        })
        .then(function(response) {
            if (!response.ok) throw new Error('خطا در دریافت اطلاعات کاربر');
            return response.json();
        })
        .catch(function(error) {
            console.error('API Error:', error);
            throw error;
        });
        */
    },
    
    // دریافت ۳ نفر برتر جدول
    getTopRankers: function() {
        // فعلاً داده‌های ساختگی برمی‌گردونه
        return new Promise(function(resolve) {
            resolve([
                { name: "عرفان", score: 1250, games: 18, correct: 12 },
                { name: "علی", score: 1100, games: 15, correct: 10 },
                { name: "taha", score: 980, games: 14, correct: 9 }
            ]);
        });
        
        // ====== بعداً که سرور آماده شد، این بخش رو فعال کن ======
        /*
        return fetch(this.baseURL + 'ranking/top3', {
            headers: this._getHeaders()
        })
        .then(function(response) {
            if (!response.ok) throw new Error('خطا در دریافت رتبه‌بندی');
            return response.json();
        })
        .catch(function(error) {
            console.error('API Error:', error);
            throw error;
        });
        */
    },
    
    // دریافت لیست مسابقات امروز
    getMatches: function() {
        return new Promise(function(resolve) {
            resolve([
                { id: 1, home: 'تیم میزبان', away: 'تیم مهمان', time: '۲۲:۳۰', date: '۱۴۰۴/۰۵/۰۱' },
                { id: 2, home: 'تیم میزبان ۲', away: 'تیم مهمان ۲', time: '۲۱:۰۰', date: '۱۴۰۴/۰۵/۰۱' },
                { id: 3, home: 'تیم میزبان ۳', away: 'تیم مهمان ۳', time: '۲۳:۱۵', date: '۱۴۰۴/۰۵/۰۲' }
            ]);
        });
    },
    
    // دریافت اطلاعات یک مسابقه
    getMatch: function(matchId) {
        return new Promise(function(resolve) {
            resolve({
                id: matchId,
                home: 'تیم میزبان',
                away: 'تیم مهمان',
                time: '۲۲:۳۰',
                date: '۱۴۰۴/۰۵/۰۱',
                status: 'upcoming' // upcoming, live, finished
            });
        });
    },
    
    // ثبت پیش‌بینی
    submitPrediction: function(matchId, prediction) {
        return new Promise(function(resolve) {
            resolve({ 
                success: true, 
                message: 'پیش‌بینی با موفقیت ثبت شد',
                points: 5
            });
        });
        
        // ====== بعداً که سرور آماده شد، این بخش رو فعال کن ======
        /*
        return fetch(this.baseURL + 'predictions', {
            method: 'POST',
            headers: this._getHeaders(),
            body: JSON.stringify({ matchId, prediction })
        })
        .then(function(response) {
            if (!response.ok) throw new Error('خطا در ثبت پیش‌بینی');
            return response.json();
        })
        .catch(function(error) {
            console.error('API Error:', error);
            throw error;
        });
        */
    },
    
    // دریافت پیش‌بینی‌های کاربر
    getUserPredictions: function() {
        return new Promise(function(resolve) {
            resolve([
                { matchId: 1, prediction: '2-1', result: '2-1', points: 5 },
                { matchId: 2, prediction: '1-1', result: '2-0', points: 0 }
            ]);
        });
    },
    
    // ====== احراز هویت ======
    
    // ورود کاربر
    login: function(username, password) {
        return new Promise(function(resolve, reject) {
            if (username === 'erfan' && password === '1234') {
                resolve({ 
                    token: 'fake-token-12345', 
                    user: { username: 'عرفان', proball: 50, ballpoint: 1240 }
                });
            } else {
                reject(new Error('نام کاربری یا رمز عبور اشتباه است'));
            }
        });
        
        // ====== بعداً که سرور آماده شد، این بخش رو فعال کن ======
        /*
        return fetch(this.baseURL + 'auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        .then(function(response) {
            if (!response.ok) throw new Error('ورود ناموفق');
            return response.json();
        })
        .catch(function(error) {
            console.error('API Error:', error);
            throw error;
        });
        */
    },
    
    // خروج کاربر
    logout: function() {
        return new Promise(function(resolve) {
            resolve({ success: true });
        });
        
        // ====== بعداً که سرور آماده شد، این بخش رو فعال کن ======
        /*
        return fetch(this.baseURL + 'auth/logout', {
            method: 'POST',
            headers: this._getHeaders()
        })
        .then(function(response) {
            if (!response.ok) throw new Error('خطا در خروج');
            return response.json();
        })
        .catch(function(error) {
            console.error('API Error:', error);
            throw error;
        });
        */
    },
    
    // ثبت‌نام کاربر جدید
    register: function(username, password, email) {
        return new Promise(function(resolve) {
            resolve({ 
                success: true, 
                message: 'ثبت‌نام با موفقیت انجام شد',
                user: { username: username }
            });
        });
        
        // ====== بعداً که سرور آماده شد، این بخش رو فعال کن ======
        /*
        return fetch(this.baseURL + 'auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, email })
        })
        .then(function(response) {
            if (!response.ok) throw new Error('خطا در ثبت‌نام');
            return response.json();
        })
        .catch(function(error) {
            console.error('API Error:', error);
            throw error;
        });
        */
    },
    
    // ====== ابزارهای داخلی ======
    
    // دریافت هدرهای درخواست با توکن
    _getHeaders: function() {
        var token = localStorage.getItem('babisnet_token');
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? 'Bearer ' + token : ''
        };
    },
    
    // ذخیره توکن
    setToken: function(token) {
        localStorage.setItem('babisnet_token', token);
    },
    
    // حذف توکن
    clearToken: function() {
        localStorage.removeItem('babisnet_token');
    },
    
    // بررسی لاگین بودن کاربر
    isLoggedIn: function() {
        var token = localStorage.getItem('babisnet_token');
        var user = localStorage.getItem('babisnet_user');
        return !!(token && user);
    }
};