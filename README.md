# FreshFarm

## Cấu trúc

- Các trang HTML được đặt ở thư mục gốc.
- `css/` chứa stylesheet dùng chung (`theme.css`, `auth.css`) và stylesheet riêng từng trang.
- `js/` chứa logic trang; `components.js` nạp thành phần dùng chung và script theo trang.
- `partials/` chứa header, footer và navbar được chia sẻ giữa các trang.
- `image/` chứa hình ảnh của dự án.

Các thẻ Super Sale trên trang chủ dùng chung một mẫu HTML, được jQuery dựng từ dữ liệu sản phẩm trong `js/data.js`.
Các thao tác biểu mẫu, bộ lọc, phân trang và giỏ hàng được gắn sự kiện bằng jQuery để hỗ trợ cả nội dung được dựng động.

## Chạy dự án

Mở dự án qua máy chủ HTTP tĩnh để jQuery có thể nạp các tệp trong `partials/`. Không mở trực tiếp trang bằng `file://`.

Từ thư mục gốc của dự án, chạy:

```bash
python -m http.server 8000
```

Sau đó truy cập `http://localhost:8000/`.
