/* =========================================================
   KAYZAD ADVERTISING – MAIN JAVASCRIPT
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll effect ────────────────────────────
  const navbar = document.getElementById('navbar');
  const stickyCta = document.querySelector('.sticky-cta-bar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    if (scrollY > 400) {
      stickyCta && stickyCta.classList.add('visible');
    } else {
      stickyCta && stickyCta.classList.remove('visible');
    }
    lastScroll = scrollY;
  });

  // ── Mobile menu ──────────────────────────────────────
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileClose = document.querySelector('.mobile-nav-close');

  hamburger?.addEventListener('click', () => {
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  const closeMobile = () => {
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  };

  mobileClose?.addEventListener('click', closeMobile);
  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobile));

  // ── Scroll Reveal ────────────────────────────────────
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));

  // ── Counter animation ────────────────────────────────
  const counters = document.querySelectorAll('[data-counter]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.done) {
        entry.target.dataset.done = 'true';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseFloat(el.dataset.counter);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 2000;
    const start = performance.now();

    function update(time) {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;

      if (Number.isInteger(target)) {
        el.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
      } else {
        el.textContent = prefix + current.toFixed(1) + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = prefix + (Number.isInteger(target) ? target.toLocaleString() : target) + suffix;
      }
    }
    requestAnimationFrame(update);
  }

  // ── Testimonial Carousel ─────────────────────────────
  const track = document.querySelector('.testimonials-track');
  const cards = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.carousel-dot');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');

  let currentSlide = 0;
  let carouselInterval;
  const visibleCards = () => window.innerWidth < 768 ? 1 : window.innerWidth < 1100 ? 2 : 3;

  function goToSlide(idx) {
    const visible = visibleCards();
    const max = Math.max(0, cards.length - visible);
    currentSlide = Math.max(0, Math.min(idx, max));

    const cardWidth = cards[0]?.offsetWidth + 24;
    track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;

    cards.forEach((c, i) => c.classList.toggle('active', i === currentSlide));
    dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }

  prevBtn?.addEventListener('click', () => {
    clearInterval(carouselInterval);
    goToSlide(currentSlide - 1);
    startCarousel();
  });

  nextBtn?.addEventListener('click', () => {
    clearInterval(carouselInterval);
    const visible = visibleCards();
    const max = Math.max(0, cards.length - visible);
    goToSlide(currentSlide + 1 > max ? 0 : currentSlide + 1);
    startCarousel();
  });

  dots.forEach((dot, i) => dot.addEventListener('click', () => {
    clearInterval(carouselInterval);
    goToSlide(i);
    startCarousel();
  }));

  function startCarousel() {
    carouselInterval = setInterval(() => {
      const visible = visibleCards();
      const max = Math.max(0, cards.length - visible);
      goToSlide(currentSlide + 1 > max ? 0 : currentSlide + 1);
    }, 4500);
  }

  if (cards.length > 0) { startCarousel(); }

  window.addEventListener('resize', () => goToSlide(currentSlide));

  // ── Particle System (Hero) ───────────────────────────
  const heroParticles = document.querySelector('.hero-particles');
  if (heroParticles) {
    for (let i = 0; i < 30; i++) {
      createParticle(heroParticles);
    }
  }

  function createParticle(container) {
    const el = document.createElement('div');
    el.className = 'particle';
    const size = Math.random() * 4 + 1;
    const x = Math.random() * 100;
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 20;
    const opacity = Math.random() * 0.5 + 0.1;

    const colors = ['rgba(37,99,235,0.6)', 'rgba(96,165,250,0.5)', 'rgba(124,58,237,0.4)'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    el.style.cssText = `
      left: ${x}%;
      bottom: -10px;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      box-shadow: 0 0 ${size * 2}px ${color};
    `;
    container.appendChild(el);
  }

  // ── Exit Intent Popup ────────────────────────────────
  const popup = document.querySelector('.popup-overlay');
  const popupClose = document.querySelector('.popup-close');
  let popupShown = false;

  document.addEventListener('mouseleave', (e) => {
    if (e.clientY <= 0 && !popupShown && !sessionStorage.getItem('popup-closed')) {
      setTimeout(() => {
        popup?.classList.add('open');
        popupShown = true;
      }, 300);
    }
  });

  popupClose?.addEventListener('click', () => {
    popup.classList.remove('open');
    sessionStorage.setItem('popup-closed', '1');
  });

  popup?.addEventListener('click', (e) => {
    if (e.target === popup) {
      popup.classList.remove('open');
      sessionStorage.setItem('popup-closed', '1');
    }
  });

  // ── Smooth scroll for nav links ──────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        window.scrollTo({
          top: target.offsetTop - offset,
          behavior: 'smooth'
        });
      }
    });
  });

  // ── Active nav link highlighting ─────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinksAll.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

  // ── Form handling ────────────────────────────────────
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const original = btn.textContent;
      btn.textContent = '✓ Sent! We\'ll contact you shortly.';
      btn.style.background = 'linear-gradient(135deg, #22C55E, #16A34A)';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 4000);
    });
  });

  // ── Blog Category Filter ─────────────────────────────
  const catBtns = document.querySelectorAll('.cat-btn');
  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // ── Typewriter effect for hero ───────────────────────
  const typeTarget = document.querySelector('.type-text');
  if (typeTarget) {
    const words = ['Growth', 'Success', 'Results', 'Revenue', 'Impact'];
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeWriter() {
      const word = words[wordIndex];
      if (deleting) {
        typeTarget.textContent = word.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typeTarget.textContent = word.substring(0, charIndex + 1);
        charIndex++;
      }

      if (!deleting && charIndex === word.length) {
        deleting = true;
        setTimeout(typeWriter, 1800);
      } else if (deleting && charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(typeWriter, 400);
      } else {
        setTimeout(typeWriter, deleting ? 60 : 90);
      }
    }
    typeWriter();
  }

  // ── Scroll to Top Button ─────────────────────────────
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ── Initialize first state ───────────────────────────
  goToSlide(0);
});
