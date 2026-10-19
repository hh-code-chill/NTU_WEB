/* ==========================================================================
   1. QUẢN LÝ GIỎ HÀNG DÙNG CHUNG (GLOBAL CART LOGIC)
   ========================================================================== */
const CART_STORAGE_KEY = "freshfarm_cart";
const COUPON_STORAGE_KEY = "freshfarm_applied_coupon";

function getCart() {
  const cartData = localStorage.getItem(CART_STORAGE_KEY);
  return cartData ? JSON.parse(cartData) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

function updateCartBadge() {
  const cart = getCart();
  const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
  $(".cart-count, .cart-count-badge").text(totalCount);
}

// Hàm Thêm vào giỏ hàng (Đã cập nhật tách dòng theo Loại & Giao từ)
function addToCart(product) {
  const cart = getCart();

  // Chuẩn hóa dữ liệu đầu vào
  const variant = product.variant || "Mặc định";
  const location = product.location || "Hà Nội";
  const requestedQuantity = parseInt(product.quantity, 10);
  const qtyToAdd = requestedQuantity > 0 ? requestedQuantity : 1;

  // Tạo ID duy nhất cho mỗi biến thể (ID + Loại + Nơi giao)
  const cartItemId = `${product.id}_${variant}_${location}`;

  // Tìm xem sản phẩm cùng biến thể này đã có trong giỏ chưa
  const existingIndex = cart.findIndex(
    (item) => item.cartItemId === cartItemId,
  );

  if (existingIndex > -1) {
    // Nếu trùng cả ID, Loại và Nơi giao -> Cộng dồn số lượng
    cart[existingIndex].quantity += qtyToAdd;
  } else {
    // Nếu khác Loại hoặc khác Nơi giao -> Thêm thành 1 dòng mới riêng biệt
    cart.push({
      cartItemId: cartItemId,
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image || "image/logo.png",
      variant: variant,
      location: location,
      quantity: qtyToAdd,
    });
  }

  saveCart(cart);

  if ($("#cartBody").length) {
    renderCartPage();
  }
}

/* ==========================================================================
   2. XỬ LÝ GIAO DIỆN TRANG GIỎ HÀNG (CART PAGE LOGIC)
   ========================================================================== */
const VALID_COUPONS = {
  FRESH10: { type: "percent", value: 0.1, label: "Giảm 10%" },
  GIAM30K: { type: "fixed", value: 30000, label: "Giảm 30.000đ" },
};

const FREESHIP_THRESHOLD = 300000;
const DEFAULT_SHIPPING_FEE = 30000;

function renderCartPage() {
  const $cartEmpty = $("#cartEmpty");
  const $cartFilled = $("#cartFilled");
  const $cartBody = $("#cartBody");

  if (!$cartBody.length || !$cartEmpty.length || !$cartFilled.length) return;

  const cart = getCart();

  if (cart.length === 0) {
    $cartEmpty.removeClass("d-none");
    $cartFilled.addClass("d-none");
    return;
  }

  $cartEmpty.addClass("d-none");
  $cartFilled.removeClass("d-none");

  let htmlContent = "";
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    htmlContent += `
            <tr>
                <td>
                    <div class="d-flex align-items-center gap-3">
                        <a href="detail.html?id=${item.id}">
                            <img src="${item.image}" alt="${item.name}" class="cart-item-img" style="width: 65px; height: 65px; object-fit: cover; border-radius: 8px;">
                        </a>
                        <div>
                            <!-- Click vào tên chuyển đến trang detail -->
                            <a href="detail.html?id=${item.id}" class="text-decoration-none text-dark fw-bold hover-success">
                                ${item.name}
                            </a>
                            <div class="small text-muted mt-1">
                                <div><i class="bi bi-tag me-1"></i>Phân loại: <strong class="text-dark">${item.variant}</strong></div>
                                <div><i class="bi bi-geo-alt me-1"></i>Giao từ: <strong class="text-dark">${item.location}</strong></div>
                            </div>
                        </div>
                    </div>
                </td>
                <td class="fw-semibold">${formatCurrency(item.price)}</td>
                <td>
                    <div class="input-group input-group-sm" style="width: 110px;">
                        <button class="btn btn-outline-secondary cart-quantity-change" type="button" data-index="${index}" data-delta="-1">-</button>
                        <input type="number" class="form-control text-center cart-quantity-input" value="${item.quantity}" min="1" data-index="${index}">
                        <button class="btn btn-outline-secondary cart-quantity-change" type="button" data-index="${index}" data-delta="1">+</button>
                    </div>
                </td>
                <td class="fw-bold text-success">${formatCurrency(itemTotal)}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-outline-danger border-0 cart-remove-item" type="button" data-index="${index}" title="Xóa">
                        <i class="bi bi-trash fs-5"></i>
                    </button>
                </td>
            </tr>
        `;
  });

  $cartBody.html(htmlContent);
  calculateCartSummary(cart);
}

