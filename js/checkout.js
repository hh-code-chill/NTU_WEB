/* ==========================================
   JAVASCRIPT TRANG ĐẶT HÀNG - FRESHFARM
   Cần nạp sau cart.js và validate.js
   ========================================== */

$(document).ready(function () {
  let cart = getCart();

  // Giỏ trống thì ẩn form, hiện thông báo
  if (cart.length === 0) {
    $("#checkoutEmpty").removeClass("d-none");
    $("#checkoutMain").addClass("d-none");
    return;
  }

  // Hiển thị danh sách hàng trong đơn
  cart.forEach(function (item) {
    $("#orderList").append(
      '<li class="summary-row"><span>' +
        item.name +
        " × " +
        item.qty +
        "</span><span>" +
        formatMoney(item.price * item.qty) +
        "</span></li>",
    );
  });
  renderTotals();

  // Tự điền thông tin nếu khách đã đăng nhập
  let user = JSON.parse(
    localStorage.getItem("freshfarm_current_user") || "null",
  );
  if (user) {
    $("#fullName").val(user.name);
    $("#email").val(user.email);
    $("#phone").val(user.phone || "");
  }

  // Gửi đơn hàng
  $("#checkoutForm").on("submit", function (e) {
    e.preventDefault();
    if (!validateForm(this)) return;

    $("#orderCode").text("FF" + Date.now().toString().slice(-6));
    $("#orderTotal").text(formatMoney(calcTotals().total));

    // Xóa giỏ hàng và mã giảm giá sau khi đặt thành công
    saveCart([]);
    localStorage.removeItem(COUPON_KEY);
    new bootstrap.Modal("#successModal").show();
  });
});
