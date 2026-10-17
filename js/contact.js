document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            
            // Lấy giá trị từ các trường input
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Các phần tử thông báo lỗi và thành công
            const nameError = document.getElementById('nameError');
            const emailError = document.getElementById('emailError');
            const phoneError = document.getElementById('phoneError');
            const messageError = document.getElementById('messageError');
            const formSuccess = document.getElementById('formSuccess');
            
            // Reset thông báo lỗi
            nameError.textContent = '';
            emailError.textContent = '';
            phoneError.textContent = '';
            messageError.textContent = '';
            formSuccess.style.display = 'none';
            
            let isValid = true;
            
            // Kiểm tra Họ tên
            if (name === '') {
                nameError.textContent = 'Vui lòng nhập họ và tên của bạn.';
                isValid = false;
            }
            
            // Kiểm tra Email
            if (email === '') {
                emailError.textContent = 'Vui lòng nhập địa chỉ email.';
                isValid = false;
            } else {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    emailError.textContent = 'Địa chỉ email không hợp lệ.';
                    isValid = false;
                }
            }
            
            // Kiểm tra Số điện thoại
            if (phone === '') {
                phoneError.textContent = 'Vui lòng nhập số điện thoại.';
                isValid = false;
            } else {
                const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
                if (!phoneRegex.test(phone)) {
                    phoneError.textContent = 'Số điện thoại không hợp lệ (định dạng 10 số tại Việt Nam).';
                    isValid = false;
                }
            }
            
            // Kiểm tra Nội dung
            if (message === '') {
                messageError.textContent = 'Vui lòng nhập nội dung tin nhắn.';
                isValid = false;
            } else if (message.length < 10) {
                messageError.textContent = 'Nội dung tin nhắn phải có ít nhất 10 ký tự.';
                isValid = false;
            }
            
            // Nếu hợp lệ, xử lý gửi form giả lập
            if (isValid) {
                const submitBtn = contactForm.querySelector('.submit-btn');
                submitBtn.disabled = true;
                submitBtn.textContent = 'Đang gửi...';
                
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Gửi thông tin';
                    formSuccess.style.display = 'block';
                    contactForm.reset();
                    
                    // Tự động ẩn thông báo thành công sau 5 giây
                    setTimeout(() => {
                        formSuccess.style.display = 'none';
                    }, 5000);
                }, 1000);
            }
        });
    }
});