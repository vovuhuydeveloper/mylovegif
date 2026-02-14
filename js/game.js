/* =============================================
   💕 Đào Vàng Tình Yêu - Premium Game Engine
   ============================================= */

// ---- CONFIG ----
const ITEMS = {
  LETTER: { emoji: '💌', name: 'Thư tình', pts: 30, w: 1, sz: 40, hr: 22, img: 'assets/letter.svg', msg: '💌 Thư tình' },
  CHOCOLATE: { emoji: '🍫', name: 'Chocolate', pts: 50, w: 1, sz: 40, hr: 22, img: 'assets/chocolate.svg', msg: '🍫 Ngọt ngào' },
  ROSE: { emoji: '🌹', name: 'Hoa hồng', pts: 80, w: 2, sz: 44, hr: 24, img: 'assets/rose.svg', msg: '🌹 Đẹp như em' },
  TEDDY: { emoji: '🧸', name: 'Gấu bông', pts: 120, w: 3, sz: 52, hr: 28, img: 'assets/teddy.svg', msg: '🧸 Ôm em thật chặt' },
  HEART: { emoji: '❤️', name: 'Trái tim', pts: 150, w: 3, sz: 50, hr: 28, img: 'assets/heart.svg', msg: '❤️ Yêu em mãi' },
  DIAMOND: { emoji: '💎', name: 'Kim cương', pts: 200, w: 1, sz: 38, hr: 20, img: 'assets/diamond.svg', msg: '💎 Quý giá như em' },
  RING: { emoji: '💍', name: 'Nhẫn cầu hôn', pts: 300, w: 1, sz: 38, hr: 20, img: 'assets/ring.svg', msg: '💍 Mãi bên em' },
  ROCK: { emoji: '🪨', name: 'Đá', pts: 5, w: 5, sz: 52, hr: 30, img: 'assets/rock.svg', msg: '🪨 Đá vô dụng' },
  CLOUD: { emoji: '☁️', name: 'Mây', pts: 0, w: 0, sz: 48, hr: 28, img: 'assets/cloud.svg', msg: '☁️ Bay mất rồi' },
  TNT: { emoji: '🧨', name: 'TNT', pts: 0, w: 1, sz: 40, hr: 22, img: 'assets/tnt.svg', msg: '💥 Nổ!' },
  MYPHOTO: { emoji: '📸', name: 'Ảnh của bạn', pts: 1000, w: 4, sz: 44, hr: 18, msg: '📸 Người anh yêu' },
};

// ---- LỜI CHÚC KHI NHẶT THƯ TÌNH ----
const LOVE_MESSAGES = [
  '👸 Công chúa anh năm nay up skill thiệt sịn nà!',
  '💕 Mãi bên anh Tồ nhoaa bé!',
  '🔥 Bé iuu mãi đỉnh!',
  '💖 Tồ yêu bé!',
  '🌟 Bé giỏi giang quá xá à nha!',
  '💎 Bé là number 1 của Tồ luôn nè!',
  '🚀 Năm nay bé lên level thiệt xịn nha!',
  '😘 Tồ tự hào vì bé lắm luôn á!',
  '💕 Bé cố lên nha, Tồ luôn ở đây cổ vũ bé!',
  '👑 Công chúa của anh mãi toả sáng nhoaa!',
  '🌹 Valentine vui nha bé iuu của Tồ!',
  '💖 Bé là điều tuyệt vời nhất của anh Tồ!',
];

const LEVELS = [
  {
    name: 'Tình yêu nảy nở 🌱', target: 300, time: 60, swing: 1.8,
    spawn: [['LETTER', 4], ['CHOCOLATE', 3], ['ROSE', 2], ['TEDDY', 1], ['ROCK', 2], ['CLOUD', 1], ['MYPHOTO', 1]]
  },
  {
    name: 'Yêu thương lớn dần 🌸', target: 500, time: 55, swing: 2.2,
    spawn: [['LETTER', 3], ['CHOCOLATE', 3], ['ROSE', 2], ['TEDDY', 2], ['HEART', 1], ['DIAMOND', 1], ['ROCK', 3], ['CLOUD', 2], ['TNT', 1], ['MYPHOTO', 1]]
  },
  {
    name: 'Tình yêu bất diệt 💖', target: 700, time: 50, swing: 2.6,
    spawn: [['LETTER', 2], ['CHOCOLATE', 2], ['ROSE', 2], ['TEDDY', 1], ['HEART', 2], ['DIAMOND', 1], ['RING', 1], ['ROCK', 4], ['CLOUD', 2], ['TNT', 1], ['MYPHOTO', 1]]
  },
];

const HOOK = { min: 20, maxAng: Math.PI * 0.42, shootSpd: 380, retractSpd: 280 };

// ---- UTILS ----
const lerp = (a, b, t) => a + (b - a) * t;
const dist = (x1, y1, x2, y2) => Math.hypot(x1 - x2, y1 - y2);
const rand = (a, b) => a + Math.random() * (b - a);
const randInt = (a, b) => Math.floor(rand(a, b + 1));

// ---- SIMPLE AUDIO (Web Audio API) ----
class SFX {
  constructor() {
    this.ctx = null;
    try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch { }
  }
  unlock() { if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); }
  play(freq, dur, type = 'sine', vol = 0.12) {
    if (!this.ctx) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
    o.connect(g); g.connect(this.ctx.destination);
    o.start(); o.stop(this.ctx.currentTime + dur);
  }
  grab() { this.play(880, 0.15, 'sine', 0.1); this.play(1100, 0.12, 'sine', 0.08); }
  shoot() { this.play(220, 0.1, 'square', 0.06); }
  miss() { this.play(150, 0.2, 'triangle', 0.05); }
  combo() { this.play(660, 0.1); this.play(880, 0.1); setTimeout(() => this.play(1100, 0.15), 80); }
  fever() { [660, 880, 1100, 1320].forEach((f, i) => setTimeout(() => this.play(f, 0.15), i * 60)); }
  gift() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => this.play(f, 0.2, 'sine', 0.15), i * 100)); }
  boom() { this.play(80, 0.3, 'sawtooth', 0.15); this.play(120, 0.2, 'square', 0.1); }
}

