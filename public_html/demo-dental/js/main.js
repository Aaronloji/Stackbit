/* ============================================================
   Clínica Dental Áurea — demo Stackbit
   CONFIGURACIÓN: cambie solo estas dos líneas por cliente.
   ============================================================ */

const WHATSAPP = '50672849920';          // Número que recibe la reserva. Formato: 506 + número, sin espacios ni +
const NOMBRE_CLINICA = 'Clínica Dental Áurea';

/* Si el cliente YA usa un sistema de citas (Fresha, Booksy, HuliHealth,
   Agenda Pro, Doctoralia…), ponga aquí la URL de su agenda.
   Al hacerlo, el botón "Reservar cita" abre ese sistema en vez del
   formulario de WhatsApp — sin tocar nada más del sitio.            */
const AGENDA_EXTERNA = '';               // ej. 'https://www.fresha.com/es/book-now/...'

/* Número de Stackbit para el botón "Quiero la mía" de la sección pitch.
   Este NO cambia por cliente: es el contacto de Stackbit, no el de la clínica.
   Esa sección se elimina de todos modos al entregar el sitio final. */
const WHATSAPP_STACKBIT = '50672849920';

/* ============================================================ */

(function () {
  'use strict';

  // --- Revelado al hacer scroll ---
  var revealEls = document.querySelectorAll(
    '.section__head, .split__copy, .photo, .card, .quote, .steps li, ' +
    '.faq details, .pitch__inner, .cta__inner, .split--even > div, .strip__grid > div'
  );
  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // --- Sombra del header al hacer scroll ---
  var header = document.querySelector('.site-header');
  if (header) {
    var syncHeaderShadow = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 10);
    };
    syncHeaderShadow();
    window.addEventListener('scroll', syncHeaderShadow, { passive: true });
  }

  // --- Contador animado (4.9 / +12 del hero) ---
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) {
    document.querySelectorAll('[data-count]').forEach(function (el) {
      var raw = el.getAttribute('data-count');
      var target = parseFloat(raw);
      if (isNaN(target)) return;
      var decimals = (raw.split('.')[1] || '').length;
      var prefix = el.getAttribute('data-prefix') || '';
      var duration = 900;
      var start = null;
      function tick(now) {
        if (start === null) start = now;
        var p = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + (target * eased).toFixed(decimals);
        if (p < 1) requestAnimationFrame(tick);
      }
      setTimeout(function () {
        el.textContent = prefix + (0).toFixed(decimals);
        requestAnimationFrame(tick);
      }, 500);
    });
  }

  // --- Botón "Quiero la mía" (nota para quien recibe la demo) ---
  const pitchLink = document.getElementById('pitch-whatsapp');
  if (pitchLink) {
    const msg = 'Hola, vi la demo de ' + NOMBRE_CLINICA + ' de Stackbit y quiero una página así para mi clínica.';
    pitchLink.href = 'https://wa.me/' + WHATSAPP_STACKBIT + '?text=' + encodeURIComponent(msg);
  }

  // --- Año del footer ---
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // --- Menú móvil ---
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      const open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- Modal de reserva ---
  const modal = document.getElementById('booking');
  const form = document.getElementById('booking-form');
  let lastFocused = null;

  function openBooking(e) {
    if (e) e.preventDefault();

    // Si hay agenda externa configurada, se abre esa y no el formulario.
    if (AGENDA_EXTERNA) {
      window.open(AGENDA_EXTERNA, '_blank', 'noopener');
      return;
    }

    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    const first = modal.querySelector('select, input');
    if (first) first.focus();
  }

  function closeBooking() {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('[data-open-booking]').forEach(function (el) {
    el.addEventListener('click', openBooking);
  });
  document.querySelectorAll('[data-close-booking]').forEach(function (el) {
    el.addEventListener('click', closeBooking);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && !modal.hidden) closeBooking();
  });

  // --- Fecha mínima: hoy ---
  const dia = form ? form.querySelector('input[name="dia"]') : null;
  if (dia) {
    const hoy = new Date();
    const off = hoy.getTimezoneOffset() * 60000;
    dia.min = new Date(hoy - off).toISOString().slice(0, 10);
  }

  // --- Envío: arma el mensaje y abre WhatsApp ---
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const d = new FormData(form);

      let fecha = d.get('dia');
      try {
        const p = String(fecha).split('-');
        fecha = new Date(p[0], p[1] - 1, p[2]).toLocaleDateString('es-CR', {
          weekday: 'long', day: 'numeric', month: 'long'
        });
      } catch (err) { /* se deja la fecha tal cual */ }

      const texto =
        'Hola, quiero reservar una cita en ' + NOMBRE_CLINICA + '.\n\n' +
        'Tratamiento: ' + d.get('tratamiento') + '\n' +
        'Día: ' + fecha + '\n' +
        'Hora: ' + d.get('hora') + '\n' +
        'Nombre: ' + d.get('nombre') + '\n' +
        'Teléfono: ' + d.get('telefono');

      window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texto), '_blank', 'noopener');
      closeBooking();
      form.reset();
    });
  }
})();
