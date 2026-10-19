$(function () {
  const $contactForm = $("#contactForm");

  if (!$contactForm.length) return;

  $contactForm.on("submit", function (event) {
    event.preventDefault();

    const $form = $(this);
    const name = $("#name").val().trim();
    const email = $("#email").val().trim();
    const phone = $("#phone").val().trim();
    const message = $("#message").val().trim();
    const $nameError = $("#nameError");
    const $emailError = $("#emailError");
    const $phoneError = $("#phoneError");
    const $messageError = $("#messageError");
    const $formSuccess = $("#formSuccess");

    $nameError.text("");
    $emailError.text("");
    $phoneError.text("");
    $messageError.text("");
    $formSuccess.hide();

    let isValid = true;

    if (name === "") {
      $nameError.text("Vui lòng nhập họ và tên của bạn.");
      isValid = false;
    }

    if (email === "") {
      $emailError.text("Vui lòng nhập địa chỉ email.");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      $emailError.text("Địa chỉ email không hợp lệ.");
      isValid = false;
    }

    if (phone === "") {
      $phoneError.text("Vui lòng nhập số điện thoại.");
      isValid = false;
    } else if (!/(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(phone)) {
      $phoneError.text(
        "Số điện thoại không hợp lệ (định dạng 10 số tại Việt Nam).",
      );
      isValid = false;
    }

    if (message === "") {
      $messageError.text("Vui lòng nhập nội dung tin nhắn.");
      isValid = false;
    } else if (message.length < 10) {
      $messageError.text("Nội dung tin nhắn phải có ít nhất 10 ký tự.");
      isValid = false;
    }

    if (!isValid) return;

    const $submitButton = $form.find(".submit-btn");
    $submitButton.prop("disabled", true).text("Đang gửi...");

    setTimeout(() => {
      $submitButton.prop("disabled", false).text("Gửi thông tin");
      $formSuccess.show();
      $form[0].reset();

      setTimeout(() => $formSuccess.hide(), 5000);
    }, 1000);
  });
});
