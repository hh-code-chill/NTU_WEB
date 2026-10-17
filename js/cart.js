/* ==========================================
   JAVASCRIPT GIỎ HÀNG - FRESHFARM
   Dùng chung cho cart.html, checkout.html và các trang khác.
   Hoàng gọi addToCart() ở trang chi tiết sản phẩm.
   ========================================== */

const CART_KEY = 'freshfarm_cart';
const COUPON_KEY = 'freshfarm_coupon';
const FREE_SHIP_FROM = 300000;  // Miễn phí giao hàng từ 300.000đ
const SHIP_FEE = 30000;

// Danh sách mã giảm giá hợp lệ
const COUPONS = {
    FRESH10: { type: 'percent', value: 10, text: 'Giảm 10%' },
    FARM50: { type: 'amount', value: 50000, text: 'Giảm 50.000đ' }
};

// Định dạng tiền Việt Nam
function formatMoney(number) {
    return Number(number).toLocaleString('vi-VN') + 'đ';
}

// Đọc / lưu giỏ hàng từ localStorage
function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (error) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
}

// Cập nhật số lượng hiển thị trên biểu tượng giỏ hàng ở Navbar
function updateCartBadge() {
    let total = getCart().reduce(function (sum, item) {
        return sum + item.qty;
    }, 0);
    $('.cart-count-badge').text(total);
}

/* Thêm sản phẩm vào giỏ.
   item = { id, name, price, qty, mode, img }
   mode: 'kg' (mua lẻ theo kg) hoặc 'weekly' (gói hộp định kỳ hàng tuần) */
function addToCart(item) {
    let cart = getCart();
    let found = cart.find(function (p) {
        return p.id === item.id && p.mode === item.mode;
    });
    if (found) {
        found.qty += item.qty || 1;
    } else {
        item.qty = item.qty || 1;
        cart.push(item);
    }
    saveCart(cart);
}

// Tính tiền giảm giá theo mã đang áp dụng
function getDiscount(subtotal) {
    let coupon = COUPONS[localStorage.getItem(COUPON_KEY)];
    if (!coupon || subtotal === 0) return 0;
    if (coupon.type === 'percent') {
        return Math.round(subtotal * coupon.value / 100);
    }
    return Math.min(coupon.value, subtotal);
}

// Tính tạm tính, giảm giá, phí giao hàng và tổng cộng
function calcTotals() {
    let subtotal = getCart().reduce(function (sum, item) {
        return sum + item.price * item.qty;
    }, 0);
    let discount = getDiscount(subtotal);
    let afterDiscount = subtotal - discount;
    let shipping = (afterDiscount === 0 || afterDiscount >= FREE_SHIP_FROM) ? 0 : SHIP_FEE;
    return { subtotal: subtotal, discount: discount, shipping: shipping, total: afterDiscount + shipping };
}

function renderTotals() {
    let t = calcTotals();
    $('#sumSubtotal').text(formatMoney(t.subtotal));
    $('#sumDiscount').text('-' + formatMoney(t.discount));
    $('#sumShipping').text(t.shipping ? formatMoney(t.shipping) : 'Miễn phí');
    $('#sumTotal').text(formatMoney(t.total));
}