// ---- BACKGROUND MUSIC (Procedural Web Audio API) ----
class BGM {
  constructor() {
    this.ctx = null;
    this.playing = false;
    this.masterGain = null;
    this.interval = null;
    this.volume = 0.35;
    try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch { }
  }

  start() {
    if (!this.ctx || this.playing) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    this.playing = true;

    // Master volume
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.volume;
    this.masterGain.connect(this.ctx.destination);

    // Chord progressions (romantic): C - Am - F - G
    const chords = [
      [261.63, 329.63, 392.00],  // C major
      [220.00, 261.63, 329.63],  // A minor
      [174.61, 220.00, 261.63],  // F major
      [196.00, 246.94, 293.66],  // G major
    ];

    // Melody notes for arpeggio
    const melodies = [
      [523.25, 659.25, 783.99, 659.25],  // C5 E5 G5 E5
      [440.00, 523.25, 659.25, 523.25],  // A4 C5 E5 C5
      [349.23, 440.00, 523.25, 440.00],  // F4 A4 C5 A4
      [392.00, 493.88, 587.33, 493.88],  // G4 B4 D5 B4
    ];

    let chordIdx = 0;
    let noteIdx = 0;
    const bpm = 72;
    const beatDur = 60 / bpm;

    // Play pad chord
    const playPad = () => {
      if (!this.playing || !this.ctx) return;
      const chord = chords[chordIdx];
      chord.forEach(freq => {
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = 'sine';
        o.frequency.value = freq;
        g.gain.setValueAtTime(0, this.ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + 0.3);
        g.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + beatDur * 3.5);
        g.gain.linearRampToValueAtTime(0, this.ctx.currentTime + beatDur * 4);
        o.connect(g); g.connect(this.masterGain);
        o.start(); o.stop(this.ctx.currentTime + beatDur * 4);
      });
    };

    // Play arpeggio note
    const playNote = () => {
      if (!this.playing || !this.ctx) return;
      const freq = melodies[chordIdx][noteIdx];
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'triangle';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0, this.ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + beatDur * 0.9);
      o.connect(g); g.connect(this.masterGain);
      o.start(); o.stop(this.ctx.currentTime + beatDur);

      noteIdx++;
      if (noteIdx >= 4) {
        noteIdx = 0;
        chordIdx = (chordIdx + 1) % chords.length;
      }
    };

    // Start music loop
    playPad();
    playNote();
    let beat = 0;
    this.interval = setInterval(() => {
      if (!this.playing) { clearInterval(this.interval); return; }
      beat++;
      playNote();
      if (beat % 4 === 0) playPad();
    }, beatDur * 1000);
  }

  stop() {
    this.playing = false;
    if (this.interval) { clearInterval(this.interval); this.interval = null; }
    if (this.masterGain) {
      try { this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5); } catch { }
    }
  }

  setVolume(v) {
    this.volume = v;
    if (this.masterGain) this.masterGain.gain.value = v;
  }
}

