// =========================
// apishop.js - API فروشگاه (داده‌های ساختگی)
// =========================

var APIShop = {
    // ====== دریافت لیست آیتم‌ها ======
    getItems: function() {
        return new Promise(function(resolve) {
            resolve([
                { id: 'bayern', name: 'بایرن مونیخ', category: 'club', price: 550, image: 'bayern.webp' },
                { id: 'arsenal', name: 'آرسنال', category: 'club', price: 550, image: 'arsenal.webp' },
                { id: 'city', name: 'منچسترسیتی', category: 'club', price: 550, image: 'city.webp' },
                { id: 'miami', name: 'اینترمیامی', category: 'club', price: 550, image: 'miami.webp' },
                { id: 'nasr', name: 'النصر', category: 'club', price: 550, image: 'nasr.webp' },
                { id: 'per', name: 'پرسپولیس', category: 'club', price: 550, image: 'per.webp' },
                { id: 'est', name: 'استقلال', category: 'club', price: 550, image: 'est.webp' },
                { id: 'real', name: 'رئال مادرید', category: 'club', price: 550, image: 'real.webp' },
                { id: 'barca', name: 'بارسلونا', category: 'club', price: 550, image: 'barca.png' },
                { id: 'man', name: 'منچستریونایتد', category: 'club', price: 550, image: 'man.webp' },
                { id: 'liver', name: 'لیورپول', category: 'club', price: 550, image: 'liver.png' },
                { id: 'dort', name: 'دورتموند', category: 'club', price: 550, image: 'dort.webp' },
                { id: 'paris', name: 'پاری سن‌ژرمن', category: 'club', price: 550, image: 'paris.webp' },
                { id: 'sepahan', name: 'سپاهان', category: 'club', price: 550, image: 'sepahan.webp' },
                { id: 'teractor', name: 'تراکتور', category: 'club', price: 550, image: 'teractor.webp' },

                { id: 'iran', name: 'ایران', category: 'national', price: 1200, image: 'iran.webp' },
                { id: 'italy', name: 'ایتالیا', category: 'national', price: 1200, image: 'Italy.png' },
                { id: 'spain', name: 'اسپانیا', category: 'national', price: 1200, image: 'spain.webp' },
                { id: 'brazil', name: 'برزیل', category: 'national', price: 1200, image: 'brazil.png' },
                { id: 'argan', name: 'آرژانتین', category: 'national', price: 1200, image: 'argan.png' },
                { id: 'france', name: 'فرانسه', category: 'national', price: 1200, image: 'france.png' },
                { id: 'crotia', name: 'کرواسی', category: 'national', price: 1200, image: 'crotia.webp' },
                { id: 'germany', name: 'آلمان', category: 'national', price: 1200, image: 'germany.png' },
                { id: 'porti', name: 'پرتغال', category: 'national', price: 1200, image: 'porti.png' },
                { id: 'england', name: 'انگلیس', category: 'national', price: 1200, image: 'england.png' },

                { id: 'cr7', name: 'رونالدو', category: 'player', price: 1000, image: 'cr7.webp' },
                { id: 'haland', name: 'هالند', category: 'player', price: 1000, image: 'haland.webp' },
                { id: 'mbape', name: 'امباپه', category: 'player', price: 1000, image: 'mbape.webp' },
                { id: 'messi', name: 'مسی', category: 'player', price: 1000, image: 'messi.webp' },
                { id: 'pele', name: 'پله', category: 'player', price: 1000, image: 'pele.webp' },
                { id: 'ronald', name: 'رونالدینیو', category: 'player', price: 1000, image: 'ronald.webp' },
                { id: 'yamal', name: 'یامال', category: 'player', price: 1000, image: 'yamal.webp' },

                { id: 'gold', name: 'توپ طلا', category: 'special', price: 15000, image: 'gold.webp', maxBuy: 5, isSpecial: true },
                { id: 'vip', name: 'اشتراک VIP', category: 'special', price: '۳۵,۰۰۰ تومان', image: 'vip.webp', isVip: true }
            ]);
        });
    },

    // ====== دریافت پکیج‌های پروبال ======
    getProballPackages: function() {
        return new Promise(function(resolve) {
            resolve([
                { amount: 200, price: '۳۰,۰۰۰' },
                { amount: 400, price: '۶۰,۰۰۰' },
                { amount: 600, price: '۹۰,۰۰۰' },
                { amount: 800, price: '۱۲۰,۰۰۰' },
                { amount: 1000, price: '۱۴۰,۰۰۰' },
                { amount: 1500, price: '۲۱۰,۰۰۰' },
                { amount: 2000, price: '۳۰۰,۰۰۰' }
            ]);
        });
    },

    // ====== خرید آیتم ======
    purchaseItem: function(itemId) {
        return new Promise(function(resolve) {
            resolve({ success: true, message: 'آیتم خریداری شد' });
        });
    },

    // ====== خرید پروبال ======
    purchaseProball: function(amount) {
        return new Promise(function(resolve) {
            resolve({ success: true, amount: amount });
        });
    },

    // ====== دریافت خریدهای کاربر ======
    getUserPurchases: function() {
        return new Promise(function(resolve) {
            var data = localStorage.getItem('babisnet_purchases');
            resolve(data ? JSON.parse(data) : {});
        });
    },

    // ====== ذخیره خریدهای کاربر ======
    saveUserPurchases: function(purchases) {
        return new Promise(function(resolve) {
            localStorage.setItem('babisnet_purchases', JSON.stringify(purchases));
            resolve({ success: true });
        });
    },

    // ====== دریافت پروبال کاربر ======
    getUserProball: function() {
        return new Promise(function(resolve) {
            var user = JSON.parse(localStorage.getItem('babisnet_user'));
            if (user) {
                resolve(parseInt(user.proball) || 0);
            } else {
                resolve(0);
            }
        });
    },

    // ====== به‌روزرسانی پروبال کاربر ======
    updateUserProball: function(amount) {
        return new Promise(function(resolve, reject) {
            var user = JSON.parse(localStorage.getItem('babisnet_user'));
            if (user) {
                var newProball = (parseInt(user.proball) || 0) + amount;
                if (newProball < 0) {
                    reject(new Error('پروبال کافی نیست'));
                    return;
                }
                user.proball = newProball;
                localStorage.setItem('babisnet_user', JSON.stringify(user));
                resolve({ success: true, proball: user.proball });
            } else {
                reject(new Error('کاربر یافت نشد'));
            }
        });
    }
};