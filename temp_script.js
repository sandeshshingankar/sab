
// Disable automatic browser scroll restoration on reload
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Ensure page always starts at top on reload
window.scrollTo(0, 0);

// ================= ENTRY ENVELOPE =================
const entryScreen = document.getElementById('entryScreen');
const envelope = document.getElementById('envelope');
const enterBtn = document.getElementById('enterBtn');
const musicWrapper = document.getElementById('musicWrapper');
const musicToggle = document.getElementById('musicToggle');
const videoModal = document.getElementById('videoModal');
const videoModalClose = document.getElementById('videoModalClose');
const poemVideo = document.getElementById('poemVideo');

let bgAudioIframe = null;
let isBgMusicPlaying = false;

function triggerSparkleBurst(x, y) {
  const chars = ['💖', '✨', '🎵', '🎶', '🌸', '✨'];
  for (let i = 0; i < 8; i++) {
    const p = document.createElement('span');
    p.className = 'burst-particle';
    p.textContent = chars[Math.floor(Math.random() * chars.length)];
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    const angle = (i / 8) * Math.PI * 2;
    const dist = Math.random() * 50 + 30;
    p.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
    p.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 800);
  }
}

function initBgAudioIframe() {
  if (!bgAudioIframe) {
    bgAudioIframe = document.createElement('iframe');
    bgAudioIframe.id = 'bgSongIframe';
    bgAudioIframe.style.display = 'none';
    bgAudioIframe.allow = 'autoplay';
    // Aaj Din Chadheya YouTube ID: IImcBEHuDRI
    bgAudioIframe.src = 'https://www.youtube-nocookie.com/embed/IImcBEHuDRI?enablejsapi=1&rel=0&autoplay=0';
    document.body.appendChild(bgAudioIframe);
  }
}

function playAajDinChadheyaAudio() {
  initBgAudioIframe();
  if (bgAudioIframe && bgAudioIframe.contentWindow) {
    bgAudioIframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
  }
  isBgMusicPlaying = true;
  if (musicToggle) musicToggle.classList.add('playing');
}

function pauseAajDinChadheyaAudio() {
  if (bgAudioIframe && bgAudioIframe.contentWindow) {
    bgAudioIframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
  }
  isBgMusicPlaying = false;
  if (musicToggle) musicToggle.classList.remove('playing');
}

// openEntry: Unlocks envelope and scrolls to hero. DOES NOT AUTOPLAY SONG.
function openEntry(){
  if (envelope) envelope.classList.add('open');
  setTimeout(() => {
    if (entryScreen) entryScreen.classList.add('hidden');
    document.body.style.overflow = 'auto';
    if (musicWrapper) musicWrapper.classList.add('show');
  }, 700);
}

if (enterBtn) enterBtn.addEventListener('click', openEntry);
if (envelope) envelope.addEventListener('click', openEntry);
document.body.style.overflow = 'hidden';

// Reset state on load: show entry screen, scroll to top
window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

// Reveal music wrapper on load after delay
setTimeout(() => {
  if (musicWrapper) musicWrapper.classList.add('show');
}, 1200);

// Hover Play, MouseLeave Pause, Resume on Re-hover ONLY when cursor reaches #musicToggle
if (musicToggle) {
  // Mouseenter: Play or Resume from current time
  musicToggle.addEventListener('mouseenter', (e) => {
    const rect = musicToggle.getBoundingClientRect();
    triggerSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
    playAajDinChadheyaAudio();
  });

  // Mouseleave: Pause at current time
  musicToggle.addEventListener('mouseleave', () => {
    pauseAajDinChadheyaAudio();
  });

  // Touchstart & Touchend for Mobile Hover Simulation
  musicToggle.addEventListener('touchstart', () => {
    playAajDinChadheyaAudio();
  }, { passive: true });

  musicToggle.addEventListener('touchend', () => {
    pauseAajDinChadheyaAudio();
  }, { passive: true });

  // Click event: Pause background song and open download.mp4 video modal
  musicToggle.addEventListener('click', (e) => {
    pauseAajDinChadheyaAudio();
    if (videoModal) videoModal.classList.add('show');
    if (poemVideo) {
      poemVideo.currentTime = 0;
      poemVideo.play().catch(err => console.log('Autoplay handled:', err));
    }
  });
}

