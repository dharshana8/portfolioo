/* ─────────────────────────────────────────────────────────────
   DEV ARCADE & GAMIFICATION SYSTEM ENGINE — arcade.js
   100% Non-destructive add-on engine for Dharshana S's portfolio
   ───────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────────
     1. WEB AUDIO SFX SYNTH ENGINE
     ───────────────────────────────────────────────────────────── */
  let audioCtx = null;
  let isMuted = localStorage.getItem('dharshana_arcade_muted') === 'true';

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSfx(type) {
    if (isMuted) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;

      if (type === 'blip') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'laser') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'powerup') {
        const notes = [330, 440, 554, 659, 880];
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.04);
          gain.gain.setValueAtTime(0.15, now + idx * 0.04);
          gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.04 + 0.08);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + idx * 0.04);
          osc.stop(now + idx * 0.04 + 0.08);
        });
      } else if (type === 'bug_hit') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.1);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'fanfare') {
        const freqs = [523.25, 659.25, 783.99, 1046.5];
        freqs.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.2, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.25);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.25);
        });
      } else if (type === 'pop') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.06);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
      }
    } catch (err) {
      console.warn('Audio SFX error:', err);
    }
  }

  function toggleMute() {
    isMuted = !isMuted;
    localStorage.setItem('dharshana_arcade_muted', isMuted ? 'true' : 'false');
    updateMuteButtons();
    if (!isMuted) playSfx('blip');
  }

  function updateMuteButtons() {
    const btns = document.querySelectorAll('.sound-toggle-btn');
    btns.forEach(btn => {
      btn.innerHTML = isMuted ? '🔇' : '🔊';
      btn.title = isMuted ? 'Unmute Sound FX' : 'Mute Sound FX';
    });
  }

  /* ─────────────────────────────────────────────────────────────
     2. GLOBAL CONFETTI ENGINE
     ───────────────────────────────────────────────────────────── */
  let confettiCanvas = null;
  let confettiCtx = null;
  let confettiParticles = [];
  let confettiAnimId = null;

  function initConfettiCanvas() {
    confettiCanvas = document.getElementById('confetti-canvas');
    if (!confettiCanvas) return;
    confettiCtx = confettiCanvas.getContext('2d');
    resizeConfetti();
    window.addEventListener('resize', resizeConfetti);
  }

  function resizeConfetti() {
    if (!confettiCanvas) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }

  function triggerConfetti(x, y) {
    if (!confettiCtx) return;
    playSfx('fanfare');
    const colors = ['#7c3aed', '#c084fc', '#facc15', '#38bdf8', '#f43f5e', '#34d399'];
    const originX = x || window.innerWidth / 2;
    const originY = y || window.innerHeight / 2;

    for (let i = 0; i < 70; i++) {
      confettiParticles.push({
        x: originX,
        y: originY,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.8) * 16,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
        life: 1
      });
    }

    if (!confettiAnimId) {
      animateConfetti();
    }
  }

  function animateConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiParticles.forEach((p, idx) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.38; // gravity
      p.rotation += p.rSpeed;
      p.opacity -= 0.015;

      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate((p.rotation * Math.PI) / 180);
      confettiCtx.globalAlpha = Math.max(0, p.opacity);
      confettiCtx.fillStyle = p.color;
      confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      confettiCtx.restore();

      if (p.opacity <= 0 || p.y > confettiCanvas.height) {
        confettiParticles.splice(idx, 1);
      }
    });

    if (confettiParticles.length > 0) {
      confettiAnimId = requestAnimationFrame(animateConfetti);
    } else {
      confettiAnimId = null;
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     3. XP & ACHIEVEMENTS ENGINE
     ───────────────────────────────────────────────────────────── */
  const ALL_ACHIEVEMENTS = [
    { id: 'explorer', icon: '🌟', title: 'First Step', desc: 'Explored Dharshana\'s Portfolio', xp: 50 },
    { id: 'bughunter', icon: '👾', title: 'Bug Hunter', desc: 'Smashed 10 bugs in Bug Smasher', xp: 150 },
    { id: 'terminal', icon: '💻', title: 'Terminal Hacker', desc: 'Executed 3 CLI commands in Cyber Terminal', xp: 100 },
    { id: 'bubblepopper', icon: '🔮', title: 'Bubble Popper', desc: 'Popped 5 Skill Bubbles', xp: 100 },
    { id: 'resume_download', icon: '📜', title: 'Resume Collector', desc: 'Downloaded Dharshana\'s Resume', xp: 100 },
    { id: 'contact_sent', icon: '✉️', title: 'Networker', desc: 'Sent a message to Dharshana', xp: 200 },
    { id: 'arcade_master', icon: '🏆', title: 'Arcade Champion', desc: 'Reached 500+ total XP', xp: 300 }
  ];

  let playerXP = parseInt(localStorage.getItem('dharshana_arcade_xp') || '0', 10);
  let unlockedAchievements = JSON.parse(localStorage.getItem('dharshana_arcade_achievements') || '[]');

  function saveProgress() {
    localStorage.setItem('dharshana_arcade_xp', playerXP.toString());
    localStorage.setItem('dharshana_arcade_achievements', JSON.stringify(unlockedAchievements));
    updateXpDisplay();
    renderAchievementsList();
  }

  function addXP(amount) {
    playerXP += amount;
    saveProgress();
    if (playerXP >= 500) {
      unlockAchievement('arcade_master');
    }
  }

  function unlockAchievement(id) {
    if (unlockedAchievements.includes(id)) return;
    const ach = ALL_ACHIEVEMENTS.find(a => a.id === id);
    if (!ach) return;

    unlockedAchievements.push(id);
    playerXP += ach.xp;
    saveProgress();

    showAchievementToast(ach);
    triggerConfetti();
  }

  function showAchievementToast(ach) {
    let toast = document.getElementById('achievement-toast');
    if (!toast) return;

    toast.querySelector('.ach-toast-icon').textContent = ach.icon;
    toast.querySelector('.ach-toast-details .title').textContent = ach.title;
    toast.querySelector('.ach-toast-details .desc').textContent = ach.desc + ` (+${ach.xp} XP)`;

    toast.classList.add('show');
    playSfx('fanfare');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  function updateXpDisplay() {
    const level = Math.floor(playerXP / 100) + 1;
    const currentLevelProgress = playerXP % 100;

    const lvlBadges = document.querySelectorAll('.xp-level-badge');
    lvlBadges.forEach(b => b.textContent = `LVL ${level}`);

    const xpFills = document.querySelectorAll('.xp-progress-bar-fill');
    xpFills.forEach(f => f.style.width = `${currentLevelProgress}%`);

    const xpTexts = document.querySelectorAll('.xp-val-text');
    xpTexts.forEach(t => t.textContent = `${playerXP} XP`);

    const miniBadges = document.querySelectorAll('.xp-badge-mini');
    miniBadges.forEach(mb => mb.textContent = `⭐ ${playerXP} XP`);
  }

  function renderAchievementsList() {
    const container = document.getElementById('achievements-grid-list');
    if (!container) return;
    container.innerHTML = '';

    ALL_ACHIEVEMENTS.forEach(ach => {
      const isUnlocked = unlockedAchievements.includes(ach.id);
      const card = document.createElement('div');
      card.className = `achievement-card ${isUnlocked ? 'unlocked' : ''}`;
      card.innerHTML = `
        <div class="achievement-icon">${ach.icon}</div>
        <div class="achievement-info">
          <h4>${ach.title} ${isUnlocked ? '✅' : '🔒'}</h4>
          <p>${ach.desc}</p>
          <span class="achievement-xp-tag">+${ach.xp} XP</span>
        </div>
      `;
      container.appendChild(card);
    });
  }

  /* ─────────────────────────────────────────────────────────────
     4. GAME 1: BUG SMASHER (MERN DEFENDER)
     ───────────────────────────────────────────────────────────── */
  let bugCanvas, bugCtx;
  let bugAnimId = null;
  let bugScore = 0;
  let bugLives = 3;
  let bugCombo = 0;
  let totalBugsSmashed = 0;
  let bugs = [];
  let bugParticles = [];
  let isBugGameRunning = false;

  const BUG_TYPES = [
    { name: 'Syntax Error', icon: '🐛', color: '#f43f5e', points: 10, speed: 2.2 },
    { name: 'Memory Leak', icon: '👾', color: '#a855f7', points: 25, speed: 2.8 },
    { name: 'Null Pointer', icon: '🐞', color: '#facc15', points: 50, speed: 3.4 },
    { name: 'React Power', icon: '⚛️', color: '#38bdf8', points: 100, speed: 2.0, powerup: true },
    { name: 'Mongo Shield', icon: '🍃', color: '#34d399', points: 100, speed: 2.0, powerup: true }
  ];

  function initBugSmasher() {
    bugCanvas = document.getElementById('bug-smasher-canvas');
    if (!bugCanvas) return;
    bugCtx = bugCanvas.getContext('2d');
    resizeBugCanvas();

    bugCanvas.addEventListener('pointerdown', handleBugClick);
  }

  function resizeBugCanvas() {
    if (!bugCanvas || !bugCanvas.parentElement) return;
    bugCanvas.width = bugCanvas.parentElement.clientWidth;
    bugCanvas.height = bugCanvas.parentElement.clientHeight;
  }

  function startBugGame() {
    resizeBugCanvas();
    bugScore = 0;
    bugLives = 3;
    bugCombo = 0;
    bugs = [];
    bugParticles = [];
    isBugGameRunning = true;

    updateBugHud();
    document.getElementById('bug-start-overlay').style.display = 'none';
    document.getElementById('bug-gameover-overlay').style.display = 'none';

    if (bugAnimId) cancelAnimationFrame(bugAnimId);
    bugGameLoop();
  }

  function updateBugHud() {
    const scoreEl = document.getElementById('bug-hud-score');
    if (scoreEl) scoreEl.textContent = bugScore;

    const comboEl = document.getElementById('bug-hud-combo');
    if (comboEl) comboEl.textContent = `${bugCombo}x`;

    const livesEl = document.getElementById('bug-hud-lives');
    if (livesEl) {
      livesEl.textContent = '❤️'.repeat(bugLives) + '🖤'.repeat(Math.max(0, 3 - bugLives));
    }
  }

  function spawnBug() {
    if (!bugCanvas || !isBugGameRunning) return;
    const type = BUG_TYPES[Math.floor(Math.random() * BUG_TYPES.length)];
    const size = 36;
    bugs.push({
      x: Math.random() * (bugCanvas.width - 60) + 30,
      y: -size,
      type: type,
      size: size,
      speed: type.speed + Math.random() * 0.8,
      wobble: Math.random() * Math.PI * 2
    });
  }

  function handleBugClick(e) {
    if (!isBugGameRunning) return;
    const rect = bugCanvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    let hit = false;
    for (let i = bugs.length - 1; i >= 0; i--) {
      const b = bugs[i];
      const dist = Math.hypot(clickX - b.x, clickY - b.y);
      if (dist < b.size + 15) {
        hit = true;
        bugs.splice(i, 1);
        bugScore += b.type.points * (1 + Math.floor(bugCombo / 5));
        bugCombo++;
        totalBugsSmashed++;

        playSfx(b.type.powerup ? 'powerup' : 'bug_hit');
        createSparks(b.x, b.y, b.type.color);
        showComboPopup(b.x, b.y, b.type.powerup ? `+${b.type.points} POWERUP!` : `+${b.type.points}`);

        if (totalBugsSmashed >= 10) {
          unlockAchievement('bughunter');
        }

        addXP(b.type.powerup ? 15 : 5);
        break;
      }
    }

    if (!hit) {
      bugCombo = 0;
    }
    updateBugHud();
  }

  function createSparks(x, y, color) {
    for (let i = 0; i < 12; i++) {
      bugParticles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        color: color,
        size: Math.random() * 4 + 2,
        life: 1.0
      });
    }
  }

  function showComboPopup(x, y, text) {
    const container = bugCanvas.parentElement;
    const el = document.createElement('div');
    el.className = 'combo-popup';
    el.textContent = text;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    container.appendChild(el);
    setTimeout(() => el.remove(), 800);
  }

  function bugGameLoop() {
    if (!isBugGameRunning) return;
    bugCtx.clearRect(0, 0, bugCanvas.width, bugCanvas.height);

    // Random spawn
    if (Math.random() < 0.03 + Math.min(bugScore / 5000, 0.04)) {
      spawnBug();
    }

    // Update and draw bugs
    for (let i = bugs.length - 1; i >= 0; i--) {
      const b = bugs[i];
      b.y += b.speed;
      b.wobble += 0.05;
      b.x += Math.sin(b.wobble) * 0.8;

      // Draw Bug Icon
      bugCtx.font = `${b.size}px sans-serif`;
      bugCtx.textAlign = 'center';
      bugCtx.textBaseline = 'middle';
      bugCtx.fillText(b.type.icon, b.x, b.y);

      // Reached bottom
      if (b.y > bugCanvas.height + b.size) {
        bugs.splice(i, 1);
        if (!b.type.powerup) {
          bugLives--;
          bugCombo = 0;
          updateBugHud();
          if (bugLives <= 0) {
            endBugGame();
            return;
          }
        }
      }
    }

    // Update and draw spark particles
    for (let i = bugParticles.length - 1; i >= 0; i--) {
      const p = bugParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.04;
      if (p.life <= 0) {
        bugParticles.splice(i, 1);
        continue;
      }
      bugCtx.fillStyle = p.color;
      bugCtx.globalAlpha = p.life;
      bugCtx.beginPath();
      bugCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      bugCtx.fill();
      bugCtx.globalAlpha = 1.0;
    }

    bugAnimId = requestAnimationFrame(bugGameLoop);
  }

  function endBugGame() {
    isBugGameRunning = false;
    if (bugAnimId) cancelAnimationFrame(bugAnimId);

    const high = parseInt(localStorage.getItem('dharshana_bug_highscore') || '0', 10);
    if (bugScore > high) {
      localStorage.setItem('dharshana_bug_highscore', bugScore.toString());
    }

    const overEl = document.getElementById('bug-gameover-overlay');
    overEl.querySelector('.final-score').textContent = `Final Score: ${bugScore} | High Score: ${Math.max(bugScore, high)}`;
    overEl.style.display = 'flex';
    playSfx('fanfare');
  }

  /* ─────────────────────────────────────────────────────────────
     5. GAME 2: CYBER TERMINAL QUEST (CRT CLI)
     ───────────────────────────────────────────────────────────── */
  let terminalCmdCount = 0;
  let matrixCanvas, matrixCtx, matrixAnimId = null;

  function initTerminal() {
    const input = document.getElementById('terminal-cli-input');
    if (!input) return;

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const val = input.value.trim();
        if (val) {
          executeCommand(val);
          input.value = '';
        }
      }
    });

    initMatrixRain();
  }

  function printTerminalLine(text, type = 'system-output') {
    const win = document.getElementById('terminal-window-body');
    if (!win) return;
    const line = document.createElement('div');
    line.className = `terminal-line ${type}`;
    line.innerHTML = text;
    win.appendChild(line);
    win.scrollTop = win.scrollHeight;
  }

  function executeCommand(cmd) {
    playSfx('blip');
    printTerminalLine(`dharshana@portfolio:~$ ${cmd}`, 'user-cmd');
    terminalCmdCount++;

    if (terminalCmdCount >= 3) {
      unlockAchievement('terminal');
    }

    const lower = cmd.toLowerCase();

    if (lower === 'help') {
      printTerminalLine('AVAILABLE COMMANDS:', 'accent');
      printTerminalLine('  <span>skills</span>      - Display Dharshana\'s technical skills');
      printTerminalLine('  <span>projects</span>    - View key full-stack projects');
      printTerminalLine('  <span>sudo matrix</span> - Toggle Matrix digital rain');
      printTerminalLine('  <span>easteregg</span>   - Unlock secret easter egg');
      printTerminalLine('  <span>hire</span>        - Connect & contact Dharshana');
      printTerminalLine('  <span>clear</span>       - Clear terminal output');
    } else if (lower === 'skills') {
      printTerminalLine('┌── SKILL MATRIX ──────────────────────────┐', 'accent');
      printTerminalLine('│ React.js      [██████████████████░] 92% │');
      printTerminalLine('│ Node.js/Exp   [█████████████████░░] 88% │');
      printTerminalLine('│ Java / Spring [████████████████░░░] 85% │');
      printTerminalLine('│ Python        [█████████████████░░] 88% │');
      printTerminalLine('│ C++ & DSA     [██████████████████░] 90% │');
      printTerminalLine('│ MongoDB/MySQL [█████████████████░░] 86% │');
      printTerminalLine('└──────────────────────────────────────────┘', 'accent');
    } else if (lower === 'projects') {
      printTerminalLine('FEATURED PROJECTS:', 'accent');
      printTerminalLine('1. BookMySeat - Placement & Bus Ticket System');
      printTerminalLine('2. AI LendingLead Intelligence - IDBI Hackathon ML Lead Scoring');
      printTerminalLine('3. EvalUI - AI Coding Evaluation Platform');
      printTerminalLine('4. Placify - Placement Management Portal');
      printTerminalLine('5. Multi-Agent AI Placement Prep Guide');
    } else if (lower === 'sudo matrix' || lower === 'matrix') {
      toggleMatrixRain();
      printTerminalLine('⚡ Matrix Digital Rain toggled!', 'accent');
    } else if (lower === 'easteregg') {
      printTerminalLine('🎉 EASTER EGG FOUND! "First solve the problem. Then, write the code." — Dharshana S', 'accent');
      unlockAchievement('terminal');
      triggerConfetti();
    } else if (lower === 'hire') {
      printTerminalLine('🚀 Navigating to Contact Section...', 'accent');
      triggerConfetti();
      closeArcadeModal();
      setTimeout(() => {
        const contactSec = document.getElementById('contact');
        if (contactSec) contactSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } else if (lower === 'clear') {
      const win = document.getElementById('terminal-window-body');
      if (win) win.innerHTML = '';
    } else {
      printTerminalLine(`Command not found: '${cmd}'. Type 'help' for available commands.`, 'error');
    }
  }

  function initMatrixRain() {
    matrixCanvas = document.getElementById('matrix-rain-canvas');
    if (!matrixCanvas) return;
    matrixCtx = matrixCanvas.getContext('2d');

    matrixCanvas.width = matrixCanvas.parentElement.clientWidth;
    matrixCanvas.height = matrixCanvas.parentElement.clientHeight;

    const chars = '01DHARSHANA8REACTNODEJAVASPRING';
    const fontSize = 14;
    const cols = Math.floor(matrixCanvas.width / fontSize);
    const drops = Array(cols).fill(1);

    function drawMatrix() {
      matrixCtx.fillStyle = 'rgba(5, 11, 7, 0.08)';
      matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
      matrixCtx.fillStyle = '#22c55e';
      matrixCtx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        matrixCtx.fillText(char, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      matrixAnimId = requestAnimationFrame(drawMatrix);
    }

    drawMatrix();
  }

  function toggleMatrixRain() {
    if (!matrixCanvas) return;
    matrixCanvas.style.opacity = matrixCanvas.style.opacity === '0.5' ? '0.15' : '0.5';
  }

  /* ─────────────────────────────────────────────────────────────
     6. GAME 3: PHYSICS TECH BUBBLE BOUNCER
     ───────────────────────────────────────────────────────────── */
  let bubbleCanvas, bubbleCtx, bubbleAnimId = null;
  let bubbles = [];
  let poppedCount = 0;
  let mouseX = -1000, mouseY = -1000;

  const TECH_BUBBLES = [
    { label: 'React', icon: '⚛️', color: '#38bdf8' },
    { label: 'Node.js', icon: '🟢', color: '#22c55e' },
    { label: 'MongoDB', icon: '🍃', color: '#34d399' },
    { label: 'Java', icon: '☕', color: '#f97316' },
    { label: 'Spring', icon: '🍃', color: '#4ade80' },
    { label: 'Python', icon: '🐍', color: '#facc15' },
    { label: 'C++', icon: '⚡', color: '#818cf8' },
    { label: 'DSA', icon: '🧠', color: '#c084fc' },
    { label: 'MySQL', icon: '🐬', color: '#38bdf8' },
    { label: 'Git', icon: '🐙', color: '#f43f5e' }
  ];

  function initBubbleBouncer() {
    bubbleCanvas = document.getElementById('bubble-canvas');
    if (!bubbleCanvas) return;
    bubbleCtx = bubbleCanvas.getContext('2d');
    resizeBubbleCanvas();

    spawnBubbles();

    bubbleCanvas.addEventListener('pointermove', e => {
      const r = bubbleCanvas.getBoundingClientRect();
      mouseX = e.clientX - r.left;
      mouseY = e.clientY - r.top;
    });

    bubbleCanvas.addEventListener('pointerdown', handleBubbleClick);
  }

  function resizeBubbleCanvas() {
    if (!bubbleCanvas || !bubbleCanvas.parentElement) return;
    bubbleCanvas.width = bubbleCanvas.parentElement.clientWidth;
    bubbleCanvas.height = bubbleCanvas.parentElement.clientHeight;
  }

  function spawnBubbles() {
    if (!bubbleCanvas) return;
    bubbles = [];
    TECH_BUBBLES.forEach((t, i) => {
      const radius = 34;
      bubbles.push({
        label: t.label,
        icon: t.icon,
        color: t.color,
        radius: radius,
        x: Math.random() * (bubbleCanvas.width - radius * 2) + radius,
        y: Math.random() * (bubbleCanvas.height - radius * 2) + radius,
        vx: (Math.random() - 0.5) * 2.5,
        vy: (Math.random() - 0.5) * 2.5
      });
    });
  }

  function handleBubbleClick(e) {
    const r = bubbleCanvas.getBoundingClientRect();
    const cx = e.clientX - r.left;
    const cy = e.clientY - r.top;

    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i];
      const dist = Math.hypot(cx - b.x, cy - b.y);
      if (dist < b.radius) {
        playSfx('pop');
        createSparks(b.x, b.y, b.color);
        bubbles.splice(i, 1);
        poppedCount++;

        if (poppedCount >= 5) {
          unlockAchievement('bubblepopper');
        }
        addXP(15);
        break;
      }
    }
  }

  function animateBubbles() {
    if (!bubbleCtx || !bubbleCanvas) return;
    bubbleCtx.clearRect(0, 0, bubbleCanvas.width, bubbleCanvas.height);

    bubbles.forEach(b => {
      b.x += b.vx;
      b.y += b.vy;

      // Bounce off walls
      if (b.x - b.radius < 0 || b.x + b.radius > bubbleCanvas.width) b.vx *= -1;
      if (b.y - b.radius < 0 || b.y + b.radius > bubbleCanvas.height) b.vy *= -1;

      // Mouse Repulsion
      const mDist = Math.hypot(mouseX - b.x, mouseY - b.y);
      if (mDist < 90) {
        const angle = Math.atan2(b.y - mouseY, b.x - mouseX);
        b.vx += Math.cos(angle) * 0.4;
        b.vy += Math.sin(angle) * 0.4;
      }

      // Speed cap
      b.vx = Math.max(-4, Math.min(4, b.vx));
      b.vy = Math.max(-4, Math.min(4, b.vy));

      // Draw Bubble
      bubbleCtx.save();
      bubbleCtx.beginPath();
      bubbleCtx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      bubbleCtx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      bubbleCtx.fill();
      bubbleCtx.strokeStyle = b.color;
      bubbleCtx.lineWidth = 2;
      bubbleCtx.stroke();

      // Text / Icon
      bubbleCtx.font = '18px sans-serif';
      bubbleCtx.textAlign = 'center';
      bubbleCtx.textBaseline = 'middle';
      bubbleCtx.fillText(b.icon, b.x, b.y - 6);

      bubbleCtx.font = '10px sans-serif';
      bubbleCtx.fillStyle = '#e2e8f0';
      bubbleCtx.fillText(b.label, b.x, b.y + 12);
      bubbleCtx.restore();
    });

    bubbleAnimId = requestAnimationFrame(animateBubbles);
  }

  /* ─────────────────────────────────────────────────────────────
     7. ARCADE MODAL CONTROLLER & TABS
     ───────────────────────────────────────────────────────────── */
  function openArcadeModal(tabName = 'bugsmasher') {
    initAudio();
    playSfx('blip');
    unlockAchievement('explorer');

    const modal = document.getElementById('arcade-modal-backdrop');
    if (modal) modal.classList.add('open');

    switchArcadeTab(tabName);
  }

  function closeArcadeModal() {
    playSfx('blip');
    const modal = document.getElementById('arcade-modal-backdrop');
    if (modal) modal.classList.remove('open');

    isBugGameRunning = false;
    if (bugAnimId) cancelAnimationFrame(bugAnimId);
  }

  function switchArcadeTab(tabId) {
    playSfx('blip');
    const tabBtns = document.querySelectorAll('.arcade-tab-btn');
    const pages = document.querySelectorAll('.arcade-tab-page');

    tabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    pages.forEach(p => {
      p.classList.toggle('active', p.id === `tab-page-${tabId}`);
    });

    if (tabId === 'bugsmasher') {
      initBugSmasher();
    } else if (tabId === 'terminal') {
      initTerminal();
    } else if (tabId === 'bouncer') {
      initBubbleBouncer();
      if (!bubbleAnimId) animateBubbles();
    } else if (tabId === 'achievements') {
      renderAchievementsList();
    }
  }

  /* ─────────────────────────────────────────────────────────────
     8. GLOBAL INITIALIZATION & BINDINGS
     ───────────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initConfettiCanvas();
    updateMuteButtons();
    updateXpDisplay();

    // Trigger explorer achievement on initial scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 200) {
        unlockAchievement('explorer');
      }
    }, { once: true });

    // Floating Arcade Launch Button
    const floatingBtn = document.getElementById('floating-arcade-btn');
    if (floatingBtn) {
      floatingBtn.addEventListener('click', () => openArcadeModal('bugsmasher'));
    }

    // Nav Arcade Button
    const navBtn = document.getElementById('arcade-nav-btn');
    if (navBtn) {
      navBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openArcadeModal('bugsmasher');
      });
    }

    // Close Modal Button & Backdrop click
    const closeBtn = document.getElementById('arcade-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeArcadeModal);

    const backdrop = document.getElementById('arcade-modal-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', e => {
        if (e.target === backdrop) closeArcadeModal();
      });
    }

    // Sound Toggle Buttons
    document.querySelectorAll('.sound-toggle-btn').forEach(btn => {
      btn.addEventListener('click', toggleMute);
    });

    // Tab buttons
    document.querySelectorAll('.arcade-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => switchArcadeTab(btn.dataset.tab));
    });

    // Bug Smasher Buttons
    const bugStartBtn = document.getElementById('bug-start-btn');
    if (bugStartBtn) bugStartBtn.addEventListener('click', startBugGame);

    const bugRestartBtn = document.getElementById('bug-restart-btn');
    if (bugRestartBtn) bugRestartBtn.addEventListener('click', startBugGame);

    // Bubble Reset Button
    const bubbleResetBtn = document.getElementById('bubble-reset-btn');
    if (bubbleResetBtn) bubbleResetBtn.addEventListener('click', () => {
      playSfx('blip');
      spawnBubbles();
    });

    // Resume Download links hook
    document.querySelectorAll('a[download]').forEach(link => {
      link.addEventListener('click', () => {
        unlockAchievement('resume_download');
        triggerConfetti();
      });
    });

    // Contact Form Hook
    const sendBtn = document.querySelector('.send-btn');
    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        const name = document.getElementById('f-name').value.trim();
        const email = document.getElementById('f-email').value.trim();
        const msg = document.getElementById('f-msg').value.trim();
        if (name && email && msg) {
          unlockAchievement('contact_sent');
          triggerConfetti();
        }
      });
    }
  });
})();
