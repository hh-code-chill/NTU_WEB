// Quản lý trạng thái lựa chọn sản phẩm
const productState = {
  productId: null,
  selectedLocation: null, // Nơi giao hàng
  selectedVariant: null, // Loại / Dung tích / Trọng lượng
  quantity: 1,
};

$(function () {
  initDetailPage();
});

function initDetailPage() {
  // 1. Lấy ID sản phẩm từ URL (Ví dụ: detail.html?id=1)
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get("id"), 10) || 1;
  productState.productId = productId;

  // 2. Tìm thông tin sản phẩm trong productsData (từ file js/data.js)
  const allProducts = window.productsData || [];
  const currentProduct =
    allProducts.find((item) => Number(item.id) === productId) || allProducts[0];

  // 3. Render thông tin chi tiết sản phẩm (nếu có các hàm render)
  if (typeof renderProductInfo === "function" && currentProduct) {
    renderProductInfo(currentProduct);
  }
  if (typeof renderBestSellers === "function") renderBestSellers();
  if (typeof renderRelatedProducts === "function" && currentProduct) {
    renderRelatedProducts(currentProduct.category);
  }
  if (typeof renderRecentlyViewed === "function") renderRecentlyViewed();

  // 4. Gán các sự kiện tương tác
  bindDetailEvents(currentProduct);
}

// Bắt các sự kiện tương tác
function bindDetailEvents(currentProduct) {
  // A. Chọn Nơi giao hàng
  const $locationButtons = $(".location-option");
  $locationButtons.each(function () {
    const $button = $(this);
    // Nếu HTML đã có sẵn class active thì đồng bộ vào state
    if ($button.hasClass("active")) {
      productState.selectedLocation = $button.text().trim();
    }

    $button.on("click", function () {
      $locationButtons.removeClass("active");
      $button.addClass("active");
      productState.selectedLocation = $button.text().trim();
    });
  });

  // B. Chọn Loại / Biến thể sản phẩm
  const $variantButtons = $(".variant-option");
  $variantButtons.each(function () {
    const $button = $(this);
    // Nếu HTML đã có sẵn class active thì đồng bộ vào state
    if ($button.hasClass("active")) {
      productState.selectedVariant = $button.text().trim();
    }

    $button.on("click", function () {
      $variantButtons.removeClass("active");
      $button.addClass("active");
      productState.selectedVariant = $button.text().trim();
    });
  });

  $(".product-thumb").on("click", function () {
    changeMainImage(this.src);
  });

  // C. Tăng / Giảm số lượng
  const $quantityInput = $("#product-qty");

  if ($quantityInput.length) {
    productState.quantity = parseInt($quantityInput.val(), 10) || 1;

    $("#btn-minus").on("click", () => {
      let currentQty = parseInt($quantityInput.val(), 10) || 1;
      if (currentQty > 1) {
        currentQty--;
        $quantityInput.val(currentQty);
        productState.quantity = currentQty;
      }
    });

    $("#btn-plus").on("click", () => {
      let currentQty = parseInt($quantityInput.val(), 10) || 1;
      currentQty++;
      $quantityInput.val(currentQty);
      productState.quantity = currentQty;
    });

    $quantityInput.on("change", () => {
      let val = parseInt($quantityInput.val(), 10);
      if (isNaN(val) || val < 1) val = 1;
      $quantityInput.val(val);
      productState.quantity = val;
    });
  }

  // D. Nút "Thêm vào giỏ hàng" (#btnAddToCart)
  $("#btnAddToCart").on("click", (event) => {
      event.preventDefault();

      // Validate bắt buộc chọn đầy đủ Nơi giao hàng và Phân loại
      if (!productState.selectedLocation) {
        alert(
          'Vui lòng chọn "Giao hàng từ" (Nơi giao hàng) trước khi thêm vào giỏ!',
        );
        return;
      }

      if (!productState.selectedVariant) {
        alert('Vui lòng chọn "Loại" sản phẩm trước khi thêm vào giỏ!');
        return;
      }

      // Lấy thông tin Tên, Giá, Ảnh từ currentProduct hoặc DOM
      const $title = $("#detail-title");
      const productName = currentProduct
        ? currentProduct.name
        : $title.length
          ? $title.text().trim()
          : "Sản phẩm";

      const $price = $("#detail-price");
      let productPrice = currentProduct ? Number(currentProduct.price) : 0;
      if (!productPrice && $price.length) {
        const rawPrice = $price.text().split("–")[0];
        productPrice = parseInt(rawPrice.replace(/\D/g, ""), 10) || 0;
      }

      const productImg = currentProduct
        ? currentProduct.image
        : "image/san_pham_1.jpg";

      // Tạo object dữ liệu sản phẩm truyền sang cart.js
      const productToAdd = {
        id:
          productState.productId ||
          (currentProduct ? currentProduct.id : "sp_temp"),
        name: productName,
        price: productPrice,
        image: productImg,
        variant: productState.selectedVariant,
        location: productState.selectedLocation,
        quantity: productState.quantity,
      };

      // Gọi hàm addToCart từ cart.js
      if (typeof addToCart === "function") {
        addToCart(productToAdd);
        alert(
          `Đã thêm ${productToAdd.quantity} x "${productToAdd.name}"\n- Phân loại: ${productToAdd.variant}\n- Giao từ: ${productToAdd.location}`,
        );
      } else {
        console.error(
          "Không tìm thấy hàm addToCart. Hãy kiểm tra lại file cart.js đã được nhúng chưa!",
        );
      }
  });
}

