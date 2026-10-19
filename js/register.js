/* ==========================================
   JAVASCRIPT TRANG ĐĂNG KÝ - FRESHFARM
   Cần nạp sau cart.js và validate.js
   ========================================== */

$(function () {
    $("#registerForm").on("submit", function (event) {
        event.preventDefault();
        if (!validateForm(this)) return;

        const users = JSON.parse(localStorage.getItem("freshfarm_users") || "[]");
        const email = $("#email").val().trim().toLowerCase();

        // Không cho đăng ký trùng email
        const existed = users.some(function (u) {
            return u.email === email;
        });
        if (existed) {
            showAlert(
                "#formAlert",
                "danger",
                "Email này đã được đăng ký. Hãy đăng nhập.",
            );
            return;
        }

        users.push({
            name: $("#fullName").val().trim(),
            email: email,
            phone: $("#phone").val().trim(),
            password: $("#password").val(),
        });
        localStorage.setItem("freshfarm_users", JSON.stringify(users));
        showAlert(
            "#formAlert",
            "success",
            "Đăng ký thành công! Đang chuyển đến trang đăng nhập...",
        );
        setTimeout(function () {
            window.location.href = "login.html";
        }, 1500);
    });
});
