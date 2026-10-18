document.addEventListener("DOMContentLoaded", () => {
  renderCheckoutSummary();
  setupCheckoutForm();
  setupPaymentMethodToggle();
});

// 1. RENDER DANH SÁCH SẢN PHẨM & TỔNG TIỀN TỪ GIỎ HÀNG
function renderCheckoutSummary() {
  const container = document.getElementById("checkoutOrderItems");
  const subtotalEl = document.getElementById("checkoutSubtotal");
  const disshipEl = document.getElementById("checkoutShip");
  const discountEl = document.getElementById("checkoutDiscount");
  const discountLabelEl = document.getElementById("checkoutDiscountLabel");
  const grandTotalEl = document.getElementById("checkoutGrandTotal");

  if (!container) return;

  // Lấy dữ liệu từ hàm getCart() có sẵn trong cart.js
  const cart = typeof getCart === "function" ? getCart() : [];

  // Nếu giỏ hàng rỗng, cảnh báo và quay về giỏ hàng
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-center py-4 text-muted">
        <i class="bi bi-cart-x fs-2 d-block mb-2"></i>
        Giỏ hàng của bạn đang trống.
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = "0 đ";
    if (discountEl) discountEl.textContent = "-0đ";
    if (disshipEl) disshipEl.textContent = "0đ";
    if (grandTotalEl) grandTotalEl.textContent = "0 đ";
    return;
  }

  let htmlContent = "";
  let subtotal = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    htmlContent += `
      <div class="checkout-item-row py-2 border-bottom">
        <div class="d-flex justify-content-between align-items-start">
          <div class="pe-2">
            <span class="checkout-item-title fw-semibold text-dark">${item.name}</span>
            <span class="fw-bold text-success ms-1">× ${item.quantity}</span>
            <div class="checkout-item-meta small text-muted mt-1">
              <div>Giao hàng từ: <strong>${item.location || "Hà Nội"}</strong></div>
              <div>Phân loại: <strong>${item.variant || "Mặc định"}</strong></div>
            </div>
          </div>
          <span class="fw-bold text-nowrap text-dark">
            ${typeof formatCurrency === "function" ? formatCurrency(itemTotal) : itemTotal.toLocaleString("vi-VN") + "đ"}
          </span>
        </div>
      </div>
    `;
  });

  container.innerHTML = htmlContent;

  // Cập nhật Tạm tính và Tổng cộng
  const formattedSubtotal =
    typeof formatCurrency === "function"
      ? formatCurrency(subtotal)
      : subtotal.toLocaleString("vi-VN") + "đ";

  const couponCode = localStorage.getItem("freshfarm_applied_coupon");
  const coupon =
    typeof VALID_COUPONS !== "undefined" && couponCode
      ? VALID_COUPONS[couponCode]
      : null;
  let discount = 0;
  if (coupon) {
    discount =
      coupon.type === "percent" ? subtotal * coupon.value : coupon.value;
    discount = Math.min(discount, subtotal);
  }

  const shippingFee =
    subtotal > 0 && subtotal < FREESHIP_THRESHOLD ? DEFAULT_SHIPPING_FEE : 0;

  if (subtotalEl) subtotalEl.textContent = formattedSubtotal;
  if (discountEl) {
    const formattedDiscount =
      typeof formatCurrency === "function"
        ? formatCurrency(discount)
        : discount.toLocaleString("vi-VN") + "đ";
    discountEl.textContent = `-${formattedDiscount}`;
  }
  if (discountLabelEl) {
    discountLabelEl.textContent = coupon
      ? `Giảm giá (${couponCode})`
      : "Giảm giá";
  }
  if (disshipEl) {
    disshipEl.textContent =
      shippingFee === 0
        ? "Miễn phí"
        : typeof formatCurrency === "function"
          ? formatCurrency(shippingFee)
          : shippingFee.toLocaleString("vi-VN") + "đ";
  }
  if (grandTotalEl) {
    const total = Math.max(0, subtotal - discount + shippingFee);
    grandTotalEl.textContent =
      typeof formatCurrency === "function"
        ? formatCurrency(total)
        : total.toLocaleString("vi-VN") + "đ";
  }
}

// 2. XỬ LÝ ẨN/HIỆN LOGO NGÂN HÀNG THEO PHƯƠNG THỨC THANH TOÁN
function setupPaymentMethodToggle() {
  const paymentRadios = document.querySelectorAll(
    'input[name="paymentMethod"]',
  );
  const paymentLogos = document.getElementById("paymentLogos");

  if (!paymentLogos) return;

  paymentRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      if (e.target.value === "BANK" || e.target.value === "ONEPAY") {
        paymentLogos.classList.remove("d-none");
      } else {
        paymentLogos.classList.add("d-none");
      }
    });
  });
}

