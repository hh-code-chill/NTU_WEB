/* ==========================================
   JAVASCRIPT TRANG ĐĂNG KÝ - FRESHFARM
   Cần nạp sau cart.js và validate.js
   ========================================== */

$(document).ready(function () {
    $('#registerForm').on('submit', function (e) {
        e.preventDefault();
        if (!validateForm(this)) return;

        let users = JSON.parse(localStorage.getItem('freshfarm_users') || '[]');
        let email = $('#email').val().trim().toLowerCase();

        // Không cho đăng ký trùng email
        let existed = users.some(function (u) {
            return u.email === email;
        });
        if (existed) {
            showAlert('#formAlert', 'danger', 'Email này đã được đăng ký. Hãy đăng nhập.');
            return;
        }

        users.push({
            name: $('#fullName').val().trim(),
            email: email,
            phone: $('#phone').val().trim(),
            password: $('#password').val()
        });
        localStorage.setItem('freshfarm_users', JSON.stringify(users));
        showAlert('#formAlert', 'success', 'Đăng ký thành công! Đang chuyển đến trang đăng nhập...');
        setTimeout(function () {
            window.location.href = 'login.html';
        }, 1500);
    });
});
