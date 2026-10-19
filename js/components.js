(function ($) {
  const pageScripts = {
    about: ["js/cart.js"],
    cart: ["js/cart.js"],
    checkout: ["js/cart.js", "js/checkout.js"],
    contact: ["js/contact.js", "js/cart.js"],
    detail: ["js/data.js", "js/cart.js", "js/detail.js"],
    index: ["js/data.js", "js/index.js", "js/cart.js"],
    login: ["js/cart.js", "js/validate.js", "js/login.js"],
    register: ["js/cart.js", "js/validate.js", "js/register.js"],
    shop: ["js/data.js", "js/shop.js", "js/cart.js"],
  };

  const page = $("body").data("page");
  const scripts = pageScripts[page];
  const isAuthPage = page === "login" || page === "register";

  if (!scripts) {
    reportFailure(`Không tìm thấy cấu hình thành phần cho trang "${page}".`);
    return;
  }

  const headerUrl = isAuthPage
    ? "partials/auth-navbar.html"
    : "partials/site-header.html";
  const footerUrl = isAuthPage
    ? "partials/auth-footer.html"
    : "partials/site-footer.html";

  $.when($.get(headerUrl), $.get(footerUrl))
    .done(function (headerResponse, footerResponse) {
      const $header = $(headerResponse[0]);
      const $footer = $(footerResponse[0]);

      const validHeader = isAuthPage
        ? $header.is("nav.navbar")
        : $header.filter("header").length > 0;
      if (!validHeader || !$footer.is("footer")) {
        reportFailure("Không thể đọc nội dung header hoặc footer dùng chung.");
        return;
      }

      if (!isAuthPage && !configureSiteHeader($header, page)) return;

      $(`#${isAuthPage ? "auth-navbar" : "site-header"}-placeholder`).replaceWith(
        $header,
      );
      $(`#${isAuthPage ? "auth-footer" : "site-footer"}-placeholder`).replaceWith(
        $footer,
      );

      loadPageScripts(scripts);
    })
    .fail(function (xhr, status, error) {
      reportFailure("Không thể tải các thành phần dùng chung của trang.", error || status);
    });

  function configureSiteHeader($header, currentPage) {
    if (currentPage === "index") {
      $header.find("#categoryMenuToggle").removeAttr("data-bs-toggle aria-expanded");
      $header
        .find("#categoryDropdown")
        .removeClass("dropdown-menu")
        .addClass("d-none");
      $header.find(".breadcrumb").closest(".bg-light-blue").remove();
      return true;
    }

    const pageLabels = {
      about: "Giới thiệu",
      cart: "Giỏ hàng",
      checkout: "Thanh toán",
      contact: "Liên hệ",
      detail: "Gian hàng",
      shop: "Gian hàng",
    };
    const $currentCrumb = $header.find(".breadcrumb-item.active");

    if (!pageLabels[currentPage] || !$currentCrumb.length) {
      reportFailure(`Không tìm thấy breadcrumb cho trang "${currentPage}".`);
      return false;
    }

    $currentCrumb.text(pageLabels[currentPage]);

    if (currentPage === "checkout") {
      $currentCrumb.before(
        '<li class="breadcrumb-item"><a href="cart.html" class="text-decoration-none text-success">Giỏ hàng</a></li>',
      );
    }

    if (currentPage === "detail") {
      $currentCrumb.attr("id", "breadcrumb-product-name").before(
        '<li class="breadcrumb-item"><a href="shop.html" class="text-decoration-none text-success">Gian hàng</a></li>',
      );
    }

    return true;
  }

  function loadPageScripts(paths) {
    const requests = paths.map(function (path) {
      return $.ajax({
        url: path,
        dataType: "text",
        cache: true,
      }).then(function (source) {
        return { source: source };
      });
    });

    $.when.apply($, requests)
      .done(function () {
        const results =
          requests.length === 1 ? [arguments[0]] : Array.from(arguments);
        results.forEach(function (result) {
          $.globalEval(result.source);
        });
      })
      .fail(function (xhr, status, error) {
        reportFailure("Không thể tải mã JavaScript của trang.", error || status);
      });
  }

  function reportFailure(message, error) {
    console.error(message, error || "");
    window.alert(message);
  }
})(jQuery);
