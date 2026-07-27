// =========================
// بابیس نت - مسابقات
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

    var currentDay = 'today';
    var matchesContainer = document.getElementById('matchesContainer');
    var userPredictions = {};
    var token = localStorage.getItem('babisnet_token');

    // ====================================
    // بارگذاری مسابقات از API
    // ====================================
    function loadMatches(day) {
        if (matchesContainer) {
            matchesContainer.innerHTML = '<div style="text-align:center;padding:20px;color:rgba(255,255,255,0.3);">در حال بارگذاری...</div>';
        }

        var url = 'http://localhost:8080/api_matches.php?type=' + day;

        fetch('http://localhost:8080/api_predictions.php', {
            headers: { 'Authorization': 'Bearer ' + token }
        })
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.success) {
                userPredictions = data.predictions || {};
            }
            return fetch(url);
        })
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.success) {
                renderMatches(data.matches, day);
            } else {
                if (matchesContainer) {
                    matchesContainer.innerHTML = '<p style="text-align:center;color:#FF6B6B;padding:20px;">خطا در بارگذاری مسابقات</p>';
                }
                console.error('خطا:', data.message);
            }
        })
        .catch(function(error) {
            if (matchesContainer) {
                matchesContainer.innerHTML = '<p style="text-align:center;color:#FF6B6B;padding:20px;">خطا در ارتباط با سرور</p>';
            }
            console.error('خطا:', error);
        });
    }

    // ====================================
    // نمایش مسابقات
    // ====================================
    function renderMatches(matches, day) {
        if (!matchesContainer) return;

        if (!matches || matches.length === 0) {
            matchesContainer.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.3);padding:20px;">هیچ مسابقه‌ای در این روز وجود ندارد</p>';
            return;
        }

        matchesContainer.innerHTML = matches.map(function(match) {
            var prediction = userPredictions[match.id];
            var isPredicted = !!prediction;
            var statusHtml = '';
            if (match.status === 'live') {
                statusHtml = '<span class="status-badge live">زنده</span>';
            } else if (match.status === 'finished') {
                statusHtml = '<span class="status-badge finished">پایان یافته</span>';
            }

            var btnHtml = '';
            if (isPredicted && match.status !== 'finished' && match.status !== 'live') {
                btnHtml = '<button class="edit-predict-btn" data-match="' + match.id + '">✏️ ویرایش پیش‌بینی</button>';
            } else if (match.status !== 'finished' && match.status !== 'live') {
                btnHtml = '<button class="predict-btn" data-match="' + match.id + '">پیش‌بینی</button>';
            } else {
                btnHtml = '<button class="predict-btn disabled" disabled>پایان یافته</button>';
            }

            return '<div class="match-card" data-id="' + match.id + '">' +
                '<div class="match-teams">' +
                '<div class="team">' +
                '<img src="' + match.home_logo + '" alt="' + match.home_team + '" loading="lazy" onerror="this.src=\'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2250%22 height=%2250%22%3E%3Crect width=%2250%22 height=%2250%22 fill=%22%230B2942%22/%3E%3Ctext x=%2225%22 y=%2232%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-weight=%22bold%22%3E' + match.home_team.charAt(0) + '%3C/text%3E%3C/svg%3E\'">' +
                '<span class="team-name">' + match.home_team + '</span>' +
                '</div>' +
                '<img src="vs.webp" alt="vs" class="vs-icon" onerror="this.style.display=\'none\'">' +
                '<div class="team">' +
                '<img src="' + match.away_logo + '" alt="' + match.away_team + '" loading="lazy" onerror="this.src=\'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2250%22 height=%2250%22%3E%3Crect width=%2250%22 height=%2250%22 fill=%22%230B2942%22/%3E%3Ctext x=%2225%22 y=%2232%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-weight=%22bold%22%3E' + match.away_team.charAt(0) + '%3C/text%3E%3C/svg%3E\'">' +
                '<span class="team-name">' + match.away_team + '</span>' +
                '</div>' +
                '</div>' +
                '<div class="match-info">' +
                '<div class="match-time-date">' +
                '<span class="time">' + match.match_time + '</span>' +
                '<span class="date">' + match.match_date + '</span>' +
                '</div>' +
                '<span class="league-badge">' + match.league + '</span>' +
                statusHtml +
                '</div>' +
                (isPredicted ? '<div class="prediction-result">پیش‌بینی: ' + prediction.home_score + '-' + prediction.away_score + '</div>' : '') +
                btnHtml +
                '</div>';
        }).join('');

        document.querySelectorAll('.predict-btn:not(.disabled)').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var matchId = this.dataset.match;
                openPredictModal(matchId);
            });
        });

        document.querySelectorAll('.edit-predict-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var matchId = this.dataset.match;
                var prediction = userPredictions[matchId];
                if (prediction) {
                    openEditModal(matchId, prediction);
                }
            });
        });
    }

    // ====================================
    // مودال پیش‌بینی
    // ====================================
    var predictModal = document.getElementById('predictModal');
    var predictModalBody = document.getElementById('predictModalBody');
    var predictModalTitle = document.getElementById('predictModalTitle');
    var closePredictModal = document.getElementById('closePredictModal');

    function openPredictModal(matchId) {
        if (!predictModal) return;

        predictModalTitle.textContent = 'پیش‌بینی نتیجه';
        predictModalBody.innerHTML = 
            '<p style="text-align:center;margin-bottom:12px;">نتیجه دقیق را وارد کنید</p>' +
            '<div class="exact-input-group">' +
            '<input type="number" id="exactHome" min="0" max="10" placeholder="0">' +
            '<span>-</span>' +
            '<input type="number" id="exactAway" min="0" max="10" placeholder="0">' +
            '</div>' +
            '<button class="confirm-exact-btn" id="confirmExact">ثبت پیش‌بینی</button>';

        predictModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        document.getElementById('confirmExact').addEventListener('click', function() {
            var home = parseInt(document.getElementById('exactHome').value);
            var away = parseInt(document.getElementById('exactAway').value);

            if (isNaN(home) || isNaN(away)) {
                showMessage('خطا', 'لطفاً هر دو عدد را وارد کنید.');
                return;
            }

            if (home < 0 || home > 10 || away < 0 || away > 10) {
                showMessage('خطا', 'اعداد باید بین ۰ تا ۱۰ باشند.');
                return;
            }

            submitPrediction(matchId, home, away);
        });
    }

    function openEditModal(matchId, prediction) {
        if (!predictModal) return;

        predictModalTitle.textContent = 'ویرایش پیش‌بینی';
        predictModalBody.innerHTML = 
            '<p style="text-align:center;margin-bottom:12px;">نتیجه جدید را وارد کنید</p>' +
            '<div class="exact-input-group">' +
            '<input type="number" id="exactHome" min="0" max="10" placeholder="0" value="' + prediction.home_score + '">' +
            '<span>-</span>' +
            '<input type="number" id="exactAway" min="0" max="10" placeholder="0" value="' + prediction.away_score + '">' +
            '</div>' +
            '<button class="confirm-exact-btn" id="confirmEdit">ویرایش پیش‌بینی</button>';

        predictModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        document.getElementById('confirmEdit').addEventListener('click', function() {
            var home = parseInt(document.getElementById('exactHome').value);
            var away = parseInt(document.getElementById('exactAway').value);

            if (isNaN(home) || isNaN(away)) {
                showMessage('خطا', 'لطفاً هر دو عدد را وارد کنید.');
                return;
            }

            if (home < 0 || home > 10 || away < 0 || away > 10) {
                showMessage('خطا', 'اعداد باید بین ۰ تا ۱۰ باشند.');
                return;
            }

            updatePrediction(matchId, home, away);
        });
    }

    function closePredictModalHandler() {
        if (predictModal) {
            predictModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (closePredictModal) {
        closePredictModal.addEventListener('click', closePredictModalHandler);
    }

    if (predictModal) {
        predictModal.addEventListener('click', function(e) {
            if (e.target === predictModal) closePredictModalHandler();
        });
    }

    // ====================================
    // ثبت پیش‌بینی
    // ====================================
    function submitPrediction(matchId, homeScore, awayScore) {
        if (!token) {
            showMessage('خطا', 'لطفاً ابتدا وارد حساب خود شوید.');
            closePredictModalHandler();
            return;
        }

        fetch('http://localhost:8080/api_predict.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                match_id: matchId,
                home_score: homeScore,
                away_score: awayScore
            })
        })
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.success) {
                showMessage('✅ موفق', 'پیش‌بینی شما با موفقیت ثبت شد!');
                closePredictModalHandler();
                loadMatches(currentDay);
            } else {
                showMessage('❌ خطا', data.message || 'خطا در ثبت پیش‌بینی');
            }
        })
        .catch(function(error) {
            console.error('خطا:', error);
            showMessage('❌ خطا', 'خطا در ارتباط با سرور');
        });
    }

    // ====================================
    // ویرایش پیش‌بینی
    // ====================================
    function updatePrediction(matchId, homeScore, awayScore) {
        if (!token) {
            showMessage('خطا', 'لطفاً ابتدا وارد حساب خود شوید.');
            closePredictModalHandler();
            return;
        }

        fetch('http://localhost:8080/api_predict_update.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                match_id: matchId,
                home_score: homeScore,
                away_score: awayScore
            })
        })
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.success) {
                showMessage('✅ موفق', 'پیش‌بینی با موفقیت ویرایش شد!');
                closePredictModalHandler();
                loadMatches(currentDay);
            } else {
                showMessage('❌ خطا', data.message || 'خطا در ویرایش پیش‌بینی');
            }
        })
        .catch(function(error) {
            console.error('خطا:', error);
            showMessage('❌ خطا', 'خطا در ارتباط با سرور');
        });
    }

    // ====================================
    // نمایش پیام
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
    // تب‌ها
    // ====================================
    var tabs = document.querySelectorAll('.tab-btn');
    if (tabs) {
        tabs.forEach(function(btn) {
            btn.addEventListener('click', function() {
                tabs.forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');
                currentDay = this.dataset.day;
                loadMatches(currentDay);
            });
        });
    }

    // ====================================
    // اجرای اولیه
    // ====================================
    setupNavIcons();
    loadMatches('today');

});