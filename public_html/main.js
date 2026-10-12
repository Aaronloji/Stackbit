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
    var currentPath = location.pathname.split("/").pop() || "index.html";
    $$(".nav-link").forEach(function(a) {
      var href = a.getAttribute("href") || "";
      if (href === currentPath || (currentPath === "" && href === "index.html")) {
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

  /* ── Count-up numbers ────────────────────────────────── */
  function initCountUp() {
    var counters = $$("[data-count]");
    if (!counters.length) return;

    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var el     = e.target;
        var target = parseInt(el.getAttribute("data-count"), 10);
        var start  = 0;
        var dur    = reduced ? 0 : 1200;
        var startTime;

        if (dur === 0) { el.textContent = target; return; }

        function tick(now) {
          if (!startTime) startTime = now;
          var progress = Math.min((now - startTime) / dur, 1);
          var eased    = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(tick);
          else el.textContent = target;
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });

    counters.forEach(function(el) { io.observe(el); });
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
        items.forEach(function(i) { i.classList.remove("is-open"); });
        // Open this unless it was already open
        if (!isOpen) item.classList.add("is-open");
      });
    });
  }

  /* ── Contact Form (Formspree AJAX) ───────────────────── */
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

  /* ── Group Stagger (per-section, resets delay counter) ── */
  function initGroupStagger() {
    var groups = [
      ".services-grid",
      ".process-list",
      ".portfolio-grid",
      ".plans-grid",
      ".extras-grid",
      ".demos-grid"
    ];
    groups.forEach(function(sel) {
      var container = $(sel);
      if (!container) return;
      $$(".reveal", container).forEach(function(el, i) {
        el.style.transitionDelay = (i * 95) + "ms";
      });
    });
  }

  /* ── Portfolio hover (cursor glow on cards) ──────────── */
  function initPortfolioGlow() {
    if (!fineHover) return;
    $$(".portfolio-card").forEach(function(card) {
      // Skip placeholder cards that have no image section
      if (!card.querySelector(".portfolio-img")) return;
      card.addEventListener("mousemove", function(e) {
        var rect = card.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
        var y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
        // Use CSS variables so it adapts to dark/light mode automatically
        card.style.background =
          "radial-gradient(circle at " + x + "% " + y + "%, var(--accent-glow) 0%, var(--bg-card) 65%)";
      });
      card.addEventListener("mouseleave", function() {
        card.style.background = "";
      });
    });
  }

  /* ── Boot ─────────────────────────────────────────────── */
  function boot() {
    safe(initThemeToggle,    "initThemeToggle");
    safe(initNav,            "initNav");
    safe(initMouseGradient,  "initMouseGradient");
    safe(initReveals,        "initReveals");
    safe(initGroupStagger,   "initGroupStagger");
    safe(initCountUp,        "initCountUp");
    safe(initFaq,            "initFaq");
    safe(initPortfolioGlow,  "initPortfolioGlow");
    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

})();