// Vẽ bảng danh sách hàng trong giỏ
function renderCart() {
    let cart = getCart();
    let $body = $('#cartBody').empty();
    $('#cartEmpty').toggleClass('d-none', cart.length > 0);
    $('#cartFilled').toggleClass('d-none', cart.length === 0);

    cart.forEach(function (item, index) {
        let isWeekly = item.mode === 'weekly';
        let unit = isWeekly ? '/ hộp / tuần' : '/ kg';
        let tag = isWeekly
            ? '<span class="badge bg-warning text-dark">Gói hộp hàng tuần</span>'
            : '<span class="badge bg-success">Mua lẻ theo kg</span>';

        $body.append(
            '<tr data-index="' + index + '">' +
                '<td><div class="d-flex align-items-center gap-3">' +
                    '<img class="cart-img" src="' + (item.img || '') + '" alt="' + item.name + '">' +
                    '<div><div class="fw-semibold">' + item.name + '</div>' + tag + '</div></div></td>' +
                '<td class="text-nowrap">' + formatMoney(item.price) + ' <small class="text-muted">' + unit + '</small></td>' +
                '<td><div class="input-group qty-box">' +
                    '<button class="btn btn-outline-success btn-minus" type="button">−</button>' +
                    '<input type="text" class="form-control qty-input" value="' + item.qty + '" aria-label="Số lượng">' +
                    '<button class="btn btn-outline-success btn-plus" type="button">+</button></div></td>' +
                '<td class="fw-bold text-nowrap">' + formatMoney(item.price * item.qty) + '</td>' +
                '<td><button class="btn btn-sm btn-outline-danger btn-delete" title="Xóa"><i class="bi bi-trash"></i></button></td>' +
            '</tr>'
        );
    });
    renderTotals();
}

// Đặt số lượng mới cho 1 dòng (tối thiểu 1, tối đa 99)
function setQuantity(index, qty) {
    let cart = getCart();
    if (!cart[index]) return;
    cart[index].qty = Math.max(1, Math.min(99, qty || 1));
    saveCart(cart);
    renderCart();
}

$(document).ready(function () {
    updateCartBadge();

    // Các thao tác dưới đây chỉ chạy ở trang giỏ hàng
    if ($('#cartBody').length === 0) return;
    renderCart();

    // Tăng / giảm / nhập tay số lượng / xóa món
    $('#cartBody').on('click', '.btn-plus', function () {
        let index = $(this).closest('tr').data('index');
        setQuantity(index, getCart()[index].qty + 1);
    });
    $('#cartBody').on('click', '.btn-minus', function () {
        let index = $(this).closest('tr').data('index');
        setQuantity(index, getCart()[index].qty - 1);
    });
    $('#cartBody').on('change', '.qty-input', function () {
        setQuantity($(this).closest('tr').data('index'), parseInt($(this).val(), 10));
    });
    $('#cartBody').on('click', '.btn-delete', function () {
        let cart = getCart();
        cart.splice($(this).closest('tr').data('index'), 1);
        saveCart(cart);
        renderCart();
    });

    // Xóa toàn bộ giỏ hàng
    $('#btnClearCart').on('click', function () {
        if (confirm('Bạn muốn xóa toàn bộ giỏ hàng?')) {
            saveCart([]);
            renderCart();
        }
    });

    // Thêm sản phẩm mẫu để kiểm thử khi chưa ghép trang của Hoàng
    $('#btnDemo').on('click', function () {
        addToCart({ id: 'cai-ngot', name: 'Cải ngọt hữu cơ', price: 35000, qty: 2, mode: 'kg', img: 'image/cai_ngot.png' });
        addToCart({ id: 'hop-rau', name: 'Hộp rau củ tuần (5 loại)', price: 189000, qty: 1, mode: 'weekly', img: 'image/hop_rau.png' });
        addToCart({ id: 'cam-sanh', name: 'Cam sành sạch', price: 45000, qty: 3, mode: 'kg', img: 'image/cam_sanh.png' });
        renderCart();
    });

    // Áp dụng mã giảm giá
    $('#btnCoupon').on('click', function () {
        let code = $('#couponCode').val().trim().toUpperCase();
        let $message = $('#couponMessage');
        if (code === '') {
            $message.attr('class', 'small mt-1 text-danger').text('Vui lòng nhập mã giảm giá.');
            return;
        }
        if (COUPONS[code]) {
            localStorage.setItem(COUPON_KEY, code);
            $message.attr('class', 'small mt-1 text-success').text('Đã áp dụng mã ' + code + ': ' + COUPONS[code].text);
        } else {
            localStorage.removeItem(COUPON_KEY);
            $message.attr('class', 'small mt-1 text-danger').text('Mã không hợp lệ. Thử FRESH10 hoặc FARM50.');
        }
        renderTotals();
    });
});
