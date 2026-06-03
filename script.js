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
  initCardGlow();

  document.querySelectorAll('.reveal-up, .reveal-right').forEach(el => revealObserver.observe(el));
  document.querySelectorAll('.stat-n').forEach(el => counterObserver.observe(el));
});