// Close Video Modal
if (videoModalClose) {
  videoModalClose.addEventListener('click', () => {
    if (videoModal) videoModal.classList.remove('show');
    if (poemVideo) poemVideo.pause();
  });
}

if (videoModal) {
  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) {
      videoModal.classList.remove('show');
      if (poemVideo) poemVideo.pause();
    }
  });
}

// ================= STARS IN ENTRY + HERO =================
function makeStars(container, count){
  if (!container) return;
  for(let i=0; i<count; i++){
    const s = document.createElement('div');
    s.className = 'star';
    const size = Math.random()*2.4 + 1;
    s.style.width = size + 'px';
    s.style.height = size + 'px';
    s.style.left = Math.random()*100 + '%';
    s.style.top = Math.random()*100 + '%';
    s.style.animationDelay = (Math.random()*3) + 's';
    container.appendChild(s);
  }
}
makeStars(document.getElementById('entryStars'), 70);
makeStars(document.getElementById('heroStars'), 50);

// ================= FLOATING PETALS IN HERO =================
const heroStarsEl = document.getElementById('heroStars');
if(heroStarsEl){
  const petals = ['🌸', '🌺', '✨', '💖'];
  for(let i=0; i<15; i++){
    const p = document.createElement('div');
    p.className = 'petal';
    p.textContent = petals[Math.floor(Math.random()*petals.length)];
    p.style.left = Math.random()*100 + '%';
    p.style.fontSize = (Math.random()*12 + 12) + 'px';
    p.style.animationDuration = (Math.random()*8 + 7) + 's';
    p.style.animationDelay = (Math.random()*5) + 's';
    heroStarsEl.appendChild(p);
  }
}

// ================= HEADER PROGRESS BAR =================
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight)*100 : 0;
  if(progressBar) progressBar.style.width = pct + '%';
});

// ================= REVEAL OBSERVER =================
const revealElements = document.querySelectorAll('.reveal, .reveal-item, .polaroid, .candle, .poem, .letter-card');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('in-view');
    }
  });
}, { threshold: 0.12 });
revealElements.forEach(el => observer.observe(el));

// ================= TIMELINE THREAD SVG =================
function updateTimelinePath(){
  const path = document.getElementById('timelinePath');
  const svg = document.getElementById('timelineSvg');
  if(!path || !svg) return;

  const dots = document.querySelectorAll('.timeline-dot');
  if(dots.length < 2) return;

  const svgRect = svg.getBoundingClientRect();
  let d = '';

  dots.forEach((dot, index) => {
    const r = dot.getBoundingClientRect();
    const x = r.left + r.width/2 - svgRect.left;
    const y = r.top + r.height/2 - svgRect.top;

    if(index === 0){
      d += `M ${x} ${y}`;
    } else {
      const prevDot = dots[index-1];
      const prevR = prevDot.getBoundingClientRect();
      const prevX = prevR.left + prevR.width/2 - svgRect.left;
      const prevY = prevR.top + prevR.height/2 - svgRect.top;
      const midY = (prevY + y) / 2;
      d += ` C ${prevX} ${midY}, ${x} ${midY}, ${x} ${y}`;
    }
  });

  path.setAttribute('d', d);
}
window.addEventListener('load', updateTimelinePath);
window.addEventListener('resize', updateTimelinePath);

// ================= FINALE HEARTS =================
const finaleSection = document.querySelector('.finale-section');
if(finaleSection){
  const hearts = ['❤️', '💖', '✨', '🌸', '💕'];
  for(let i=0; i<20; i++){
    const h = document.createElement('div');
    h.className = 'finale-heart';
    h.textContent = hearts[Math.floor(Math.random()*hearts.length)];
    h.style.left = Math.random()*100 + '%';
    h.style.bottom = '-30px';
    h.style.fontSize = (Math.random()*16 + 14) + 'px';
    h.style.animationDuration = (Math.random()*7 + 6) + 's';
    h.style.animationDelay = (Math.random()*6) + 's';
    finaleSection.appendChild(h);
  }
}

