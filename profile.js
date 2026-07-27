// =========================
// بابیس نت - پروفایل
// =========================

document.addEventListener('DOMContentLoaded', function() {

    // ====================================
    // مدیریت آیکون‌های نوار پایین
    // ====================================
    function setupNavIcons() {
        var currentPage = window.location.pathname.split('/').pop();
        
        document.querySelectorAll('.bottom-nav .nav-item').forEach(function(item) {
            var link = item.getAttribute('href');
            var icon = item.querySelector('.nav-icon');
            var iconActive = item.querySelector('.nav-icon-active');
            
            if (link === currentPage) {
                item.classList.add('active');
                if (icon) icon.style.display = 'none';
                if (iconActive) iconActive.style.display = 'block';
            } else {
                item.classList.remove('active');
                if (icon) icon.style.display = 'block';
                if (iconActive) iconActive.style.display = 'none';
            }
        });
    }

    var token = localStorage.getItem('babisnet_token');

    // ====================================
    // ۱. سابقه پیش‌بینی (فقط ۵ تای آخر)
    // ====================================
    function loadPredictionHistory() {
        var container = document.getElementById('historyContainer');
        if (!container) return;

        if (!token) {
            container.innerHTML = '<span style="color:rgba(255,255,255,0.2);font-size:14px;">لطفاً وارد حساب خود شوید</span>';
            return;
        }

        fetch('http://localhost:8080/api_predictions.php', {
            headers: { 'Authorization': 'Bearer ' + token }
        })
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.success) {
                var history = data.predictions || [];
                // ====== فقط ۵ تای آخر ======
                var recent = history.slice(-5).reverse();

                if (recent.length === 0) {
                    container.innerHTML = '<span style="color:rgba(255,255,255,0.2);font-size:14px;">هیچ پیش‌بینی ثبت نشده</span>';
                    return;
                }

                var html = '';
                recent.forEach(function(item) {
                    var icon = '';
                    if (item.status === 'exact') {
                        icon = '<img src="tikz.webp" alt="دقیق" class="history-icon">';
                    } else if (item.status === 'correct') {
                        icon = '<img src="tik.webp" alt="درست" class="history-icon">';
                    } else {
                        icon = '<img src="zarb.webp" alt="اشتباه" class="history-icon">';
                    }
                    html += icon;
                });

                container.innerHTML = html;
            } else {
                container.innerHTML = '<span style="color:#FF6B6B;font-size:14px;">خطا در دریافت سابقه</span>';
            }
        })
        .catch(function(error) {
            console.error('خطا:', error);
            container.innerHTML = '<span style="color:#FF6B6B;font-size:14px;">خطا در ارتباط با سرور</span>';
        });
    }

    // ====================================
    // ۲. بارگذاری اطلاعات کاربر
    // ====================================
    function loadUserData() {
        if (!token) return;

        fetch('http://localhost:8080/api_user.php', {
            headers: { 'Authorization': 'Bearer ' + token }
        })
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.success) {
                var user = data.user;
                document.getElementById('username').textContent = user.username || 'کاربر';
                document.getElementById('ballpoint-amount').textContent = user.ballpoint || 0;
                document.getElementById('proball-amount').textContent = user.proball || 0;
                document.getElementById('goldCount').textContent = user.gold || 0;
            }
        })
        .catch(function(error) {
            console.error('خطا در دریافت اطلاعات کاربر:', error);
        });
    }

    // ====================================
    // ۳. بارگذاری اولیه
    // ====================================
    setupNavIcons();
    loadUserData();
    loadPredictionHistory();

});