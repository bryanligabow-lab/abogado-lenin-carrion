/* ============================================
   AB. LENIN CARRION — V2 ANIMATIONS
   Uses IntersectionObserver for reveals (reliable)
   + GSAP for hero entrance & polish
   ============================================ */
gsap.registerPlugin(ScrollTrigger);

// ===== PRELOADER =====
(function(){
  const bar = document.querySelector('.preloader-bar');
  const loader = document.getElementById('preloader');
  if (!bar || !loader) { init(); return; }

  gsap.to(bar, {
    width: '100%',
    duration: 1.2,
    ease: 'power2.inOut',
    onComplete() {
      gsap.to(loader, { opacity: 0, duration: 0.35, onComplete() { loader.style.display='none'; init(); } });
    }
  });
  setTimeout(() => { if(loader.style.display!=='none'){ loader.style.display='none'; init(); } }, 3000);
})();

function init() {
  heroEntrance();
  setupRevealObserver();
  setupNavbar();
  setupSmoothScroll();
  setupForm();
  setupWhatsApp();
}

// ===== HERO ENTRANCE (GSAP) =====
function heroEntrance() {
  // Elements start hidden via CSS opacity:0, GSAP reveals them (no flash)
  const tl = gsap.timeline({ defaults: { ease:'power2.out' } });

  tl.to('.hero-portrait',          { opacity:1, scale:1, duration:.9, ease:'elastic.out(1,0.6)' }, .2)
    .to('.hero-label',             { opacity:1, y:0, duration:.7 }, .6)
    .to('.hero-title span',        { opacity:1, y:0, duration:1, stagger:.12, ease:'power3.out' }, .7)
    .to('.hero-bar',               { opacity:1, scaleX:1, duration:.6, ease:'power2.inOut' }, 1.2)
    .to('.hero-desc',              { opacity:1, y:0, duration:.7 }, 1.4)
    .to('.hero-actions',           { opacity:1, y:0, duration:.6 }, 1.6)
    .to('.hero-badges',            { opacity:1, y:0, duration:.6 }, 1.8)
    .to('.hero-scroll',            { opacity:1, duration:.8 }, 2.1)
    .from('.wa-float',             { scale:0, duration:.5, ease:'back.out(2.5)' }, 2);

  // Video section reveal
  gsap.from('.video-wrap', {
    scrollTrigger: { trigger:'.video-section', start:'top 75%' },
    y:40, opacity:0, duration:1, ease:'power3.out'
  });

  // Badge counter animation
  document.querySelectorAll('.badge strong').forEach(el => {
    const text = el.textContent;
    const num = parseInt(text);
    if (isNaN(num)) return;
    const suffix = text.replace(String(num), '');
    const obj = { val: 0 };
    gsap.to(obj, {
      val: num, duration: 2.2, delay: 1, ease: 'power2.out',
      onUpdate() { el.textContent = Math.round(obj.val) + suffix; }
    });
  });
}

// ===== INTERSECTION OBSERVER REVEAL SYSTEM =====
function setupRevealObserver() {
  // Auto-tag elements that should reveal on scroll
  const selectors = [
    '.about-photo-main', '.about-photo-secondary',
    '.about-text .section-tag', '.about-text .section-heading',
    '.about-text p', '.about-signature',
    '.section-header .section-tag', '.section-header .section-heading',
    '.featured-card',
    '.service-row',
    '.cv-left > *', '.cv-item',
    '.gallery-strip-item',
    '.consult-info > *', '.consult-form-wrap',
    '.contact-row', '.contact-cta-box',
    '.consult-photo',
    '.footer-inner'
  ];

  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
        // Stagger delay within groups
        if (i > 0 && i < 6) el.classList.add('reveal-delay-' + Math.min(i, 4));
      }
    });
  });

  // Special directional reveals
  document.querySelectorAll('.about-photo-main').forEach(el => el.classList.add('reveal-left'));
  document.querySelectorAll('.about-photo-secondary').forEach(el => el.classList.add('reveal-right'));
  document.querySelectorAll('.consult-form-wrap').forEach(el => el.classList.add('reveal-right'));
  document.querySelectorAll('.gallery-strip-item').forEach(el => { el.classList.remove('reveal'); el.classList.add('reveal', 'reveal-scale'); });

  // Create observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Gallery image parallax (GSAP scrub - pure enhancement, no opacity change)
  gsap.utils.toArray('.gallery-strip-item img').forEach(img => {
    gsap.to(img, {
      scrollTrigger: { trigger:img, start:'top bottom', end:'bottom top', scrub:1.5 },
      y:-25, ease:'none'
    });
  });
}

// ===== NAVBAR =====
function setupNavbar() {
  const header = document.getElementById('header');
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  });

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      nav.classList.toggle('active');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      toggle.classList.remove('active');
      nav.classList.remove('active');
    }));
  }
}

// ===== SMOOTH SCROLL =====
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const t = document.querySelector(a.getAttribute('href'));
      if (t) {
        const offset = 70;
        const y = t.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });
}

// ===== FORM STEPS =====
function setupForm() {
  window.nextStep = function(step) {
    if (step === 2) {
      const n = document.getElementById('wa_nombre');
      if (n && !n.value.trim()) {
        n.style.borderColor = '#b8952e';
        n.focus();
        gsap.fromTo(n, {x:-6}, {x:0, duration:.4, ease:'elastic.out(1,.3)'});
        return;
      }
    }
    if (step === 3) {
      const s = document.querySelector('input[name="wa_servicio"]:checked');
      if (!s) {
        gsap.fromTo('.radio-group', {x:-6}, {x:0, duration:.4, ease:'elastic.out(1,.3)'});
        return;
      }
    }
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    const target = document.querySelector(`[data-step="${step}"]`);
    if (target) target.classList.add('active');
    const bar = document.getElementById('formProgress');
    if (bar) bar.style.width = (step / 3 * 100) + '%';
  };
}

// ===== WHATSAPP SUBMIT =====
function setupWhatsApp() {
  document.getElementById('consultaForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const nombre = document.getElementById('wa_nombre')?.value || '';
    const telefono = document.getElementById('wa_telefono')?.value || '';
    const servicio = document.querySelector('input[name="wa_servicio"]:checked')?.value || '';
    const mensaje = document.getElementById('wa_mensaje')?.value || '';
    let text = `Hola Ab. Lenin Carrión, soy *${nombre}*.`;
    if (telefono) text += `\nTelefono: ${telefono}`;
    if (servicio) text += `\nNecesito ayuda con: *${servicio}*`;
    if (mensaje) text += `\n\nDetalle: ${mensaje}`;
    window.open(`https://wa.me/593988489037?text=${encodeURIComponent(text)}`, '_blank');
  });
}