// ---- PARTICLE ----
class Particle {
  constructor(x, y, opts = {}) {
    this.x = x; this.y = y;
    this.vx = opts.vx || rand(-100, 100); this.vy = opts.vy || rand(-160, -30);
    this.life = opts.life || rand(0.5, 1.2); this.maxLife = this.life;
    this.color = opts.color || '#ff4d8d';
    this.size = opts.size || rand(2, 6);
    this.gravity = opts.gravity ?? 180;
    this.emoji = opts.emoji || null;
    this.emojiSize = opts.emojiSize || 16;
  }
  update(dt) {
    this.x += this.vx * dt; this.y += this.vy * dt;
    this.vy += this.gravity * dt; this.life -= dt;
  }
  draw(ctx) {
    const a = Math.max(0, this.life / this.maxLife);
    ctx.globalAlpha = a;
    if (this.emoji) {
      ctx.font = `${this.emojiSize}px serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(this.emoji, this.x, this.y);
    } else {
      ctx.fillStyle = this.color;
      ctx.beginPath(); ctx.arc(this.x, this.y, this.size * a, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}

// ---- SCORE POPUP ----
class Popup {
  constructor(x, y, text, color = '#ffc857') {
    this.x = x; this.y = y; this.text = text; this.color = color; this.life = 1.4; this.maxLife = 1.4;
  }
  update(dt) { this.y -= 50 * dt; this.life -= dt; }
  draw(ctx) {
    const a = Math.max(0, this.life / this.maxLife);
    const s = 14 + 8 * (1 - a);
    ctx.globalAlpha = a;
    ctx.font = `800 ${s}px 'Baloo 2',cursive`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    // outline
    ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 3;
    ctx.strokeText(this.text, this.x, this.y);
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, this.x, this.y);
    ctx.globalAlpha = 1;
  }
}

// ---- BG RENDERER ----
class BGRenderer {
  constructor(canvas) {
    this.c = canvas; this.ctx = canvas.getContext('2d');
    this.hearts = []; this.resize(); this.initHearts();
    window.addEventListener('resize', () => this.resize());
  }
  resize() { this.c.width = window.innerWidth; this.c.height = window.innerHeight; }
  initHearts() {
    const emojis = ['💕', '❤️', '💖', '🌹', '✨', '💗', '💘'];
    for (let i = 0; i < 18; i++) {
      this.hearts.push({
        x: rand(0, window.innerWidth), y: rand(0, window.innerHeight),
        vy: rand(-15, -5), vx: rand(-5, 5), size: rand(10, 22),
        emoji: emojis[randInt(0, emojis.length - 1)],
        alpha: rand(0.06, 0.15), phase: rand(0, Math.PI * 2)
      });
    }
  }
  draw(t) {
    const ctx = this.ctx, W = this.c.width, H = this.c.height;
    ctx.clearRect(0, 0, W, H);
    // gradient bg
    const g = ctx.createRadialGradient(W * 0.3, H * 0.3, 0, W * 0.5, H * 0.5, W * 0.8);
    g.addColorStop(0, '#1a0533'); g.addColorStop(0.5, '#0d0221'); g.addColorStop(1, '#050111');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // stars
    for (let i = 0; i < 40; i++) {
      const sx = (i * 137 + 23) % W, sy = (i * 97 + 11) % H;
      const twinkle = 0.3 + 0.7 * Math.abs(Math.sin(t * 0.001 + i * 0.7));
      ctx.globalAlpha = twinkle * 0.4;
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(sx, sy, 0.8 + twinkle * 0.5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    // hearts
    this.hearts.forEach(h => {
      h.y += h.vy * 0.016; h.x += Math.sin(t * 0.001 + h.phase) * 0.3;
      if (h.y < -30) { h.y = H + 30; h.x = rand(0, W); }
      ctx.globalAlpha = h.alpha;
      ctx.font = `${h.size}px serif`;
      ctx.textAlign = 'center';
      ctx.fillText(h.emoji, h.x, h.y);
    });
    ctx.globalAlpha = 1;
  }
}

// ==========================================
// MAIN GAME
// ==========================================
class Game {
  constructor() {
    this.gc = document.getElementById('game-canvas');
    this.ctx = this.gc.getContext('2d');
    this.sfx = new SFX();
    this.bgm = new BGM();
    this.bg = new BGRenderer(document.getElementById('bg-canvas'));
    this.screens = {};
    ['screen-welcome', 'screen-level', 'screen-game', 'screen-result', 'screen-end']
      .forEach(id => this.screens[id] = document.getElementById(id));

    // State
    this.names = ['Bạn', 'Người yêu'];
    this.lvl = 0; this.score = 0; this.total = 0; this.timer = 0;
    this.items = []; this.particles = []; this.popups = [];
    this.hookAng = 0; this.hookLen = HOOK.min; this.hookSt = 'SWING';
    this.shootAng = 0; this.grabbed = null; this.swingT = 0;
    this.combo = 0; this.multi = 1; this.fever = false; this.feverT = 0;
    this.paused = true; this.lastT = 0;
    this.pivotX = 0; this.pivotY = 0; this.maxLen = 0;
    this.groundY = 0; this.shakeT = 0; this.config = null;
    this.gameTime = 0; // for item bobbing
    this.loveMsg = null; this.loveMsgT = 0; this.loveMsgDur = 3.5; // love message overlay

    // Photos
    this.photoMe = null;     // Image object for user's photo
    this.photoLover = null;  // Image object for lover's photo

    // Preload item images
    this.itemImages = {};
    Object.entries(ITEMS).forEach(([key, def]) => {
      if (def.img) {
        const img = new Image();
        img.src = def.img;
        this.itemImages[key] = img;
      }
    });

    this.init();
  }

  init() {
    this.loadConfig();
    this.setupUI();
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Input
    const shoot = (e) => { e.preventDefault(); this.sfx.unlock(); this.shoot(); };
    this.gc.addEventListener('click', shoot);
    this.gc.addEventListener('touchstart', shoot, { passive: false });
    document.addEventListener('keydown', e => {
      if (e.code === 'Space') { e.preventDefault(); this.sfx.unlock(); this.shoot(); }
    });

    this.lastT = performance.now();
    requestAnimationFrame(t => this.loop(t));
  }

  loadConfig() {
    try { this.config = JSON.parse(localStorage.getItem('valentine_gold_miner_config')); } catch { }
    if (!this.config) this.config = { password: 'love2026', gifts: [{ name: '', desc: '', msg: '', img: '' }, { name: '', desc: '', msg: '', img: '' }, { name: '', desc: '', msg: '', img: '' }] };
  }

  setupUI() {
    const $ = id => document.getElementById(id);
    $('btn-start').onclick = () => this.startGame();
    $('btn-play').onclick = () => this.beginPlay();
    $('btn-next').onclick = () => this.nextLevel();
    $('btn-restart').onclick = () => this.restart();
    $('gift-box').onclick = () => this.openGift();

    // Photo uploads
    $('photo-me').addEventListener('change', (e) => this.handlePhoto(e, 'me'));
    $('photo-lover').addEventListener('change', (e) => this.handlePhoto(e, 'lover'));
  }

  handlePhoto(e, who) {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      if (who === 'me') this.photoMe = img;
      else this.photoLover = img;
      // Update preview
      const preview = document.getElementById(who === 'me' ? 'preview-me' : 'preview-lover');
      preview.innerHTML = '';
      const previewImg = document.createElement('img');
      previewImg.src = url;
      preview.appendChild(previewImg);
      preview.classList.add('has-photo');
    };
    img.src = url;
  }

  show(id) {
    Object.values(this.screens).forEach(s => s.classList.remove('active'));
    this.screens[id].classList.add('active');
    // re-trigger animation
    const card = this.screens[id].querySelector('.glass-card,.animate-in');
    if (card) { card.classList.remove('animate-in'); void card.offsetWidth; card.classList.add('animate-in'); }
  }

  resize() {
    const wrap = document.querySelector('.game-wrap');
    const hud = document.getElementById('hud');
    const W = wrap ? Math.min(wrap.clientWidth, 500) : Math.min(window.innerWidth, 500);
    const hudH = hud ? hud.offsetHeight : 56;
    const H = window.innerHeight - hudH;
    this.gc.width = W; this.gc.height = Math.max(H, 350);
    this.pivotX = this.gc.width / 2;
    this.pivotY = 55;
    this.groundY = this.gc.height * 0.12;
    this.maxLen = this.gc.height - 30;
  }

  // ---- FLOW ----
  startGame() {
    const n1 = document.getElementById('inp-name1').value.trim() || 'Bạn';
    const n2 = document.getElementById('inp-name2').value.trim() || 'Người yêu';
    this.names = [n1, n2]; this.total = 0; this.lvl = 0;
    this.showLevelIntro();
  }

  showLevelIntro() {
    const lv = LEVELS[this.lvl];
    document.getElementById('level-badge').textContent = `LEVEL ${this.lvl + 1}`;
    document.getElementById('level-title').textContent = lv.name;
    document.getElementById('stat-target').textContent = lv.target;
    document.getElementById('stat-time').textContent = lv.time + 's';
    // item preview
    const preview = document.getElementById('item-preview');
    const types = [...new Set(lv.spawn.map(s => s[0]))];
    preview.innerHTML = types.map(t => `<span title="${ITEMS[t].name}">${ITEMS[t].emoji}</span>`).join('');
    this.show('screen-level');
  }

  beginPlay() {
    const lv = LEVELS[this.lvl];
    this.score = 0; this.timer = lv.time; this.combo = 0; this.multi = 1;
    this.fever = false; this.feverT = 0;
    this.hookSt = 'SWING'; this.hookLen = HOOK.min; this.swingT = 0;
    this.grabbed = null; this.particles = []; this.popups = [];
    this.shakeT = 0; this.gameTime = 0;
    this.show('screen-game');
    this.resize();
    this.generateItems(lv);
    this.updateHUD();
    this.paused = false;
    this.bgm.start();
  }

  generateItems(lv) {
    this.items = [];
    const W = this.gc.width;
    const H = this.gc.height;
    const topY = this.groundY + 35;
    const botY = H - 30;
    const leftX = 30;
    const rightX = W - 30;
    // Separate MYPHOTO from regular items
    const regularSpawn = lv.spawn.filter(([t]) => t !== 'MYPHOTO');
    const photoCount = lv.spawn.filter(([t]) => t === 'MYPHOTO').reduce((s, [_, c]) => s + c, 0);
    // Count regular items
    let total = 0;
    regularSpawn.forEach(([_, c]) => total += c);
    // Create grid cells for regular items
    const cols = Math.ceil(Math.sqrt(total * (rightX - leftX) / (botY - topY)));
    const rows = Math.ceil(total / cols);
    const cellW = (rightX - leftX) / cols;
    const cellH = (botY - topY) / rows;
    // Flatten regular items
    const allTypes = [];
    regularSpawn.forEach(([type, count]) => {
      for (let i = 0; i < count; i++) allTypes.push(type);
    });
    // Shuffle
    for (let i = allTypes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allTypes[i], allTypes[j]] = [allTypes[j], allTypes[i]];
    }
    // Place regular items in grid
    let idx = 0;
    for (let r = 0; r < rows && idx < allTypes.length; r++) {
      for (let c = 0; c < cols && idx < allTypes.length; c++) {
        const type = allTypes[idx++];
        const def = ITEMS[type];
        const cx = leftX + (c + 0.5) * cellW + rand(-cellW * 0.3, cellW * 0.3);
        const cy = topY + (r + 0.5) * cellH + rand(-cellH * 0.25, cellH * 0.25);
        const x = Math.max(leftX, Math.min(rightX, cx));
        const y = Math.max(topY, Math.min(botY, cy));
        this.items.push({
          type, ...def, x, y, baseY: y, collected: false,
          phase: rand(0, Math.PI * 2), bobSpeed: rand(0.8, 1.5)
        });
      }
    }
    // Place MYPHOTO at the very bottom (high difficulty)
    for (let i = 0; i < photoCount; i++) {
      const def = ITEMS.MYPHOTO;
      const deepZoneTop = botY - (botY - topY) * 0.25;
      const x = rand(leftX + 40, rightX - 40);
      const y = rand(deepZoneTop, botY - 10);
      this.items.push({
        type: 'MYPHOTO', ...def, x, y, baseY: y, collected: false,
        phase: rand(0, Math.PI * 2), bobSpeed: rand(0.6, 1.0)
      });
    }
  }

  endLevel() {
    this.paused = true;
    this.bgm.stop();
    const lv = LEVELS[this.lvl];
    const won = this.score >= lv.target;
    this.total += this.score;

    document.getElementById('result-icon').textContent = won ? '🎉' : '😊';
    document.getElementById('result-title').textContent = won ? 'Tuyệt Vời!' : 'Hết Giờ!';
    document.getElementById('result-score').textContent = this.score;

    // Stars
    const starsWrap = document.getElementById('stars-wrap');
    const ratio = this.score / lv.target;
    const starCount = ratio >= 1.5 ? 3 : ratio >= 1 ? 2 : ratio >= 0.5 ? 1 : 0;
    starsWrap.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const s = document.createElement('span');
      s.className = 'star' + (i < starCount ? ' lit' : '');
      s.textContent = '⭐'; starsWrap.appendChild(s);
    }

    // Gift
    const giftArea = document.getElementById('gift-area');
    const noGift = document.getElementById('no-gift-area');
    const giftContent = document.getElementById('gift-reveal');
    const giftBox = document.getElementById('gift-box');
    giftArea.classList.add('hidden'); noGift.classList.add('hidden');
    giftContent.classList.add('hidden'); giftBox.classList.remove('opened');

    if (won) {
      const gift = this.config.gifts[this.lvl];
      if (gift && gift.name) giftArea.classList.remove('hidden');
      else noGift.classList.remove('hidden');
    }

    document.getElementById('btn-next').querySelector('span').textContent =
      this.lvl < LEVELS.length - 1 ? 'Level Tiếp' : 'Xem Kết Quả';
    this.show('screen-result');
  }

  openGift() {
    const gift = this.config.gifts[this.lvl];
    if (!gift || !gift.name) return;
    document.getElementById('gift-box').classList.add('opened');
    document.getElementById('gift-name').textContent = gift.name;
    document.getElementById('gift-desc').textContent = gift.desc || '';
    document.getElementById('gift-msg').textContent = gift.msg || '';
    const img = document.getElementById('gift-img');
    if (gift.img) { img.src = gift.img; img.classList.remove('hidden'); } else { img.classList.add('hidden'); }
    document.getElementById('gift-reveal').classList.remove('hidden');
    this.sfx.gift();
  }

  nextLevel() {
    this.lvl++;
    if (this.lvl >= LEVELS.length) this.showEnd();
    else this.showLevelIntro();
  }

  showEnd() {
    document.getElementById('end-total').textContent = `Tổng: ${this.total} ⭐`;
    document.getElementById('end-msg').textContent =
      `${this.names[0]} & ${this.names[1]} — Chúc hai bạn mãi hạnh phúc bên nhau! 💕`;
    this.show('screen-end');
  }

  restart() { this.total = 0; this.lvl = 0; this.show('screen-welcome'); }

  // ---- HOOK ----
  shoot() {
    if (this.paused || this.hookSt !== 'SWING') return;
    this.shootAng = this.hookAng;
    this.hookSt = 'SHOOT'; this.hookLen = HOOK.min;
    this.sfx.shoot();
  }

  updateHook(dt) {
    const lv = LEVELS[this.lvl];
    if (this.hookSt === 'SWING') {
      this.swingT += dt;
      this.hookAng = HOOK.maxAng * Math.sin(this.swingT * lv.swing);
      this.hookLen = HOOK.min;
    } else if (this.hookSt === 'SHOOT') {
      this.hookLen += HOOK.shootSpd * dt;
      const ang = this.shootAng;
      const tx = this.pivotX + Math.sin(ang) * this.hookLen;
      const ty = this.pivotY + Math.cos(ang) * this.hookLen;
      for (const it of this.items) {
        if (it.collected) continue;
        if (dist(tx, ty, it.x, it.y) < it.hr + 6) {
          if (it.type === 'CLOUD') {
            it.collected = true;
            for (let i = 0; i < 6; i++) this.particles.push(new Particle(it.x, it.y, { color: '#fff', gravity: 40, vy: rand(-60, 0), size: rand(3, 8) }));
            this.popups.push(new Popup(it.x, it.y - 10, 'Poof~', '#aaa'));
            this.sfx.miss();
            this.hookSt = 'RETRACT'; this.grabbed = null;
          } else {
            this.grabbed = it; this.hookSt = 'RETRACT';
          }
          break;
        }
      }
      if (this.hookLen > this.maxLen || tx < -10 || tx > this.gc.width + 10 || ty > this.gc.height + 10) {
        this.hookSt = 'RETRACT';
      }
    } else if (this.hookSt === 'RETRACT') {
      const w = this.grabbed ? this.grabbed.w : 0;
      const spd = HOOK.retractSpd / (1 + w * 0.4);
      this.hookLen -= spd * dt;
      if (this.grabbed) {
        const a = this.shootAng;
        this.grabbed.x = this.pivotX + Math.sin(a) * this.hookLen;
        this.grabbed.y = this.pivotY + Math.cos(a) * this.hookLen;
      }
      if (this.hookLen <= HOOK.min) {
        if (this.grabbed) this.collect(this.grabbed);
        this.grabbed = null; this.hookSt = 'SWING';
      }
    }
  }

  collect(item) {
    item.collected = true;

    // Special: MYPHOTO = instant level pass!
    if (item.type === 'MYPHOTO') {
      const bonus = 1000 * this.multi;
      this.score += bonus;
      // Big celebration effect
      for (let i = 0; i < 20; i++) {
        this.particles.push(new Particle(this.pivotX, this.pivotY, {
          color: ['#ffc857', '#ff4d8d', '#c67dff', '#00d2ff', '#ff6600'][randInt(0, 4)],
          size: rand(3, 8), vy: rand(-200, -60), vx: rand(-120, 120), life: rand(1, 2)
        }));
      }
      // Emoji burst
      ['💖', '✨', '🎉', '💕', '⭐'].forEach((em) => {
        this.particles.push(new Particle(this.pivotX + rand(-30, 30), this.pivotY - 10, {
          emoji: em, emojiSize: 24, vy: rand(-140, -60), vx: rand(-80, 80), gravity: 100, life: 1.5
        }));
      });
      this.popups.push(new Popup(this.pivotX, this.pivotY - 20, '💖 +' + bonus + ' gold!', '#ff4d8d'));
      this.popups.push(new Popup(this.pivotX, this.pivotY - 50, '🎉 QUA MÀN!', '#ffc857'));
      this.sfx.fever(); this.sfx.gift(); this.shakeT = 0.4;
      this.updateHUD();
      // Auto win after short delay
      setTimeout(() => {
        if (this.score >= LEVELS[this.lvl].target) this.endLevel();
        else { this.score = LEVELS[this.lvl].target; this.endLevel(); }
      }, 1200);
      return;
    }

    if (item.type === 'TNT') {
      let bonus = 0;
      this.items.forEach(it => {
        if (it.type === 'ROCK' && !it.collected) {
          it.collected = true;
          for (let i = 0; i < 8; i++) this.particles.push(new Particle(it.x, it.y, { color: ['#ff4400', '#ff8800', '#ffcc00'][randInt(0, 2)], size: rand(3, 8) }));
          bonus += 20;
        }
      });
      for (let i = 0; i < 12; i++) this.particles.push(new Particle(this.pivotX, this.pivotY + 20, { color: '#ff4400', size: rand(4, 9) }));
      this.popups.push(new Popup(this.pivotX, this.pivotY, '💥 BOOM!', '#ff4400'));
      if (bonus > 0) { this.score += bonus; this.popups.push(new Popup(this.pivotX, this.pivotY + 25, '+' + bonus + ' gold', '#ffc857')); }
      this.sfx.boom(); this.shakeT = 0.3;
      this.combo = 0; this.multi = 1;
    } else {
      const pts = item.pts * this.multi;
      this.score += pts;
      // particles
      const colors = item.pts >= 150 ? ['#ffc857', '#ff4d8d', '#c67dff'] : ['#ffc857', '#ffaa00'];
      for (let i = 0; i < 8; i++) this.particles.push(new Particle(this.pivotX, this.pivotY + 15, { color: colors[randInt(0, colors.length - 1)], size: rand(2, 6) }));
      // emoji particle
      this.particles.push(new Particle(this.pivotX, this.pivotY - 10, { emoji: item.emoji, emojiSize: 20, vy: -100, gravity: 100, life: 1 }));

      // Show item message + gold
      if (item.msg) {
        this.popups.push(new Popup(this.pivotX, this.pivotY - 25, item.msg, '#fff'));
      }
      this.popups.push(new Popup(this.pivotX, this.pivotY + 5, '+' + pts + ' gold' + (this.multi > 1 ? ' x' + this.multi : ''), this.multi >= 3 ? '#ff4400' : '#ffc857'));

      // LETTER: show special love message
      if (item.type === 'LETTER') {
        const msg = LOVE_MESSAGES[randInt(0, LOVE_MESSAGES.length - 1)];
        this.showLoveMessage(msg);
        this.sfx.gift();
      } else {
        this.sfx.grab();
      }

      // Combo
      if (item.type !== 'ROCK') {
        this.combo++;
        if (this.combo >= 5 && !this.fever) {
          this.fever = true; this.feverT = 8; this.multi = 3;
          this.popups.push(new Popup(this.pivotX, this.pivotY - 50, '🔥 FEVER x3!', '#ff4400'));
          this.sfx.fever(); this.shakeT = 0.2;
        } else if (this.combo >= 3 && !this.fever) { this.multi = 2; this.sfx.combo(); }
      } else { this.combo = 0; this.multi = this.fever ? 3 : 1; }
      // Shake for heavy items
      if (item.w >= 3) this.shakeT = 0.15;
    }
    this.updateHUD();
  }

  // ---- LOVE MESSAGE OVERLAY ----
  showLoveMessage(msg) {
    this.loveMsg = msg;
    this.loveMsgT = this.loveMsgDur;
  }

  // ---- HUD ----
  updateHUD() {
    const lv = LEVELS[this.lvl];
    document.getElementById('hud-time').textContent = Math.ceil(this.timer);
    document.getElementById('hud-score').textContent = this.score;
    document.getElementById('hud-target-label').textContent = '🎯 ' + lv.target;
    // progress
    const pct = Math.min(100, (this.score / lv.target) * 100);
    document.getElementById('hud-progress').style.width = pct + '%';
    // timer ring
    const ring = document.getElementById('timer-ring');
    const frac = this.timer / lv.time;
    ring.style.strokeDashoffset = 113 * (1 - frac);
    ring.classList.toggle('danger', this.timer <= 10);
    // combo
    const cb = document.getElementById('combo-badge');
    if (this.multi > 1) { cb.classList.remove('hidden'); document.getElementById('combo-text').textContent = 'x' + this.multi; }
    else cb.classList.add('hidden');
  }

  // ---- UPDATE ----
  update(dt) {
    if (this.paused) return;
    this.gameTime += dt;
    // Timer
    this.timer -= dt;
    if (this.timer <= 0) { this.timer = 0; this.endLevel(); return; }
    // All collected?
    if (this.items.length > 0 && this.items.every(it => it.collected) && this.hookSt === 'SWING') {
      const bonus = Math.floor(this.timer) * 10;
      this.score += bonus;
      if (bonus > 0) this.popups.push(new Popup(this.pivotX, this.pivotY, '⏱️+' + bonus, '#00d2ff'));
      this.timer = 0; this.endLevel(); return;
    }
    // Fever
    if (this.fever) { this.feverT -= dt; if (this.feverT <= 0) { this.fever = false; this.multi = this.combo >= 3 ? 2 : 1; } }
    // Shake
    if (this.shakeT > 0) this.shakeT -= dt;
    if (this.loveMsgT > 0) this.loveMsgT -= dt;
    // Hook
    this.updateHook(dt);
    this.updateHUD();
    // Item bobbing
    this.items.forEach(it => {
      if (!it.collected && !this.grabbed?.x === it.x) {
        it.y = it.baseY + Math.sin(this.gameTime * it.bobSpeed + it.phase) * 4;
      }
    });
    // Particles
    this.particles.forEach(p => p.update(dt));
    this.particles = this.particles.filter(p => p.life > 0);
    this.popups.forEach(p => p.update(dt));
    this.popups = this.popups.filter(p => p.life > 0);
  }

  // ---- RENDER ----
  render() {
    const ctx = this.ctx, W = this.gc.width, H = this.gc.height;
    ctx.save();
    // Screen shake
    if (this.shakeT > 0) {
      ctx.translate(rand(-3, 3), rand(-3, 3));
    }
    ctx.clearRect(-5, -5, W + 10, H + 10);

    // ---- Sky ----
    const sky = ctx.createLinearGradient(0, 0, 0, this.groundY);
    sky.addColorStop(0, '#0d0221');
    sky.addColorStop(1, '#1a0840');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, this.groundY);

    // Twinkling stars
    const t = this.gameTime;
    for (let i = 0; i < 15; i++) {
      const sx = (i * 71 + 13) % W, sy = (i * 37 + 5) % (this.groundY - 5);
      const tw = 0.3 + 0.7 * Math.abs(Math.sin(t * 2 + i * 1.3));
      ctx.globalAlpha = tw * 0.5;
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(sx, sy, 0.8, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // ---- Underground ----
    const ugGrad = ctx.createLinearGradient(0, this.groundY, 0, H);
    ugGrad.addColorStop(0, '#4a2810');
    ugGrad.addColorStop(0.3, '#3a1e0a');
    ugGrad.addColorStop(0.7, '#2a1508');
    ugGrad.addColorStop(1, '#1a0e04');
    ctx.fillStyle = ugGrad;
    ctx.fillRect(0, this.groundY, W, H - this.groundY);

    // Ground surface
    ctx.fillStyle = '#3d6b2e';
    ctx.fillRect(0, this.groundY - 4, W, 8);
    // Grass tufts
    ctx.fillStyle = '#4a8a35';
    for (let gx = 3; gx < W; gx += 12) {
      const gh = rand(4, 9);
      ctx.fillRect(gx, this.groundY - gh, 2, gh);
    }

    // Soil layers (subtle horizontal lines)
    ctx.strokeStyle = 'rgba(90,60,30,0.15)'; ctx.lineWidth = 1;
    for (let ly = this.groundY + 60; ly < H; ly += 50) {
      ctx.beginPath();
      ctx.moveTo(0, ly + rand(-5, 5));
      for (let lx = 30; lx <= W; lx += 30) ctx.lineTo(lx, ly + rand(-3, 3));
      ctx.stroke();
    }

    // Small dots (soil texture)
    ctx.fillStyle = 'rgba(120,80,40,0.12)';
    for (let i = 0; i < 30; i++) {
      const dx = (i * 83 + 17) % W, dy = this.groundY + 20 + (i * 67 + 31) % (H - this.groundY - 40);
      ctx.beginPath(); ctx.arc(dx, dy, 1.5, 0, Math.PI * 2); ctx.fill();
    }

    // ---- Items ----
    this.items.forEach(it => {
      if (it.collected) return;
      ctx.save();

      if (it.type === 'MYPHOTO') {
        // ---- SPARKLE PHOTO ITEM ----
        const radius = it.sz / 2;
        const sparklePhase = t * 3 + it.phase;

        // Outer sparkle ring
        const sparkColors = ['#ffc857', '#ff4d8d', '#00d2ff', '#c67dff', '#ff6600', '#fff'];
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI * 2 + sparklePhase;
          const sparkR = radius + 12 + Math.sin(sparklePhase * 2 + i) * 5;
          const sx = it.x + Math.cos(a) * sparkR;
          const sy = it.y + Math.sin(a) * sparkR;
          const sSize = 2 + Math.sin(t * 5 + i * 1.5) * 1.5;
          ctx.globalAlpha = 0.5 + Math.sin(t * 4 + i) * 0.4;
          ctx.fillStyle = sparkColors[i % sparkColors.length];
          // Draw star shape
          ctx.beginPath();
          for (let j = 0; j < 4; j++) {
            const sa = j * Math.PI / 2 + sparklePhase * 2;
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx + Math.cos(sa) * sSize, sy + Math.sin(sa) * sSize);
          }
          ctx.fill();
          // Also draw a dot
          ctx.beginPath(); ctx.arc(sx, sy, sSize * 0.6, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;

        // Glowing ring around photo
        const glowIntensity = 12 + Math.sin(sparklePhase) * 8;
        ctx.shadowColor = '#ffc857';
        ctx.shadowBlur = glowIntensity;
        ctx.strokeStyle = '#ffc857';
        ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(it.x, it.y, radius + 3, 0, Math.PI * 2); ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw photo as circle
        if (this.photoMe) {
          ctx.beginPath(); ctx.arc(it.x, it.y, radius, 0, Math.PI * 2); ctx.clip();
          const s = radius * 2;
          ctx.drawImage(this.photoMe, it.x - radius, it.y - radius, s, s);
        } else {
          // Fallback: emoji with glow
          ctx.shadowColor = '#ffc857'; ctx.shadowBlur = 20;
          ctx.font = `${it.sz}px serif`;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('📸', it.x, it.y);
        }
      } else {
        // ---- Regular items ----
        const radius = it.sz / 2;
        // Glow for rare items
        if (it.type === 'DIAMOND' || it.type === 'RING') {
          ctx.shadowColor = it.type === 'RING' ? '#ffc857' : '#00d2ff';
          ctx.shadowBlur = 14 + Math.sin(t * 3 + it.phase) * 6;
        } else if (it.type === 'TNT') {
          ctx.shadowColor = '#ff4400'; ctx.shadowBlur = 8 + Math.sin(t * 5) * 4;
        } else if (it.type === 'HEART') {
          ctx.shadowColor = '#ff3366'; ctx.shadowBlur = 10 + Math.sin(t * 2 + it.phase) * 4;
        }
        // Render image sprite or fallback to emoji
        const sprite = this.itemImages[it.type];
        if (sprite && sprite.complete && sprite.naturalWidth > 0) {
          const s = it.sz;
          ctx.drawImage(sprite, it.x - s / 2, it.y - s / 2, s, s);
        } else {
          ctx.font = `${it.sz}px serif`;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(it.emoji, it.x, it.y);
        }
      }
      ctx.restore();
    });

    // ---- Hook ----
    const ang = this.hookSt === 'SWING' ? this.hookAng : this.shootAng;
    const tipX = this.pivotX + Math.sin(ang) * this.hookLen;
    const tipY = this.pivotY + Math.cos(ang) * this.hookLen;

    // Rope
    ctx.strokeStyle = this.fever ? '#ff4400' : '#a08040';
    ctx.lineWidth = this.fever ? 3 : 2;
    ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(this.pivotX, this.pivotY); ctx.lineTo(tipX, tipY); ctx.stroke();

    // Rope segments (knots)
    if (this.hookLen > 60) {
      const segs = Math.floor(this.hookLen / 40);
      for (let i = 1; i <= segs; i++) {
        const frac = i / (segs + 1);
        const kx = this.pivotX + Math.sin(ang) * this.hookLen * frac;
        const ky = this.pivotY + Math.cos(ang) * this.hookLen * frac;
        ctx.fillStyle = this.fever ? '#ff6600' : '#c8a040';
        ctx.beginPath(); ctx.arc(kx, ky, 2.5, 0, Math.PI * 2); ctx.fill();
      }
    }

    // Claw
    const spread = this.grabbed ? 0.12 : 0.45;
    const clawLen = this.grabbed ? 10 : 15;
    ctx.strokeStyle = this.fever ? '#ff8800' : '#ffc857';
    ctx.lineWidth = 3; ctx.lineCap = 'round';
    [ang - spread, ang + spread].forEach(a => {
      ctx.beginPath(); ctx.moveTo(tipX, tipY);
      ctx.lineTo(tipX + Math.sin(a) * clawLen, tipY + Math.cos(a) * clawLen);
      ctx.stroke();
    });

    // Grabbed item
    if (this.grabbed) {
      ctx.font = `${this.grabbed.sz}px serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(this.grabbed.emoji, tipX, tipY + 20);
    }

    // Machine
    const mx = this.pivotX, my = this.pivotY;
    // Platform
    ctx.fillStyle = '#333'; ctx.beginPath();
    ctx.roundRect(mx - 28, my - 18, 56, 22, 8); ctx.fill();
    ctx.fillStyle = this.fever ? '#ff4400' : '#ff4d8d'; ctx.beginPath();
    ctx.roundRect(mx - 24, my - 16, 48, 18, 6); ctx.fill();
    // Avatar (lover's photo or emoji)
    if (this.photoLover) {
      ctx.save();
      ctx.beginPath(); ctx.arc(mx, my - 30, 15, 0, Math.PI * 2); ctx.clip();
      ctx.drawImage(this.photoLover, mx - 15, my - 45, 30, 30);
      ctx.restore();
      // Pink border
      ctx.strokeStyle = '#ff4d8d'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(mx, my - 30, 16, 0, Math.PI * 2); ctx.stroke();
    } else {
      ctx.font = '16px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(this.fever ? '🔥' : '💖', mx, my - 26);
    }
    // Wheel
    const wheelAng = this.gameTime * 3;
    ctx.save(); ctx.translate(mx - 18, my - 7); ctx.rotate(wheelAng);
    ctx.fillStyle = '#666'; ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#888'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(-4, 0); ctx.lineTo(4, 0); ctx.moveTo(0, -4); ctx.lineTo(0, 4); ctx.stroke();
    ctx.restore();
    ctx.save(); ctx.translate(mx + 18, my - 7); ctx.rotate(-wheelAng);
    ctx.fillStyle = '#666'; ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#888'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(-4, 0); ctx.lineTo(4, 0); ctx.moveTo(0, -4); ctx.lineTo(0, 4); ctx.stroke();
    ctx.restore();

    // Fever overlay
    if (this.fever) {
      ctx.fillStyle = 'rgba(255,68,0,0.05)';
      ctx.fillRect(0, 0, W, H);
      ctx.font = 'bold 13px Nunito'; ctx.fillStyle = '#ff4400'; ctx.textAlign = 'center';
      ctx.fillText(`🔥 FEVER x3 — ${Math.ceil(this.feverT)}s`, W / 2, this.groundY - 12);
    }

    // Particles & popups
    this.particles.forEach(p => p.draw(ctx));
    this.popups.forEach(p => p.draw(ctx));

    // ---- Love Message Overlay ----
    if (this.loveMsg && this.loveMsgT > 0) {
      const dur = this.loveMsgDur;
      const fadeIn = 0.4, fadeOut = 0.5;
      let alpha = 1;
      if (this.loveMsgT > dur - fadeIn) alpha = (dur - this.loveMsgT) / fadeIn;
      else if (this.loveMsgT < fadeOut) alpha = this.loveMsgT / fadeOut;
      alpha = Math.max(0, Math.min(1, alpha));

      // Semi-transparent backdrop
      ctx.globalAlpha = alpha * 0.55;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, W, H);

      // Message card
      const cardW = W * 0.85, cardH = 110;
      const cx = W / 2, cy = H * 0.4;
      ctx.globalAlpha = alpha;

      // Card background with rounded corners
      const rx = cx - cardW / 2, ry = cy - cardH / 2;
      ctx.fillStyle = 'rgba(60, 10, 30, 0.92)';
      ctx.beginPath(); ctx.roundRect(rx, ry, cardW, cardH, 16); ctx.fill();
      // Card border glow
      ctx.strokeStyle = 'rgba(255, 77, 141, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(rx, ry, cardW, cardH, 16); ctx.stroke();

      // Inner glow
      const grd = ctx.createRadialGradient(cx, cy, 10, cx, cy, cardW / 2);
      grd.addColorStop(0, 'rgba(255, 77, 141, 0.15)');
      grd.addColorStop(1, 'rgba(255, 77, 141, 0)');
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.roundRect(rx, ry, cardW, cardH, 16); ctx.fill();

      // Heart decorations
      ctx.font = '20px serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('💌', rx + 24, cy);
      ctx.fillText('💕', rx + cardW - 24, cy);

      // Message text - wrap lines
      ctx.font = "bold 14px 'Baloo 2', cursive";
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

      // Simple word-wrap
      const maxW = cardW - 80;
      const words = this.loveMsg.split(' ');
      const lines = []; let line = '';
      words.forEach(w => {
        const test = line ? line + ' ' + w : w;
        if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; }
        else line = test;
      });
      if (line) lines.push(line);

      const lineH = 22;
      const startY = cy - ((lines.length - 1) * lineH) / 2;
      lines.forEach((ln, i) => {
        ctx.fillText(ln, cx, startY + i * lineH);
      });

      ctx.globalAlpha = 1;
    }

    ctx.restore();
  }

  // ---- LOOP ----
  loop(t) {
    const dt = Math.min((t - this.lastT) / 1000, 0.05);
    this.lastT = t;
    // Always render BG
    this.bg.draw(t);
    // Game
    this.update(dt);
    if (this.screens['screen-game'].classList.contains('active')) this.render();
    requestAnimationFrame(ts => this.loop(ts));
  }
}

document.addEventListener('DOMContentLoaded', () => new Game());
