/* ==========================================
   JAVASCRIPT KIỂM TRA FORM (Form Validation) - FRESHFARM
   Dùng chung cho checkout.html, login.html, register.html
   Quy ước: data-required = bắt buộc nhập
            data-rule = email | phone | password | match
   ========================================== */

// Hiện thông báo (Bootstrap Alert)
function showAlert(selector, type, message) {
    $(selector).attr("class", `alert alert-${type}`).text(message);
}

// Kiểm tra 1 ô nhập, trả về true nếu hợp lệ
function checkField($field) {
    const value = $.trim($field.val());
    let message = "";

    // 1. Kiểm tra để trống / chưa tick
    if ($field.is("[data-required]")) {
        if ($field.is(":checkbox")) {
            if (!$field.is(":checked")) message = "Bạn cần đồng ý để tiếp tục.";
        } else if (value === "") {
            message = "Vui lòng không để trống trường này.";
        }
    }

    // 2. Kiểm tra định dạng
    if (message === "" && value !== "") {
        const rule = $field.data("rule");
        if (rule === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
            message = "Email không đúng định dạng (ví dụ: ten@gmail.com).";
        }
        if (
            rule === "phone" &&
            !/^(0|\+84)[0-9]{9}$/.test(value.replace(/\s/g, ""))
        ) {
            message = "Số điện thoại gồm 10 số, bắt đầu bằng 0.";
        }
        if (rule === "password" && value.length < 6) {
            message = "Mật khẩu tối thiểu 6 ký tự.";
        }
        if (rule === "match" && value !== $($field.data("match")).val()) {
            message = "Mật khẩu nhập lại không khớp.";
        }
    }

    // 3. Hiển thị trạng thái đúng / sai
    $field.toggleClass("is-invalid", message !== "");
    $field.toggleClass(
        "is-valid",
        message === "" && (value !== "" || $field.is(":checked")),
    );
    $field.closest(".mb-3, .form-check").find(".invalid-feedback").first().text(message);
    return message === "";
}

// Kiểm tra toàn bộ form
function validateForm(form) {
    let isValid = true;
    const $form = $(form);

    $form.find("[data-required], [data-rule]").each(function () {
        if (!checkField($(this))) isValid = false;
    });
    if (!isValid) $form.find(".is-invalid").first().trigger("focus");
    return isValid;
}

// Kiểm tra ngay khi người dùng rời khỏi ô nhập
$(document).on(
    "blur change",
    "form[novalidate] [data-required], form[novalidate] [data-rule]",
    function () {
        checkField($(this));
    },
);

// Nút hiện / ẩn mật khẩu
$(document).on("click", ".toggle-password", function () {
    const $input = $($(this).data("target"));
    $input.attr("type", $input.attr("type") === "password" ? "text" : "password");
});