// 3. XỬ LÝ VALIDATE FORM VÀ SỰ KIỆN ĐẶT HÀNG
function setupCheckoutForm() {
  const form = document.getElementById("checkoutForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Kiểm tra giỏ hàng có sản phẩm không
    const cart = typeof getCart === "function" ? getCart() : [];
    if (cart.length === 0) {
      alert(
        "Giỏ hàng của bạn đang trống! Vui lòng chọn sản phẩm trước khi đặt hàng.",
      );
      window.location.href = "shop.html";
      return;
    }

    // Kiểm tra tính hợp lệ của Form HTML5
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      // Tự động cuộn tới vị trí ô chưa điền đúng
      const firstInvalid = form.querySelector(":invalid");
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
        firstInvalid.focus();
      }
      return;
    }

    // Đã hợp lệ -> Tạo mã đơn hàng cố định (hoặc ngẫu nhiên) để demo
    const demoOrderCode = "FF-20268899";

    // Hiển thị Pop-up đặt hàng thành công
    showSuccessModal(demoOrderCode);

    // Xóa giỏ hàng sau khi đặt thành công
    localStorage.removeItem("freshfarm_cart");
    localStorage.removeItem("freshfarm_applied_coupon");
    if (typeof updateCartBadge === "function") {
      updateCartBadge();
    }
  });
}

// 4. HIỂN THỊ POP-UP (MODAL) THÔNG BÁO THÀNH CÔNG VÀ COPY MÃ ĐƠN HÀNG
function showSuccessModal(orderCode) {
  // Xóa modal cũ nếu có
  const oldModal = document.getElementById("orderSuccessModal");
  if (oldModal) oldModal.remove();

  // Tạo phần tử HTML Pop-up
  const modalHTML = `
    <div class="modal fade show d-block" id="orderSuccessModal" tabindex="-1" style="background-color: rgba(0, 0, 0, 0.5);" aria-modal="true" role="dialog">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content text-center p-4 rounded-3 border-0 shadow-lg">
          <div class="mb-3">
            <i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i>
          </div>
          <h3 class="fw-bold text-success mb-2">Đặt Hàng Thành Công!</h3>
          <p class="text-muted mb-3">Cảm ơn bạn đã mua hàng tại FreshFarm. Đơn hàng của bạn đã được tiếp nhận và đang xử lý.</p>
          
          <div class="bg-light p-3 rounded-2 border mb-3">
            <span class="d-block text-muted small mb-1">Mã đơn hàng của bạn (Nhấp để sao chép):</span>
            <div class="d-inline-flex align-items-center gap-2 cursor-pointer bg-white px-3 py-2 border rounded border-success" id="btnCopyOrderCode" title="Bấm để sao chép mã">
              <strong class="fs-5 text-dark" id="txtOrderCode">${orderCode}</strong>
              <i class="bi bi-clipboard text-success fs-5" id="iconCopy"></i>
            </div>
            <div id="copyAlert" class="small text-success mt-1 d-none fw-semibold">
              <i class="bi bi-check2"></i> Đã sao chép mã đơn hàng!
            </div>
          </div>

          <p class="small text-muted mb-4">Chúng tôi sẽ liên hệ với bạn qua số điện thoại để xác nhận đơn hàng trong thời gian sớm nhất.</p>
          
          <div class="d-flex gap-2 justify-content-center">
            <a href="index.html" class="btn btn-success fw-bold px-4 py-2 rounded-pill">
              Quay về trang chủ
            </a>
            <button type="button" class="btn btn-outline-secondary px-4 py-2 rounded-pill" id="btnCloseModal">
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Chèn Pop-up vào cuối thẻ body
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Sự kiện Click để Copy Mã Đơn Hàng
  const btnCopy = document.getElementById("btnCopyOrderCode");
  const copyAlert = document.getElementById("copyAlert");
  const iconCopy = document.getElementById("iconCopy");

  if (btnCopy) {
    btnCopy.addEventListener("click", () => {
      navigator.clipboard
        .writeText(orderCode)
        .then(() => {
          if (copyAlert) copyAlert.classList.remove("d-none");
          if (iconCopy) {
            iconCopy.className = "bi bi-check-lg text-success fs-5";
          }
          setTimeout(() => {
            if (copyAlert) copyAlert.classList.add("d-none");
            if (iconCopy) {
              iconCopy.className = "bi bi-clipboard text-success fs-5";
            }
          }, 2500);
        })
        .catch((err) => {
          console.error("Lỗi khi sao chép: ", err);
        });
    });
  }

  // Sự kiện Đóng Pop-up
  const btnClose = document.getElementById("btnCloseModal");
  if (btnClose) {
    btnClose.addEventListener("click", () => {
      const modal = document.getElementById("orderSuccessModal");
      if (modal) modal.remove();
      // Chuyển về trang chủ hoặc trang shop sau khi đóng
      window.location.href = "index.html";
    });
  }
}
