(function () {
  "use strict";

  /* ── Helpers ─────────────────────────────────────────── */
  var $  = function(sel, scope) { return (scope || document).querySelector(sel); };
  var $$ = function(sel, scope) { return Array.from((scope || document).querySelectorAll(sel)); };
  var reduced   = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fineHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
  function safe(fn, name) { try { fn(); } catch(e) { console.warn("[" + name + "]", e); } }

  /* ── Nav ─────────────────────────────────────────────── */
  function initNav() {
    var nav  = $(".nav");
    var ham  = $(".nav-hamburger");
    var menu = $(".mobile-menu");
    if (!nav) return;

    // Scroll solidify
    var onScroll = function() {
      nav.classList.toggle("is-scrolled", window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Mark active link
    var currentPath = location.pathname.replace(/\.html$/, "").replace(/\/$/, "");
    $$(".nav-link").forEach(function(a) {
      var href = (a.getAttribute("href") || "").replace(/\/$/, "");
      if (href === currentPath) {
        a.setAttribute("aria-current", "page");
      }
    });

    // Hamburger
    if (!ham || !menu) return;
    ham.addEventListener("click", function() {
      var open = ham.classList.toggle("is-open");
      ham.setAttribute("aria-expanded", open);
      if (open) {
        menu.removeAttribute("hidden");
        menu.style.display = "flex";
        document.body.style.overflow = "hidden";
      } else {
        menu.setAttribute("hidden", "");
        menu.style.display = "";
        document.body.style.overflow = "";
      }
    });

    // Close on link click
    $$(".mobile-menu a").forEach(function(a) {
      a.addEventListener("click", function() {
        ham.classList.remove("is-open");
        ham.setAttribute("aria-expanded", "false");
        menu.setAttribute("hidden", "");
        menu.style.display = "";
        document.body.style.overflow = "";
      });
    });

    // Close on Escape
    document.addEventListener("keydown", function(e) {
      if (e.key === "Escape" && ham.classList.contains("is-open")) {
        ham.click();
      }
    });
  }

  /* ── Mouse-reactive gradient ─────────────────────────── */
  function initMouseGradient() {
    var el = $("[data-mouse-gradient]");
    if (!el || !fineHover) return;

    var targetX = 30, targetY = 40;
    var currentX = 30, currentY = 40;
    var lerp = 0.07;

    document.addEventListener("mousemove", function(e) {
      targetX = (e.clientX / window.innerWidth)  * 100;
      targetY = (e.clientY / window.innerHeight) * 100;
    }, { passive: true });

    (function animate() {
      currentX += (targetX - currentX) * lerp;
      currentY += (targetY - currentY) * lerp;
      el.style.setProperty("--mx", currentX.toFixed(2) + "%");
      el.style.setProperty("--my", currentY.toFixed(2) + "%");
      requestAnimationFrame(animate);
    })();
  }

  /* ── Scroll Reveals (IntersectionObserver) ───────────── */
  function initReveals() {
    var items = $$(".reveal");
    if (!items.length) return;

    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -3% 0px" });

    items.forEach(function(el, i) {
      // Stagger via delay on transition
      el.style.transitionDelay = (i % 4) * 80 + "ms";
      io.observe(el);
    });

    // Safety: reveal anything still hidden after 6s.
    // Leer todas las posiciones ANTES de tocar clases: intercalar lectura y
    // escritura fuerza un reflow por elemento (forced reflow).
    setTimeout(function() {
      var pending = $$(".reveal:not(.is-visible)");
      if (!pending.length) return;
      var vh = window.innerHeight;
      var onscreen = pending.filter(function(el) {
        return el.getBoundingClientRect().top < vh;
      });
      onscreen.forEach(function(el) { el.classList.add("is-visible"); });
    }, 6000);
  }

  /* ── FAQ Accordion ───────────────────────────────────── */
  function initFaq() {
    var items = $$(".faq-item");
    if (!items.length) return;

    items.forEach(function(item) {
      var btn    = $(".faq-question", item);
      var answer = $(".faq-answer", item);
      if (!btn || !answer) return;

      btn.addEventListener("click", function() {
        var isOpen = item.classList.contains("is-open");
        // Close all
        items.forEach(function(i) {
          i.classList.remove("is-open");
          var b = $(".faq-question", i), a = $(".faq-answer", i);
          if (b) b.setAttribute("aria-expanded", "false");
          if (a) a.style.maxHeight = "";
        });
        // Open this unless it was already open (altura real: las respuestas largas no se cortan)
        if (!isOpen) {
          item.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
          answer.style.maxHeight = answer.scrollHeight + "px";
        }
      });
    });
  }

  /* ── Theme Toggle ────────────────────────────────────── */
  function initThemeToggle() {
    var btn = $(".theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", function() {
      var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("sb-theme", next); } catch(e) {}
    });
  }

  /* ── Language switch: recordar la elección para "/" ──── */
  function initLangSwitch() {
    $$(".lang-link").forEach(function(a) {
      a.addEventListener("click", function() {
        try { localStorage.setItem("sb-lang", a.getAttribute("data-lang")); } catch(e) {}
      });
    });
  }

  /* ── Group Stagger (per-section, resets delay counter) ── */
  function initGroupStagger() {
    $$(".services-grid, .process-list, .mini-grid, .bip-grid").forEach(function(container) {
      $$(".reveal", container).forEach(function(el, i) {
        el.style.transitionDelay = (i * 95) + "ms";
      });
    });
  }

  /* ── Scroll: barra de progreso y línea del proceso ───── */
  function initScrollEffects() {
    var bar   = $(".scroll-progress");
    var lists = $$(".process-list");
    if (!bar && !lists.length) return;
    var ticking = false;

    function update() {
      ticking = false;
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      if (bar) bar.style.setProperty("--p", max > 0 ? (window.scrollY / max).toFixed(4) : 0);

      var mark = window.innerHeight * 0.6;
      lists.forEach(function(list) {
        var r = list.getBoundingClientRect();
        var p = Math.min(Math.max((mark - r.top) / r.height, 0), 1);
        list.style.setProperty("--pp", p.toFixed(4));
        $$(".process-step", list).forEach(function(step) {
          step.classList.toggle("is-active", step.getBoundingClientRect().top + 40 < mark);
        });
      });
    }
    window.addEventListener("scroll", function() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
  }

  /* ── Tarjetas: foco de luz + inclinación 3D ──────────── */
  function initCardEffects() {
    if (!fineHover) return;
    $$(".service-card, .sector-tile").forEach(function(card) {
      card.addEventListener("mousemove", function(e) {
        var r = card.getBoundingClientRect();
        var x = e.clientX - r.left, y = e.clientY - r.top;
        card.style.setProperty("--sx", x + "px");
        card.style.setProperty("--sy", y + "px");
        if (reduced || !card.classList.contains("service-card")) return;
        card.classList.add("is-tilting");
        card.style.setProperty("--ry", ((x / r.width - 0.5) * 6).toFixed(2) + "deg");
        card.style.setProperty("--rx", ((0.5 - y / r.height) * 6).toFixed(2) + "deg");
      });
      card.addEventListener("mouseleave", function() {
        card.classList.remove("is-tilting");
        card.style.setProperty("--sx", "-500px");
        card.style.setProperty("--sy", "-500px");
      });
    });
  }

  /* ── Botones magnéticos (hero y CTA) ─────────────────── */
  function initMagnetic() {
    if (!fineHover || reduced) return;
    $$(".hero-actions .btn, .cta-band-actions .btn, .btn-nav").forEach(function(btn) {
      btn.addEventListener("mousemove", function(e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.18;
        var y = (e.clientY - r.top - r.height / 2) * 0.28;
        btn.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
      });
      btn.addEventListener("mouseleave", function() { btn.style.transform = ""; });
    });
  }

  /* ── Transición entre páginas (cortina) ──────────────── */
  function initPageTransitions() {
    var curtain = $(".page-curtain");
    if (!curtain || reduced) return;

    document.addEventListener("click", function(e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest ? e.target.closest("a") : null;
      if (!a || !a.href || a.target === "_blank" || a.hasAttribute("download")) return;
      var url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      // Ancla dentro de la misma página: scroll normal, sin cortina
      if (url.pathname === location.pathname && url.search === location.search && url.hash) return;
      e.preventDefault();
      try { sessionStorage.setItem("sb-pt", "1"); } catch(err) {}
      curtain.classList.add("is-leaving");
      setTimeout(function() { location.href = url.href; }, 560);
    });

    // Al volver con "atrás" el navegador puede restaurar la página con la cortina cerrada
    window.addEventListener("pageshow", function(e) {
      if (e.persisted) curtain.classList.remove("is-leaving");
    });
  }

  /* ── Boot ─────────────────────────────────────────────── */
  function boot() {
    safe(initThemeToggle,    "initThemeToggle");
    safe(initNav,            "initNav");
    safe(initLangSwitch,     "initLangSwitch");
    safe(initMouseGradient,  "initMouseGradient");
    safe(initReveals,        "initReveals");
    safe(initGroupStagger,   "initGroupStagger");
    safe(initFaq,            "initFaq");
    safe(initScrollEffects,  "initScrollEffects");
    safe(initCardEffects,    "initCardEffects");
    safe(initMagnetic,       "initMagnetic");
    safe(initPageTransitions, "initPageTransitions");
    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

})();
