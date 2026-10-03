/**
 * LOVE PROPOSAL - INTERACTIVE ENGINE
 * Features:
 * - Dynamic No-button shrinking & Yes-button expansion
 * - Persuasion narrative progression
 * - Web Audio API procedural romantic sound effects & ambient music
 * - Canvas floating hearts & celebratory heart confetti blast
 * - Replay & Seal interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const askingView = document.getElementById('asking-view');
  const celebrationView = document.getElementById('celebration-view');
  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');
  const noBtnText = document.getElementById('no-btn-text');
  const yesBtnText = document.getElementById('yes-btn-text');
  const persuasionBanner = document.getElementById('persuasion-banner');
  const persuasionText = document.getElementById('persuasion-text');
  const persuasionEmoji = document.getElementById('persuasion-emoji');
  const floatingSticker = document.getElementById('floating-sticker');
  const hintCaption = document.getElementById('hint-caption');
  const btnSeal = document.getElementById('btn-seal');
  const btnReplay = document.getElementById('btn-replay');
  const audioToggle = document.getElementById('audio-toggle');
  const musicLabel = document.getElementById('music-label');
  const loveToast = document.getElementById('love-toast');

  let noClickCount = 0;
  let musicPlaying = false;
  let audioCtx = null;
  let musicInterval = null;

  // Persuasion dialogues
  const persuasionPhrases = [
    { text: "Are you sure? 🥺", emoji: "🥺", noText: "No... 💔", sticker: "🥺" },
    { text: "Please... think about it again! 😢", emoji: "😢", noText: "Really no? 😿", sticker: "😿" },
    { text: "Don't break my little heart! 💔", emoji: "💔", noText: "Are you positive? 🥺", sticker: "💔" },
    { text: "Look how big and shiny YES is getting! 👉👈", emoji: "✨", noText: "Still no? 😭", sticker: "😭" },
    { text: "Pretty please with strawberries on top? 🍓🥺", emoji: "🍓", noText: "Think again! 💭", sticker: "🥺" },
    { text: "I promise unlimited warm hugs & treats! 🍫", emoji: "🍫", noText: "Don't do this! 🙈", sticker: "🙈" },
    { text: "You're teasing me now, aren't you? 😭", emoji: "😭", noText: "Have mercy! 🥺", sticker: "😭" },
    { text: "Are you really, really sure? Look into my eyes! 🥺", emoji: "👀", noText: "Last chance! ⚠️", sticker: "🥺" },
    { text: "No is getting way too tiny to even click! 🔍", emoji: "🔍", noText: "no (tiny)", sticker: "🤏" },
    { text: "There is only one true answer in your heart... 🥰", emoji: "💖", noText: "...", sticker: "✨" },
    { text: "Okay, you have no choice now, click YES! 💖", emoji: "🥰", noText: "🤍", sticker: "💍" }
  ];

  // ==========================================
  // WEB AUDIO API SOUND SYSTEM
  // ==========================================
  function initAudioContext() {
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

  // Playful boop for "No" clicks
  function playBoopSound() {
    initAudioContext();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      const freqStart = Math.max(180, 420 - (noClickCount * 25));
      const freqEnd = freqStart * 0.7;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freqStart, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freqEnd, audioCtx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.22);
    } catch (e) {
      // Audio fallback silent
    }
  }

  // Romantic celestial harp fanfare for "Yes"
  function playCelebrationFanfare() {
    initAudioContext();
    if (!audioCtx) return;

    try {
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C Major arpeggio
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.001, audioCtx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.22, audioCtx.currentTime + idx * 0.08 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + idx * 0.08 + 1.2);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(audioCtx.currentTime + idx * 0.08);
        osc.stop(audioCtx.currentTime + idx * 0.08 + 1.3);
      });
    } catch (e) {}
  }

  // Soft romantic chime for interactions
  function playSweetChime() {
    initAudioContext();
    if (!audioCtx) return;

    try {
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.1);
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.1 + 0.5);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + i * 0.1);
        osc.stop(audioCtx.currentTime + i * 0.1 + 0.55);
      });
    } catch (e) {}
  }

  // Procedural Romantic Ambient Lullaby
  function toggleRomanticMusic() {
    initAudioContext();
    if (!audioCtx) return;

    musicPlaying = !musicPlaying;

    if (musicPlaying) {
      audioToggle.classList.add('playing');
      musicLabel.textContent = "Music Playing 💕";
      showToast("Playing sweet romantic melodies 🎶");

      // Chords: Cmaj7 -> Am9 -> Fmaj7 -> Gsus4
      const chords = [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 329.63, 392.00], // Am7
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [196.00, 261.63, 293.66, 392.00]  // Gsus4
      ];
      let chordIndex = 0;

      const playChordNote = (freq, delay, duration = 1.4) => {
        if (!musicPlaying || !audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);
        gain.gain.setValueAtTime(0.001, audioCtx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.045, audioCtx.currentTime + delay + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + delay + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + delay);
        osc.stop(audioCtx.currentTime + delay + duration + 0.1);
      };

      const stepMusic = () => {
        if (!musicPlaying) return;
        const currentChord = chords[chordIndex % chords.length];
        currentChord.forEach((freq, idx) => {
          playChordNote(freq, idx * 0.32, 2.2);
        });
        chordIndex++;
      };

      stepMusic();
      musicInterval = setInterval(stepMusic, 1800);

    } else {
      audioToggle.classList.remove('playing');
      musicLabel.textContent = "Romantic Melodies";
      if (musicInterval) {
        clearInterval(musicInterval);
        musicInterval = null;
      }
      showToast("Music paused 🌙");
    }
  }

  audioToggle.addEventListener('click', toggleRomanticMusic);
  audioToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleRomanticMusic();
    }
  });

  // ==========================================
  // CLICK "NO" LOGIC: YES GROWS, NO SHRINKS
  // ==========================================
  btnNo.addEventListener('click', () => {
    noClickCount++;
    playBoopSound();

    const info = persuasionPhrases[Math.min(noClickCount - 1, persuasionPhrases.length - 1)];

    // 1. Show & update persuasion message
    persuasionBanner.style.display = 'flex';
    persuasionBanner.style.animation = 'none';
    persuasionBanner.offsetHeight; // trigger reflow
    persuasionBanner.style.animation = 'bannerPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';

    persuasionText.textContent = info.text;
    persuasionEmoji.textContent = info.emoji;
    noBtnText.textContent = info.noText;
    floatingSticker.textContent = info.sticker;

    // 2. Scale Yes Button Up (bouncy & progressively massive)
    // Starting at 1.0, increases by 0.22 each click up to 3.2x!
    const yesScale = 1.0 + (noClickCount * 0.24);
    btnYes.style.transform = `scale(${yesScale})`;
    btnYes.style.boxShadow = `0 ${10 + noClickCount * 4}px ${30 + noClickCount * 8}px rgba(255, 42, 109, ${Math.min(0.85, 0.45 + noClickCount * 0.05)})`;
    
    // Add pulsing excited wording for Yes as it grows
    if (noClickCount >= 3 && noClickCount < 6) {
      yesBtnText.textContent = "YES! PLEASE! 💖";
    } else if (noClickCount >= 6 && noClickCount < 9) {
      yesBtnText.textContent = "YES! I LOVE YOU! 💍💖";
    } else if (noClickCount >= 9) {
      yesBtnText.textContent = "YES FOREVER & ALWAYS! 🌟❤️";
    }

    // 3. Scale No Button Down (shrinks smaller and smaller)
    // Decreases from 1.0 down to min 0.2
    const noScale = Math.max(0.22, 1.0 - (noClickCount * 0.11));
    const noPaddingY = Math.max(4, 16 - (noClickCount * 1.4));
    const noPaddingX = Math.max(8, 36 - (noClickCount * 3.2));
    const noFontSize = Math.max(0.65, 1.15 - (noClickCount * 0.07));

    btnNo.style.transform = `scale(${noScale})`;
    btnNo.style.padding = `${noPaddingY}px ${noPaddingX}px`;
    btnNo.style.fontSize = `${noFontSize}rem`;
    btnNo.style.opacity = `${Math.max(0.4, 1.0 - (noClickCount * 0.06))}`;

    // Micro shake animation on No button
    btnNo.animate([
      { transform: `scale(${noScale}) translateX(-5px)` },
      { transform: `scale(${noScale}) translateX(5px)` },
      { transform: `scale(${noScale}) translateX(-3px)` },
      { transform: `scale(${noScale}) translateX(0)` }
    ], {
      duration: 250,
      easing: 'ease-in-out'
    });

    // If clicked many times, playfully move No button a little on hover
    if (noClickCount >= 7) {
      dodgeNoButton();
    }

    hintCaption.textContent = `Hehe, the YES button wants you so much! 🥰 (${noClickCount} attempts)`;
  });

  // Playful dodging behavior when No button is too tiny
  function dodgeNoButton() {
    const randomX = (Math.random() - 0.5) * 60;
    const randomY = (Math.random() - 0.5) * 40;
    const currentScale = Math.max(0.22, 1.0 - (noClickCount * 0.11));
    btnNo.style.transform = `scale(${currentScale}) translate(${randomX}px, ${randomY}px)`;
  }

  btnNo.addEventListener('mouseenter', () => {
    if (noClickCount >= 6) {
      dodgeNoButton();
    }
  });

  // ==========================================
  // CLICK "YES" LOGIC: CELEBRATION!
  // ==========================================
  btnYes.addEventListener('click', () => {
    playCelebrationFanfare();

    // Hide asking view, show celebration view
    askingView.style.display = 'none';
    celebrationView.style.display = 'block';

    // Start celebratory confetti blast
    triggerConfettiExplosion();

    // Auto-start ambient music if not yet playing
    if (!musicPlaying) {
      toggleRomanticMusic();
    }

    showToast("My heart is yours forever! 💍❤️");
  });

  // ==========================================
  // CELEBRATION INTERACTIONS
  // ==========================================
  btnSeal.addEventListener('click', () => {
    playSweetChime();
    triggerHeartFountain();
    showToast("💋 Sealed with a lifetime vow of love!");
  });

  btnReplay.addEventListener('click', () => {
    // Reset state
    noClickCount = 0;
    btnYes.style.transform = 'scale(1)';
    btnYes.style.boxShadow = '';
    yesBtnText.textContent = "YES! 💖";

    btnNo.style.transform = 'scale(1)';
    btnNo.style.padding = '';
    btnNo.style.fontSize = '';
    btnNo.style.opacity = '1';
    noBtnText.textContent = "No 💔";

    persuasionBanner.style.display = 'none';
    floatingSticker.textContent = "🥺";
    hintCaption.textContent = "Tip: Listen closely to what your heart whispers ✨";

    celebrationView.style.display = 'none';
    askingView.style.display = 'block';

    showToast("Let's ask again from the very start! 🥰");
  });

  // Toast Notification helper
  let toastTimer = null;
  function showToast(message) {
    loveToast.textContent = message;
    loveToast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      loveToast.classList.remove('show');
    }, 3200);
  }

  // ==========================================
  // AMBIENT FLOATING HEARTS & PARTICLES CANVAS
  // ==========================================
  const ambientCanvas = document.getElementById('ambient-canvas');
  const ambientCtx = ambientCanvas.getContext('2d');
  let ambientParticles = [];

  function resizeAmbientCanvas() {
    ambientCanvas.width = window.innerWidth;
    ambientCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeAmbientCanvas);
  resizeAmbientCanvas();

  class HeartParticle {
    constructor() {
      this.reset();
      this.y = Math.random() * ambientCanvas.height; // initial scatter
    }

    reset() {
      this.x = Math.random() * ambientCanvas.width;
      this.y = ambientCanvas.height + 20;
      this.size = Math.random() * 14 + 10;
      this.speedY = Math.random() * 1.2 + 0.6;
      this.speedX = Math.sin(Math.random() * 6.28) * 0.5;
      this.rotation = Math.random() * 6.28;
      this.rotSpeed = (Math.random() - 0.5) * 0.03;
      this.opacity = Math.random() * 0.5 + 0.3;
      this.color = Math.random() > 0.4 ? 'rgba(255, 42, 109,' : 'rgba(255, 117, 143,';
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.015) * 0.6;
      this.rotation += this.rotSpeed;

      if (this.y < -30) {
        this.reset();
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillStyle = `${this.color} ${this.opacity})`;

      // Heart path
      ctx.beginPath();
      const s = this.size / 15;
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-5 * s, -10 * s, -15 * s, -5 * s, -15 * s, 5 * s);
      ctx.bezierCurveTo(-15 * s, 15 * s, 0, 20 * s, 0, 26 * s);
      ctx.bezierCurveTo(0, 20 * s, 15 * s, 15 * s, 15 * s, 5 * s);
      ctx.bezierCurveTo(15 * s, -5 * s, 5 * s, -10 * s, 0, 0);
      ctx.fill();
      ctx.restore();
    }
  }

  // Populate ambient particles
  const particleCount = Math.min(35, Math.floor(window.innerWidth / 35));
  for (let i = 0; i < particleCount; i++) {
    ambientParticles.push(new HeartParticle());
  }

  function animateAmbient() {
    ambientCtx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);
    for (let p of ambientParticles) {
      p.update();
      p.draw(ambientCtx);
    }
    requestAnimationFrame(animateAmbient);
  }
  animateAmbient();

  // ==========================================
  // CONFETTI CANNON FOR CELEBRATION
  // ==========================================
  const confettiCanvas = document.getElementById('confetti-canvas');
  const confettiCtx = confettiCanvas.getContext('2d');
  let confettiPieces = [];

  function resizeConfettiCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeConfettiCanvas);
  resizeConfettiCanvas();

  const confettiColors = ['#ff2a6d', '#ff758f', '#ffd166', '#ffffff', '#ff9aa2', '#b33951', '#f72585'];

  class ConfettiPiece {
    constructor(x, y, isBurst = false) {
      this.x = x ?? Math.random() * confettiCanvas.width;
      this.y = y ?? (isBurst ? confettiCanvas.height * 0.5 : -10);
      this.size = Math.random() * 10 + 6;
      this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      
      const angle = isBurst ? Math.random() * 6.28 : Math.PI / 2 + (Math.random() - 0.5);
      const velocity = isBurst ? Math.random() * 14 + 6 : Math.random() * 5 + 3;
      
      this.vx = Math.cos(angle) * velocity;
      this.vy = Math.sin(angle) * velocity - (isBurst ? 5 : 0);
      this.gravity = 0.25;
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 8;
      this.shape = Math.random() > 0.4 ? 'heart' : (Math.random() > 0.5 ? 'circle' : 'ribbon');
      this.life = 1;
      this.decay = Math.random() * 0.007 + 0.005;
    }

    update() {
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.985;
      this.vy *= 0.985;
      this.rotation += this.rotSpeed;
      this.life -= this.decay;
    }

    draw(ctx) {
      if (this.life <= 0) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, this.life);
      ctx.fillStyle = this.color;

      if (this.shape === 'heart') {
        const s = this.size / 14;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-4 * s, -8 * s, -12 * s, -4 * s, -12 * s, 4 * s);
        ctx.bezierCurveTo(-12 * s, 12 * s, 0, 16 * s, 0, 20 * s);
        ctx.bezierCurveTo(0, 16 * s, 12 * s, 12 * s, 12 * s, 4 * s);
        ctx.bezierCurveTo(12 * s, -4 * s, 4 * s, -8 * s, 0, 0);
        ctx.fill();
      } else if (this.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
      }

      ctx.restore();
    }
  }

  function triggerConfettiExplosion() {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight * 0.45;
    for (let i = 0; i < 220; i++) {
      confettiPieces.push(new ConfettiPiece(cx, cy, true));
    }
    // Also add rain from top
    for (let i = 0; i < 100; i++) {
      setTimeout(() => {
        confettiPieces.push(new ConfettiPiece(null, -15, false));
      }, Math.random() * 1500);
    }
  }

  function triggerHeartFountain() {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight * 0.75;
    for (let i = 0; i < 80; i++) {
      const p = new ConfettiPiece(cx + (Math.random() - 0.5) * 120, cy, true);
      p.shape = 'heart';
      p.vy = -Math.random() * 16 - 8;
      confettiPieces.push(p);
    }
  }

  function animateConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    for (let i = confettiPieces.length - 1; i >= 0; i--) {
      const p = confettiPieces[i];
      p.update();
      p.draw(confettiCtx);
      if (p.life <= 0 || p.y > confettiCanvas.height + 50) {
        confettiPieces.splice(i, 1);
      }
    }
    requestAnimationFrame(animateConfetti);
  }
  animateConfetti();
});
