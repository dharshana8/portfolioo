/* ── CLICK RIPPLE ── */
document.addEventListener('click', e => {
  const r = document.createElement('div');
  r.className = 'ripple';
  r.style.left = e.clientX + 'px';
  r.style.top  = e.clientY + 'px';
  document.body.appendChild(r);
  setTimeout(() => r.remove(), 600);
});

/* ── PARTICLES ── */
function initParticles() {
  const container = document.getElementById('particles-bg');
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 3 + 1;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      animation-duration:${Math.random() * 15 + 10}s;
      animation-delay:-${Math.random() * 20}s;
      opacity:${Math.random() * 0.5 + 0.1};
    `;
    container.appendChild(p);
  }
}

/* ── TYPING ANIMATION ── */
function initTyping() {
  const words = ['Developer', 'Engineer', 'Problem Solver', 'MERN Dev'];
  const el = document.getElementById('typed-text');
  if (!el) return;
  let wi = 0, ci = 0, deleting = false;

  function type() {
    const word = words[wi];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; setTimeout(type, 1800); return; }
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
    }
    setTimeout(type, deleting ? 60 : 100);
  }
  setTimeout(type, 1200);
}

/* ── 3D TILT ── */
function initTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const surfaces = '.hero-left, .hero-right, .about-text, .edu-box, .exp-card, .project-card, .skills-table, .ach-item, .coding-item, .contact-form, .contact-info';
  document.querySelectorAll(surfaces).forEach(surface => {
    surface.classList.add('depth-surface');
    const move = e => {
      const r = surface.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      surface.classList.add('is-active');
      surface.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      surface.style.setProperty('--my', (e.clientY - r.top) + 'px');
      surface.style.transform = 'perspective(1000px) rotateX(' + (-y * 11) + 'deg) rotateY(' + (x * 11) + 'deg) translateZ(24px)';
    };
    const reset = () => {
      surface.classList.remove('is-active');
      surface.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    };
    surface.addEventListener('pointermove', move, { passive: true });
    surface.addEventListener('pointerdown', e => { move(e); setTimeout(reset, 480); }, { passive: true });
    surface.addEventListener('pointerleave', reset, { passive: true });
  });

  const heroLeft = document.querySelector('.hero-left');
  const heroRight = document.querySelector('.hero-right');
  const moveCamera = e => {
    const x = e.clientX / window.innerWidth - .5;
    const y = e.clientY / window.innerHeight - .5;
    if (heroLeft && !heroLeft.matches(':hover')) heroLeft.style.transform = 'perspective(1300px) rotateY(' + (x * -7) + 'deg) rotateX(' + (y * 5) + 'deg) translateZ(12px)';
    if (heroRight && !heroRight.matches(':hover')) heroRight.style.transform = 'perspective(1300px) rotateY(' + (x * 9) + 'deg) rotateX(' + (y * -6) + 'deg) translateZ(30px)';
  };
  document.addEventListener('pointermove', moveCamera, { passive: true });
}
/* ── INTERACTIVE 3D BACKGROUND ── */
function initDepthScene() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.getElementById('depth-canvas');
  const ctx = canvas && canvas.getContext('2d');
  if (!ctx) return;
  const points = Array.from({ length: 54 }, () => ({ x: (Math.random() - .5) * 2, y: (Math.random() - .5) * 2, z: Math.random() * 1.6 + .25, size: Math.random() * 1.8 + .7, drift: (Math.random() - .5) * .0007 }));
  let w, h, dpr, pointerX = 0, pointerY = 0;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function draw(time) {
    ctx.clearRect(0, 0, w, h);
    const tone = document.documentElement.getAttribute('data-theme') === 'dark' ? '167,139,250' : '124,58,237';
    const projected = points.map(p => {
      const angle = time * .00008 + pointerX * .2;
      const rx = p.x * Math.cos(angle) - p.z * Math.sin(angle);
      const rz = p.x * Math.sin(angle) + p.z * Math.cos(angle) + 2.6;
      return { x: w * .52 + (rx / rz) * w * .68, y: h * .44 + ((p.y + pointerY * .12) / rz) * h * .78, size: p.size / rz };
    });
    for (let i = 0; i < projected.length; i++) {
      for (let j = i + 1; j < projected.length; j++) {
        const a = projected[i], b = projected[j], distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance < 140) { ctx.strokeStyle = 'rgba(' + tone + ',' + (.28 * (1 - distance / 140)).toFixed(3) + ')'; ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
    }
    projected.forEach(p => { ctx.fillStyle = 'rgba(' + tone + ',.82)'; ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(.7, p.size), 0, Math.PI * 2); ctx.fill(); });
    points.forEach(p => { p.y += p.drift; if (p.y > 1.1 || p.y < -1.1) p.drift *= -1; });
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointermove', e => { pointerX = e.clientX / w - .5; pointerY = e.clientY / h - .5; }, { passive: true });
  resize(); requestAnimationFrame(draw);
}
/* ── ACTIVE NAV ON SCROLL ── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => observer.observe(s));
}

/* ── BACK TO TOP ── */
function initBackTop() {
  const btn = document.getElementById('back-top');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── THEME TOGGLE ── */
const moonIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const sunIcon  = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

function initTheme() {
  const btn = document.getElementById('theme-toggle');
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  btn.innerHTML = saved === 'dark' ? sunIcon : moonIcon;
  btn.textContent = '';
  btn.innerHTML = saved === 'dark' ? sunIcon : moonIcon;
  btn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    btn.innerHTML = next === 'dark' ? sunIcon : moonIcon;
  });
}

/* ── PAGE LOADER ── */
window.addEventListener('load', () => {
  setTimeout(() => document.querySelector('.page-loader').classList.add('done'), 3000);
});

/* ── NAV SCROLL ── */
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 50);
});

/* ── COUNTER ANIMATION ── */
function animateCounter(el) {
  const target = +el.dataset.count;
  const duration = 1800;
  const start = performance.now();
  function update(now) {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(ease * target);
    if (p < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

/* ── SCROLL REVEAL ── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

/* ── PROJECT CARD GLOW ── */
function initCardGlow() {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
}

/* ── MARQUEE DATA ── */
const marqueeItems1 = ['JavaScript','React','Node.js','Express.js','MongoDB','MySQL','Spring Boot','Java','Python','C++','HTML','CSS','DSA','OOP','Git','GitHub','Postman','Canva'];
const marqueeItems2 = ['Full Stack Dev','Problem Solving','Hackathons','RESTful APIs','Database Design','UI Development','Backend Logic','Data Structures','Algorithms','DBMS','DAA'];

function buildMarquee(id, items) {
  const track = document.getElementById(id);
  const doubled = [...items, ...items];
  doubled.forEach(item => {
    const el = document.createElement('div');
    el.className = 'marquee-item';
    el.textContent = item;
    track.appendChild(el);
  });
}

/* ── PROJECTS DATA ── */
const projects = [
  {
    title: 'BookMySeat',
    sub: 'Placement Management System',
    desc: 'Full-stack bus ticket booking with user/admin roles, real-time seat selection, fare calculation, and coupon integration.',
    tags: ['React', 'Node.js', 'Express', 'MongoDB'],
    year: '2025', github: 'https://github.com/dharshana8/BookMySeat',
    bg: 'assets/image.png',
  },
  {
    title: 'AI LendingLead Intelligence',
    sub: 'IDBI Bank Hackathon',
    desc: 'Predicts high-potential loan customers using ML with intelligent lead scoring and role-based dashboards for Admins, Branch Managers, and Relationship Managers.',
    tags: ['Python', 'ML', 'React', 'Node.js'],
    year: '2025', github: 'https://github.com/dharshana8/AI_LendingLead_Intelligence',
    bg: 'https://as1.ftcdn.net/v2/jpg/00/95/16/92/1000_F_95169255_3LYLeZ36fkzLDWFOtAdJEtHIlPFS6do0.jpg',
  },
  {
    title: 'EvalUI',
    sub: 'AI-Powered Evaluation Platform',
    desc: 'Automatically generates coding questions from uploaded solutions and assesses responses in real time with instant feedback, performance analysis, and personalized recommendations.',
    tags: ['React', 'Node.js', 'Express', 'AI APIs'],
    year: '2026', github: 'https://github.com/dharshana8/EvalUI',
    bg: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80',
  },
  {
    title: 'Placify',
    sub: 'Placement Management System',
    desc: 'Placement platform with student profiles, company listings, application tracking, drive scheduling, and admin dashboards.',
    tags: ['React', 'Node.js', 'Express', 'MongoDB'],
    year: '2025', github: 'https://github.com/dharshana8/placify',
    bg: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80',
  },
  {
    title: 'Placement Preparation Guide',
    sub: 'Multi-Agent AI System',
    desc: 'Analyzes resumes, detects skill gaps, creates personalized learning roadmaps, and matches students with relevant job opportunities through AI-driven recommendations.',
    tags: ['AI', 'Python', 'Multi-Agent', 'ML'],
    year: '2025', github: 'https://github.com/dharshana8/AI_placement_guide',
    bg: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80',
  },
];

function renderProjects() {
  const grid = document.getElementById('projects-grid');
  projects.forEach((p, i) => {
    const el = document.createElement('div');
    el.className = 'project-card reveal-up';
    el.style.backgroundImage = `url('${p.bg}')`;
    el.innerHTML = `
      <div class="project-card-overlay"></div>
      <div class="project-card-content">
        <div class="project-num">0${i + 1}</div>
        <div class="project-title">${p.title}<span class="project-sub"> — ${p.sub}</span></div>
        <div class="project-desc">${p.desc}</div>
        <div class="project-tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        <div class="project-footer">
          <span class="proj-yr">${p.year}</span>
          <a href="${p.github}" class="proj-link" target="_blank">GitHub →</a>
        </div>
      </div>
    `;
    grid.appendChild(el);
    revealObserver.observe(el);
  });
}

/* ── ACHIEVEMENTS DATA ── */
const achievements = [
  { title: 'DevTrails — GigShield AI', desc: 'Built GigShield AI, a predictive parametric insurance platform for gig workers. Reached Round 3 out of the competition.', year: '2025' },
  { title: 'Smart India Hackathon', desc: 'Selected in Top 50 teams at college level among 400+ competing teams.', year: '2025' },
  { title: '24hr Hackathon', desc: 'Participated at Sri Shakthi Institute of Engineering and Technology.', year: '2026' },
  { title: 'Freshathon', desc: 'Participated at Sri Eshwar College of Engineering.', year: '2025' },
];

function renderAchievements() {
  const list = document.getElementById('ach-list');
  achievements.forEach((a, i) => {
    const el = document.createElement('div');
    el.className = 'ach-item reveal-up';
    el.innerHTML = `
      <div class="ach-num">0${i+1}</div>
      <div>
        <div class="ach-title">${a.title}</div>
        <div class="ach-desc">${a.desc}</div>
        <div class="ach-year">${a.year}</div>
      </div>
    `;
    list.appendChild(el);
    revealObserver.observe(el);
  });
}

/* ── CERTS DATA ── */
const certs = [
  { name: 'Problem Solving Through Programming in C', org: 'NPTEL', year: '2025' },
  { name: 'Design Thinking — Top 2% Topper', org: 'NPTEL', year: '2025' },
  { name: 'C++', org: 'Sololearn', year: '2025' },
  { name: 'Python', org: 'Sololearn & HackerRank', year: '2025' },
  { name: 'Introduction to SQL', org: 'Sololearn', year: '2025' },
  { name: 'Java', org: 'Oracle', year: '2025' },
  { name: 'SQL Beginner & Intermediate', org: 'HackerRank', year: '2025' },
  { name: 'Introduction to Java', org: 'Sololearn', year: '2025' },
  { name: 'Learning Full Stack Development', org: 'Infosys', year: '2026' },
];

function renderCerts() {
  const list = document.getElementById('cert-list');
  certs.forEach(c => {
    const el = document.createElement('div');
    el.className = 'cert-item';
    el.innerHTML = `<strong>${c.org} · ${c.year}</strong> — ${c.name}`;
    list.appendChild(el);
  });
}

/* ── CONTACT ── */
function handleSend() {
  const name  = document.getElementById('f-name').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const msg   = document.getElementById('f-msg').value.trim();
  if (!name || !email || !msg) { showToast('Please fill in all fields.'); return; }
  showToast('Message sent! I\'ll get back to you soon.');
  document.getElementById('f-name').value  = '';
  document.getElementById('f-email').value = '';
  document.getElementById('f-msg').value   = '';
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderProjects();
  renderAchievements();
  renderCerts();
  buildMarquee('marquee1', marqueeItems1);
  buildMarquee('marquee2', marqueeItems2);
  initParticles();
  initTyping();
  initTilt();
  initActiveNav();
  initBackTop();

  document.querySelectorAll('.reveal-up, .reveal-right').forEach(el => revealObserver.observe(el));
  document.querySelectorAll('.stat-n').forEach(el => counterObserver.observe(el));
});
