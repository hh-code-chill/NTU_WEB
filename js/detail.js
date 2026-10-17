// Đổi hình ảnh chính khi click vào thumbnail
function changeImage(element) {
    // Đổi source của ảnh chính
    const mainImage = document.getElementById('mainImage');
    mainImage.src = element.src;

    // Xóa class 'active' ở tất cả thumbnails
    const thumbnails = document.querySelectorAll('.thumb-img');
    thumbnails.forEach(img => img.classList.remove('active'));

    // Thêm class 'active' cho thumbnail được click
    element.classList.add('active');
}

// Xử lý tăng giảm số lượng (Quantity)
function updateQty(change) {
    const qtyInput = document.getElementById('qtyInput');
    let currentVal = parseInt(qtyInput.value);
    
    if (isNaN(currentVal)) currentVal = 1;
    
    let newVal = currentVal + change;
    
    // Đảm bảo số lượng không nhỏ hơn 1
    if (newVal >= 1) {
        qtyInput.value = newVal;
    }
}

// Xử lý active trạng thái cho các nút chọn biến thể (Size/Màu sắc/Vị trí)
document.addEventListener('DOMContentLoaded', () => {
    const variantGroups = document.querySelectorAll('.variant-group');

    variantGroups.forEach(group => {
        const buttons = group.querySelectorAll('.variant-btn');
        
        buttons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Xóa active class của các nút cùng nhóm
                buttons.forEach(b => b.classList.remove('active'));
                // Thêm active class cho nút vừa click
                this.classList.add('active');
            });
        });
    });
});