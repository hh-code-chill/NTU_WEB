// Quản lý trạng thái lựa chọn sản phẩm
const productState = {
  productId: null,
  selectedLocation: null, // Nơi giao hàng
  selectedVariant: null, // Loại / Dung tích / Trọng lượng
  quantity: 1,
};

document.addEventListener("DOMContentLoaded", () => {
  initDetailPage();
});

function initDetailPage() {
  // 1. Lấy ID sản phẩm từ URL (Ví dụ: detail.html?id=1)
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get("id")) || 1; // Mặc định ID 1 nếu không truyền
  productState.productId = productId;

  // 2. Tìm thông tin sản phẩm trong productsData (từ file js/data.js)
  const currentProduct =
    productsData.find((item) => item.id === productId) || productsData[0];

  // 3. Render thông tin chi tiết sản phẩm
  renderProductInfo(currentProduct);

  // 4. Render danh sách sản phẩm bán chạy & sản phẩm tương tự
  renderBestSellers();
  renderRelatedProducts(currentProduct.category);
  renderRecentlyViewed();

  // 5. Gán các sự kiện tương tác
  bindDetailEvents();
}

// Render thông tin chi tiết sản phẩm lên giao diện
function renderProductInfo(product) {
  // Cập nhật Breadcrumb & Tiêu đề
  const breadcrumbName = document.getElementById("breadcrumb-product-name");
  const detailTitle = document.getElementById("detail-title");
  if (breadcrumbName) breadcrumbName.textContent = product.name;
  if (detailTitle) detailTitle.textContent = product.name;

  // Cập nhật Giá & Giảm giá
  const detailPrice = document.getElementById("detail-price");
  const detailDiscount = document.getElementById("detail-discount");
  if (detailPrice) detailPrice.textContent = product.priceDisplay;
  if (detailDiscount) {
    if (product.discount) {
      detailDiscount.textContent = product.discount;
      detailDiscount.style.display = "inline-block";
    } else {
      detailDiscount.style.display = "none";
    }
  }

  // Cập nhật Ảnh chính
  const mainImg = document.getElementById("main-product-img");
  if (mainImg) {
    mainImg.src = product.image;
    mainImg.alt = product.name;
  }
}

// Đổi ảnh chính khi click vào Thumbnails
function changeMainImage(src) {
  const mainImg = document.getElementById("main-product-img");
  if (mainImg) mainImg.src = src;

  // Active thumbnail được chọn
  document.querySelectorAll(".product-thumb").forEach((thumb) => {
    thumb.classList.remove("active");
    if (thumb.src === src) thumb.classList.add("active");
  });
}

// Bắt các sự kiện tương tác
function bindDetailEvents() {
  // A. Chọn Nơi giao hàng
  const locationBtns = document.querySelectorAll(".location-option");
  locationBtns.forEach((btn) => {
    // Mặc định bỏ chọn active ban đầu để yêu cầu user phải chọn
    btn.classList.remove("active");

    btn.addEventListener("click", () => {
      locationBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      productState.selectedLocation = btn.textContent.trim();
    });
  });

  // B. Chọn Loại / Biến thể sản phẩm
  const variantBtns = document.querySelectorAll(".variant-option");
  variantBtns.forEach((btn) => {
    // Mặc định bỏ chọn active ban đầu
    btn.classList.remove("active");

    btn.addEventListener("click", () => {
      variantBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      productState.selectedVariant = btn.textContent.trim();
    });
  });

  // C. Tăng / Giảm số lượng
  const btnMinus = document.getElementById("btn-minus");
  const btnPlus = document.getElementById("btn-plus");
  const qtyInput = document.getElementById("product-qty");

  if (btnMinus && btnPlus && qtyInput) {
    btnMinus.addEventListener("click", () => {
      let currentQty = parseInt(qtyInput.value) || 1;
      if (currentQty > 1) {
        currentQty--;
        qtyInput.value = currentQty;
        productState.quantity = currentQty;
      }
    });

    btnPlus.addEventListener("click", () => {
      let currentQty = parseInt(qtyInput.value) || 1;
      currentQty++;
      qtyInput.value = currentQty;
      productState.quantity = currentQty;
    });

    qtyInput.addEventListener("change", () => {
      let val = parseInt(qtyInput.value);
      if (isNaN(val) || val < 1) val = 1;
      qtyInput.value = val;
      productState.quantity = val;
    });
  }

  // D. Xử lý nút "Thêm vào giỏ hàng" và "Mua ngay" (Validate bắt buộc chọn đủ trường)
  const actionBtns = document.querySelectorAll(
    '.btn-action-add, a[href="cart.html"], a[href="checkout.html"]',
  );
  actionBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // Kiểm tra xem đã chọn đầy đủ Nơi giao hàng và Loại chưa
      if (!productState.selectedLocation) {
        e.preventDefault();
        alert(
          'Vui lòng chọn "Giao hàng từ" (Nơi giao hàng) trước khi tiếp tục!',
        );
        return;
      }

      if (!productState.selectedVariant) {
        e.preventDefault();
        alert('Vui lòng chọn "Loại" sản phẩm trước khi tiếp tục!');
        return;
      }

      // Đã chọn đầy đủ -> Cho phép chuyển trang
    });
  });
}

// Render Sản phẩm bán chạy
function renderBestSellers() {
  const container = document.getElementById("best-seller-grid");
  if (!container) return;

  const bestSellers = productsData.slice(0, 4);
  container.innerHTML = bestSellers
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
    .join("");
}

// Render Sản phẩm tương tự
function renderRelatedProducts(category) {
  const container = document.getElementById("related-products-grid");
  if (!container) return;

  // Lấy các sản phẩm cùng danh mục (loại trừ sản phẩm hiện tại)
  let related = productsData.filter(
    (p) => p.category === category && p.id !== productState.productId,
  );
  if (related.length < 3) related = productsData.slice(4, 7);

  container.innerHTML = related
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
    .join("");
}

// Render Danh sách Sản phẩm vừa xem bên Sidebar
function renderRecentlyViewed() {
  const container = document.getElementById("recently-viewed-list");
  if (!container) return;

  const recentList = productsData.slice(1, 4);
  container.innerHTML = recentList
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
    .join("");
}