function changeQuantity(index, delta) {
  const cart = getCart();
  if (!cart[index]) return;

  cart[index].quantity += delta;
  if (cart[index].quantity < 1) cart[index].quantity = 1;

  saveCart(cart);
  renderCartPage();
}

function updateQuantityInput(index, value) {
  const cart = getCart();
  if (!cart[index]) return;

  const parsedQuantity = parseInt(value, 10);
  const newQty = Number.isNaN(parsedQuantity) || parsedQuantity < 1 ? 1 : parsedQuantity;

  cart[index].quantity = newQty;
  saveCart(cart);
  renderCartPage();
}

function removeItem(index) {
  const cart = getCart();
  if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
    cart.splice(index, 1);
    saveCart(cart);
    renderCartPage();
  }
}

function clearAllCart() {
  if (confirm("Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?")) {
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(COUPON_STORAGE_KEY);
    updateCartBadge();
    renderCartPage();
  }
}

function calculateCartSummary(cart) {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  let discount = 0;
  const appliedCouponCode = localStorage.getItem(COUPON_STORAGE_KEY);

  if (appliedCouponCode && VALID_COUPONS[appliedCouponCode]) {
    const coupon = VALID_COUPONS[appliedCouponCode];
    discount =
      coupon.type === "percent" ? subtotal * coupon.value : coupon.value;
    if (discount > subtotal) discount = subtotal;
  }

  const shippingFee =
    subtotal > 0 && subtotal < FREESHIP_THRESHOLD ? DEFAULT_SHIPPING_FEE : 0;
  const grandTotal = Math.max(0, subtotal - discount + shippingFee);

  $("#sumSubtotal").text(formatCurrency(subtotal));
  $("#sumDiscount").text(`-${formatCurrency(discount)}`);
  $("#sumShipping").text(
    shippingFee === 0 ? "Miễn phí" : formatCurrency(shippingFee),
  );
  $("#sumTotal").text(formatCurrency(grandTotal));
}

function applyCoupon() {
  const $couponInput = $("#couponCode");
  const $couponMessage = $("#couponMessage");
  if (!$couponInput.length || !$couponMessage.length) return;

  const code = $couponInput.val().trim().toUpperCase();
  $couponInput.val(code);

  if (!code) {
    $couponMessage
      .text("Vui lòng nhập mã giảm giá.")
      .attr("class", "small mt-1 text-danger");
    return;
  }

  const coupon = VALID_COUPONS[code];
  if (!coupon) {
    $couponMessage
      .text("Mã giảm giá không hợp lệ.")
      .attr("class", "small mt-1 text-danger");
    return;
  }

  localStorage.setItem(COUPON_STORAGE_KEY, code);
  $couponMessage
    .text(`Đã áp dụng mã ${code} (${coupon.label}).`)
    .attr("class", "small mt-1 text-success");
  calculateCartSummary(getCart());
}

$(function () {
  updateCartBadge();
  if ($("#cartBody").length) {
    const $cartBody = $("#cartBody");
    renderCartPage();
    $("#btnClearCart").on("click", clearAllCart);
    $("#btnCoupon").on("click", applyCoupon);
    $("#couponCode").on("keydown", (event) => {
      if (event.key === "Enter") applyCoupon();
    });
    $cartBody.on("click", ".cart-quantity-change", function () {
      changeQuantity(
        Number($(this).data("index")),
        Number($(this).data("delta")),
      );
    });
    $cartBody.on("change", ".cart-quantity-input", function () {
      updateQuantityInput(Number($(this).data("index")), $(this).val());
    });
    $cartBody.on("click", ".cart-remove-item", function () {
      removeItem(Number($(this).data("index")));
    });

    const appliedCouponCode = localStorage.getItem(COUPON_STORAGE_KEY);
    const appliedCoupon = appliedCouponCode && VALID_COUPONS[appliedCouponCode];
    if (appliedCoupon) {
      $("#couponCode").val(appliedCouponCode);
      $("#couponMessage")
        .text(`Đã áp dụng mã ${appliedCouponCode} (${appliedCoupon.label}).`)
        .attr("class", "small mt-1 text-success");
    }
  }
});