// ================= YOUTUBE CARD PLAYERS =================
const ytPlayers = document.querySelectorAll('.yt-player');
ytPlayers.forEach(player => {
  player.addEventListener('click', () => {
    const ytId = player.getAttribute('data-yt-id');
    if(!ytId) return;
    pauseAajDinChadheyaAudio();
    const title = player.getAttribute('data-yt-title') || 'Song';
    player.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&playsinline=1" title="${title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  });
});

// ================= CURSOR PARTICLES & TRAIL ANIMATION =================
let lastTrailTime = 0;
document.addEventListener('mousemove', (e) => {
  const now = Date.now();
  if (now - lastTrailTime < 40) return;
  lastTrailTime = now;

  const particle = document.createElement('div');
  particle.className = 'cursor-trail-particle';
  const symbols = ['✨', '💖', '💫', '🌸', '⭐', '❤️'];
  particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];

  const offsetX = (Math.random() - 0.5) * 10;
  const offsetY = (Math.random() - 0.5) * 10;

  particle.style.left = (e.clientX + offsetX) + 'px';
  particle.style.top = (e.clientY + offsetY) + 'px';
  document.body.appendChild(particle);

  setTimeout(() => particle.remove(), 750);
});

// ================= OUR SWEET MEMORIES LOGIC =================
const MEMORY_PASSWORD = "sanikasandesh2225";
const MEMORY_STORAGE_KEY = "sanika_sandesh_sweet_memories_v1";

const DEFAULT_MEMORIES = [
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                {
    id: "apology_mem_special",
    title: "🥺❤️ मला माफ करशील ना?",
    date: "08-08-2026",
    type: "photo",
    isSpecial: true,
    audioUrl: "Video-80226.mp3",
    createdAt: new Date().toISOString()
  },
  {
    id: "default_1",
    title: "पहिली भेट आणि ते गोड हसू",
    date: "२०२३-०८-१५",
    type: "photo",
    mediaUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='450' viewBox='0 0 600 450'><rect width='100%' height='100%' fill='%23521a29'/><circle cx='300' cy='200' r='100' fill='%23c9a24b' opacity='0.3'/><text x='50%' y='48%' font-family='serif' font-size='32' fill='%23eecf8a' text-anchor='middle'>सानिका &amp; संदेश</text><text x='50%' y='60%' font-family='sans-serif' font-size='20' fill='%23fbf3e6' text-anchor='middle'>सुंदर आठवणींचा प्रवास ❤️</text></svg>",
    caption: "तुझं ते पहिलं हसू अजूनही तसंच आठवतं... जणू कालचीच गोष्ट!",
    createdAt: new Date().toISOString()
  },
  {
    id: "default_2",
    title: "आपली निवांत कॉफी आणि गप्पा",
    date: "२०२४-०१-१०",
    type: "photo",
    mediaUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='450' viewBox='0 0 600 450'><rect width='100%' height='100%' fill='%23210a10'/><circle cx='300' cy='220' r='120' fill='%23eecf8a' opacity='0.2'/><text x='50%' y='50%' font-family='serif' font-size='28' fill='%23c9a24b' text-anchor='middle'>विशेष क्षण ☕</text></svg>",
    caption: "तासनतास मारलेल्या गप्पा आणि मनमोकळं हसणं...",
    createdAt: new Date().toISOString()
  }
];

function getLocalMemories() {
  try {
    const raw = localStorage.getItem(MEMORY_STORAGE_KEY);
    if (!raw) return DEFAULT_MEMORIES;
    const parsed = JSON.parse(raw);
    return (Array.isArray(parsed) && parsed.length > 0) ? parsed : DEFAULT_MEMORIES;
  } catch (e) {
    console.error("Local storage read error", e);
    return DEFAULT_MEMORIES;
  }
}

function saveLocalMemories(memories) {
  try {
    localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(memories));
  } catch (e) {
    console.error("Local storage save error", e);
  }
}

