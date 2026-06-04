/* ── CURSOR ── */
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

function animateFollower() {
  fx += (mx - fx) * 0.28;
  fy += (my - fy) * 0.28;
  follower.style.left = fx + 'px';
  follower.style.top  = fy + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, .project-card, .coding-item, .ach-item, .edu-item').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

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
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(10px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(600px) rotateY(0) rotateX(0) translateZ(0)';
      card.style.transition = 'transform .5s ease, box-shadow .35s, border-color .35s';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'box-shadow .35s, border-color .35s';
    });
  });
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

/* ── PAGE LOADER ── */
window.addEventListener('load', () => {
  setTimeout(() => document.querySelector('.page-loader').classList.add('done'), 800);
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
    sub: 'Bus Ticket Booking System',
    desc: 'Full-stack bus ticket booking app with user/admin roles, real-time seat selection, fare calculation, booking management, and coupon integration.',
    tags: ['React', 'Node.js', 'Express', 'MongoDB'],
    year: '2025', github: 'https://github.com/dharshana8',
    bg: 'assets/image.png',
  },
  {
    title: 'Digital Wallet',
    sub: 'UPI Payment System',
    desc: 'Online wallet and UPI payment system with account creation, fund transfer, balance tracking, transaction history, and secure REST APIs.',
    tags: ['Spring Boot', 'Java', 'MySQL'],
    year: '2025', github: 'https://github.com/dharshana8',
    bg: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=800&q=80',
  },
  {
    title: 'EvalUI',
    sub: 'AI Question Generator',
    desc: 'AI-powered Tutor Dashboard that auto-generates coding questions from uploaded solutions with evaluation rules and rubric scoring.',
    tags: ['React', 'Node.js', 'Express', 'AI APIs'],
    year: '2026', github: 'https://github.com/dharshana8',
    bg: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80',
  },
  {
    title: 'Placify',
    sub: 'Placement Management System',
    desc: 'Placement management platform with student profiles, company listings, application tracking, drive scheduling, and admin dashboards.',
    tags: ['React', 'Node.js', 'Express', 'MongoDB'],
    year: '2025', github: 'https://github.com/dharshana8',
    bg: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80',
  },
  {
    title: 'GigShield AI',
    sub: 'Predictive Parametric Insurance Platform',
    desc: 'AI-driven predictive parametric insurance platform using hyperlocal disruption analysis and automated payouts to protect gig workers from income loss before and during external disruptions.',
    tags: ['AI', 'React', 'Node.js', 'ML'],
    year: '2025', github: 'https://github.com/dharshana8',
    bg: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
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
