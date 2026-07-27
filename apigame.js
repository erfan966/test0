// =========================
// apigame.js - API مسابقات
// =========================

var APIGame = {
    _allMatches: [],

    // ====== دریافت مسابقات امروز ======
    getTodayMatches: function() {
        return new Promise(function(resolve) {
            var matches = [
                {
                    id: 1,
                    home: 'پرسپولیس',
                    homeLogo: 'per.webp',
                    away: 'استقلال',
                    awayLogo: 'est.webp',
                    time: '21:00',
                    date: '۱۴۰۴/۰۵/۰۱',
                    league: 'لیگ برتر',
                    status: 'upcoming'
                },
                {
                    id: 2,
                    home: 'رئال مادرید',
                    homeLogo: 'real.webp',
                    away: 'بارسلونا',
                    awayLogo: 'barca.png',
                    time: '23:30',
                    date: '۱۴۰۴/۰۵/۰۱',
                    league: 'لالیگا',
                    status: 'upcoming'
                },
                {
                    id: 3,
                    home: 'بایرن مونیخ',
                    homeLogo: 'bayern.webp',
                    away: 'دورتموند',
                    awayLogo: 'dort.webp',
                    time: '22:15',
                    date: '۱۴۰۴/۰۵/۰۱',
                    league: 'بوندسلیگا',
                    status: 'upcoming'
                }
            ];
            APIGame._allMatches = APIGame._allMatches.concat(matches);
            resolve(matches);
        });
    },

    // ====== دریافت مسابقات فردا ======
    getTomorrowMatches: function() {
        return new Promise(function(resolve) {
            var matches = [
                {
                    id: 4,
                    home: 'منچسترسیتی',
                    homeLogo: 'city.webp',
                    away: 'لیورپول',
                    awayLogo: 'liver.png',
                    time: '20:30',
                    date: '۱۴۰۴/۰۵/۰۲',
                    league: 'لیگ برتر انگلیس',
                    status: 'upcoming'
                },
                {
                    id: 5,
                    home: 'پاری سن‌ژرمن',
                    homeLogo: 'paris.webp',
                    away: 'المپیک مارسی',
                    awayLogo: 'marseille.webp', // اگه این فایل رو ندارید، اسمش رو عوض کنید
                    time: '22:45',
                    date: '۱۴۰۴/۰۵/۰۲',
                    league: 'لیگ ۱ فرانسه',
                    status: 'upcoming'
                }
            ];
            APIGame._allMatches = APIGame._allMatches.concat(matches);
            resolve(matches);
        });
    },

    // ====== دریافت یک مسابقه با ID ======
    getMatchById: function(matchId) {
        return new Promise(function(resolve) {
            var match = APIGame._allMatches.find(function(m) { return m.id === matchId; });
            if (match) {
                resolve(match);
                return;
            }
            Promise.all([APIGame.getTodayMatches(), APIGame.getTomorrowMatches()])
                .then(function() {
                    var match = APIGame._allMatches.find(function(m) { return m.id === matchId; });
                    resolve(match || null);
                });
        });
    },

    // ====== دریافت پیش‌بینی‌های کاربر ======
    getUserPredictions: function() {
        return new Promise(function(resolve) {
            var data = localStorage.getItem('babisnet_predictions');
            resolve(data ? JSON.parse(data) : {});
        });
    },

    // ====== ذخیره پیش‌بینی‌های کاربر ======
    saveUserPredictions: function(predictions) {
        return new Promise(function(resolve) {
            localStorage.setItem('babisnet_predictions', JSON.stringify(predictions));
            resolve({ success: true });
        });
    },

    // ====== دریافت امتیاز کاربر ======
    getUserPoints: function() {
        return new Promise(function(resolve) {
            var user = JSON.parse(localStorage.getItem('babisnet_user'));
            resolve(user ? parseInt(user.points) || 0 : 0);
        });
    },

    // ====== به‌روزرسانی امتیاز کاربر ======
    updateUserPoints: function(points) {
        return new Promise(function(resolve) {
            var user = JSON.parse(localStorage.getItem('babisnet_user'));
            if (user) {
                user.points = (parseInt(user.points) || 0) + points;
                localStorage.setItem('babisnet_user', JSON.stringify(user));
                resolve({ success: true, points: user.points });
            } else {
                resolve({ success: false });
            }
        });
    },

    // ====== محاسبه امتیاز ======
    calculatePoints: function(prediction, actualHome, actualAway) {
        var predHome = parseInt(prediction.homeScore);
        var predAway = parseInt(prediction.awayScore);

        if (predHome === actualHome && predAway === actualAway) {
            return 5;
        }
        var predWinner = predHome > predAway ? 'home' : (predHome < predAway ? 'away' : 'draw');
        var actualWinner = actualHome > actualAway ? 'home' : (actualHome < actualAway ? 'away' : 'draw');
        if (predWinner === actualWinner) {
            return 2;
        }
        return 0;
    }
};