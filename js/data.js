// Danh sách dữ liệu sản phẩm mẫu (Mock Data)
const productsData = [
  // --- 7 Sản phẩm gốc ---
  {
    id: 1,
    name: "Quả La Hán Khô",
    price: 120000,
    priceMax: 250000,
    priceDisplay: "120.000 đ – 250.000 đ",
    discount: "-20%",
    category: "do-kho", // Đồ khô
    brand: "dung-ha", // Nông sản Dũng Hà
    priceRange: "100-200", // Từ 100k - 200k
    image: "./image/san_pham_1.jpg",
    isNew: true,
    salesCount: 150
  },
  {
    id: 2,
    name: "Muối Hồng Himalaya (Hạt To + Mịn)",
    price: 19000,
    priceMax: 69000,
    priceDisplay: "19.000 đ – 69.000 đ",
    discount: "-26%",
    category: "gia-vi", // Gia vị
    brand: "fresh-farm",
    priceRange: "under-100", // Dưới 100k
    image: "./image/san_pham_2.jpg",
    isNew: false,
    salesCount: 320
  },
  {
    id: 3,
    name: "Rong Biển Cuộn Cơm Hàn Quốc",
    price: 42000,
    priceMax: 155000,
    priceDisplay: "42.000 đ – 155.000 đ",
    discount: "-11%",
    category: "do-kho",
    brand: "dung-ha",
    priceRange: "under-100",
    image: "./image/san_pham_3.jpg",
    isNew: true,
    salesCount: 85
  },
  {
    id: 4,
    name: "Đỗ Xanh Tách Đôi Bóc Vỏ – Đỗ Xanh Tách Đôi Còn Vỏ",
    price: 17500,
    priceMax: 65000,
    priceDisplay: "17.500 đ – 65.000 đ",
    discount: "-32%",
    category: "hat-dinh-duong", // Hạt dinh dưỡng
    brand: "vietgap",
    priceRange: "under-100",
    image: "./image/san_pham_4.jpg",
    isNew: false,
    salesCount: 410
  },
  {
    id: 5,
    name: "Rau Tiến Vua Khô – Rau Tiến Vua Ngâm",
    price: 37500,
    priceMax: 890000,
    priceDisplay: "37.500 đ – 890.000 đ",
    discount: "-27%",
    category: "rau-cu", // Rau củ sạch
    brand: "dung-ha",
    priceRange: "under-100",
    image: "./image/san_pham_5.jpg",
    isNew: true,
    salesCount: 200
  },
  {
    id: 6,
    name: "Chân Nấm Hương Khô Loại 1",
    price: 50000,
    priceMax: 210000,
    priceDisplay: "50.000 đ – 210.000 đ",
    discount: "-23%",
    category: "do-kho",
    brand: "vietgap",
    priceRange: "under-100",
    image: "./image/san_pham_6.jpg",
    isNew: false,
    salesCount: 95
  },
  {
    id: 7,
    name: "Mỳ Gạo Chũ Bắc Giang – Mỳ Gạo Chũ Ngũ Sắc",
    price: 47000,
    priceMax: 80000,
    priceDisplay: "47.000 đ – 80.000 đ",
    discount: "-15%",
    category: "do-kho",
    brand: "fresh-farm",
    priceRange: "under-100",
    image: "./image/san_pham_7.jpg",
    isNew: false,
    salesCount: 530
  },

  // --- Nhân bản & biến tấu thêm 9 sản phẩm để đạt 16 sản phẩm test phân trang ---
  {
    id: 8,
    name: "Quả La Hán Khô Hộp Cao Cấp",
    price: 260000,
    priceMax: 450000,
    priceDisplay: "260.000 đ – 450.000 đ",
    discount: "-10%",
    category: "do-kho",
    brand: "dung-ha",
    priceRange: "200-500", // 200k - 500k
    image: "./image/san_pham_1.jpg",
    isNew: true,
    salesCount: 45
  },
  {
    id: 9,
    name: "Muối Hồng Himalaya Xay Mịn 500g",
    price: 85000,
    priceMax: 120000,
    priceDisplay: "85.000 đ – 120.000 đ",
    discount: "-15%",
    category: "gia-vi",
    brand: "fresh-farm",
    priceRange: "under-100",
    image: "./image/san_pham_2.jpg",
    isNew: false,
    salesCount: 110
  },
  {
    id: 10,
    name: "Rong Biển Tách Muối Cho Bé",
    price: 130000,
    priceMax: 220000,
    priceDisplay: "130.000 đ – 220.000 đ",
    discount: "-5%",
    category: "do-kho",
    brand: "fresh-farm",
    priceRange: "100-200",
    image: "./image/san_pham_3.jpg",
    isNew: true,
    salesCount: 78
  },
  {
    id: 11,
    name: "Hạt Đỗ Xanh Nguyên Cây VietGAP",
    price: 35000,
    priceMax: 90000,
    priceDisplay: "35.000 đ – 90.000 đ",
    discount: "-20%",
    category: "hat-dinh-duong",
    brand: "vietgap",
    priceRange: "under-100",
    image: "./image/san_pham_4.jpg",
    isNew: false,
    salesCount: 230
  },
  {
    id: 12,
    name: "Rau Tiến Vua Thượng Hạng Đóng Túi",
    price: 520000,
    priceMax: 950000,
    priceDisplay: "520.000 đ – 950.000 đ",
    discount: "-18%",
    category: "rau-cu",
    brand: "dung-ha",
    priceRange: "above-500", // Trên 500k
    image: "./image/san_pham_5.jpg",
    isNew: true,
    salesCount: 62
  },
  {
    id: 13,
    name: "Nấm Hương Rừng Khô Hà Giang",
    price: 180000,
    priceMax: 350000,
    priceDisplay: "180.000 đ – 350.000 đ",
    discount: "-12%",
    category: "do-kho",
    brand: "vietgap",
    priceRange: "100-200",
    image: "./image/san_pham_6.jpg",
    isNew: false,
    salesCount: 180
  },
  {
    id: 14,
    name: "Mỳ Gạo Chũ Rau Củ Tự Nhiên",
    price: 65000,
    priceMax: 110000,
    priceDisplay: "65.000 đ – 110.000 đ",
    discount: "-10%",
    category: "do-kho",
    brand: "fresh-farm",
    priceRange: "under-100",
    image: "./image/san_pham_7.jpg",
    isNew: true,
    salesCount: 290
  },
  {
    id: 15,
    name: "Combo Đồ Khô Dũng Hà Hộp Quà Biếu",
    price: 600000,
    priceMax: 1200000,
    priceDisplay: "600.000 đ – 1.200.000 đ",
    discount: "-25%",
    category: "do-kho",
    brand: "dung-ha",
    priceRange: "above-500",
    image: "./image/san_pham_1.jpg",
    isNew: true,
    salesCount: 35
  },
  {
    id: 16,
    name: "Bộ Gia Vị Nông Sản Sạch VietGAP",
    price: 210000,
    priceMax: 380000,
    priceDisplay: "210.000 đ – 380.000 đ",
    discount: "-15%",
    category: "gia-vi",
    brand: "vietgap",
    priceRange: "200-500",
    image: "./image/san_pham_2.jpg",
    isNew: false,
    salesCount: 140
  }
];