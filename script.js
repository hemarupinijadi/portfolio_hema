/* ==============================
   PORTFOLIO — script.js
   ============================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ——— Custom Cursor ——— */
  const cursor         = document.getElementById('cursor');
  const cursorFollower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  /* Smooth follower via rAF */
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.14;
    followerY += (mouseY - followerY) * 0.14;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  /* Cursor hover states */
  const hoverTargets = document.querySelectorAll('a, button, input, textarea, .skill-item, .info-card, .project-card, .contact-item');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('active');
      cursorFollower.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('active');
      cursorFollower.classList.remove('active');
    });
  });

  /* Hide cursor when leaving window */
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorFollower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorFollower.style.opacity = '1';
  });


  /* ——— Navigation: scroll styling ——— */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });


  /* ——— Mobile hamburger ——— */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  /* Close on link click */
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });


  /* ——— Smooth scroll for all anchor links ——— */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 68; // nav height
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ——— Scroll Reveal (IntersectionObserver) ——— */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach(el => revealObserver.observe(el));


  /* ——— Skill items stagger on group hover ——— */
  document.querySelectorAll('.skill-group').forEach(group => {
    const items = group.querySelectorAll('.skill-item');
    group.addEventListener('mouseenter', () => {
      items.forEach((item, i) => {
        item.style.transitionDelay = `${i * 40}ms`;
        item.style.borderColor     = 'rgba(56,189,248,0.2)';
        item.style.color           = 'var(--text)';
      });
    });
    group.addEventListener('mouseleave', () => {
      items.forEach(item => {
        item.style.transitionDelay = '';
        item.style.borderColor     = '';
        item.style.color           = '';
      });
    });
  });


  /* ——— Contact Form ——— */
  const form        = document.getElementById('contactForm');
  const successMsg  = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const name    = form.querySelector('#name').value.trim();
      const email   = form.querySelector('#email').value.trim();
      const message = form.querySelector('#message').value.trim();

      if (!name || !email || !message) {
        shakeForm(form);
        return;
      }

      /* Simulate send */
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Sending…';
      btn.disabled    = true;

      setTimeout(() => {
        btn.textContent = '✓ Sent!';
        successMsg.classList.add('show');
        form.reset();
        setTimeout(() => {
          btn.innerHTML  = '<i class="fas fa-paper-plane"></i> Send Message';
          btn.disabled   = false;
          successMsg.classList.remove('show');
        }, 4000);
      }, 1200);
    });
  }

  function shakeForm(el) {
    el.style.animation = 'none';
    el.offsetHeight; /* reflow */
    el.style.animation = 'shake 0.4s ease';
    el.addEventListener('animationend', () => el.style.animation = '', { once: true });
  }

  /* Inject shake keyframes */
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-8px); }
      40%      { transform: translateX(8px); }
      60%      { transform: translateX(-5px); }
      80%      { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(shakeStyle);


  /* ——— Parallax orbs on hero ——— */
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');

  window.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    if (orb1) orb1.style.transform = `translate(${dx * 20}px, ${dy * 20}px)`;
    if (orb2) orb2.style.transform = `translate(${-dx * 20}px, ${-dy * 20}px)`;
  });


  /* ——— Active nav link on scroll ——— */
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          link.style.setProperty('--tw', '0%');
        });
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.style.color = 'var(--sky)';
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));


  /* ——— Hero typing text effect ——— */
  const titleEl = document.querySelector('.hero-title');
  if (titleEl) {
    const words = ['Full Stack Developer', 'Problem Solver', 'Open to Internships'];
    let wIdx = 0, cIdx = 0, deleting = false;
    let wait = false;

    function typeEffect() {
      if (wait) return;

      const current = words[wIdx];
      if (!deleting) {
        titleEl.textContent = current.slice(0, cIdx + 1);
        cIdx++;
        if (cIdx === current.length) {
          wait = true;
          setTimeout(() => { deleting = true; wait = false; }, 2000);
        }
      } else {
        titleEl.textContent = current.slice(0, cIdx - 1);
        cIdx--;
        if (cIdx === 0) {
          deleting = false;
          wIdx = (wIdx + 1) % words.length;
        }
      }
    }

    setInterval(typeEffect, deleting ? 60 : 90);
    /* overrides on scroll: just initial display */
  }


  /* ——— Scroll-triggered counter for stats (future use) ——— */

  console.log('%c🚀 Portfolio — Jadi Hemarupini', 'font-size:18px;font-weight:bold;background:linear-gradient(135deg,#38BDF8,#F9A8D4);-webkit-background-clip:text;color:transparent;padding:4px 0');
  console.log('%cBuilt with ❤️ | Open to Internships', 'color:#94A3B8;font-size:12px');

});
