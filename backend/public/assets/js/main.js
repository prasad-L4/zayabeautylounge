(() => {
  const updateVisibleHeroSlider = () => {
    const slider = document.querySelector(
      window.innerWidth <= 992 ? ".hero-mobile-slider" : ".hero-desktop-slider",
    );
    slider?.swiper?.update();
  };
  window.addEventListener("load", () => {
    document.onkeydown = null;
    window.addEventListener(
      "contextmenu",
      (e) => e.stopImmediatePropagation(),
      true,
    );
    updateVisibleHeroSlider();
  });
  window.addEventListener("resize", updateVisibleHeroSlider);
})();
!(function (e) {
  "use strict";
  if (
    (e(window).on("load", function () {
      e(".preloader").fadeOut();
    }),
    e("#preloader").length &&
      (e("#preloader").delay(1600).fadeOut(),
      setTimeout(function () {
        (e(".preloader-bg-one").css("transform", "translateY(-100%)"),
          e(".preloader-bg-two").css("transform", "translateY(100%)"),
          e(".txt-loading").css("opacity", 0));
      }, 1e3)),
    e(".mouseCursor").length > 0)
  ) {
    !(function () {
      if (jQuery(".mouseCursor").length && e("body")) {
        const t = document.querySelector(".cursor-inner"),
          o = document.querySelector(".cursor-outer");
        let a,
          n = 0,
          s = !1;
        ((window.onmousemove = function (e) {
          (s ||
            (o.style.transform =
              "translate(" + e.clientX + "px, " + e.clientY + "px)"),
            (t.style.transform =
              "translate(" + e.clientX + "px, " + e.clientY + "px)"),
            (a = e.clientY),
            (n = e.clientX));
        }),
          e("body").on(
            "mouseenter",
            "button:not(.not-cursor), a:not(.not-cursor), .cursor-pointer",
            function () {
              (t.classList.add("cursor-hover"),
                o.classList.add("cursor-hover"));
            },
          ),
          e("body").on("mouseleave", "button, a, .cursor-pointer", function () {
            (e(this).is("a", "button") &&
              e(this).closest(".cursor-pointer").length) ||
              (t.classList.remove("cursor-hover"),
              o.classList.remove("cursor-hover"));
          }),
          (t.style.visibility = "visible"),
          (o.style.visibility = "visible"),
          e("h1, h2, h3, h4, h5, h6, .cursor-lg").on("mouseenter", function () {
            e(".mouseCursor").addClass("cursor-big");
          }),
          e("h1, h2, h3, h4, h5, h6, .cursor-lg").on("mouseleave", function () {
            e(".mouseCursor").removeClass("cursor-big");
          }),
          e(".not-cursor").on("mouseenter", function () {
            e(".mouseCursor").addClass("not-cursor-outer");
          }),
          e(".not-cursor").on("mouseleave", function () {
            e(".mouseCursor").removeClass("not-cursor-outer");
          }));
      }
    })();
  }
  function t(t) {
    e(t).length > 0 &&
      e(t).each(function () {
        var t = e(this).find("a");
        e(this)
          .find(t)
          .each(function () {
            e(this).on("click", function () {
              var t = e(this.getAttribute("href"));
              t.length &&
                (event.preventDefault(),
                e("html, body")
                  .stop()
                  .animate({ scrollTop: t.offset().top - 10 }, 1e3));
            });
          });
      });
  }
  if (
    (e(".nice-select").length && e(".nice-select").niceSelect(),
    (e.fn.thmobilemenu = function (t) {
      var o = e.extend(
        {
          menuToggleBtn: ".th-menu-toggle",
          bodyToggleClass: "th-body-visible",
          subMenuClass: "th-submenu",
          subMenuParent: "th-item-has-children",
          subMenuParentToggle: "th-active",
          meanExpandClass: "th-mean-expand",
          appendElement: '<span class="th-mean-expand"></span>',
          subMenuToggleClass: "th-open",
          toggleSpeed: 400,
        },
        t,
      );
      return this.each(function () {
        var t = e(this);
        function a() {
          t.toggleClass(o.bodyToggleClass);
          var a = "." + o.subMenuClass;
          e(a).each(function () {
            e(this).hasClass(o.subMenuToggleClass) &&
              (e(this).removeClass(o.subMenuToggleClass),
              e(this).css("display", "none"),
              e(this).parent().removeClass(o.subMenuParentToggle));
          });
        }
        t.find("li").each(function () {
          var t = e(this).find("ul");
          (t.addClass(o.subMenuClass),
            t.css("display", "none"),
            t.parent().addClass(o.subMenuParent),
            t.prev("a").append(o.appendElement),
            t.next("a").append(o.appendElement));
        });
        var n = "." + o.meanExpandClass;
        (e(n).each(function () {
          e(this).on("click", function (t) {
            var a;
            (t.preventDefault(),
              (a = e(this).parent()),
              e(a).next("ul").length > 0
                ? (e(a).parent().toggleClass(o.subMenuParentToggle),
                  e(a).next("ul").slideToggle(o.toggleSpeed),
                  e(a).next("ul").toggleClass(o.subMenuToggleClass))
                : e(a).prev("ul").length > 0 &&
                  (e(a).parent().toggleClass(o.subMenuParentToggle),
                  e(a).prev("ul").slideToggle(o.toggleSpeed),
                  e(a).prev("ul").toggleClass(o.subMenuToggleClass)));
          });
        }),
          e(o.menuToggleBtn).each(function () {
            e(this).on("click", function () {
              a();
            });
          }),
          t.on("click", function (e) {
            (e.stopPropagation(), a());
          }),
          t.find("div").on("click", function (e) {
            e.stopPropagation();
          }));
      });
    }),
    e(".th-menu-wrapper").thmobilemenu(),
    e(window).scroll(function () {
      e(this).scrollTop() > 500
        ? e(".sticky-wrapper").addClass("sticky")
        : e(".sticky-wrapper").removeClass("sticky");
    }),
    t(".onepage-nav"),
    t(".scroll-down"),
    e(".scroll-top").length)
  ) {
    var o = document.querySelector(".scroll-top");
    (jQuery(window).on("scroll", function () {
      jQuery(this).scrollTop() > 50
        ? jQuery(o).addClass("show")
        : jQuery(o).removeClass("show");
    }),
      jQuery(o).on("click", function (e) {
        return (
          e.preventDefault(),
          jQuery("html, body").animate({ scrollTop: 0 }, 750),
          !1
        );
      }));
  }
  let a, n, s, r, i;
  function c() {
    (requestAnimationFrame(c), s && n && a && s.render(a, n));
  }
  function d(e) {
    if (!i) return;
    const t = document.querySelectorAll(".swiper-slide");
    if (!t[e]) return;
    const o = t[e].getAttribute("data-image");
    if (!o) return;
    const a = new THREE.TextureLoader().load(o);
    ((i.texture2.value = a),
      (i.progress.value = 0),
      gsap.to(i.progress, {
        value: 1,
        duration: 1.8,
        ease: "power2.inOut",
        onComplete: () => {
          ((i.texture1.value = a), (i.progress.value = 0));
        },
      }));
  }
  (e("[data-bg-src]").length > 0 &&
    e("[data-bg-src]").each(function () {
      var t = e(this).attr("data-bg-src");
      (e(this).css("background-image", "url(" + t + ")"),
        e(this).removeAttr("data-bg-src").addClass("background-image"));
    }),
    e("[data-bg-color]").length > 0 &&
      e("[data-bg-color]").each(function () {
        var t = e(this).attr("data-bg-color");
        (e(this).css("background-color", t),
          e(this).removeAttr("data-bg-color"));
      }),
    e("[data-border]").each(function () {
      var t = e(this).data("border");
      e(this).css("--th-border-color", t);
    }),
    e("[data-mask-src]").length > 0 &&
      e("[data-mask-src]").each(function () {
        var t = e(this).attr("data-mask-src");
        (e(this).css({
          "mask-image": "url(" + t + ")",
          "-webkit-mask-image": "url(" + t + ")",
        }),
          e(this).addClass("bg-mask"),
          e(this).removeAttr("data-mask-src"));
      }),
    (function () {
      const e = document.querySelector("#slider-webgl");
      if (!e) return;
      ((a = new THREE.Scene()),
        (n = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)),
        (s = new THREE.WebGLRenderer({ alpha: !0 })),
        s.setSize(window.innerWidth, window.innerHeight),
        e.appendChild(s.domElement));
      const t = document.querySelectorAll(".swiper-slide");
      if (!t.length) return;
      const o = t[0].getAttribute("data-image") || "",
        l = new THREE.TextureLoader(),
        d = e.dataset.disp || "assets/img/hero/pattan.png",
        u = l.load(d);
      ((i = {
        progress: { value: 0 },
        texture1: { value: l.load(o) },
        texture2: { value: l.load(o) },
        disp: { value: u },
        intensity: { value: 0.3 },
      }),
        (r = new THREE.ShaderMaterial({
          uniforms: i,
          vertexShader:
            "\n            varying vec2 vUv;\n            void main() {\n                vUv = uv;\n                gl_Position = vec4(position, 1.0);\n            }\n        ",
          fragmentShader:
            "\n            varying vec2 vUv;\n            uniform sampler2D texture1;\n            uniform sampler2D texture2;\n            uniform sampler2D disp;\n            uniform float progress;\n            uniform float intensity;\n\n            void main() {\n                vec2 uv = vUv;\n                vec4 dispTex = texture2D(disp, uv);\n                vec2 distortedPosition = uv + (dispTex.rg * 2.0 - 1.0) * intensity * progress;\n                vec2 distortedPosition2 = uv - (dispTex.rg * 2.0 - 1.0) * intensity * (1.0 - progress);\n                vec4 _texture1 = texture2D(texture1, distortedPosition);\n                vec4 _texture2 = texture2D(texture2, distortedPosition2);\n                gl_FragColor = mix(_texture1, _texture2, progress);\n            }\n        ",
          transparent: !0,
        })));
      const p = new THREE.PlaneBufferGeometry(2, 2),
        g = new THREE.Mesh(p, r);
      (a.add(g), c());
    })(),
    e(".th-slider").each(function () {
      const t = e(this);
      let o = {};
      try {
        o = JSON.parse(t.attr("data-slider-options") || "{}");
      } catch (e) {
        console.warn("Invalid data-slider-options JSON", e);
      }
      const a = t.find(".slider-prev").length
          ? t.find(".slider-prev").get(0)
          : null,
        n = t.find(".slider-next").length
          ? t.find(".slider-next").get(0)
          : null,
        s = t.siblings(".slider-controller").find(".slider-pagination"),
        r = s.length
          ? s.get(0)
          : t.find(".slider-pagination").length
            ? t.find(".slider-pagination").get(0)
            : void 0,
        i = s.length ? s.get(0) : t.find(".slider-pagination2").get(0),
        l = t.find(".slider-pagination.pagi-number"),
        c = o.paginationType || "bullets",
        u = o.autoplay || { delay: 6e3, disableOnInteraction: !1 },
        p = {
          slidesPerView: 1,
          spaceBetween: o.spaceBetween || 24,
          loop: !1 !== o.loop,
          speed: 1800,
          autoplay: u,
          navigation: { nextEl: n, prevEl: a },
          pagination: {
            el: r,
            type: c,
            clickable: !0,
            renderBullet: function (e, t) {
              const o = e + 1,
                a = o < 10 ? "0" + o : o;
              return l.length
                ? `<span class="${t} number">${a}</span>`
                : `<span class="${t}" aria-label="Go to Slide ${a}"></span>`;
            },
            formatFractionCurrent: (e) => (e < 10 ? "0" + e : e),
            formatFractionTotal: (e) => (e < 10 ? "0" + e : e),
          },
          on: {
            init: function () {
              if (i) {
                const t = this.slides.length;
                e(i).html(
                  '<span class="current-slide">01</span> <span class="total-slides">' +
                    (t < 10 ? "0" + t : t) +
                    "</span>",
                );
              }
            },
            slideChangeTransitionStart: function () {
              if ((d(this.realIndex), i)) {
                const t = this.realIndex + 1,
                  o = this.slides.length;
                e(i).html(
                  `<span class="current-slide">${t < 10 ? "0" + t : t}</span> \n                         <span class="total-slides">${o < 10 ? "0" + o : o}</span>`,
                );
              }
            },
          },
        },
        g = e.extend({}, p, o);
      (new Swiper(t.get(0), g),
        e(".slider-area").length > 0 &&
          e(".slider-area")
            .closest(".container")
            .parent()
            .addClass("arrow-wrap"));
    }));
  const u = 0.1,
    p = 0.01;
  (!(function e() {
    (requestAnimationFrame(e),
      document.querySelectorAll(".swiper .single").forEach((e) => {
        const t = e.getBoundingClientRect(),
          o = 0.5 * window.innerWidth - (t.x + 0.5 * t.width);
        let a = Math.abs(o) * u - t.width * u;
        a < 0 && (a = 0);
        const n = o < 0 ? "left top" : "right top";
        ((e.style.transform = `translate(0, ${a}px) rotate(${-o * p}deg)`),
          (e.style.transformOrigin = n));
      }));
  })(),
    e("[data-ani]").each(function () {
      var t = e(this).data("ani");
      e(this).addClass(t);
    }),
    e("[data-ani-delay]").each(function () {
      var t = e(this).data("ani-delay");
      e(this).css("animation-delay", t);
    }),
    e("[data-slider-prev], [data-slider-next]").on("click", function () {
      var t = e(this).data("slider-prev") || e(this).data("slider-next"),
        o = e(t);
      if (o.length) {
        var a = o[0].swiper;
        a && (e(this).data("slider-prev") ? a.slidePrev() : a.slideNext());
      }
    }),
    e("#slider").on("input change", (t) => {
      const o = t.target.value;
      (e(".foreground-img").css("width", o + "%"),
        e(".slider-button").css("left", `calc(${o}% - 30px)`));
    }),
    e(document).on("mouseover", ".hover-item", function () {
      (e(this).addClass("item-active"),
        e(".hover-item").removeClass("item-active"),
        e(this).addClass("item-active"));
    }),
    (e.fn.activateSliderThumbs = function (t) {
      var o = e.extend({ sliderTab: !1, tabButton: ".tab-btn" }, t);
      return this.each(function () {
        var t = e(this),
          a = t.find(o.tabButton),
          n = e('<span class="indicator"></span>').appendTo(t),
          s = t.data("slider-tab"),
          r = e(s)[0].swiper;
        if (
          (a.on("click", function (t) {
            t.preventDefault();
            var a = e(this);
            if (
              (a.addClass("active").siblings().removeClass("active"),
              c(a),
              o.sliderTab)
            ) {
              var n = a.index();
              r.slideTo(n);
            }
          }),
          o.sliderTab)
        ) {
          r.on("slideChange", function () {
            var e = r.realIndex,
              t = a.eq(e);
            (t.addClass("active").siblings().removeClass("active"), c(t));
          });
          var i = r.activeIndex,
            l = a.eq(i);
          (l.addClass("active").siblings().removeClass("active"), c(l));
        }
        function c(e) {
          var t = e.position(),
            o = parseInt(e.css("margin-top")) || 0,
            a = parseInt(e.css("margin-left")) || 0;
          (n.css("--height-set", e.outerHeight() + "px"),
            n.css("--width-set", e.outerWidth() + "px"),
            n.css("--pos-y", t.top + o + "px"),
            n.css("--pos-x", t.left + a + "px"));
        }
      });
    }),
    e(".testi-thumb").length &&
      e(".testi-thumb").activateSliderThumbs({
        sliderTab: !0,
        tabButton: ".tab-btn",
      }),
    e(".project-thumb").length &&
      e(".project-thumb").activateSliderThumbs({
        sliderTab: !0,
        tabButton: ".tab-btn",
      }));
  var g,
    m,
    h,
    f = ".ajax-contact",
    v = '[name="email"]',
    y = e(".form-messages");
  function b() {
    var t = e(f).serialize();
    (function () {
      var t,
        o = !0;
      function a(a) {
        a = a.split(",");
        for (var n = 0; n < a.length; n++)
          ((t = f + " " + a[n]),
            e(t).val()
              ? (e(t).removeClass("is-invalid"), (o = !0))
              : (e(t).addClass("is-invalid"), (o = !1)));
      }
      (a(
        '[name="name"],[name="email"],[name="subject"],[name="number"],[name="message"]',
      ),
        e(v).val() &&
        e(v)
          .val()
          .match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/)
          ? (e(v).removeClass("is-invalid"), (o = !0))
          : (e(v).addClass("is-invalid"), (o = !1)));
      return o;
    })() &&
      jQuery
        .ajax({ url: e(f).attr("action"), data: t, type: "POST" })
        .done(function (t) {
          (y.removeClass("error"),
            y.addClass("success"),
            y.text(t),
            e(f + ' input:not([type="submit"]),' + f + " textarea").val(""));
        })
        .fail(function (e) {
          (y.removeClass("success"),
            y.addClass("error"),
            "" !== e.responseText
              ? y.html(e.responseText)
              : y.html(
                  "Oops! An error occured and your message could not be sent.",
                ));
        });
  }
  function w(t, o, a, n) {
    (e(o).on("click", function (o) {
      (o.preventDefault(), e(t).addClass(n));
    }),
      e(t).on("click", function (o) {
        (o.stopPropagation(), e(t).removeClass(n));
      }),
      e(t + " > div").on("click", function (o) {
        (o.stopPropagation(), e(t).addClass(n));
      }),
      e(a).on("click", function (o) {
        (o.preventDefault(), o.stopPropagation(), e(t).removeClass(n));
      }));
  }
  function w(t, o, a, n) {
    (e(o).on("click", function (o) {
      (o.preventDefault(), e(t).addClass(n));
    }),
      e(t).on("click", function (o) {
        (o.stopPropagation(), e(t).removeClass(n));
      }),
      e(t + " > div").on("click", function (o) {
        (o.stopPropagation(), e(t).addClass(n));
      }),
      e(a).on("click", function (o) {
        (o.preventDefault(), o.stopPropagation(), e(t).removeClass(n));
      }));
  }
  function x(t, o, a, n) {
    var s = t.text().split(o),
      r = "";
    s.length &&
      (e(s).each(function (e, t) {
        r += '<span class="' + a + (e + 1) + '">' + t + "</span>" + n;
      }),
      t.empty().append(r));
  }
  (e(f).on("submit", function (e) {
    (e.preventDefault(), b());
  }),
    (g = ".popup-search-box"),
    (m = ".searchClose"),
    (h = "show"),
    e(".searchBoxToggler").on("click", function (t) {
      (t.preventDefault(), e(g).addClass(h));
    }),
    e(g).on("click", function (t) {
      (t.stopPropagation(), e(g).removeClass(h));
    }),
    e(g)
      .find("form")
      .on("click", function (t) {
        (t.stopPropagation(), e(g).addClass(h));
      }),
    e(m).on("click", function (t) {
      (t.preventDefault(), t.stopPropagation(), e(g).removeClass(h));
    }),
    w(".sidemenu-wrapper", ".sideMenuToggler", ".sideMenuCls", "show"),
    w(".shopping-cart", ".sideMenuToggler2", ".sideMenuCls", "show"),
    e(".th-popup-image").magnificPopup({
      type: "image",
      mainClass: "mfp-zoom-in",
      removalDelay: 260,
      gallery: { enabled: !0 },
    }),
    e(".popup-video").magnificPopup({
      type: "iframe",
      mainClass: "mfp-zoom-in",
      removalDelay: 260,
    }),
    e(".popup-content").magnificPopup({ type: "inline", midClick: !0 }),
    e("[data-theme-color]").length > 0 &&
      e("[data-theme-color]").each(function () {
        var t = e(this).attr("data-theme-color");
        (e(this).get(0).style.setProperty("--theme-color", t),
          e(this).removeAttr("data-theme-color"));
      }));
  var C = {
    init: function () {
      return this.each(function () {
        x(e(this), "", "char", "");
      });
    },
    words: function () {
      return this.each(function () {
        x(e(this), " ", "word", " ");
      });
    },
    lines: function () {
      return this.each(function () {
        var t = "eefec303079ad17405c889e092e105b0";
        x(e(this).children("br").replaceWith(t).end(), t, "line", "");
      });
    },
  };
  function k(e) {
    return parseInt(e, 10);
  }
  ((e.fn.lettering = function (t) {
    return t && C[t]
      ? C[t].apply(this, [].slice.call(arguments, 1))
      : "letters" !== t && t
        ? (e.error("Method " + t + " does not exist on jQuery.lettering"), this)
        : C.init.apply(this, [].slice.call(arguments, 0));
  }),
    e(".discount-anime").lettering(),
    (e.fn.sectionPosition = function (t, o) {
      e(this).each(function () {
        var a,
          n,
          s,
          r,
          i,
          l = e(this);
        ((a = Math.floor(l.height() / 2)),
          (n = l.attr(t)),
          (s = l.attr(o)),
          (r = k(e(s).css("padding-top"))),
          (i = k(e(s).css("padding-bottom"))),
          "top-half" === n
            ? (e(s).css("padding-bottom", i + a + "px"),
              l.css("margin-top", "-" + a + "px"))
            : "bottom-half" === n &&
              (e(s).css("padding-top", r + a + "px"),
              l.css("margin-bottom", "-" + a + "px")));
      });
    }));
  (e("[data-sec-pos]").length &&
    e("[data-sec-pos]").imagesLoaded(function () {
      e("[data-sec-pos]").sectionPosition("data-sec-pos", "data-pos-for");
    }),
    e(".filter-active").imagesLoaded(function () {
      var t = ".filter-active";
      if (e(t).length > 0) {
        var o = e(t).isotope({
          itemSelector: ".filter-item",
          filter: "*",
          masonry: { columnWidth: 1 },
        });
        (e(".filter-menu-active").on("click", "button", function () {
          var t = e(this).attr("data-filter");
          o.isotope({ filter: t });
        }),
          e(".filter-menu-active").on("click", "button", function (t) {
            (t.preventDefault(),
              e(this).addClass("active"),
              e(this).siblings(".active").removeClass("active"));
          }));
      }
      e(".load-more-btn").on("click", function () {
        var o = e(this).find("i");
        (o.addClass("fa-spin-pulse"),
          setTimeout(function () {
            o.removeClass("fa-spin-pulse");
          }, 1e3));
        var a = e(this);
        setTimeout(function () {
          var o = a.prev(".load-more-active");
          (0 === o.length &&
            (o = a.closest(".container").find(".load-more-active")),
            o
              .find(
                ".load-more.d-none, .accordion-card.style2.d-none, .filter-item.d-none",
              )
              .removeClass("d-none"));
          e(t).isotope({ filter: "*" });
        }, 700);
      });
    }),
    e(".masonary-active").imagesLoaded(function () {
      e(".masonary-active").length > 0 &&
        e(".masonary-active").isotope({
          itemSelector: ".filter-item",
          filter: "*",
          masonry: { columnWidth: 1 },
        });
    }),
    e(".masonary-active, .woocommerce-Reviews .comment-list").imagesLoaded(
      function () {
        var t = ".masonary-active, .woocommerce-Reviews .comment-list";
        (e(t).length > 0 &&
          e(t).isotope({
            itemSelector: ".filter-item, .woocommerce-Reviews .comment-list li",
            filter: "*",
            masonry: { columnWidth: 1 },
          }),
          e('[data-bs-toggle="tab"]').on("shown.bs.tab", function (o) {
            e(t).isotope({ filter: "*" });
          }));
      },
    ),
    e(".counter-number").counterUp({ delay: 10, time: 1e3 }),
    (e.fn.shapeMockup = function () {
      e(this).each(function () {
        var t = e(this),
          o = t.data("top"),
          a = t.data("right"),
          n = t.data("bottom"),
          s = t.data("left");
        t.css({ top: o, right: a, bottom: n, left: s })
          .removeAttr("data-top")
          .removeAttr("data-right")
          .removeAttr("data-bottom")
          .removeAttr("data-left")
          .parent()
          .addClass("shape-mockup-wrap");
      });
    }),
    e(".shape-mockup") && e(".shape-mockup").shapeMockup(),
    (e.fn.shapeMockup2 = function () {
      e(this).each(function () {
        var t = e(this),
          o = t.data("top"),
          a = t.data("right"),
          n = t.data("bottom"),
          s = t.data("left");
        t.css({ top: o, right: a, bottom: n, left: s })
          .removeAttr("data-top")
          .removeAttr("data-right")
          .removeAttr("data-bottom")
          .removeAttr("data-left")
          .parent()
          .addClass("shape-mockup-wrap2");
      });
    }),
    e(".shape-mockup2") && e(".shape-mockup2").shapeMockup2(),
    e(".price_slider").slider({
      range: !0,
      min: 10,
      max: 100,
      values: [10, 75],
      slide: function (t, o) {
        (e(".from").text("$" + o.values[0]), e(".to").text("$" + o.values[1]));
      },
    }),
    e(".from").text("$" + e(".price_slider").slider("values", 0)),
    e(".to").text("$" + e(".price_slider").slider("values", 1)),
    e(".progress-bar").waypoint(
      function () {
        e(".progress-bar").css({
          animation: "animate-positive 1.8s",
          opacity: "1",
        });
      },
      { offset: "75%" },
    ),
    document.addEventListener("DOMContentLoaded", function () {
      const e = document.querySelector(".th-screen");
      if (e) {
        new IntersectionObserver(
          (t) => {
            t.forEach((t) => {
              t.isIntersecting
                ? e.classList.add("th-visible")
                : e.classList.remove("th-visible");
            });
          },
          { root: null, threshold: 0.2 },
        ).observe(e);
      }
    }),
    e("#ship-to-different-address-checkbox").on("change", function () {
      e(this).is(":checked")
        ? e("#ship-to-different-address").next(".shipping_address").slideDown()
        : e("#ship-to-different-address").next(".shipping_address").slideUp();
    }),
    e(".woocommerce-form-login-toggle a").on("click", function (t) {
      (t.preventDefault(), e(".woocommerce-form-login").slideToggle());
    }),
    e(".woocommerce-form-coupon-toggle a").on("click", function (t) {
      (t.preventDefault(), e(".woocommerce-form-coupon").slideToggle());
    }),
    e(".shipping-calculator-button").on("click", function (t) {
      (t.preventDefault(),
        e(this).next(".shipping-calculator-form").slideToggle());
    }),
    e('.wc_payment_methods input[type="radio"]:checked')
      .siblings(".payment_box")
      .show(),
    e('.wc_payment_methods input[type="radio"]').each(function () {
      e(this).on("change", function () {
        (e(".payment_box").slideUp(),
          e(this).siblings(".payment_box").slideDown());
      });
    }),
    e(".rating-select .stars a").each(function () {
      e(this).on("click", function (t) {
        (t.preventDefault(),
          e(this).siblings().removeClass("active"),
          e(this).parent().parent().addClass("selected"),
          e(this).addClass("active"));
      });
    }),
    e(".quantity-plus").each(function () {
      e(this).on("click", function (t) {
        t.preventDefault();
        var o = e(this).siblings(".qty-input"),
          a = parseInt(o.val(), 10);
        isNaN(a) || o.val(a + 1);
      });
    }),
    e(".quantity-minus").each(function () {
      e(this).on("click", function (t) {
        t.preventDefault();
        var o = e(this).siblings(".qty-input"),
          a = parseInt(o.val(), 10);
        !isNaN(a) && a > 1 && o.val(a - 1);
      });
    }),
    e(".color-switch-btns button").each(function () {
      const t = e(this),
        o = t.data("color");
      (t.css("--theme-color", o),
        t.on("click", function () {
          const t = e(this).data("color");
          e("body").css("--theme-color", t);
        }));
    }),
    e("[theme-color]").length > 0 &&
      e("[theme-color]").each(function () {
        var t = e(this).attr("theme-color");
        (e(this).get(0).style.setProperty("--theme-color", t),
          e(this).removeAttr("theme-color"));
      }),
    e("[title-color]").length > 0 &&
      e("[title-color]").each(function () {
        var t = e(this).attr("title-color");
        (e(this).get(0).style.setProperty("--title-color", t),
          e(this).removeAttr("title-color"));
      }),
    e(document).on("click", ".switchIcon", function () {
      e(".color-scheme-wrap").toggleClass("active");
    }));
  var T = document.getElementById("filt-monthly"),
    S = document.getElementById("filt-yearly"),
    E = document.getElementById("switcher"),
    A = document.getElementById("monthly"),
    P = document.getElementById("yearly");
  e(".pricing-tabs").length &&
    (T.addEventListener("click", function () {
      ((E.checked = !1),
        T.classList.add("toggler--is-active"),
        S.classList.remove("toggler--is-active"),
        A.classList.remove("hide"),
        P.classList.add("hide"));
    }),
    S.addEventListener("click", function () {
      ((E.checked = !0),
        S.classList.add("toggler--is-active"),
        T.classList.remove("toggler--is-active"),
        A.classList.add("hide"),
        P.classList.remove("hide"));
    }),
    E.addEventListener("click", function () {
      (S.classList.toggle("toggler--is-active"),
        T.classList.toggle("toggler--is-active"),
        A.classList.toggle("hide"),
        P.classList.toggle("hide"));
    }));
  new WOW({
    boxClass: "wow",
    animateClass: "animated",
    offset: 0,
    mobile: !0,
    live: !0,
  });
  if ((new WOW().init(), e(".reveal").length)) {
    (gsap.registerPlugin(ScrollTrigger),
      document.querySelectorAll(".reveal").forEach((e) => {
        let t = e.querySelector("img"),
          o = gsap.timeline({
            scrollTrigger: { trigger: e, toggleActions: "play none none none" },
          });
        (o.set(e, { autoAlpha: 1 }),
          o.from(e, 1, { xPercent: -100, ease: Power2.out }),
          o.from(t, 1, {
            xPercent: 100,
            scale: 1,
            delay: -1,
            ease: Power2.out,
          }));
      }));
  }
  if (e(".text-anime-style-1").length) {
    let e = 0.05,
      t = 0.5;
    document.querySelectorAll(".text-anime-style-1").forEach((o) => {
      let a = new SplitText(o, { type: "chars, words" });
      gsap.from(a.words, {
        duration: 1,
        delay: t,
        x: 20,
        autoAlpha: 0,
        stagger: e,
        scrollTrigger: { trigger: o, start: "top 85%" },
      });
    });
  }
  if (e(".text-anime-style-2").length) {
    let e = 0.03,
      t = 20,
      o = 0.1,
      a = "power2.out";
    document.querySelectorAll(".text-anime-style-2").forEach((n) => {
      let s = new SplitText(n, { type: "chars, words" });
      gsap.from(s.chars, {
        duration: 2,
        delay: o,
        x: t,
        autoAlpha: 0,
        stagger: e,
        ease: a,
        scrollTrigger: { trigger: n, start: "top 85%" },
      });
    });
  }
  if (e(".text-anime-style-3").length) {
    document.querySelectorAll(".text-anime-style-3").forEach((e) => {
      (e.animation && (e.animation.progress(1).kill(), e.split.revert()),
        (e.split = new SplitText(e, {
          type: "lines,words,chars",
          linesClass: "split-line",
        })),
        gsap.set(e, { perspective: 400 }),
        gsap.set(e.split.chars, { opacity: 0, x: "50" }),
        (e.animation = gsap.to(e.split.chars, {
          scrollTrigger: { trigger: e, start: "top 90%" },
          x: "0",
          y: "0",
          rotateX: "0",
          opacity: 1,
          duration: 1,
          ease: Back.easeOut,
          stagger: 0.02,
        })));
    });
  }
  if (
    (document.querySelectorAll(".img_anim_reveal").forEach((e) => {
      let t = e.querySelector("img"),
        o = gsap.timeline({ scrollTrigger: { trigger: e, start: "top 50%" } });
      (o.set(e, { autoAlpha: 1 }),
        o.from(e, 1.5, { yPercent: -100, ease: Power2.out }),
        o.from(t, 1.5, {
          yPercent: 100,
          scale: 1.3,
          delay: -1.5,
          ease: Power2.out,
        }));
    }),
    document.querySelectorAll(".hover-reveal").length > 0)
  ) {
    document.querySelectorAll(".hover-reveal").forEach((e, t) => {
      e.addEventListener("mousemove", (t) => {
        setInterval(
          (function (e, t) {
            const o = t.getBoundingClientRect(),
              a = e.clientX - o.x,
              n = e.clientY - o.y;
            t.children[0] &&
              (t.children[0].style.transform = `translate(${a}px, ${n}px)`);
          })(t, e),
          100,
        );
      });
    });
  }
  var q = document.querySelectorAll(".scale"),
    L = document.querySelectorAll(".scale img");
  function D() {
    const e = window.innerWidth < 526;
    let t = ScrollTrigger.getById("ctaTrigger");
    e
      ? (t && t.kill(),
        gsap.set(".cta-card-wrapp, .cta-trigger-thumb", {
          scale: 1,
          y: 0,
          opacity: 1,
        }))
      : t ||
        (gsap.set(".cta-card-wrapp", {
          scale: 0,
          y: 100,
          opacity: 0,
          transformOrigin: "center center",
          willChange: "transform, opacity",
        }),
        ScrollTrigger.create({
          id: "ctaTrigger",
          trigger: ".cta-trigger-thumb",
          start: "top 80%",
          end: "top 50%",
          scrub: 1,
          markers: !1,
          animation: gsap.to(".cta-card-wrapp", {
            scale: 1,
            y: 0,
            opacity: 1,
            ease: "power1.out",
            duration: 1.5,
          }),
        }),
        ScrollTrigger.create({
          id: "ctaThumbTrigger",
          trigger: ".cta-trigger-thumb",
          start: "top 80%",
          end: "top 50%",
          scrub: 1,
          markers: !1,
          animation: gsap.to(".cta-trigger-thumb", {
            scale: 1,
            borderRadius: "0px",
            width: "100%",
            top: "0",
            ease: "linear",
          }),
        }));
    let o = ScrollTrigger.getById("videoTrigger");
    e
      ? o && o.kill()
      : o ||
        ScrollTrigger.create({
          id: "videoTrigger",
          trigger: ".video-trigger-thumb",
          start: "top 80%",
          end: "top 50%",
          scrub: 1,
          markers: !1,
          animation: gsap.to(".video-trigger-thumb", {
            duration: 2,
            scale: 1,
            borderRadius: "0px",
            width: "100%",
            top: "0",
            ease: "linear",
          }),
        });
  }
  if (
    (q.forEach((e) => {
      gsap.to(e, {
        scale: 1,
        duration: 1,
        ease: "power1.out",
        scrollTrigger: {
          trigger: e,
          start: "top bottom",
          end: "bottom top",
          toggleActions: "play reverse play reverse",
        },
      });
    }),
    L.forEach((e) => {
      (gsap.set(e, { scale: 1.3 }),
        gsap.to(e, {
          scale: 1,
          duration: 1,
          scrollTrigger: {
            trigger: e,
            start: "top bottom",
            end: "bottom top",
            toggleActions: "play reverse play reverse",
          },
        }));
    }),
    gsap.registerPlugin(ScrollTrigger),
    window.addEventListener("load", D),
    window.addEventListener("resize", D),
    e(".gallery-grid-row").length > 0)
  ) {
    const t = e(".gallery-grid-row"),
      o = t.find(".gallery-card");
    let a = [4, 3];
    function M(e = 0, t = 0, o = 0) {
      return {
        x: e ? gsap.utils.random(-e, e) : 0,
        y: t ? gsap.utils.random(-t, t) : 0,
        z: o ? gsap.utils.random(-o, o) : 0,
        rotateX: gsap.utils.random(-20, 20),
        rotateY: gsap.utils.random(-20, 20),
      };
    }
    if (
      ("undefined" != typeof l && l && (a = [3, 4]), window.innerWidth > 768)
    ) {
      gsap.set(t[0], { perspective: 1312 });
      gsap
        .timeline({
          defaults: { ease: "power4.out" },
          scrollTrigger: {
            trigger: t[0],
            start: "top 80%",
            end: "bottom 20%",
            scrub: 0.5,
          },
        })
        .fromTo(
          o.toArray(),
          {
            x: (e) => M(200, 200, 0).x,
            y: (e) => M(200, 200, 0).y,
            rotateX: (e) => M().rotateX,
            rotateY: (e) => M().rotateY,
            autoAlpha: 0,
            scale: 0.5,
          },
          {
            x: 0,
            y: 0,
            rotateX: 0,
            rotateY: 0,
            autoAlpha: 1,
            scale: 1,
            stagger: { amount: 0.3, from: "center", grid: a },
          },
        );
    } else
      gsap.set(o.toArray(), {
        clearProps: "all",
        autoAlpha: 1,
        scale: 1,
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
      });
  }
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".accordion-card").forEach((e) => {
      const t = e.querySelector(".box-img"),
        o = e.querySelector(".accordion-collapse");
      o &&
        t &&
        (o.addEventListener("show.bs.collapse", () => {
          t.style.display = "none";
        }),
        o.addEventListener("hide.bs.collapse", () => {
          t.style.display = "block";
        }));
    });
  });
  const I = window.innerWidth,
    _ = gsap.utils.toArray(".bounce_animation .bounce__anim");
  if (
    (_.length > 0 &&
      (gsap.set(_, { y: -100, opacity: 0 }),
      I < 1023
        ? _.forEach((e) => {
            gsap
              .timeline({
                scrollTrigger: { trigger: e, start: "top center+=200" },
              })
              .to(e, { y: 0, opacity: 1, ease: "bounce", duration: 1.5 });
          })
        : gsap.to(_, {
            scrollTrigger: {
              trigger: ".bounce_animation",
              start: "top center+=300",
            },
            y: 0,
            opacity: 1,
            ease: "bounce",
            duration: 1.5,
            stagger: { each: 0.3 },
          })),
    e(".anim-wrap").length > 0)
  ) {
    const t = function (t, o) {
      const a = new hoverEffect({
        parent: t.get(0),
        intensity: t.data("intensity") || 0.5,
        speedIn: t.data("speedin") || 1.2,
        speedOut: t.data("speedout") || 1.2,
        easing: t.data("easing") || "power2.out",
        displacementImage: t.data("displacement"),
        image1: o.eq(0).attr("src"),
        image2: o.eq(1).length ? o.eq(1).attr("src") : o.eq(0).attr("src"),
        hover: !1,
      });
      (o.css("opacity", 0),
        t
          .closest(".anim-wrap")
          .on("mouseenter", () => a.next())
          .on("mouseleave", () => a.previous()));
      const n = () => {
        const e = t.width(),
          o = t.height();
        if (
          (a.renderer && a.renderer.setSize(e, o),
          a.material &&
            a.material.uniforms.texture1.value &&
            a.material.uniforms.texture1.value.image)
        ) {
          const t = a.material.uniforms.texture1.value.image,
            n = t.width / t.height,
            s = e / o;
          s > n ? a.mesh.scale.set(s / n, 1, 1) : a.mesh.scale.set(1, n / s, 1);
        }
      };
      (n(), e(window).on("resize", n));
    };
    (function () {
      e(".img-anim").each(function () {
        const o = e(this),
          a = o.find("img"),
          n = a.eq(0);
        n[0].complete
          ? t(o, a)
          : n.on("load", function () {
              t(o, a);
            });
      });
    })();
  }
  (document.addEventListener("DOMContentLoaded", () => {
    const e = [
        "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)",
        "polygon(33.33% 0%, 33.33% 0%, 33.33% 0%, 33.33% 0%)",
        "polygon(65.66% 0%, 66.66% 0%, 66.66% 0%, 66.66% 0%)",
        "polygon(0% 33.33%, 0% 33.33%, 0% 33.33%, 0% 33.33%)",
        "polygon(33.33% 33.33%, 33.33% 33.33%, 33.33% 33.33%, 33.33% 33.33%)",
        "polygon(65.66% 33.33%, 66.66% 33.33%, 66.66% 33.33%, 66.66% 33.33%)",
        "polygon(0% 66.66%, 0% 66.66%, 0% 66.66%, 0% 66.66%)",
        "polygon(33.33% 66.66%, 33.33% 66.66%, 33.33% 66.66%, 33.33% 66.66%)",
        "polygon(65.66% 66.66%, 66.66% 66.66%, 66.66% 66.66%, 66.66% 66.66%)",
      ],
      t = [
        "polygon(0% 0%, 34.33% 0%, 34.33% 34.33%, 0% 34.33%)",
        "polygon(32.33% 0%, 66.66% 0%, 66.66% 33.33%, 33.33% 34.33%)",
        "polygon(65.66% 0%, 100% 0%, 100% 33.33%, 65.66% 34.33%)",
        "polygon(0% 33.33%, 33.33% 33.33%, 33.33% 66.66%, 0% 66.66%)",
        "polygon(30.33% 33.33%, 66.66% 33.33%, 66.66% 66.66%, 33.33% 66.66%)",
        "polygon(65.66% 33.33%, 100% 32.33%, 100% 66.66%, 65.66% 66.66%)",
        "polygon(0% 65.66%, 33.33% 66.66%, 33.33% 100%, 0% 100%)",
        "polygon(30.33% 66.66%, 66.66% 65.66%, 66.66% 100%, 33.33% 100%)",
        "polygon(65.66% 66.66%, 100% 65.66%, 100% 100%, 65.66% 100%)",
      ];
    (document.querySelectorAll(".th-clip-anim").forEach((e) => {
      const t = e.querySelector(".th-anim-img[data-animate='true']");
      if (!t) return;
      const o = t.src;
      e.querySelectorAll(".mask").forEach((e) => e.remove());
      for (let t = 0; t < 9; t++) {
        const a = document.createElement("div");
        ((a.className = "mask mask-" + (t + 1)),
          Object.assign(a.style, {
            backgroundImage: `url(${o})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "absolute",
            inset: "0",
          }),
          e.appendChild(a));
      }
    }),
      gsap.utils.toArray(".th-clip-anim").forEach((o) => {
        const a = o.querySelectorAll(".mask");
        if (!a.length) return;
        gsap.set(a, { clipPath: (t) => e[t] });
        const n = gsap.timeline({
          scrollTrigger: { trigger: o, start: "top 75%" },
        });
        [
          [".mask-1"],
          [".mask-2", ".mask-4"],
          [".mask-3", ".mask-5", ".mask-7"],
          [".mask-6", ".mask-8"],
          [".mask-9"],
        ].forEach((e, s) => {
          const r = e.map((e) => o.querySelector(e)).filter((e) => e);
          r.length &&
            n.to(
              r,
              {
                clipPath: (e, o) => t[Array.from(a).indexOf(o)],
                duration: 1,
                ease: "power4.out",
                stagger: 0.1,
              },
              0.125 * s,
            );
        });
      }));
  }),
    e(".th-ripples").ripples({
      resolution: 256,
      dropRadius: 20,
      perturbance: 0.02,
    }),
    window.addEventListener(
      "contextmenu",
      function (e) {
        e.preventDefault();
      },
      !1,
    ),
    (document.onkeydown = function (e) {
      return (
        123 != event.keyCode &&
        (!e.ctrlKey || !e.shiftKey || e.keyCode != "I".charCodeAt(0)) &&
        (!e.ctrlKey || !e.shiftKey || e.keyCode != "C".charCodeAt(0)) &&
        (!e.ctrlKey || !e.shiftKey || e.keyCode != "J".charCodeAt(0)) &&
        (!e.ctrlKey || e.keyCode != "U".charCodeAt(0)) &&
        void 0
      );
    }));
})(jQuery);


(function () {

  function init() {
    var overlay = document.getElementById("zmOverlay");
    if (!overlay) return;

    // move the modal to the end of <body> so no parent can clip it
    document.body.appendChild(overlay);

    var sheet = overlay.querySelector(".zm-sheet");
    var closeBtn = overlay.querySelector(".zm-close");
    var panels = overlay.querySelectorAll(".zm-panel");
    var WHATSAPP = overlay.getAttribute("data-whatsapp");

    var lastFocus = null;
    var prevOverflow = "";

    /* ---------- Open / close ---------- */
    function open(key, trigger) {
      var panel = overlay.querySelector('[data-zm-panel="' + key + '"]');
      if (!panel) return;

      lastFocus = trigger || document.activeElement;

      panels.forEach(function (p) { p.classList.remove("is-active"); });
      panel.classList.add("is-active");
      panel.querySelector(".zm-body").scrollTop = 0;
      sheet.setAttribute("aria-label", panel.querySelector(".zm-title").textContent.trim());

      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");

      // stop the page scrolling behind the sheet (restored on close)
      prevOverflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = "hidden";

      closeBtn.focus({ preventScroll: true });
    }

    function close() {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      document.documentElement.style.overflow = prevOverflow;
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    }

    closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });

    document.addEventListener("keydown", function (e) {
      if (!overlay.classList.contains("is-open")) return;
      if (e.key === "Escape") { close(); return; }
      if (e.key !== "Tab") return;

      var f = sheet.querySelectorAll(".zm-panel.is-active a[href], .zm-panel.is-active button, .zm-close");
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    /* ---------- Swipe down to close (handle + header) ---------- */
    var startY = 0, dy = 0, dragging = false;

    sheet.addEventListener("touchstart", function (e) {
      if (!e.target.closest(".zm-handle, .zm-head")) return;
      startY = e.touches[0].clientY;
      dy = 0;
      dragging = true;
      sheet.classList.add("is-dragging");
    }, { passive: true });

    sheet.addEventListener("touchmove", function (e) {
      if (!dragging) return;
      dy = Math.max(0, e.touches[0].clientY - startY);
      sheet.style.transform = "translateY(" + dy + "px)";
    }, { passive: true });

    sheet.addEventListener("touchend", function () {
      if (!dragging) return;
      dragging = false;
      sheet.classList.remove("is-dragging");
      sheet.style.transform = "";
      if (dy > 110) close();
    });

    /* ---------- WhatsApp booking (reads text from the card itself) ---------- */
    overlay.addEventListener("click", function (e) {
      var card = e.target.closest(".zm-card");
      if (!card) return;
      e.preventDefault();

      var title = card.querySelector(".zm-card__title");
      var duration = card.querySelector(".zm-card__time");
      var price = card.querySelector(".zm-card__price");
      var details = ["Service: " + (title ? title.textContent.trim() : "Selected service")];

      if (duration) details.push("Duration: " + duration.textContent.trim());
      if (price) details.push("Price: " + price.textContent.trim());

      var message =
        "Hello Zaya Beauty Lounge,\n\n" +
        "I would like to book the following service:\n\n" +
        details.join("\n") + "\n\n" +
        "Please let me know the available slots.\n" +
        "My preferred available time: ";

      window.open(
        "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(message),
        "_blank"
      );
    });

    /* ---------- Home page cards ---------- */
    document.querySelectorAll("[data-zm]").forEach(function (card) {
      var key = card.getAttribute("data-zm");

      var count = card.querySelector(".zm-count");
      if (count) {
        var n = overlay.querySelectorAll('[data-zm-panel="' + key + '"] .zm-card').length;
        if (n) count.textContent = n + " services";
      }

      card.addEventListener("click", function (e) {
        e.preventDefault();          // stops the inner link from navigating
        open(key, card);
      });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open(key, card);
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();

(function () {

  function init() {
    var dock = document.getElementById("znDock");   // bottom navbar
    var rail = document.getElementById("znRail");   // left Instagram / WhatsApp / Book Now
    if (!dock && !rail) return;

    var SHOW_AFTER = parseInt((dock || rail).getAttribute("data-show-after"), 10) || 100;

    var links = [];
    var spy = [];          // dock links that point to a #section on this page
    var pageIndex = -1;    // dock link that points to the current page
    var current = -2;

    /* ---------- Bottom dock setup ---------- */
    function setActive(i) {
      if (i === current) return;
      current = i;

      links.forEach(function (link, j) {
        var on = j === i;
        link.classList.toggle("is-active", on);
        if (on) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });

      if (i >= 0) {
        dock.style.setProperty("--zn-i", i);
        dock.classList.add("has-active");
      } else {
        dock.classList.remove("has-active");
      }
    }

    if (dock) {
      links = Array.prototype.slice.call(dock.querySelectorAll(".zn-link"));

      // the CSS lays out as many columns as there are links
      dock.style.setProperty("--zn-count", links.length);

      var here = location.pathname.split("/").pop() || "index.html";

      links.forEach(function (link, i) {
        var href = link.getAttribute("href") || "";
        var parts = href.split("#");
        var file = parts[0].split("?")[0].split("/").pop();
        var samePage = !file || file === here;

        if (parts[1] && samePage) {
          var el = document.getElementById(parts[1]);
          if (el) spy.push({ index: i, el: el, link: link });
        } else if (!parts[1] && file && file === here) {
          pageIndex = i;
        }
      });

      /* in-page #links scroll smoothly */
      spy.forEach(function (s) {
        s.link.addEventListener("click", function (e) {
          e.preventDefault();
          s.el.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });

      setActive(spy.length ? 0 : pageIndex);
    }

    /* ---------- Scroll: show/hide both + section spy ---------- */
    function update() {
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      var show = y > SHOW_AFTER;

      if (dock) dock.classList.toggle("is-visible", show);
      if (rail) rail.classList.toggle("is-visible", show);

      if (dock && spy.length) {
        var active = 0;                                  // Home by default
        spy.forEach(function (s) {
          if (s.el.getBoundingClientRect().top <= window.innerHeight * 0.4) active = s.index;
        });
        setActive(active);
      }
    }

    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        update();
        ticking = false;
      });
    }, { passive: true });
    window.addEventListener("resize", update);

    update();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();