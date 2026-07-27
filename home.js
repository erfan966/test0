// =========================
// بابیس نت - HOME SCRIPT
// =========================

document.addEventListener('DOMContentLoaded', function() {

    // ====================================
    // مدیریت نوار پایین (با رنگ‌های درست)
    // ====================================
function setupNavIcons() {

    // اول active را از همه حذف کن
    document.querySelectorAll(".bottom-nav .nav-item").forEach(item => {
        item.classList.remove("active");
    });

    // صفحه فعلی
    const currentPage = window.location.pathname.split("/").pop() || "home.html";

    // فقط همان صفحه را active کن
    const activeItem = document.querySelector(`.bottom-nav a[href="${currentPage}"]`);

    if (activeItem) {
        activeItem.classList.add("active");
    }
}
    // ====================================
    // ۱. دریافت اطلاعات کاربر
    // ====================================
    function loadUserData() {
        var token = localStorage.getItem('babisnet_token');

        if (!token) {
            document.getElementById('username').textContent = 'کاربر مهمان';
            document.getElementById('proball-amount').textContent = '0';
            document.getElementById('ballpoint-amount').textContent = '0';
            document.getElementById('streak-count').textContent = '0';
            return;
        }

        fetch('http://localhost:8080/api_user.php', {
            headers: { 'Authorization': 'Bearer ' + token }
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if (data.success) {
                var user = data.user;
                document.getElementById('username').textContent = user.username || 'کاربر';
                document.getElementById('proball-amount').textContent = user.proball || 0;
                document.getElementById('ballpoint-amount').textContent = user.ballpoint || 0;
                document.getElementById('streak-count').textContent = user.streak || 0;
            } else {
                console.error('خطا:', data.message);
                if (data.message === 'کاربر یافت نشد') {
                    localStorage.removeItem('babisnet_token');
                    localStorage.removeItem('babisnet_user');
                    window.location.href = 'form.html';
                }
            }
        })
        .catch(function(error) {
            console.error('خطا در دریافت اطلاعات کاربر:', error);
        });
    }

    // ====================================
    // ۲. دریافت ۳ نفر برتر
    // ====================================
    var rankContainer = document.getElementById('top-rankers');

    if (rankContainer) {
        rankContainer.innerHTML = '<div class="rank-loading">در حال بارگذاری...</div>';

        fetch('http://localhost:8080/api_ranking.php')
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                if (data.success) {
                    var top3 = data.users.slice(0, 3);
                    if (top3.length === 0) {
                        rankContainer.innerHTML = '<div class="rank-loading">هیچ کاربری برای نمایش وجود ندارد</div>';
                    } else {
                        rankContainer.innerHTML = top3.map(function(user, index) {
                            var accuracy = Math.round((user.correct / user.games) * 100) || 0;
                            var rank = index + 1;
                            return '<div class="rank-item">' +
                                '<span class="rank-number">' + rank + '</span>' +
                                '<div class="rank-info">' +
                                '<span class="rank-name">' + user.username + '</span>' +
                                '<span class="rank-detail">' + accuracy + '% دقت پیش‌بینی</span>' +
                                '</div>' +
                                '<span class="rank-score">' +
                                user.ballpoint +
                                ' <img src="ballpoint.png" alt="ballpoint" class="rank-score-img">' +
                                '</span>' +
                                '</div>';
                        }).join('');
                    }
                } else {
                    rankContainer.innerHTML = '<div class="rank-loading" style="color: #FF6B6B;">خطا در بارگذاری رتبه‌بندی</div>';
                }
            })
            .catch(function(error) {
                console.error('خطا:', error);
                rankContainer.innerHTML = '<div class="rank-loading" style="color: #FF6B6B;">خطا در ارتباط با سرور</div>';
            });
    }

    // ====================================
    // ۳. چالش روزانه
    // ====================================
    var status = document.getElementById('challenge-status');
    var todayPredictions = 1;
    var challengeGoal = 2;

    if (todayPredictions >= challengeGoal) {
        status.classList.add('done');
    }

    // ====================================
    // ۴. بنرها
    // ====================================
    document.querySelectorAll('.banner-item').forEach(function(banner) {
        banner.addEventListener('click', function(e) {
            e.preventDefault();
            var id = this.dataset.id;
            var link = this.dataset.link;
            if (link) {
                window.location.href = link;
            } else {
                alert('بنر شماره ' + id + ' کلیک شد!');
            }
        });
    });

    // ====================================
    // ۵. مشاهده همه
    // ====================================
    var viewAllBtn = document.getElementById('viewAllRank');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('به زودی صفحه جدول رتبه‌بندی اضافه میشه!');
        });
    }

    // ====================================
    // ۶. منوی همبرگری
    // ====================================
    var hamburgerBtn = document.getElementById('hamburgerBtn');
    var sideMenu = document.getElementById('sideMenu');
    var menuOverlay = document.getElementById('menuOverlay');

    function openMenu() {
        sideMenu.classList.add('open');
        menuOverlay.classList.add('active');
        hamburgerBtn.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        sideMenu.classList.remove('open');
        menuOverlay.classList.remove('active');
        hamburgerBtn.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (sideMenu.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeMenu);
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeMenu();
    });

    // ====================================
    // ۷. مودال
    // ====================================
    var modalOverlay = document.getElementById('modalOverlay');
    var modalTitle = document.getElementById('modalTitle');
    var modalBody = document.getElementById('modalBody');
    var modalCloseBtn = document.getElementById('modalCloseBtn');

    function showModal(title, content) {
        modalTitle.innerHTML = title;
        modalBody.innerHTML = content;
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) closeModal();
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });

    // ====================================
    // ۸. آیتم‌های منو
    // ====================================
    var menuSupport = document.getElementById('menuSupport');
    if (menuSupport) {
        menuSupport.addEventListener('click', function(e) {
            e.preventDefault();
            closeMenu();
            showModal(
                'پشتیبانی',
                '<div style="text-align:center;">' +
                '<div style="font-size:48px;margin-bottom:12px;">📱</div>' +
                '<p style="font-size:16px;color:rgba(255,255,255,0.8);">در صورت بروز مشکل، سوال یا پیشنهاد، با ما در ارتباط باشید:</p>' +
                '<p style="font-size:18px;font-weight:700;color:#00B894;margin:12px 0;">آیدی تلگرام: @erfan_966</p>' +
                '</div>'
            );
        });
    }

    var menuPages = document.getElementById('menuPages');
    if (menuPages) {
        menuPages.addEventListener('click', function(e) {
            e.preventDefault();
            closeMenu();
            showModal(
                'صفحات ما',
                '<div style="text-align:center;font-size:16px;line-height:2.5;">' +
                '<p>📢 کانال تلگرام: <a href="https://t.me/Babisnet" target="_blank" style="color:#00B894;text-decoration:underline;">@Babisnet</a></p>' +
                '<p>📸 صفحه اینستاگرام: <a href="https://instagram.com/babisnet" target="_blank" style="color:#00B894;text-decoration:underline;">@babisnet</a></p>' +
                '</div>'
            );
        });
    }

    var menuInvite = document.getElementById('menuInvite');
    if (menuInvite) {
        menuInvite.addEventListener('click', function(e) {
            e.preventDefault();
            closeMenu();
            showModal(
                'دعوت دوستان',
                '<div style="text-align:center;">' +
                '<div style="font-size:44px;margin-bottom:12px;">👥</div>' +
                '<p style="font-size:16px;color:rgba(255,255,255,0.8);">دوستانت رو به <strong style="color:#00B894;">بابیس نت</strong> دعوت کن و جایزه بگیر!</p>' +
                '<p style="font-size:14px;color:rgba(255,255,255,0.6);margin:12px 0;">🔗 کد دعوت: <strong style="color:#00B894;">به زودی</strong></p>' +
                '<p style="font-size:14px;color:rgba(255,255,255,0.6);">📤 اشتراک‌گذاری لینک: <strong style="color:#00B894;">به زودی</strong></p>' +
                '<p style="font-size:16px;color:#FFD700;margin-top:12px;">🎁 به ازای هر دعوت، ۱۵۰ پروبال جایزه بگیر!</p>' +
                '</div>'
            );
        });
    }

    var menuGuide = document.getElementById('menuGuide');
    if (menuGuide) {
        menuGuide.addEventListener('click', function(e) {
            e.preventDefault();
            closeMenu();
            showModal(
                'راهنمای بازی بابیس نت',
                '<div style="font-size:14px;line-height:2;">' +
                '<p>🎯 <strong style="color:#00B894;">چطور بازی کنیم؟</strong></p>' +
                '<p>۱. وارد بخش مسابقات بشو</p>' +
                '<p>۲. نتیجه هر بازی رو پیش‌بینی کن</p>' +
                '<p>۳. با پیش‌بینی درست، بال پوینت بگیر</p>' +
                '<p>۴. بال پوینت‌هات رو توی جدول رتبه‌بندی ببین</p>' +
                '<p>۵. در پایان هر تورنومنت، به برترین‌ها جایزه تعلق می‌گیره!</p>' +
                '<p>۶. در پایان هر تورنومنت امتیازات ۰ می‌شوند</p>' +
                '<br>' +
                '<p>🏆 <strong style="color:#00B894;">جوایز:</strong></p>' +
                '<p>قبل از شروع هر تورنومنت جوایز از طریق کانال تلگرام، پیج اینستاگرام و بخش جوایز در داخل منو قابل مشاهده است</p>' +
                '<br>' +
                '<p>📊 <strong style="color:#00B894;">امتیازدهی:</strong></p>' +
                '<p>✅ پیش‌بینی دقیق نتیجه: <strong style="color:#FFD700;">۵</strong> بال پوینت</p>' +
                '<p>✅ پیش‌بینی درست برنده/مساوی: <strong style="color:#FFD700;">۳</strong> بال پوینت</p>' +
                '<p>❌ پیش‌بینی اشتباه: <strong style="color:#FF6B6B;">۰</strong> بال پوینت</p>' +
                '<br>' +
                '<p>🔥 <strong style="color:#00B894;">استریک:</strong> هر روز پیش‌بینی کن و پاداش بگیر!</p>' +
                '<p>🎁 <strong style="color:#00B894;">چالش روزانه:</strong> ۲ پیش‌بینی = ۵۰ سکه</p>' +
                '</div>'
            );
        });
    }

    var menuRules = document.getElementById('menuRules');
    if (menuRules) {
        menuRules.addEventListener('click', function(e) {
            e.preventDefault();
            closeMenu();
            showModal(
                'قوانین بابیس نت',
                '<div style="font-size:14px;line-height:2.2;">' +
                '<p>۱. هر کاربر فقط با <strong style="color:#00B894;">یک حساب</strong> می‌تونه شرکت کنه.</p>' +
                '<p>۲. پیش‌بینی تا <strong style="color:#00B894;">۵ دقیقه</strong> قبل از شروع مسابقه.</p>' +
                '<p>۳. بعد از شروع، <strong style="color:#00B894;">امکان ویرایش</strong> وجود نداره.</p>' +
                '<p>۴. امتیاز بر اساس <strong style="color:#00B894;">نتیجه نهایی</strong> مسابقه.</p>' +
                '<p>۵. در صورت تساوی، <strong style="color:#00B894;">پیش‌بینی مساوی</strong> معتبره.</p>' +
                '<p>۶. تقلب = <strong style="color:#FF6B6B;">حذف از جدول</strong></p>' +
                '<p>۷. جوایز فقط به <strong style="color:#00B894;">برترین‌ها</strong> تعلق می‌گیره.</p>' +
                '<p>۸. سکه‌ها <strong style="color:#00B894;">قابل تبدیل به پول</strong> نیستن.</p>' +
                '<p>۹. تغییر قوانین با <strong style="color:#00B894;">اطلاع‌رسانی</strong> قبلی.</p>' +
                '<p>۱۰. ثبت‌نام = <strong style="color:#00B894;">پذیرش قوانین</strong></p>' +
                '<br>' +
                '<p style="text-align:center;color:rgba(255,255,255,0.4);font-size:12px;">تاریخ به‌روزرسانی: ۱۴۰۵/۰۴/۲۷</p>' +
                '</div>'
            );
        });
    }

    var menuGift = document.getElementById('menuGift');
    if (menuGift) {
        menuGift.addEventListener('click', function(e) {
            e.preventDefault();
            closeMenu();
            showModal(
                '🎁 جوایز تورنومنت',
                '<div style="text-align:center;font-size:16px;line-height:2.5;">' +
                '<div style="font-size:48px;margin-bottom:12px;">🏆</div>' +
                '<p style="color:rgba(255,255,255,0.9);">جوایز هر تورنومنت از طریق:</p>' +
                '<p>📢 <strong style="color:#00B894;">کانال تلگرام</strong></p>' +
                '<p>📸 <strong style="color:#00B894;">پیج اینستاگرام</strong></p>' +
                '<p>📋 <strong style="color:#00B894;">بخش جوایز</strong> در همین منو</p>' +
                '<p style="color:rgba(255,255,255,0.6);font-size:14px;margin-top:12px;">قابل مشاهده است</p>' +
                '</div>'
            );
        });
    }

    // ====================================
    // ۹. خروج از حساب
    // ====================================
    var menuLogout = document.getElementById('menuLogout');
    if (menuLogout) {
        menuLogout.addEventListener('click', function(e) {
            e.preventDefault();
            closeMenu();
            showModal(
                '🚪 خروج از حساب',
                '<div style="text-align:center;">' +
                '<div style="font-size:48px;margin-bottom:12px;">🤔</div>' +
                '<p style="font-size:16px;color:rgba(255,255,255,0.9);">آیا مطمئنی که می‌خوای از حساب خود خارج بشی؟</p>' +
                '<div style="display:flex;gap:12px;justify-content:center;margin-top:20px;">' +
                '<button id="confirmLogout" style="background:#00B894;color:white;padding:10px 30px;border-radius:12px;font-size:16px;font-weight:bold;border:none;cursor:pointer;">آره</button>' +
                '<button id="cancelLogout" style="background:rgba(255,255,255,0.15);color:white;padding:10px 30px;border-radius:12px;font-size:16px;border:none;cursor:pointer;">نه</button>' +
                '</div>' +
                '</div>'
            );

            document.getElementById('confirmLogout').addEventListener('click', function() {
                localStorage.removeItem('babisnet_token');
                localStorage.removeItem('babisnet_user');
                closeModal();
                showModal(
                    '🚪 خروج موفق',
                    '<div style="text-align:center;">' +
                    '<div style="font-size:48px;margin-bottom:12px;">👋</div>' +
                    '<p style="font-size:16px;color:rgba(255,255,255,0.9);">شما با موفقیت از حساب خود خارج شدید.</p>' +
                    '<button id="goToLogin" style="background:#00B894;color:white;padding:10px 30px;border-radius:12px;font-size:16px;font-weight:bold;border:none;cursor:pointer;margin-top:16px;">رفتن به صفحه ورود</button>' +
                    '</div>'
                );
                document.getElementById('goToLogin').addEventListener('click', function() {
                    window.location.href = 'form.html';
                });
            });

            document.getElementById('cancelLogout').addEventListener('click', function() {
                closeModal();
            });
        });
    }
document.addEventListener("DOMContentLoaded", setupNavIcons);