// Render thông tin chi tiết sản phẩm lên giao diện
function renderProductInfo(product) {
  // Cập nhật Breadcrumb & Tiêu đề
  $("#breadcrumb-product-name, #detail-title").text(product.name);

  // Cập nhật Giá & Giảm giá
  $("#detail-price").text(product.priceDisplay);
  const $detailDiscount = $("#detail-discount");
  if ($detailDiscount.length) {
    if (product.discount) {
      $detailDiscount.text(product.discount).css("display", "inline-block");
    } else {
      $detailDiscount.hide();
    }
  }

  // Cập nhật Ảnh chính
  $("#main-product-img").attr({ src: product.image, alt: product.name });
}

// Đổi ảnh chính khi click vào Thumbnails
function changeMainImage(src) {
  $("#main-product-img").attr("src", src);

  // Active thumbnail được chọn
  $(".product-thumb").each(function () {
    $(this).toggleClass("active", this.src === src);
  });
}

// Render Sản phẩm bán chạy
function renderBestSellers() {
  const $container = $("#best-seller-grid");
  if (!$container.length) return;

  const bestSellers = window.productsData.slice(0, 4);
  $container.html(bestSellers
    .map(
      (product) => `
    <div class="col">
      <a href="detail.html?id=${product.id}" class="card h-100 border-0 shadow-sm text-center bg-white overflow-hidden text-decoration-none product-card-link">
        <div class="position-relative">
          ${product.discount ? `<span class="position-absolute top-0 start-0 bg-success text-white px-2 py-1 small fw-bold rounded-bottom-end z-1">${product.discount}</span>` : ""}
          <div class="ratio ratio-1x1">
            <img src="${product.image}" class="card-img-top object-fit-cover" alt="${product.name}" />
          </div>
        </div>
        <div class="card-body p-2 d-flex flex-column justify-content-between">
          <h6 class="card-title fw-bold text-dark text-truncate-2 mb-2 style="font-size: 0.85rem;">${product.name}</h6>
          <div>
            <p class="text-danger fw-bold mb-2 small">${product.priceDisplay}</p>
            <span class="btn btn-success btn-sm w-100 fw-bold">Mua ngay</span>
          </div>
        </div>
      </a>
    </div>
  `,
    )
    .join(""));
}

// Render Sản phẩm tương tự
function renderRelatedProducts(category) {
  const $container = $("#related-products-grid");
  if (!$container.length) return;

  // Lấy các sản phẩm cùng danh mục (loại trừ sản phẩm hiện tại)
  let related = productsData.filter(
    (p) => p.category === category && p.id !== productState.productId,
  );
  if (related.length < 3) related = window.productsData.slice(4, 7);

  $container.html(related
    .slice(0, 3)
    .map(
      (product) => `
    <div class="col">
      <a href="detail.html?id=${product.id}" class="card h-100 border-0 shadow-sm text-center bg-white overflow-hidden text-decoration-none product-card-link">
        <div class="position-relative">
          ${product.discount ? `<span class="position-absolute top-0 start-0 bg-success text-white px-2 py-1 small fw-bold rounded-bottom-end z-1">${product.discount}</span>` : ""}
          <div class="ratio ratio-1x1">
            <img src="${product.image}" class="card-img-top object-fit-cover" alt="${product.name}" />
          </div>
        </div>
        <div class="card-body p-2 d-flex flex-column justify-content-between">
          <h6 class="card-title fw-bold text-dark text-truncate-2 mb-2 style="font-size: 0.85rem;">${product.name}</h6>
          <div>
            <p class="text-danger fw-bold mb-2 small">${product.priceDisplay}</p>
            <span class="btn btn-success btn-sm w-100 fw-bold">Mua ngay</span>
          </div>
        </div>
      </a>
    </div>
  `,
    )
    .join(""));
}

// Render Danh sách Sản phẩm vừa xem bên Sidebar
function renderRecentlyViewed() {
  const $container = $("#recently-viewed-list");
  if (!$container.length) return;

  const recentList = window.productsData.slice(1, 4);
  $container.html(recentList
    .map(
      (product) => `
    <a href="detail.html?id=${product.id}" class="d-flex align-items-center gap-2 text-decoration-none text-dark">
      <img src="${product.image}" alt="${product.name}" class="rounded object-fit-cover" style="width: 50px; height: 50px;" />
      <div>
        <h6 class="mb-1 fw-bold text-truncate-2 small">${product.name}</h6>
        <p class="mb-0 text-danger fw-bold small">${product.priceDisplay}</p>
      </div>
    </a>
  `,
    )
    .join(""));
}
