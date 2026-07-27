// =========================
// بابیس نت - LOGIN SCRIPT (با اتصال به بک‌اند)
// =========================

document.addEventListener('DOMContentLoaded', function() {

    // ====================================
    // ۱. نمایش/مخفی کردن رمز عبور
    // ====================================
    var toggleBtn = document.getElementById('togglePassword');
    var passwordInput = document.getElementById('password');

    if (toggleBtn && passwordInput) {
        toggleBtn.addEventListener('click', function() {
            var icon = toggleBtn.querySelector('i');
            var isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            if (icon) {
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            }
        });
    }

    // ====================================
    // ۲. المان‌های فرم
    // ====================================
    var form = document.getElementById('authForm');
    var submitBtn = document.getElementById('submitBtn');
    var switchLink = document.getElementById('switchLink');
    var switchText = document.getElementById('switchText');
    var subtitleText = document.getElementById('subtitleText');
    
    var phoneInput = document.getElementById('phone');
    var codeInput = document.getElementById('verifyCode');
    var fullnameInput = document.getElementById('fullname');
    var fullnameGroup = document.getElementById('fullnameGroup');
    var codeGroup = document.getElementById('codeGroup');
    var timerGroup = document.getElementById('timerGroup');
    var timerDisplay = document.getElementById('timerDisplay');
    var loginOptions = document.getElementById('loginOptions');
    var forgotLink = document.getElementById('forgotPassword');

    var isLogin = true;
    var isCodeSent = false;
    var generatedCode = '';
    var timerInterval = null;
    var codeExpired = false;

    // ====================================
    // ۳. تغییر حالت (ورود ↔ ثبت‌نام)
    // ====================================
    function toggleMode() {
        isLogin = !isLogin;
        isCodeSent = false;
        codeExpired = false;
        clearInterval(timerInterval);
        timerGroup.style.display = 'none';

        if (isLogin) {
            submitBtn.textContent = 'ورود به حساب';
            switchText.textContent = 'حساب کاربری ندارید؟';
            switchLink.textContent = 'ثبت‌نام';
            subtitleText.textContent = 'پیش‌بینی کن، رقابت کن، جایزه ببر';
            fullnameGroup.style.display = 'none';
            codeGroup.style.display = 'none';
            loginOptions.style.display = 'flex';
            document.querySelector('.divider').style.display = 'flex';
            phoneInput.removeAttribute('readonly');
            fullnameInput.removeAttribute('required');
            codeInput.removeAttribute('required');
        } else {
            submitBtn.textContent = 'ثبت‌نام';
            switchText.textContent = 'قبلاً ثبت‌نام کردید؟';
            switchLink.textContent = 'ورود';
            subtitleText.textContent = 'به جمع ما بپیوند! 🚀';
            fullnameGroup.style.display = 'block';
            fullnameInput.setAttribute('required', 'required');
            codeGroup.style.display = 'none';
            codeInput.removeAttribute('required');
            loginOptions.style.display = 'none';
            document.querySelector('.divider').style.display = 'none';
            phoneInput.removeAttribute('readonly');
        }

        var msg = document.querySelector('.message');
        if (msg) msg.remove();
        form.reset();
        submitBtn.disabled = false;
        submitBtn.style.display = 'block';
    }

    if (switchLink) {
        switchLink.addEventListener('click', function(e) {
            e.preventDefault();
            toggleMode();
        });
    }

    // ====================================
    // ۴. تایمر ۲ دقیقه‌ای
    // ====================================
    function startTimer() {
        var timeLeft = 120;
        timerGroup.style.display = 'block';
        codeExpired = false;

        clearInterval(timerInterval);
        timerInterval = setInterval(function() {
            var minutes = Math.floor(timeLeft / 60);
            var seconds = timeLeft % 60;
            timerDisplay.textContent = 
                (minutes < 10 ? '0' : '') + minutes + ':' + 
                (seconds < 10 ? '0' : '') + seconds;
            
            timeLeft--;

            if (timeLeft < 0) {
                clearInterval(timerInterval);
                codeExpired = true;
                timerDisplay.textContent = '۰۰:۰۰';
                showMessage('⏰ زمان کد یکبار مصرف به پایان رسید. لطفاً دوباره تلاش کنید.', 'error');
                codeInput.disabled = true;
                submitBtn.disabled = true;
            }
        }, 1000);
    }

    // ====================================
    // ۵. ارسال فرم
    // ====================================
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            var phone = phoneInput.value.trim();
            var password = passwordInput.value.trim();

            if (!phone || !password) {
                showMessage('لطفاً تمام فیلدهای ضروری را پر کنید.', 'error');
                return;
            }

            // ====== ثبت‌نام ======
            if (!isLogin) {
                var fullname = fullnameInput.value.trim();

                if (!fullname) {
                    showMessage('لطفاً نام و نام خانوادگی خود را وارد کنید.', 'error');
                    return;
                }

                if (password.length < 8) {
                    showMessage('رمز عبور باید حداقل ۸ کاراکتر باشد.', 'error');
                    return;
                }

                // ====== مرحله ۱: ارسال کد ======
                if (!isCodeSent) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'در حال ارسال کد...';

                    fetch('http://localhost:8080/api_send_code.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ phone: phone })
                    })
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(data) {
                        if (data.success) {
                            generatedCode = data.code;
                            isCodeSent = true;

                            codeGroup.style.display = 'block';
                            codeInput.setAttribute('required', 'required');
                            codeInput.disabled = false;
                            submitBtn.disabled = false;
                            submitBtn.textContent = 'ثبت‌نام';
                            phoneInput.setAttribute('readonly', 'readonly');

                            startTimer();
                            showMessage('✅ کد یکبار مصرف به شماره شما ارسال شد! (۲ دقیقه زمان دارید)', 'success');
                        } else {
                            showMessage(data.message || 'خطا در ارسال کد. لطفاً دوباره تلاش کنید.', 'error');
                            submitBtn.disabled = false;
                            submitBtn.textContent = 'ثبت‌نام';
                        }
                    })
                    .catch(function(error) {
                        console.error('خطا:', error);
                        showMessage('خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.', 'error');
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'ثبت‌نام';
                    });
                    
                    return;
                }

                // ====== مرحله ۲: تایید کد و ثبت‌نام نهایی ======
                var code = codeInput.value.trim();

                if (!code) {
                    showMessage('لطفاً کد یکبار مصرف را وارد کنید.', 'error');
                    return;
                }

                if (codeExpired) {
                    showMessage('⏰ زمان کد به پایان رسیده. لطفاً دوباره تلاش کنید.', 'error');
                    return;
                }

                if (code !== generatedCode) {
                    showMessage('❌ کد یکبار مصرف اشتباه است. لطفاً دوباره تلاش کنید.', 'error');
                    return;
                }

                submitBtn.disabled = true;
                submitBtn.textContent = 'در حال ثبت‌نام...';

                fetch('http://localhost:8080/api_register.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: fullname,
                        phone: phone,
                        password: password
                    })
                })
                .then(function(response) {
                    return response.json();
                })
                .then(function(data) {
                    if (data.success) {
                        clearInterval(timerInterval);
                        showMessage('🎉 ثبت‌نام با موفقیت انجام شد!', 'success');
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'ثبت‌نام';

                        setTimeout(function() {
                            if (!isLogin) toggleMode();
                        }, 2000);
                    } else {
                        showMessage(data.message || 'خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.', 'error');
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'ثبت‌نام';
                    }
                })
                .catch(function(error) {
                    console.error('خطا:', error);
                    showMessage('خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.', 'error');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'ثبت‌نام';
                });
            }

            // ====== ورود ======
            else {
                submitBtn.disabled = true;
                submitBtn.textContent = 'در حال ورود...';

                fetch('http://localhost:8080/api_login.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phone: phone, password: password })
                })
                .then(function(response) {
                    return response.json();
                })
                .then(function(data) {
                    if (data.success) {
                        localStorage.setItem('babisnet_user', JSON.stringify(data.user));
                        localStorage.setItem('babisnet_token', data.token);

                        showMessage('🎉 ورود با موفقیت انجام شد!', 'success');

                        setTimeout(function() {
                            window.location.href = 'home.html';
                        }, 1500);
                    } else {
                        showMessage(data.message || 'شماره تلفن یا رمز عبور اشتباه است.', 'error');
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'ورود به حساب';
                    }
                })
                .catch(function(error) {
                    console.error('خطا:', error);
                    showMessage('خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.', 'error');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'ورود به حساب';
                });
            }
        });
    }

    // ====================================
    // ۶. نمایش پیام
    // ====================================
    function showMessage(text, type) {
        var oldMessage = document.querySelector('.message');
        if (oldMessage) oldMessage.remove();

        var messageDiv = document.createElement('div');
        messageDiv.className = 'message ' + type;
        messageDiv.textContent = text;

        var form = document.getElementById('authForm');
        if (form) {
            form.parentNode.insertBefore(messageDiv, form);
        }
    }

    // ====================================
    // ۷. فراموشی رمز
    // ====================================
    if (forgotLink) {
        forgotLink.addEventListener('click', function(e) {
            e.preventDefault();
            showMessage('لطفاً با پشتیبانی تماس بگیرید: @erfan_966', 'error');
        });
    }

});