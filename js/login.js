/* ==========================================
   JAVASCRIPT TRANG ĐĂNG NHẬP - FRESHFARM
   Cần nạp sau cart.js và validate.js
   ========================================== */

$(function () {
    $("#loginForm").on("submit", function (event) {
        event.preventDefault();
        if (!validateForm(this)) return;

        const users = JSON.parse(localStorage.getItem("freshfarm_users") || "[]");
        const email = $("#email").val().trim().toLowerCase();
        const password = $("#password").val();

        // Tìm tài khoản trùng email và mật khẩu
        const user = users.find(function (u) {
            return u.email === email && u.password === password;
        });

        if (!user) {
            showAlert("#formAlert", "danger", "Email hoặc mật khẩu không đúng.");
            return;
        }
        localStorage.setItem("freshfarm_current_user", JSON.stringify(user));
        showAlert(
            "#formAlert",
            "success",
            "Xin chào " + user.name + "! Đang chuyển về trang chủ...",
        );
        setTimeout(function () {
            window.location.href = "index.html";
        }, 1200);
    });
});
