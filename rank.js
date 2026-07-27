// =========================
// بابیس نت - جدول رتبه‌بندی
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

    var allUsers = [];
    var currentUserId = null;
    var visibleCount = 10;
    var loadMoreCount = 5;

    // ====================================
    // ۱. دریافت داده‌ها
    // ====================================
    function loadRanking() {
        APIRank.getRanking()
            .then(function(users) {
                allUsers = users;
                return APIRank.getCurrentUser();
            })
            .then(function(currentUser) {
                if (currentUser) {
                    currentUserId = currentUser.id;
                }
                renderTopThree();
                renderRankList();
            })
            .catch(function(error) {
                console.error('خطا در دریافت رتبه‌بندی:', error);
                document.getElementById('rankList').innerHTML = '<p style="text-align:center;color:#FF6B6B;padding:30px 0;">خطا در بارگذاری جدول</p>';
            });
    }

    // ====================================
    // ۲. نمایش ۳ نفر برتر
    // ====================================
    function renderTopThree() {
        var container = document.getElementById('topThree');
        var sorted = [...allUsers].sort(function(a, b) { return b.ballpoint - a.ballpoint; });
        var top3 = sorted.slice(0, 3);

        if (top3.length === 0) {
            container.innerHTML = '';
            return;
        }

        var medals = [
            { img: 'tala.webp', alt: 'طلایی', cls: 'gold' },
            { img: 'nogh.webp', alt: 'نقره‌ای', cls: 'silver' },
            { img: 'boronz.webp', alt: 'برنزی', cls: 'bronze' }
        ];

        container.innerHTML = '';
        top3.forEach(function(user, index) {
            var card = document.createElement('div');
            var medal = medals[index] || medals[0];
            card.className = 'top-card ' + medal.cls;
            card.dataset.id = user.id;
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');

            var medalImg = document.createElement('img');
            medalImg.src = medal.img;
            medalImg.alt = 'مدال ' + medal.alt;
            medalImg.className = 'rank-icon';
            medalImg.onerror = function() { this.style.display = 'none'; };
            card.appendChild(medalImg);

            var avatarImg = document.createElement('img');
            avatarImg.src = user.avatar || 'hich.png';
            avatarImg.alt = user.name;
            avatarImg.className = 'avatar';
            avatarImg.onerror = function() { this.src = 'hich.png'; };
            card.appendChild(avatarImg);

            var nameDiv = document.createElement('div');
            nameDiv.className = 'name';
            nameDiv.textContent = user.name;
            card.appendChild(nameDiv);

            var scoreDiv = document.createElement('div');
            scoreDiv.className = 'score';
            var scoreText = document.createTextNode(user.ballpoint + ' ');
            scoreDiv.appendChild(scoreText);
            var scoreIcon = document.createElement('img');
            scoreIcon.src = 'ballpoint.png';
            scoreIcon.alt = 'بال پوینت';
            scoreIcon.className = 'score-icon';
            scoreDiv.appendChild(scoreIcon);
            card.appendChild(scoreDiv);

            var detailDiv = document.createElement('div');
            detailDiv.className = 'detail';
            detailDiv.textContent = 'لول ' + user.level + ' • ' + user.accuracy + '% دقت';
            card.appendChild(detailDiv);

            card.addEventListener('click', function() {
                openUserModal(user.id);
            });

            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openUserModal(user.id);
                }
            });

            container.appendChild(card);
        });
    }

    // ====================================
    // ۳. نمایش لیست بقیه کاربران
    // ====================================
    function renderRankList() {
        var container = document.getElementById('rankList');
        var sorted = [...allUsers].sort(function(a, b) { return b.ballpoint - a.ballpoint; });
        var displayUsers = sorted.slice(0, visibleCount);

        if (displayUsers.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.3);padding:30px 0;">هیچ کاربری وجود ندارد</p>';
            return;
        }

        container.innerHTML = '';
        displayUsers.forEach(function(user, index) {
            var rank = index + 1;
            var isCurrent = (user.id === currentUserId);
            var item = document.createElement('div');
            item.className = 'rank-item' + (isCurrent ? ' current-user' : '');
            item.dataset.id = user.id;
            item.setAttribute('role', 'button');
            item.setAttribute('tabindex', '0');

            var rankSpan = document.createElement('span');
            rankSpan.className = 'rank-number';
            rankSpan.textContent = rank;
            item.appendChild(rankSpan);

            var avatarImg = document.createElement('img');
            avatarImg.src = user.avatar || 'hich.png';
            avatarImg.alt = user.name;
            avatarImg.className = 'avatar';
            avatarImg.onerror = function() { this.src = 'hich.png'; };
            item.appendChild(avatarImg);

            var infoDiv = document.createElement('div');
            infoDiv.className = 'info';
            var nameDiv = document.createElement('div');
            nameDiv.className = 'name';
            nameDiv.textContent = user.name + (isCurrent ? ' (شما)' : '');
            infoDiv.appendChild(nameDiv);
            var detailDiv = document.createElement('div');
            detailDiv.className = 'detail';
            detailDiv.textContent = 'لول ' + user.level + ' • ' + user.accuracy + '% دقت';
            infoDiv.appendChild(detailDiv);
            item.appendChild(infoDiv);

            var scoreDiv = document.createElement('div');
            scoreDiv.className = 'score';
            var scoreText = document.createTextNode(user.ballpoint + ' ');
            scoreDiv.appendChild(scoreText);
            var scoreIcon = document.createElement('img');
            scoreIcon.src = 'ballpoint.png';
            scoreIcon.alt = 'بال پوینت';
            scoreIcon.className = 'score-icon';
            scoreDiv.appendChild(scoreIcon);
            item.appendChild(scoreDiv);

            item.addEventListener('click', function() {
                openUserModal(user.id);
            });

            item.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openUserModal(user.id);
                }
            });

            container.appendChild(item);
        });

        checkScroll();
    }

    // ====================================
    // ۴. Lazy Loading
    // ====================================
    function checkScroll() {
        var container = document.getElementById('rankList');
        var loader = document.getElementById('loader');

        var observer = new IntersectionObserver(function(entries) {
            if (entries[0].isIntersecting) {
                var sorted = [...allUsers].sort(function(a, b) { return b.ballpoint - a.ballpoint; });
                if (visibleCount < sorted.length) {
                    loader.style.display = 'block';
                    setTimeout(function() {
                        visibleCount += loadMoreCount;
                        renderRankList();
                        loader.style.display = 'none';
                    }, 500);
                } else {
                    loader.style.display = 'none';
                }
            }
        });

        if (container) {
            observer.observe(container);
        }
    }

    // ====================================
    // ۵. مودال اطلاعات کاربر
    // ====================================
    var modal = document.getElementById('userModal');
    var modalTitle = document.getElementById('modalUsername');
    var modalBody = document.getElementById('modalBody');
    var closeBtn = document.getElementById('closeUserModal');

    function openUserModal(userId) {
        APIRank.getUserById(userId)
            .then(function(user) {
                if (!user) {
                    showMessage('خطا', 'کاربر پیدا نشد.');
                    return;
                }

                modalTitle.textContent = user.name;

                modalBody.innerHTML = '';

                var avatarImg = document.createElement('img');
                avatarImg.src = user.avatar || 'hich.png';
                avatarImg.alt = user.name;
                avatarImg.className = 'modal-avatar';
                avatarImg.onerror = function() { this.src = 'hich.png'; };
                modalBody.appendChild(avatarImg);

                var infoDiv = document.createElement('div');
                infoDiv.className = 'modal-info';
                var nameDiv = document.createElement('div');
                nameDiv.className = 'modal-name';
                nameDiv.textContent = user.name;
                infoDiv.appendChild(nameDiv);
                var uidDiv = document.createElement('div');
                uidDiv.className = 'modal-uid';
                uidDiv.textContent = user.uid || 'BABIS-0000';
                infoDiv.appendChild(uidDiv);
                modalBody.appendChild(infoDiv);

                var statsDiv = document.createElement('div');
                statsDiv.className = 'modal-stats';

                var statsData = [
                    { num: user.ballpoint, label: 'بال پوینت', icon: 'ballpoint.png' },
                    { num: user.predictions, label: 'پیش‌بینی', icon: null },
                    { num: user.accuracy + '%', label: 'دقت', icon: null },
                    { num: user.level, label: 'لول', icon: null }
                ];

                statsData.forEach(function(stat) {
                    var statDiv = document.createElement('div');
                    statDiv.className = 'stat';
                    var numSpan = document.createElement('span');
                    numSpan.className = 'num';
                    var numText = document.createTextNode(stat.num + ' ');
                    numSpan.appendChild(numText);
                    if (stat.icon) {
                        var iconImg = document.createElement('img');
                        iconImg.src = stat.icon;
                        iconImg.alt = stat.label;
                        iconImg.className = 'stat-icon';
                        numSpan.appendChild(iconImg);
                    }
                    statDiv.appendChild(numSpan);
                    var labelSpan = document.createElement('span');
                    labelSpan.className = 'label';
                    labelSpan.textContent = stat.label;
                    statDiv.appendChild(labelSpan);
                    statsDiv.appendChild(statDiv);
                });

                modalBody.appendChild(statsDiv);

                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            })
            .catch(function(error) {
                console.error('خطا در دریافت اطلاعات کاربر:', error);
                showMessage('خطا', 'خطا در دریافت اطلاعات کاربر.');
            });
    }

    function closeUserModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeUserModal);
    }

    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeUserModal();
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeUserModal();
        }
    });

    // ====================================
    // ۶. نمایش پیام
    // ====================================
    function showMessage(title, content) {
        var msgModal = document.getElementById('messageModal');
        if (msgModal) {
            document.getElementById('msgTitle').textContent = title;
            var msgBody = document.getElementById('msgBody');
            msgBody.innerHTML = '';
            var p = document.createElement('p');
            p.style.textAlign = 'center';
            p.textContent = content;
            msgBody.appendChild(p);
            msgModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            setTimeout(function() {
                msgModal.classList.remove('active');
                document.body.style.overflow = '';
            }, 3000);
        } else {
            alert(content);
        }
    }

    // ====================================
    // ۷. بارگذاری اولیه
    // ====================================
    setupNavIcons();
    loadRanking();

});