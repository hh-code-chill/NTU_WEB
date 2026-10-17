document.addEventListener('DOMContentLoaded', () => {
    // 1. Xử lý sắp xếp sản phẩm (Sorting)
    const sortSelect = document.getElementById('sort-by');
    
    sortSelect.addEventListener('change', (e) => {
        const sortValue = e.target.value;
        console.log(`Đang sắp xếp sản phẩm theo: ${sortValue}`);
        
        // Tại đây sẽ call API kèm query param (VD: /api/products?sort=price-asc)
        // Hoặc sắp xếp DOM trực tiếp nếu dữ liệu đã load sẵn
    });

    // 2. Xử lý bộ lọc giá (Price Filtering)
    const priceFilterForm = document.getElementById('price-filter-form');
    
    priceFilterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const minPrice = document.getElementById('min-price').value;
        const maxPrice = document.getElementById('max-price').value;

        if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
            alert('Giá tối thiểu không được lớn hơn giá tối đa!');
            return;
        }

        console.log(`Đang lọc giá từ: ${minPrice || 0} đến ${maxPrice || 'Vô hạn'}`);
        // Xử lý logic gọi API để fetch lại danh sách sản phẩm
    });

    // 3. Xử lý bắt sự kiện thêm vào giỏ hàng (Add to Cart)
    const productGrid = document.getElementById('product-grid');
    
    productGrid.addEventListener('click', (e) => {
        // Sử dụng Event Delegation để tối ưu hiệu suất cho Grid system
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = e.target.getAttribute('data-id');
            const productName = e.target.closest('.product-info').querySelector('.product-title').innerText;
            
            console.log(`Đã thêm sản phẩm ID: ${productId} - ${productName} vào giỏ hàng`);
            
            // Đổi text button tạm thời để tạo UX tốt
            const originalText = e.target.innerText;
            e.target.innerText = 'Đã thêm ✓';
            e.target.style.backgroundColor = '#52a851';
            e.target.style.color = '#fff';

            setTimeout(() => {
                e.target.innerText = originalText;
                e.target.removeAttribute('style'); // Reset inline styles (dựa vào hover CSS)
            }, 1500);
        }
    });

    // 4. Xử lý bộ lọc thương hiệu (Brand Filtering)
    const brandCheckboxes = document.querySelectorAll('input[name="brand"]');
    
    brandCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const selectedBrands = Array.from(brandCheckboxes)
                .filter(i => i.checked)
                .map(i => i.value);
                
            console.log(`Đang lọc theo thương hiệu: ${selectedBrands.join(', ')}`);
            // Render lại Grid system dựa trên mảng selectedBrands
        });
    });
});