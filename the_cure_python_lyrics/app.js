/**
 * Olivia Rodrigo — The Cure
 * Python Lyrics Simulator & Web App Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Default Lyrics Data
    let songData = {
        title: "The Cure",
        artist: "Olivia Rodrigo",
        album: "you seem pretty sad for a girl so in love",
        lines: [
            { text: "And my head is full of poison", charDelay: 0.075, pauseAfter: 0.50, color: "#d8b4fe" },
            { text: "And my heart is full of doubt", charDelay: 0.080, pauseAfter: 0.60, color: "#f472b6" },
            { text: "I got toxins in my bloodstream", charDelay: 0.070, pauseAfter: 0.45, color: "#c084fc" },
            { text: "You tried hard to suck 'em out", charDelay: 0.075, pauseAfter: 0.80, color: "#fb923c" },
            { text: "And it feels like medication", charDelay: 0.080, pauseAfter: 0.50, color: "#818cf8" },
            { text: "And it's good for me, I'm sure", charDelay: 0.080, pauseAfter: 0.75, color: "#f472b6" },
            { text: "But it don't matter how your love feels anymore", charDelay: 0.060, pauseAfter: 0.60, color: "#f87171" },
            { text: "It'll never be the cure", charDelay: 0.095, pauseAfter: 0.85, color: "#e879f9", isCure: true },
            { text: "It'll never be the cure...", charDelay: 0.110, pauseAfter: 1.50, color: "#fb7185", isCure: true }
        ]
    };

    // Calculate total duration
    function calculateTotalDuration() {
        let total = 2.0; // Banner intro
        songData.lines.forEach(l => {
            total += (l.text.length * l.charDelay) + l.pauseAfter;
        });
        return total;
    }

    // State Variables
    let isPlaying = false;
    let playbackTime = 0;
    let totalDuration = calculateTotalDuration();
    let speedMultiplier = 1.0;
    let audioEnabled = true;
    let animationFrameId = null;
    let lastTimestamp = null;
    let currentLineIndex = 0;
    let currentCharIndex = 0;
    let isTypingLine = false;

    // DOM Elements
    const workspace = document.getElementById('main-workspace');
    const lineNumbersContainer = document.getElementById('line-numbers');
    const termOutputStream = document.getElementById('term-output-stream');
    const terminalBody = document.getElementById('terminal-body');
    const playPauseBtn = document.getElementById('btn-play-pause');
    const playIcon = document.getElementById('play-icon');
    const restartBtn = document.getElementById('btn-restart');
    const progressTrack = document.getElementById('progress-track');
    const progressFill = document.getElementById('progress-fill');
    const timeCurrentLabel = document.getElementById('time-current');
    const timeDurationLabel = document.getElementById('time-duration');
    const speedSelect = document.getElementById('speed-select');
    const audioToggleBtn = document.getElementById('btn-audio-toggle');
    const audioIcon = document.getElementById('audio-icon');
    const vinylDisc = document.getElementById('vinyl-disc');
    const customAudioInput = document.getElementById('audio-file-input');

    // Mode Buttons
    const modeSplitBtn = document.getElementById('mode-split-btn');
    const modeTermBtn = document.getElementById('mode-term-btn');
    const modeTiktokBtn = document.getElementById('mode-tiktok-btn');

    // Modal Elements
    const customLyricsBtn = document.getElementById('btn-custom-lyrics');
    const customLyricsModal = document.getElementById('custom-lyrics-modal');
    const closeModalBtn = document.getElementById('btn-close-modal');
    const applyLyricsBtn = document.getElementById('btn-apply-custom-lyrics');
    const resetLyricsBtn = document.getElementById('btn-reset-default-lyrics');
    const songTitleInput = document.getElementById('modal-song-title');
    const artistNameInput = document.getElementById('modal-artist-name');
    const lyricsTextInput = document.getElementById('modal-lyrics-input');

    const copyCodeBtn = document.getElementById('btn-copy-code');
    const clearTermBtn = document.getElementById('btn-clear-term');

    // -------------------------------------------------------------
    // Populate Line Numbers in Code Editor
    // -------------------------------------------------------------
    function renderLineNumbers() {
        if (!lineNumbersContainer) return;
        let linesHtml = '';
        for (let i = 1; i <= 28; i++) {
            linesHtml += `<div>${i}</div>`;
        }
        lineNumbersContainer.innerHTML = linesHtml;
    }
    renderLineNumbers();

    // -------------------------------------------------------------
    // Web Audio Synthesizer (Atmospheric Piano / Synth Pad)
    // -------------------------------------------------------------
    let audioCtx = null;
    let customAudioElement = null;

    function initAudioContext() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    // Melodic chord progression notes (Frequencies in Hz)
    const chordProgressions = [
        [220.00, 261.63, 329.63, 440.00], // Am (A3, C4, E4, A4)
        [174.61, 220.00, 261.63, 349.23], // F (F3, A3, C4, F4)
        [261.63, 329.63, 392.00, 523.25], // C (C4, E4, G4, C5)
        [196.00, 246.94, 293.66, 392.00]  // G (G3, B3, D4, G4)
    ];

    function playSynthChord(chordIndex) {
        if (!audioEnabled || !audioCtx) return;
        
        const chord = chordProgressions[chordIndex % chordProgressions.length];
        const now = audioCtx.currentTime;

        chord.forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const filter = audioCtx.createBiquadFilter();

            // Soft triangle wave for piano-synth blend
            osc.type = i === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, now);

            // Filter for warm soft tone
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800 + (i * 200), now);

            // Envelope (gentle attack, soft sustain, warm release)
            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.045 / (i + 1), now + 0.15);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(now + (i * 0.04));
            osc.stop(now + 3.4);
        });
    }

    function playKeyPluck(charFreqIndex = 0) {
        if (!audioEnabled || !audioCtx) return;
        
        const now = audioCtx.currentTime;
        const baseNotes = [440, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99, 880];
        const freq = baseNotes[charFreqIndex % baseNotes.length];

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.015, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.2);
    }

    // -------------------------------------------------------------
    // Audio Visualizer Waveform Canvas
    // -------------------------------------------------------------
    const waveCanvas = document.getElementById('audio-wave-canvas');
    const waveCtx = waveCanvas ? waveCanvas.getContext('2d') : null;

    function resizeWaveCanvas() {
        if (!waveCanvas) return;
        waveCanvas.width = waveCanvas.parentElement.clientWidth * window.devicePixelRatio;
        waveCanvas.height = waveCanvas.parentElement.clientHeight * window.devicePixelRatio;
    }
    window.addEventListener('resize', resizeWaveCanvas);
    resizeWaveCanvas();

    let wavePhase = 0;
    function drawWaveform() {
        if (!waveCtx || !waveCanvas) return;
        const w = waveCanvas.width;
        const h = waveCanvas.height;
        waveCtx.clearRect(0, 0, w, h);

        waveCtx.lineWidth = 2 * window.devicePixelRatio;
        const gradient = waveCtx.createLinearGradient(0, 0, w, 0);
        gradient.addColorStop(0, 'rgba(168, 85, 247, 0.2)');
        gradient.addColorStop(0.5, isPlaying ? 'rgba(244, 63, 94, 0.85)' : 'rgba(192, 132, 252, 0.4)');
        gradient.addColorStop(1, 'rgba(56, 189, 248, 0.2)');
        waveCtx.strokeStyle = gradient;

        waveCtx.beginPath();
        const numPoints = 60;
        const amp = isPlaying ? (h * 0.25) : (h * 0.05);

        for (let i = 0; i <= numPoints; i++) {
            const x = (i / numPoints) * w;
            const freq = isPlaying ? 3 : 1;
            const y = (h / 2) + Math.sin((i * 0.2) + wavePhase * freq) * Math.cos((i * 0.1) + wavePhase) * amp;
            if (i === 0) waveCtx.moveTo(x, y);
            else waveCtx.lineTo(x, y);
        }
        waveCtx.stroke();

        wavePhase += isPlaying ? 0.06 : 0.015;
        requestAnimationFrame(drawWaveform);
    }
    drawWaveform();

    // -------------------------------------------------------------
    // Ambient Starfield / Particles Canvas
    // -------------------------------------------------------------
    const ambientCanvas = document.getElementById('ambient-canvas');
    const ambientCtx = ambientCanvas ? ambientCanvas.getContext('2d') : null;
    let particles = [];

    function initAmbientParticles() {
        if (!ambientCanvas) return;
        ambientCanvas.width = window.innerWidth;
        ambientCanvas.height = window.innerHeight;
        particles = [];
        for (let i = 0; i < 40; i++) {
            particles.push({
                x: Math.random() * ambientCanvas.width,
                y: Math.random() * ambientCanvas.height,
                radius: Math.random() * 2 + 0.5,
                alpha: Math.random() * 0.6 + 0.2,
                vy: -Math.random() * 0.4 - 0.1,
                color: i % 2 === 0 ? '192, 132, 252' : '244, 114, 182'
            });
        }
    }
    window.addEventListener('resize', initAmbientParticles);
    initAmbientParticles();

    function renderAmbientParticles() {
        if (!ambientCtx || !ambientCanvas) return;
        ambientCtx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);

        particles.forEach(p => {
            p.y += p.vy;
            if (p.y < 0) {
                p.y = ambientCanvas.height;
                p.x = Math.random() * ambientCanvas.width;
            }
            ambientCtx.beginPath();
            ambientCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ambientCtx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
            ambientCtx.fill();
        });
        requestAnimationFrame(renderAmbientParticles);
    }
    renderAmbientParticles();

    // -------------------------------------------------------------
    // Terminal Typewriter Lyrics Engine
    // -------------------------------------------------------------
    function getAsciiBanner() {
        return `
   ___  _ _       _          ____           _        _             
  / _ \\| (_)_   _(_) __ _   |  _ \\ ___   __| |_ __  (_) __ _  ___  
 | | | | | \\ \\ / / |/ _` |  | |_) / _ \\ / _` | '__| | |/ _` |/ _ \\ 
 | |_| | | |\\ V /| | (_| |  |  _ < (_) | (_| | |    | | (_| | (_) |
  \\___/|_|_| \\_/ |_|\\__,_|  |_| \\_\\___/ \\__,_|_|    |_|\\__, |\\___/ 
                                                        |___/       
<div class="ascii-subtitle">♫ ${songData.title} — ${songData.artist} ♫</div>
        `.trim();
    }

    function renderInitialTerminalState() {
        termOutputStream.innerHTML = `
            <div class="ascii-banner">${getAsciiBanner()}</div>
            <div style="color: var(--accent-cyan); margin-bottom: 12px; font-size: 13px;">
                [▶] Klik tombol Putar (Play) untuk memulai pengetikan lirik Python...
            </div>
        `;
    }
    renderInitialTerminalState();

    // Format time (seconds to MM:SS)
    function formatTime(secs) {
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60);
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    timeDurationLabel.textContent = formatTime(totalDuration);

    // Build timeline markers for all characters and pauses
    let timelineEvents = [];
    function buildTimeline() {
        timelineEvents = [];
        let curTime = 1.2; // Initial banner delay

        songData.lines.forEach((lineObj, lIdx) => {
            const lineStartTime = curTime;
            const chars = lineObj.text.split('');
            const charDuration = lineObj.charDelay;

            chars.forEach((char, cIdx) => {
                timelineEvents.push({
                    type: 'char',
                    time: curTime,
                    lineIndex: lIdx,
                    charIndex: cIdx,
                    char: char,
                    lineText: lineObj.text,
                    color: lineObj.color,
                    isCure: lineObj.isCure
                });
                curTime += charDuration;
            });

            timelineEvents.push({
                type: 'line_end',
                time: curTime,
                lineIndex: lIdx
            });

            curTime += lineObj.pauseAfter;
        });

        totalDuration = curTime + 0.8;
        timeDurationLabel.textContent = formatTime(totalDuration);
    }
    buildTimeline();

    // Render terminal state at specific playback time
    function renderTerminalAtTime(targetTime) {
        let html = `<div class="ascii-banner">${getAsciiBanner()}</div>`;
        html += `<div style="color: var(--accent-cyan); margin-bottom: 12px; font-size: 12px;">[▶] Playing: ${songData.title} by ${songData.artist} 🎧</div>`;

        let currentActiveLineIdx = -1;
        let lineBuffers = {};

        // Find events up to targetTime
        timelineEvents.forEach(ev => {
            if (ev.time <= targetTime) {
                if (ev.type === 'char') {
                    if (!lineBuffers[ev.lineIndex]) {
                        lineBuffers[ev.lineIndex] = {
                            text: '',
                            color: ev.color,
                            isCure: ev.isCure,
                            complete: false
                        };
                    }
                    lineBuffers[ev.lineIndex].text += ev.char;
                    currentActiveLineIdx = ev.lineIndex;
                } else if (ev.type === 'line_end') {
                    if (lineBuffers[ev.lineIndex]) {
                        lineBuffers[ev.lineIndex].complete = true;
                    }
                }
            }
        });

        // Render each accumulated line
        Object.keys(lineBuffers).forEach(idxKey => {
            const idx = parseInt(idxKey);
            const data = lineBuffers[idx];
            const isCurrent = idx === currentActiveLineIdx && !data.complete;
            const cureClass = data.isCure ? 'highlight-cure' : '';

            html += `
                <div class="lyric-line-box ${isCurrent ? 'active-singing' : ''}">
                    <span class="lyric-prefix">♪</span>
                    <span class="lyric-text ${cureClass}" style="color: ${data.color}">
                        ${escapeHtml(data.text)}${isCurrent ? '<span class="lyric-typing-cursor"></span>' : ''}
                    </span>
                </div>
            `;
        });

        termOutputStream.innerHTML = html;
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    // -------------------------------------------------------------
    // Main Playback Loop
    // -------------------------------------------------------------
    let lastPlayedEventIndex = -1;

    function playbackLoop(timestamp) {
        if (!isPlaying) return;

        if (!lastTimestamp) lastTimestamp = timestamp;
        const delta = (timestamp - lastTimestamp) / 1000;
        lastTimestamp = timestamp;

        playbackTime += delta * speedMultiplier;

        // Check timeline events for sound triggers
        for (let i = lastPlayedEventIndex + 1; i < timelineEvents.length; i++) {
            const ev = timelineEvents[i];
            if (ev.time <= playbackTime) {
                lastPlayedEventIndex = i;
                if (ev.type === 'char' && ev.charIndex === 0) {
                    // Play a soft chord for every new lyric line
                    playSynthChord(ev.lineIndex);
                } else if (ev.type === 'char' && ev.char !== ' ') {
                    // Gentle pluck for character typing
                    playKeyPluck(ev.charIndex);
                }
            } else {
                break;
            }
        }

        // Render view
        renderTerminalAtTime(playbackTime);

        // Update Progress UI
        const progressPercent = Math.min((playbackTime / totalDuration) * 100, 100);
        progressFill.style.width = `${progressPercent}%`;
        timeCurrentLabel.textContent = formatTime(playbackTime);

        if (playbackTime >= totalDuration) {
            pausePlayback();
            playbackTime = totalDuration;
            progressFill.style.width = '100%';
            showToast('Selesai! Lirik telah selesai dimainkan.');
            return;
        }

        animationFrameId = requestAnimationFrame(playbackLoop);
    }

    function startPlayback() {
        initAudioContext();
        isPlaying = true;
        lastTimestamp = null;
        playIcon.setAttribute('data-lucide', 'pause');
        if (window.lucide) window.lucide.createIcons();
        if (vinylDisc) vinylDisc.classList.add('spinning');

        if (playbackTime >= totalDuration) {
            playbackTime = 0;
            lastPlayedEventIndex = -1;
        }

        animationFrameId = requestAnimationFrame(playbackLoop);
    }

    function pausePlayback() {
        isPlaying = false;
        playIcon.setAttribute('data-lucide', 'play');
        if (window.lucide) window.lucide.createIcons();
        if (vinylDisc) vinylDisc.classList.remove('spinning');
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    }

    // Toggle Play/Pause
    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            pausePlayback();
        } else {
            startPlayback();
        }
    });

    // Restart Playback
    restartBtn.addEventListener('click', () => {
        playbackTime = 0;
        lastPlayedEventIndex = -1;
        renderTerminalAtTime(0);
        progressFill.style.width = '0%';
        timeCurrentLabel.textContent = '00:00';
        if (!isPlaying) {
            startPlayback();
        }
    });

    // Scrubber / Seek
    progressTrack.addEventListener('click', (e) => {
        const rect = progressTrack.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const ratio = Math.max(0, Math.min(1, clickX / rect.width));
        playbackTime = ratio * totalDuration;
        
        // Recalculate lastPlayedEventIndex
        lastPlayedEventIndex = -1;
        for (let i = 0; i < timelineEvents.length; i++) {
            if (timelineEvents[i].time <= playbackTime) {
                lastPlayedEventIndex = i;
            } else {
                break;
            }
        }

        renderTerminalAtTime(playbackTime);
        progressFill.style.width = `${ratio * 100}%`;
        timeCurrentLabel.textContent = formatTime(playbackTime);
    });

    // Speed Selector
    speedSelect.addEventListener('change', (e) => {
        speedMultiplier = parseFloat(e.target.value);
        showToast(`Kecepatan diset ke ${speedMultiplier}x`);
    });

    // Audio Toggle (Mute/Unmute Synth)
    audioToggleBtn.addEventListener('click', () => {
        audioEnabled = !audioEnabled;
        audioToggleBtn.classList.toggle('active', audioEnabled);
        if (audioEnabled) {
            audioIcon.setAttribute('data-lucide', 'volume-2');
            showToast('Synth audio diaktifkan 🔊');
        } else {
            audioIcon.setAttribute('data-lucide', 'volume-x');
            showToast('Synth audio dinonaktifkan 🔇');
        }
        if (window.lucide) window.lucide.createIcons();
    });

    // Clear Terminal
    clearTermBtn.addEventListener('click', () => {
        renderInitialTerminalState();
        showToast('Terminal dibersihkan');
    });

    // -------------------------------------------------------------
    // View Modes Switcher
    // -------------------------------------------------------------
    function setViewMode(mode) {
        modeSplitBtn.classList.remove('active');
        modeTermBtn.classList.remove('active');
        modeTiktokBtn.classList.remove('active');

        workspace.classList.remove('mode-terminal-only', 'mode-tiktok-view');

        if (mode === 'split') {
            modeSplitBtn.classList.add('active');
        } else if (mode === 'terminal') {
            modeTermBtn.classList.add('active');
            workspace.classList.add('mode-terminal-only');
        } else if (mode === 'tiktok') {
            modeTiktokBtn.classList.add('active');
            workspace.classList.add('mode-tiktok-view');
            showToast('Mode TikTok 9:16 aktif! Siap rekam layar.');
        }
        resizeWaveCanvas();
    }

    modeSplitBtn.addEventListener('click', () => setViewMode('split'));
    modeTermBtn.addEventListener('click', () => setViewMode('terminal'));
    modeTiktokBtn.addEventListener('click', () => setViewMode('tiktok'));

    // -------------------------------------------------------------
    // Custom Lyrics Modal & Dynamic Updates
    // -------------------------------------------------------------
    customLyricsBtn.addEventListener('click', () => {
        customLyricsModal.classList.add('open');
    });

    closeModalBtn.addEventListener('click', () => {
        customLyricsModal.classList.remove('open');
    });

    customLyricsModal.addEventListener('click', (e) => {
        if (e.target === customLyricsModal) {
            customLyricsModal.classList.remove('open');
        }
    });

    applyLyricsBtn.addEventListener('click', () => {
        const title = songTitleInput.value.trim() || "My Song";
        const artist = artistNameInput.value.trim() || "My Artist";
        const rawLines = lyricsTextInput.value.split('\n').filter(l => l.trim() !== '');

        if (rawLines.length === 0) {
            alert('Silakan masukkan minimal 1 baris lirik!');
            return;
        }

        const colors = ['#d8b4fe', '#f472b6', '#c084fc', '#fb923c', '#818cf8', '#f87171', '#38bdf8'];
        songData.title = title;
        songData.artist = artist;
        songData.lines = rawLines.map((lineText, idx) => ({
            text: lineText.trim(),
            charDelay: 0.075,
            pauseAfter: 0.65,
            color: colors[idx % colors.length],
            isCure: idx >= rawLines.length - 2
        }));

        buildTimeline();
        playbackTime = 0;
        lastPlayedEventIndex = -1;
        renderTerminalAtTime(0);
        customLyricsModal.classList.remove('open');
        showToast(`Lirik '${title}' berhasil diterapkan! ✨`);
        startPlayback();
    });

    resetLyricsBtn.addEventListener('click', () => {
        songTitleInput.value = "The Cure";
        artistNameInput.value = "Olivia Rodrigo";
        lyricsTextInput.value = `And my head is full of poison
And my heart is full of doubt
I got toxins in my bloodstream
You tried hard to suck 'em out
And it feels like medication
And it's good for me, I'm sure
But it don't matter how your love feels anymore
It'll never be the cure
It'll never be the cure...`;
    });

    // -------------------------------------------------------------
    // Copy Python Code to Clipboard
    // -------------------------------------------------------------
    copyCodeBtn.addEventListener('click', () => {
        const pythonCode = `import sys, time, os

if os.name == 'nt':
    os.system('')  # Enable ANSI colors on Windows

def print_typewriter(text, delay=0.075, color="\\033[38;2;216;180;254m"):
    sys.stdout.write(f"  ♪  {color}")
    for char in text:
        sys.stdout.write(char)
        sys.stdout.flush()
        time.sleep(delay)
    sys.stdout.write("\\033[0m\\n")

lyrics = [
    ("And my head is full of poison", 0.075, 0.50),
    ("And my heart is full of doubt", 0.080, 0.60),
    ("I got toxins in my bloodstream", 0.070, 0.45),
    ("You tried hard to suck 'em out", 0.075, 0.80),
    ("And it feels like medication", 0.080, 0.50),
    ("And it's good for me, I'm sure", 0.080, 0.75),
    ("But it don't matter how your love feels anymore", 0.060, 0.60),
    ("It'll never be the cure", 0.095, 0.85),
    ("It'll never be the cure...", 0.110, 1.50)
]

print("\\n♫ The Cure — Olivia Rodrigo ♫\\n")
for line, speed, pause in lyrics:
    print_typewriter(line, speed)
    time.sleep(pause)

print("\\n💜 Selesai!\\n")
`;
        navigator.clipboard.writeText(pythonCode).then(() => {
            showToast('Kode Python berhasil disalin ke clipboard! 📋');
        }).catch(err => {
            console.error('Clipboard copy failed', err);
            showToast('Gagal menyalin kode.');
        });
    });

    // -------------------------------------------------------------
    // Toast Notification System
    // -------------------------------------------------------------
    function showToast(message) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<span>✨</span><span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 3000);
    }

});
