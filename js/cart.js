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
  const badges = document.querySelectorAll(".cart-count-badge");
  badges.forEach((badge) => {
    badge.textContent = totalCount;
  });
}

// Hàm Thêm vào giỏ hàng (Đã cập nhật tách dòng theo Loại & Giao từ)
function addToCart(product) {
  let cart = getCart();

  // Chuẩn hóa dữ liệu đầu vào
  const variant = product.variant || "Mặc định";
  const location = product.location || "Hà Nội";
  const qtyToAdd =
    parseInt(product.quantity, 10) > 0 ? parseInt(product.quantity, 10) : 1;

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

  if (document.getElementById("cartBody")) {
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
  const cartEmpty = document.getElementById("cartEmpty");
  const cartFilled = document.getElementById("cartFilled");
  const cartBody = document.getElementById("cartBody");

  if (!cartBody || !cartEmpty || !cartFilled) return;

  const cart = getCart();

  if (cart.length === 0) {
    cartEmpty.classList.remove("d-none");
    cartFilled.classList.add("d-none");
    return;
  }

  cartEmpty.classList.add("d-none");
  cartFilled.classList.remove("d-none");

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
                        <button class="btn btn-outline-secondary" type="button" onclick="changeQuantity(${index}, -1)">-</button>
                        <input type="number" class="form-control text-center" value="${item.quantity}" min="1" onchange="updateQuantityInput(${index}, this.value)">
                        <button class="btn btn-outline-secondary" type="button" onclick="changeQuantity(${index}, 1)">+</button>
                    </div>
                </td>
                <td class="fw-bold text-success">${formatCurrency(itemTotal)}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-outline-danger border-0" onclick="removeItem(${index})" title="Xóa">
                        <i class="bi bi-trash fs-5"></i>
                    </button>
                </td>
            </tr>
        `;
  });

  cartBody.innerHTML = htmlContent;
  calculateCartSummary(cart);
}

function changeQuantity(index, delta) {
  let cart = getCart();
  if (!cart[index]) return;

  cart[index].quantity += delta;
  if (cart[index].quantity < 1) cart[index].quantity = 1;

  saveCart(cart);
  renderCartPage();
}

function updateQuantityInput(index, value) {
  let cart = getCart();
  if (!cart[index]) return;

  let newQty = parseInt(value, 10);
  if (isNaN(newQty) || newQty < 1) newQty = 1;

  cart[index].quantity = newQty;
  saveCart(cart);
  renderCartPage();
}

function removeItem(index) {
  let cart = getCart();
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

  let shippingFee =
    subtotal > 0 && subtotal < FREESHIP_THRESHOLD ? DEFAULT_SHIPPING_FEE : 0;
  const grandTotal = Math.max(0, subtotal - discount + shippingFee);

  document.getElementById("sumSubtotal").textContent = formatCurrency(subtotal);
  document.getElementById("sumDiscount").textContent =
    `-${formatCurrency(discount)}`;
  document.getElementById("sumShipping").textContent =
    shippingFee === 0 ? "Miễn phí" : formatCurrency(shippingFee);
  document.getElementById("sumTotal").textContent = formatCurrency(grandTotal);
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  if (document.getElementById("cartBody")) {
    renderCartPage();
    document
      .getElementById("btnClearCart")
      ?.addEventListener("click", clearAllCart);
  }
});
