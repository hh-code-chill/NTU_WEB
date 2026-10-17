// Xử lý logic hiển thị số lượng giỏ hàng trên badge từ localStorage
document.addEventListener("DOMContentLoaded", function () {
    updateCartBadge();
});

function updateCartBadge() {
    let cart = JSON.parse(localStorage.getItem('freshfarm_cart')) || [];
    let totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badges = document.querySelectorAll('.cart-count-badge');
    badges.forEach(badge => {
        badge.textContent = totalCount;
    });
}