function renderMemoriesGrid() {
  const grid = document.getElementById('memoriesGrid');
  if (!grid) return;
  const memoryList = getLocalMemories();

  grid.innerHTML = '';
  memoryList.forEach(item => {
    const card = document.createElement('div');
    card.className = 'memory-card reveal-item';
    card.dataset.id = item.id;

    if (item.isSpecial || item.id === 'apology_mem_special') {
      card.dataset.special = "true";
      card.innerHTML = `
        <button class="delete-memory-btn" title="आठवण हटवा">🗑️ हटवा</button>
        <div class="apology-card-inner">
          <div class="apology-title">🥺❤️ मला माफ करशील ना?</div>
          <div class="apology-date-badge">📅 08-08-2026 • आजची एक गोड आठवण… ✨</div>
          
          <div class="apology-text">
            <p>कधी कधी छोट्याशा रागात आपण अशा गोष्टी करून बसतो, ज्यांचा नंतर स्वतःलाच पश्चात्ताप होतो…</p>
            <p>आज मी तुला एका छोट्याशा कारणावरून block केलं.<br>
            पण खरं सांगू? <span class="apology-highlight">तुला block करून ठेवणं माझ्याच्याने झालंच नाही. 🥺</span></p>
            
            <p>एक दिवस तर सोड… मला तुला तिथे ठेवणंही मनापासून आवडलं नाही. म्हणून तुला लगेच unblock केलं. ❤️</p>
            
            <p>कारण त्या क्षणी एक गोष्ट जाणवली—<br>
            <span class="apology-gold-text">"तुझ्यावर कितीही राग आला, तरी तुला माझ्यापासून दूर ठेवणं मला जमत नाही." 🫶🏻</span></p>
            
            <p>माझ्याकडून चूक झाली… आणि त्यासाठी मनापासून <span class="apology-highlight">SORRY. ❤️</span></p>
            
            <p>मला माहीत आहे, फक्त "sorry" म्हटलं म्हणून सगळं लगेच ठीक होणार नाही. पण खरंच सांगतो—<br>
            <span class="apology-gold-text">"माझा तुला दुखवण्याचा हेतू नव्हता."</span><br>
            रागाच्या भरात झालेल्या त्या एका चुकीसाठी मला मनापासून माफ कर. 🥺❤️</p>
            
            <p>आणि जर तू हे वाचून थोडंसं हसलीस ना…<br>
            तर समज, माझी apology थोडी तरी successful झाली. 😌✨</p>
            
            <p><span class="apology-highlight">आता एक छोटंसं काम कर…<br>
            राग सोड आणि मला माफ कर. 🥺👉🏻👈🏻❤️</span></p>
          </div>

          <div class="apology-promise-box">
            <div class="apology-promise-title">🤍 One little promise…</div>
            <div style="font-size:15px;color:#fbf3e6;line-height:1.7;">
              <b>पुढच्या वेळी राग आला, तर block करण्याआधी एकदा माझ्याशी बोलूया.<br>
              कारण "block" पेक्षा "बोलणं" मला जास्त आवडतं. 🫶🏻</b>
            </div>
          </div>

          <div class="apology-audio-wrap">
            <div class="apology-audio-title">🎵 आपलं गाणं (Video-80226.mp3)</div>
            <audio controls style="width:100%;height:36px;" preload="metadata">
              <source src="Video-80226.mp3" type="audio/mpeg">
              Your browser does not support the audio element.
            </audio>
          </div>

          <div style="text-align:center;margin-top:18px;">
            <button class="forgive-btn" onclick="triggerForgiveExplosion(event)">माफ केलं! 💕 (Forgiven)</button>
          </div>
        </div>
      `;
    } else {
      let mediaHTML = '';
      if (item.type === 'video') {
        mediaHTML = `<video src="${item.mediaUrl}" controls playsinline style="width:100%;height:220px;object-fit:cover;border-radius:8px;background:#000;"></video>`;
      } else {
        mediaHTML = `<img src="${item.mediaUrl}" alt="${item.title}" loading="lazy" style="width:100%;height:220px;object-fit:cover;border-radius:8px;">`;
      }

      const formattedCaption = (item.caption || '').split('
').join('<br>');
      card.innerHTML = `
        ${mediaHTML}
        <button class="delete-memory-btn" title="आठवण हटवा">🗑️ हटवा</button>
        <div class="memory-card-title">${item.title}</div>
        <div class="memory-card-date">📅 ${item.date || ''}</div>
        <div class="memory-card-caption">${formattedCaption}</div>
      `;
    }

    const delBtn = card.querySelector('.delete-memory-btn');
    if (delBtn) {
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteMemoryPrompt(item.id);
      });
    }

    grid.appendChild(card);
  });
}

