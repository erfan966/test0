// =========================
// بابیس نت - فروشگاه
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

    var grid = document.getElementById('shopGrid');
    var token = localStorage.getItem('babisnet_token');
    var currentCategory = 'all';

    // ====================================
    // بارگذاری آیتم‌ها از API
    // ====================================
    function loadShopItems() {
        if (grid) {
            grid.innerHTML = '<div style="text-align:center;padding:20px;color:rgba(255,255,255,0.3);">در حال بارگذاری...</div>';
        }

        fetch('http://localhost:8080/api_shop.php')
            .then(function(response) { return response.json(); })
            .then(function(data) {
                if (data.success) {
                    renderItems(data.items);
                } else {
                    if (grid) {
                        grid.innerHTML = '<p style="text-align:center;color:#FF6B6B;padding:20px;">خطا در بارگذاری فروشگاه</p>';
                    }
                    console.error('خطا:', data.message);
                }
            })
            .catch(function(error) {
                if (grid) {
                    grid.innerHTML = '<p style="text-align:center;color:#FF6B6B;padding:20px;">خطا در ارتباط با سرور</p>';
                }
                console.error('خطا:', error);
            });
    }

    // ====================================
    // نمایش آیتم‌ها
    // ====================================
    function renderItems(items) {
        if (!grid) return;

        if (!items || items.length === 0) {
            grid.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.3);padding:20px;">هیچ آیتمی در فروشگاه وجود ندارد</p>';
            return;
        }

        grid.innerHTML = items.map(function(item) {
            var priceHtml = '';
            if (item.is_vip) {
                priceHtml = '<span style="color:#FFD700;">قیمت ویژه: ' + item.price + '</span>';
            } else {
                priceHtml = '<span>' + item.price + ' <img src="proball.png" alt="پروبال"></span>';
            }

            var btnHtml = '';
            var tagHtml = '';

            if (item.is_vip) {
                btnHtml = '<button class="buy-btn vip" data-id="' + item.id + '">خرید اشتراک</button>';
                tagHtml = '<span class="badge vip-badge">VIP</span>';
            } else if (item.is_special) {
                btnHtml = '<button class="buy-btn limited" data-id="' + item.id + '">خرید</button>';
                tagHtml = '<span class="badge limited-badge">ویژه</span>';
            } else {
                btnHtml = '<button class="buy-btn" data-id="' + item.id + '">خرید</button>';
                tagHtml = '<span class="badge profile-badge">پروفایل</span>';
            }

            return '<div class="shop-item" data-category="' + item.category + '">' +
                tagHtml +
                '<img src="' + item.image + '" alt="' + item.name + '" class="item-image" loading="lazy">' +
                '<div class="item-name">' + item.name + '</div>' +
                '<div class="item-price">' + priceHtml + '</div>' +
                btnHtml +
                '</div>';
        }).join('');

        document.querySelectorAll('.buy-btn:not(.owned)').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = this.dataset.id;
                alert('خرید آیتم ' + id + ' (در حال توسعه)');
            });
        });
    }

    // ====================================
    // دسته‌بندی
    // ====================================
    var catBtns = document.querySelectorAll('.cat-btn');
    if (catBtns) {
        catBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                catBtns.forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');
                currentCategory = this.dataset.category;
                loadShopItems();
            });
        });
    }

    // ====================================
    // بارگذاری اولیه
    // ====================================
    setupNavIcons();
    loadShopItems();

});