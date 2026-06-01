/**
 * POLIUREX — Main JavaScript
 * Custom cursor · Nav scroll · Mobile menu · Reveal animations
 * Counter animations · Form → WhatsApp submission
 */
;(function () {
  'use strict';

  /* ────────────────────────────────────────────
     1. CUSTOM CURSOR
     ──────────────────────────────────────────── */
  var cursor   = document.getElementById('cursor');
  var follower = document.getElementById('cursor-follower');
  var hasHover = window.matchMedia('(hover: hover)').matches;

  if (cursor && follower && hasHover) {
    var cx = -100, cy = -100;
    var fx = -100, fy = -100;

    document.addEventListener('mousemove', function (e) {
      cx = e.clientX;
      cy = e.clientY;
      // Dot follows instantly
      cursor.style.left = cx + 'px';
      cursor.style.top  = cy + 'px';
    });

    // Follower lerps toward cursor
    (function followLoop() {
      fx += (cx - fx) * 0.11;
      fy += (cy - fy) * 0.11;
      follower.style.left = fx + 'px';
      follower.style.top  = fy + 'px';
      requestAnimationFrame(followLoop);
    })();

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', function () {
      cursor.style.opacity   = '0';
      follower.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function () {
      cursor.style.opacity   = '1';
      follower.style.opacity = '1';
    });
  }

  /* ────────────────────────────────────────────
     2. NAV — scroll state
     ──────────────────────────────────────────── */
  var nav = document.getElementById('nav');

  function handleNavScroll() {
    if (window.scrollY > 40) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ────────────────────────────────────────────
     3. MOBILE MENU
     ──────────────────────────────────────────── */
  var hamburger  = document.getElementById('nav-hamburger');
  var mobileMenu = document.getElementById('nav-mobile');

  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('is-open');
      hamburger.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    });

    // Close on any link click
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target)) closeMenu();
    });
  }

  /* ────────────────────────────────────────────
     4. SCROLL REVEAL — IntersectionObserver
     ──────────────────────────────────────────── */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    // Fallback: show all immediately
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ────────────────────────────────────────────
     5. COUNTER ANIMATIONS
     ──────────────────────────────────────────── */
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target) || target === 0) return;  // stay at 0 if target is 0

    var duration = 1500;
    var start    = performance.now();
    var from     = 0;

    function tick(now) {
      var elapsed  = now - start;
      var progress = Math.min(elapsed / duration, 1);
      var value    = Math.round(easeOutCubic(progress) * target);
      el.textContent = value;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(tick);
  }

  var counterEls = document.querySelectorAll('.stat__num[data-count]');

  if ('IntersectionObserver' in window && counterEls.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    counterEls.forEach(function (el) { cio.observe(el); });
  }

  /* ────────────────────────────────────────────
     6. FORM → WHATSAPP SUBMISSION
     ──────────────────────────────────────────── */
  var form    = document.getElementById('hero-form');
  var success = document.getElementById('form-success');
  var submit  = document.getElementById('form-submit');

  if (form && success) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Honeypot check — abandon silently if filled
      var honey = form.querySelector('[name="_honey"]');
      if (honey && honey.value) return;

      // Simple required-field check with visual feedback
      var requiredFields = form.querySelectorAll('[required]');
      var valid = true;

      requiredFields.forEach(function (field) {
        field.classList.remove('error');
        if (!field.value || field.value.trim() === '') {
          field.classList.add('error');
          valid = false;
        }
      });

      if (!valid) {
        // Shake the submit button
        submit.style.animation = 'none';
        submit.offsetHeight; // reflow
        submit.style.animation = 'shake 0.4s ease';
        return;
      }

      // Gather values
      var nombre     = (document.getElementById('nombre')?.value     || '').trim();
      var empresa    = (document.getElementById('empresa')?.value    || '').trim();
      var cargo      = (document.getElementById('cargo')?.value      || '').trim();
      var telefono   = (document.getElementById('telefono')?.value   || '').trim();
      var superficie = (document.getElementById('superficie')?.value || '').trim();
      var metros     = (document.getElementById('metros')?.value     || '').trim();

      // Build WhatsApp message
      var lines = [
        '📋 *Solicitud de diagnóstico técnico — POLIUREX*',
        '',
        '👤 *Nombre:* '        + (nombre     || '—'),
        '🏢 *Empresa:* '       + (empresa    || '—'),
        '💼 *Cargo:* '         + (cargo      || '—'),
        '📞 *Teléfono:* '      + (telefono   || '—'),
        '🏗️ *Superficie:* '    + (superficie || '—'),
      ];

      if (metros) {
        lines.push('📐 *Metros cuadrados:* ' + metros + ' m²');
      }

      var msg = lines.join('\n');
      var waURL = 'https://wa.me/573115572571?text=' + encodeURIComponent(msg);

      // Transition to success state
      form.style.transition = 'opacity 0.3s ease';
      form.style.opacity    = '0';

      setTimeout(function () {
        form.style.display = 'none';
        success.classList.add('is-active');

        // Open WhatsApp tab
        setTimeout(function () {
          window.open(waURL, '_blank', 'noopener,noreferrer');
        }, 400);
      }, 300);
    });

    // Remove error state on input
    form.querySelectorAll('.form__input, .form__select').forEach(function (el) {
      el.addEventListener('input', function () { this.classList.remove('error'); });
    });
  }

  /* ────────────────────────────────────────────
     7. SMOOTH ANCHOR SCROLL
     ──────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id     = this.getAttribute('href');
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();

      var offset = 80; // account for fixed nav height
      var top    = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ────────────────────────────────────────────
     8. INJECT SHAKE KEYFRAME (for form error)
     ──────────────────────────────────────────── */
  var shakeStyle = document.createElement('style');
  shakeStyle.textContent = [
    '@keyframes shake {',
    '  0%,100%{transform:translateX(0)}',
    '  20%{transform:translateX(-5px)}',
    '  40%{transform:translateX(5px)}',
    '  60%{transform:translateX(-4px)}',
    '  80%{transform:translateX(3px)}',
    '}'
  ].join('');
  document.head.appendChild(shakeStyle);

})();