function triggerForgiveExplosion(e) {
  const rect = e.target.getBoundingClientRect();
  const startX = rect.left + rect.width / 2;
  const startY = rect.top + rect.height / 2;
  const hearts = ['💖', '💕', '🥰', '✨', '❤️', '🌸', '💫', '😍', '🌹'];

  for (let i = 0; i < 35; i++) {
    const p = document.createElement('div');
    p.className = 'heart-explosion-particle';
    p.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    p.style.left = startX + 'px';
    p.style.top = startY + 'px';

    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 180 + 60;
    p.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
    p.style.setProperty('--dy', Math.sin(angle) * dist - 80 + 'px');

    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1400);
  }

  setTimeout(() => {
    alert("Thank you so much! तुझ्या चेहऱ्यावरचं हे हसू असंच कायम राहो! 🥰✨❤️");
  }, 400);
}

function deleteMemoryPrompt(id) {
  const pass = prompt("ही आठवण हटवण्यासाठी पासवर्ड टाका:");
  if (pass === null) return;
  if (pass.trim() === MEMORY_PASSWORD) {
    let currentMemories = getLocalMemories();
    currentMemories = currentMemories.filter(m => m.id !== id);
    saveLocalMemories(currentMemories);
    renderMemoriesGrid();
    alert("आठवण यशस्वीरीत्या हटवली!");
  } else {
    alert("चुकीचा पासवर्ड! आठवण हटवता आली नाही.");
  }
}

// Memory Modal Controls
const addMemoryBtn = document.getElementById('addMemoryBtn');
const memoryModal = document.getElementById('memoryModal');
const memoryModalClose = document.getElementById('memoryModalClose');
const memoryForm = document.getElementById('memoryForm');
const mediaFileInput = document.getElementById('mediaFileInput');
const mediaPreviewContainer = document.getElementById('mediaPreviewContainer');
let currentBase64Media = "";

if (addMemoryBtn) {
  addMemoryBtn.addEventListener('click', () => {
    const pass = prompt("नवीन आठवण जोडण्यासाठी पासवर्ड टाका:");
    if (pass === null) return;
    if (pass.trim() === MEMORY_PASSWORD) {
      if (memoryForm) memoryForm.reset();
      currentBase64Media = "";
      if (mediaPreviewContainer) mediaPreviewContainer.innerHTML = '';
      if (memoryModal) memoryModal.classList.add('show');
    } else {
      alert("चुकीचा पासवर्ड! तुम्ही नवीन आठवण जोडू शकत नाही.");
    }
  });
}

if (memoryModalClose) {
  memoryModalClose.addEventListener('click', () => {
    if (memoryModal) memoryModal.classList.remove('show');
  });
}

if (memoryModal) {
  memoryModal.addEventListener('click', (e) => {
    if (e.target === memoryModal) memoryModal.classList.remove('show');
  });
}

if (mediaFileInput) {
  mediaFileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert("फाईल आकार १५MB पेक्षा कमी असावा!");
      this.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = function(evt) {
      currentBase64Media = evt.target.result;
      if (mediaPreviewContainer) {
        if (file.type.startsWith('video/')) {
          mediaPreviewContainer.innerHTML = `<video src="${currentBase64Media}" controls style="max-width:100%;max-height:180px;border-radius:6px;"></video>`;
        } else {
          mediaPreviewContainer.innerHTML = `<img src="${currentBase64Media}" style="max-width:100%;max-height:180px;border-radius:6px;object-fit:cover;">`;
        }
      }
    };
    reader.readAsDataURL(file);
  });
}

// Initial render on load
document.addEventListener('DOMContentLoaded', () => {
  renderMemoriesGrid();
});
