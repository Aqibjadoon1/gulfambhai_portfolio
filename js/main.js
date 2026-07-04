const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReduced) {
  initCustomCursor();
  initParticles();
  initScrollReveal();
  initNavbar();
}

function initCustomCursor() {
  const cursor = document.createElement('div');
  const follower = document.createElement('div');
  cursor.className = 'custom-cursor';
  follower.className = 'cursor-follower';
  document.body.appendChild(cursor);
  document.body.appendChild(follower);

  const style = document.createElement('style');
  style.textContent = `
    .custom-cursor {
      width: 12px; height: 12px;
      background: var(--accent-red);
      border-radius: 50%;
      position: fixed;
      pointer-events: none;
      z-index: 99999;
      box-shadow: 0 0 10px var(--accent-red), 0 0 20px var(--accent-red);
      transform: translate(-50%, -50%);
      transition: width 0.15s, height 0.15s, background 0.15s;
    }
    .cursor-follower {
      width: 36px; height: 36px;
      border: 1px solid var(--accent-red);
      border-radius: 50%;
      position: fixed;
      pointer-events: none;
      z-index: 99998;
      transform: translate(-50%, -50%);
      transition: all 0.12s ease;
      opacity: 0.4;
    }
    .custom-cursor.hover {
      width: 22px; height: 22px;
      background: var(--accent-green);
      box-shadow: 0 0 15px var(--accent-green), 0 0 30px var(--accent-green);
    }
    .cursor-follower.hover {
      width: 50px; height: 50px;
      border-color: var(--accent-green);
      opacity: 0.25;
    }
  `;
  document.head.appendChild(style);

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  document.querySelectorAll('a, button, .glass-card, .btn-figma, [data-cursor]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      follower.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      follower.classList.remove('hover');
    });
  });
}

function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.className = 'particles-canvas';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouseX = 0, mouseY = 0;

  canvas.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.5 + 0.8;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.4 + 0.08;
      this.hue = Math.random() > 0.6 ? 0 : 120;
      this.sat = Math.random() > 0.6 ? 80 : 60;
    }
    update() {
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 200) {
        const force = (200 - dist) / 200 * 0.02;
        this.speedX -= dx * force;
        this.speedY -= dy * force;
      }

      this.speedX *= 0.98;
      this.speedY *= 0.98;
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, ${this.sat}%, 55%, ${this.opacity})`;
      ctx.fill();
    }
  }

  const particleCount = Math.min(60, Math.floor(window.innerWidth * window.innerHeight / 15000));
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function connect() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `hsla(0, 60%, 50%, ${0.08 * (1 - dist / 140)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    connect();
    requestAnimationFrame(animate);
  }
  animate();
}

function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('active');
      toggle.classList.toggle('active');
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('active');
        toggle.classList.remove('active');
      });
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a, button, .glass-card, .btn-figma').forEach(el => {
    el.style.cursor = 'none';
  });
  initProjectSlider();
});

function initProjectSlider() {
  const track = document.querySelector('.slider-track');
  const prev = document.querySelector('.slider-prev');
  const next = document.querySelector('.slider-next');
  if (!track || !prev || !next) return;
  const scrollAmount = 300;
  prev.addEventListener('click', () => { track.scrollLeft -= scrollAmount; });
  next.addEventListener('click', () => { track.scrollLeft += scrollAmount; });
}