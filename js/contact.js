/* ==========================================
   JAVASCRIPT CHO TRANG LIÊN HỆ - NÔNG SẢN DŨNG HÀ
   ========================================== */

$(document).ready(function() {
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();
        let isValid = true;

        // Kiểm tra tên không để trống
        let name = $('#name').val().trim();
        if (name === '') {
            $('#name').addClass('is-invalid');
            isValid = false;
        } else {
            $('#name').removeClass('is-invalid').addClass('is-valid');
        }

        // Kiểm tra định dạng số điện thoại (10-11 số)
        let phone = $('#phone').val().trim();
        let phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(phone)) {
            $('#phone').addClass('is-invalid');
            isValid = false;
        } else {
            $('#phone').removeClass('is-invalid').addClass('is-valid');
        }

        // Kiểm tra định dạng Email
        let email = $('#email').val().trim();
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            $('#email').addClass('is-invalid');
            isValid = false;
        } else {
            $('#email').removeClass('is-invalid').addClass('is-valid');
        }

        // Kiểm tra mật khẩu (nếu có nhập) tối thiểu 6-8 ký tự
        let password = $('#password').val();
        if (password !== '' && (password.length < 6 || password.length > 8)) {
            $('#password').addClass('is-invalid');
            isValid = false;
        } else {
            $('#password').removeClass('is-invalid');
            if(password !== '') $('#password').addClass('is-valid');
        }

        // Kiểm tra nội dung tin nhắn
        let message = $('#message').val().trim();
        if (message === '') {
            $('#message').addClass('is-invalid');
            isValid = false;
        } else {
            $('#message').removeClass('is-invalid').addClass('is-valid');
        }

        // Nếu hợp lệ toàn bộ
        if (isValid) {
            $('#formAlert').removeClass('d-none').hide().fadeIn(400);
            $('#contactForm')[0].reset();
            $('.form-control').removeClass('is-valid');
            
            // Lưu mảng thông tin liên hệ tạm vào localStorage
            let feedbackData = { name, phone, email, message, time: new Date().toLocaleString() };
            let feedbackList = JSON.parse(localStorage.getItem('feedbackList')) || [];
            feedbackList.push(feedbackData);
            localStorage.setItem('feedbackList', JSON.stringify(feedbackList));
        }
    });
});