$(document).ready(function () {
  renderFeaturedProducts();

  // Cập nhật số lượng giỏ hàng
  updateCartBadge();

  const $categoryDropdown = $("#categoryDropdown");

  // 1. Đặt mặc định hiển thị menu Chuyên mục khi vừa load trang chủ
  $categoryDropdown.removeClass("d-none").addClass("d-block");

  // 2. Bật/tắt menu khi click thẳng vào nút "Chuyên mục"
  $("#categoryMenuToggle").on("click", function (event) {
    event.stopPropagation();
    $categoryDropdown.toggleClass("d-none d-block");
  });

  // 3. Tự động ẩn menu khi click chuột ra vùng trống bên ngoài
  $(document).on("click", function (event) {
    if (!$(event.target).closest(".z-index-dropdown").length) {
      $categoryDropdown.removeClass("d-block").addClass("d-none");
    }
  });

  // 4. Tự động thu/mở menu khi cuộn trang (Scroll event)
  $(window).on("scroll", function () {
    const scrollPosition = $(window).scrollTop();

    // Nếu cuộn xuống quá 50px thì ẩn menu đi
    if (scrollPosition > 50) {
      $categoryDropdown.removeClass("d-block").addClass("d-none");
    } else {
      // Nếu kéo ngược lên sát đầu trang (dưới 50px) thì hiện menu lại
      $categoryDropdown.removeClass("d-none").addClass("d-block");
    }
  });
});

function renderFeaturedProducts() {
  const $slider = $("#productSlider");
  const template = $("#featuredProductTemplate").html();

  if (!$slider.length || !template) {
    console.error("Không tìm thấy vùng hiển thị hoặc mẫu sản phẩm nổi bật.");
    return;
  }

  if (!Array.isArray(window.productsData)) {
    console.error("Không tải được dữ liệu sản phẩm nổi bật.");
    return;
  }

  const featuredOverrides = {
    2: { imageAlt: "Muối Hồng Himalaya" },
    3: { imageAlt: "Rong Biển Cuộn Cơm" },
    4: {
      name: "Đỗ Xanh Tách Đôi Bóc Vỏ – Đỗ Xanh Tách Đôi Còn Vỏ – Đỗ Xanh Nguyên Hạt",
      imageAlt: "Đỗ Xanh Tách Đôi",
    },
    5: { imageAlt: "Rau Tiến Vua Khô" },
    6: { imageAlt: "Chân Nấm Hương Khô" },
    7: { imageAlt: "Mỳ Gạo Chũ" },
  };

  window.productsData.slice(0, 7).forEach(function (product) {
    const featured = featuredOverrides[product.id] || {};
    const $card = $(template);

    $card.find(".featured-product-discount").text(product.discount);
    $card
      .find(".featured-product-image")
      .attr("src", product.image)
      .attr("alt", featured.imageAlt || product.name);
    $card
      .find(".featured-product-title")
      .text(featured.name || product.name);
    $card.find(".featured-product-price").text(product.priceDisplay);

    $slider.append($card);
  });
}

// SUPER SALE SECTION
// Xử lý sự kiện cuộn slider sản phẩm (Có vòng lặp đầu/cuối)
$(function () {
  const $slider = $("#productSlider");
  const $previousButton = $("#prevBtn");
  const $nextButton = $("#nextBtn");

  if (!$slider.length || !$previousButton.length || !$nextButton.length) return;

  $previousButton.on("click", function () {
    const slider = $slider[0];
    const scrollAmount = slider.clientWidth * 0.8;

    if (slider.scrollLeft <= 0) {
      slider.scrollLeft = slider.scrollWidth;
    } else {
      slider.scrollLeft -= scrollAmount;
    }
  });

  $nextButton.on("click", function () {
    const slider = $slider[0];
    const scrollAmount = slider.clientWidth * 0.8;
    const maxScrollLeft = slider.scrollWidth - slider.clientWidth;

    if (slider.scrollLeft >= maxScrollLeft - 5) {
      slider.scrollLeft = 0;
    } else {
      slider.scrollLeft += scrollAmount;
    }
  });
});
