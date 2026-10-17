/* ==========================================
   JAVASCRIPT TRANG ĐĂNG NHẬP - FRESHFARM
   Cần nạp sau cart.js và validate.js
   ========================================== */

$(document).ready(function () {
    $('#loginForm').on('submit', function (e) {
        e.preventDefault();
        if (!validateForm(this)) return;

        let users = JSON.parse(localStorage.getItem('freshfarm_users') || '[]');
        let email = $('#email').val().trim().toLowerCase();
        let password = $('#password').val();

        // Tìm tài khoản trùng email và mật khẩu
        let user = users.find(function (u) {
            return u.email === email && u.password === password;
        });

        if (!user) {
            showAlert('#formAlert', 'danger', 'Email hoặc mật khẩu không đúng.');
            return;
        }
        localStorage.setItem('freshfarm_current_user', JSON.stringify(user));
        showAlert('#formAlert', 'success', 'Xin chào ' + user.name + '! Đang chuyển về trang chủ...');
        setTimeout(function () {
            window.location.href = 'index.html';
        }, 1200);
    });
});
