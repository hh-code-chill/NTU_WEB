$(document).ready(function () {
  // Cập nhật số lượng giỏ hàng
  updateCartBadge();

  // Khởi tạo biến lưu trữ element của dropdown để code gọn hơn
  let $categoryDropdown = $("#categoryDropdown");

  // 1. Đặt mặc định hiển thị menu Chuyên mục khi vừa load trang chủ
  $categoryDropdown.removeClass("d-none").addClass("d-block");

  // 2. Bật/tắt menu khi click thẳng vào nút "Chuyên mục"
  $("#categoryMenuToggle").on("click", function (e) {
    e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
    $categoryDropdown.toggleClass("d-none d-block");
  });

  // 3. Tự động ẩn menu khi click chuột ra vùng trống bên ngoài
  $(document).on("click", function (e) {
    if (!$(e.target).closest(".z-index-dropdown").length) {
      $categoryDropdown.removeClass("d-block").addClass("d-none");
    }
  });

  // 4. Tự động thu/mở menu khi cuộn trang (Scroll event)
  $(window).on("scroll", function () {
    let scrollPosition = $(window).scrollTop(); // Lấy vị trí cuộn hiện tại

    // Nếu cuộn xuống quá 50px thì ẩn menu đi
    if (scrollPosition > 50) {
      $categoryDropdown.removeClass("d-block").addClass("d-none");
    } else {
      // Nếu kéo ngược lên sát đầu trang (dưới 50px) thì hiện menu lại
      $categoryDropdown.removeClass("d-none").addClass("d-block");
    }
  });

  // Hàm cập nhật số lượng trên icon giỏ hàng
  function updateCartBadge() {
    let count = parseInt(localStorage.getItem("freshfarm_cart_count")) || 0;
    $(".cart-count").text(count);
  }
});

// SUPER SALE SECTION
// Xử lý sự kiện cuộn slider sản phẩm (Có vòng lặp đầu/cuối)
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("productSlider");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (slider && prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      const scrollAmount = slider.clientWidth * 0.8;

      // Kiểm tra nếu đang ở vị trí đầu tiên (hoặc sát đầu)
      if (slider.scrollLeft <= 0) {
        slider.scrollLeft = slider.scrollWidth; // Cuộn tới cuối
      } else {
        slider.scrollLeft -= scrollAmount;
      }
    });

    nextBtn.addEventListener("click", () => {
      const scrollAmount = slider.clientWidth * 0.8;
      const maxScrollLeft = slider.scrollWidth - slider.clientWidth;

      // Kiểm tra nếu đã cuộn tới vị trí cuối cùng (trừ sai số 5px)
      if (slider.scrollLeft >= maxScrollLeft - 5) {
        slider.scrollLeft = 0; // Quay về đầu
      } else {
        slider.scrollLeft += scrollAmount;
      }
    });
  }
});
