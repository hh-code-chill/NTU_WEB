// Cấu hình trang Shop
const CONFIG = {
  itemsPerPage: 6, // Số sản phẩm hiển thị trên mỗi trang
  currentPage: 1,
};

// Biến lưu trữ trạng thái mảng sản phẩm hiện tại sau khi Filter/Sort
let currentProducts = [...productsData];

document.addEventListener("DOMContentLoaded", () => {
  initShop();
});

function initShop() {
  // Render dữ liệu ban đầu
  applyFilterAndSort();

  // Gán sự kiện lắng nghe tương tác người dùng
  bindEvents();
}

// 1. Hàm áp dụng Lọc và Sắp xếp
function applyFilterAndSort() {
  let result = [...productsData];

  // A. Lọc theo Danh mục (Radio)
  const selectedCategory = document.querySelector(
    ".filter-category:checked",
  )?.value;
  if (selectedCategory && selectedCategory !== "all") {
    result = result.filter((item) => item.category === selectedCategory);
  }

  // B. Lọc theo Khoảng giá (Radio)
  const selectedPriceRange = document.querySelector(
    ".filter-price:checked",
  )?.value;
  if (selectedPriceRange && selectedPriceRange !== "all") {
    result = result.filter((item) => {
      if (selectedPriceRange === "under-100") return item.price < 100000;
      if (selectedPriceRange === "100-200")
        return item.price >= 100000 && item.price <= 200000;
      if (selectedPriceRange === "200-500")
        return item.price > 200000 && item.price <= 500000;
      if (selectedPriceRange === "above-500") return item.price > 500000;
      return true;
    });
  }

  // C. Lọc theo Thương hiệu (Checkbox - Chọn nhiều)
  const selectedBrands = Array.from(
    document.querySelectorAll(".filter-brand:checked"),
  ).map((cb) => cb.value);
  if (selectedBrands.length > 0) {
    result = result.filter((item) => selectedBrands.includes(item.brand));
  }

  // D. Sắp xếp (Sort)
  const sortType = document.getElementById("sort-by")?.value || "default";
  if (sortType === "price-asc") {
    result.sort((a, b) => a.price - b.price);
  } else if (sortType === "price-desc") {
    result.sort((a, b) => b.price - a.price);
  } else if (sortType === "newest") {
    result.sort((a, b) => (b.isNew === a.isNew ? 0 : b.isNew ? 1 : -1));
  }

  // Cập nhật lại mảng dữ liệu đang hiển thị và reset về trang 1
  currentProducts = result;
  CONFIG.currentPage = 1;

  // Hiển thị ra giao diện
  renderUI();
}

// 2. Hàm Render UI chính
function renderUI() {
  renderProductGrid();
  renderPagination();
  updateCounter();
}

// Render danh sách sản phẩm theo trang hiện tại
function renderProductGrid() {
  const gridContainer = document.getElementById("shop-product-grid");
  if (!gridContainer) return;

  if (currentProducts.length === 0) {
    gridContainer.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
        <p class="text-muted fs-5">Không tìm thấy sản phẩm nào phù hợp với bộ lọc!</p>
      </div>
    `;
    return;
  }

  // Tính toán vị trí cắt mảng theo phân trang
  const startIndex = (CONFIG.currentPage - 1) * CONFIG.itemsPerPage;
  const endIndex = startIndex + CONFIG.itemsPerPage;
  const pageProducts = currentProducts.slice(startIndex, endIndex);

  // Render thẻ sản phẩm dạng link
  gridContainer.innerHTML = pageProducts
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
        <div class="card-body d-flex flex-column justify-content-between p-3">
          <h6 class="card-title fw-bold text-dark text-truncate-2 mb-2 product-title">
            ${product.name}
          </h6>
          <div>
            <p class="text-danger fw-bold mb-3 product-price">
              ${product.priceDisplay}
            </p>
            <span class="btn btn-success btn-sm w-75 fw-bold text-capitalize">Mua ngay</span>
          </div>
        </div>
      </a>
    </div>
  `,
    )
    .join("");
}

// Render nút phân trang
function renderPagination() {
  const paginationList = document.getElementById("pagination-list");
  if (!paginationList) return;

  const totalPages = Math.ceil(currentProducts.length / CONFIG.itemsPerPage);

  if (totalPages <= 1) {
    paginationList.innerHTML = "";
    return;
  }

  let html = "";

  // Nút Previous
  html += `
    <li class="page-item ${CONFIG.currentPage === 1 ? "disabled" : ""}">
      <button class="page-link" onclick="changePage(${CONFIG.currentPage - 1})">&laquo;</button>
    </li>
  `;

  // Danh sách các số trang
  for (let i = 1; i <= totalPages; i++) {
    html += `
      <li class="page-item ${i === CONFIG.currentPage ? "active" : ""}">
        <button class="page-link" onclick="changePage(${i})">${i}</button>
      </li>
    `;
  }

  // Nút Next
  html += `
    <li class="page-item ${CONFIG.currentPage === totalPages ? "disabled" : ""}">
      <button class="page-link" onclick="changePage(${CONFIG.currentPage + 1})">&raquo;</button>
    </li>
  `;

  paginationList.innerHTML = html;
}

// Chuyển trang
function changePage(page) {
  const totalPages = Math.ceil(currentProducts.length / CONFIG.itemsPerPage);
  if (page < 1 || page > totalPages) return;

  CONFIG.currentPage = page;
  renderProductGrid();
  renderPagination();

  // Cuộn nhẹ lên đầu lưới sản phẩm
  document
    .getElementById("shop-product-grid")
    ?.scrollIntoView({ behavior: "smooth" });
}

// Cập nhật số lượng sản phẩm hiển thị trên Toolbar
function updateCounter() {
  const showingCount = document.getElementById("showing-count");
  if (showingCount) {
    showingCount.textContent = currentProducts.length;
  }
}

// 3. Lắng nghe các sự kiện người dùng tương tác
function bindEvents() {
  // Lắng nghe sự kiện chọn Danh mục
  document.querySelectorAll(".filter-category").forEach((radio) => {
    radio.addEventListener("change", applyFilterAndSort);
  });

  // Lắng nghe sự kiện chọn Khoảng giá
  document.querySelectorAll(".filter-price").forEach((radio) => {
    radio.addEventListener("change", applyFilterAndSort);
  });

  // Lắng nghe sự kiện chọn Thương hiệu
  document.querySelectorAll(".filter-brand").forEach((checkbox) => {
    checkbox.addEventListener("change", applyFilterAndSort);
  });

  // Lắng nghe sự kiện Sắp xếp
  const sortSelect = document.getElementById("sort-by");
  if (sortSelect) {
    sortSelect.addEventListener("change", applyFilterAndSort);
  }

  // Nút Reset Bộ lọc
  const btnReset = document.getElementById("btn-reset-filter");
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      document.getElementById("cat-all").checked = true;
      document.getElementById("price-all").checked = true;
      document
        .querySelectorAll(".filter-brand")
        .forEach((cb) => (cb.checked = false));
      if (sortSelect) sortSelect.value = "default";

      applyFilterAndSort();
    });
  }
}
