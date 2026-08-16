/**
 * Main Application Controller for Lover, You Should've Come Over Floating Lyrics
 */

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const canvasContainer = document.getElementById("floating-canvas");
    const rainCanvas = document.getElementById("rain-canvas");
    const waveformCanvas = document.getElementById("waveform-canvas");

    // Top Navigation
    const searchInput = document.getElementById("search-input");
    const modeButtons = document.querySelectorAll(".nav-btn[data-mode]");
    const scatterBtn = document.getElementById("scatter-btn");
    const newCardBtn = document.getElementById("new-card-btn");
    const transToggleBtn = document.getElementById("trans-toggle-btn");

    // Bottom Player
    const playPauseBtn = document.getElementById("play-pause-btn");
    const playPauseIcon = playPauseBtn.querySelector("i");
    const timeCurrentLabel = document.getElementById("time-current");
    const timeTotalLabel = document.getElementById("time-total");
    const scrubberWrap = document.getElementById("scrubber-wrap");
    const scrubberFill = document.getElementById("scrubber-fill");
    const activeChordBadge = document.getElementById("active-chord-name");
    const vinylIcon = document.querySelector(".vinyl-icon");
    const volumeSlider = document.getElementById("volume-slider");
    const rainToggle = document.getElementById("rain-toggle");
    const vinylToggle = document.getElementById("vinyl-toggle");
    const customAudioInput = document.getElementById("custom-audio-file");

    // Modal
    const modalBackdrop = document.getElementById("modal-backdrop");
    const modalCloseBtn = document.getElementById("modal-close-btn");
    const modalSubmitBtn = document.getElementById("modal-submit-btn");
    const inputQuote = document.getElementById("input-quote");
    const inputTranslation = document.getElementById("input-translation");
    const inputTag = document.getElementById("input-tag");

    // Toast
    const toastNotice = document.getElementById("toast-notice");

    // State
    let hideTranslations = false;
    let rainEnabled = true;
    let vinylEnabled = true;
    let clickPosForModal = { x: 50, y: 50 };

    // 1. Initialize Physics Engine
    const physics = new FloatingPhysicsEngine(canvasContainer);

    // 2. Initialize Rain Canvas Background
    const rainCtx = rainCanvas.getContext("2d");
    let raindrops = [];

    function initRain() {
        rainCanvas.width = window.innerWidth;
        rainCanvas.height = window.innerHeight;
        raindrops = [];
        const count = Math.floor(window.innerWidth / 12);
        for (let i = 0; i < count; i++) {
            raindrops.push({
                x: Math.random() * rainCanvas.width,
                y: Math.random() * rainCanvas.height,
                length: 14 + Math.random() * 20,
                speed: 8 + Math.random() * 12,
                opacity: 0.12 + Math.random() * 0.28,
                thickness: 0.7 + Math.random() * 0.9
            });
        }
    }

    function renderRain() {
        if (!rainEnabled) {
            rainCtx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
            requestAnimationFrame(renderRain);
            return;
        }

        rainCtx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
        rainCtx.strokeStyle = "rgba(240, 215, 180, 0.4)";
        rainCtx.lineWidth = 1;

        for (let i = 0; i < raindrops.length; i++) {
            const drop = raindrops[i];
            rainCtx.strokeStyle = `rgba(230, 200, 160, ${drop.opacity})`;
            rainCtx.lineWidth = drop.thickness;
            rainCtx.beginPath();
            rainCtx.moveTo(drop.x, drop.y);
            rainCtx.lineTo(drop.x - 2, drop.y + drop.length);
            rainCtx.stroke();

            drop.y += drop.speed;
            drop.x -= 0.6; // Wind angle

            if (drop.y > rainCanvas.height) {
                drop.y = -drop.length;
                drop.x = Math.random() * rainCanvas.width;
            }
        }

        requestAnimationFrame(renderRain);
    }

    window.addEventListener("resize", initRain);
    initRain();
    renderRain();

    // 3. Render Lyric Window Cards
    function createLyricCardDOM(data) {
        const card = document.createElement("div");
        card.className = "lyric-card";
        card.id = `card-${data.id}`;
        card.dataset.time = data.time;
        card.dataset.endTime = data.endTime;
        card.dataset.id = data.id;

        const linesHtml = data.lines ? data.lines.map(line => `<div class="lyric-line">${line}</div>`).join("") : "";

        card.innerHTML = `
            <div class="window-header">
                <div class="window-controls">
                    <button class="window-btn btn-close" title="Tutup Card"></button>
                    <button class="window-btn btn-min" title="Kecilkan/Buka"></button>
                    <button class="window-btn btn-pin" title="Pin / Kunci Posisi"></button>
                </div>
                <div class="window-meta">
                    <span class="timecode-tag">${formatTime(data.time)}</span>
                    <span class="chord-tag">${data.chord || "Dmaj7"}</span>
                </div>
                <div class="window-tools">
                    <button class="tool-icon-btn copy-btn" title="Salin Kutipan">📋</button>
                    <button class="tool-icon-btn fav-btn" title="Sukai Bait Ini">🤍</button>
                </div>
            </div>
            <div class="window-body">
                <div class="lyric-section-name">${data.section || "Verse"} • ${data.tag || "Jeff Buckley"}</div>
                <div class="lyric-quote-text">“${data.quote}”</div>
                <div class="lyric-lines">${linesHtml}</div>
                <div class="lyric-translation">${data.translation || ""}</div>
            </div>
        `;

        // Card button event listeners
        const closeBtn = card.querySelector(".btn-close");
        const minBtn = card.querySelector(".btn-min");
        const pinBtn = card.querySelector(".btn-pin");
        const copyBtn = card.querySelector(".copy-btn");
        const favBtn = card.querySelector(".fav-btn");

        closeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
            card.style.opacity = "0";
            card.style.transform += " scale(0.8)";
            setTimeout(() => card.remove(), 300);
            showToast("Tab lirik ditutup");
        });

        minBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            physics.toggleMinimize(data.id);
        });

        pinBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const isPinned = physics.togglePin(data.id);
            pinBtn.style.transform = isPinned ? "scale(1.3)" : "scale(1)";
            showToast(isPinned ? "📌 Posisi tab dikunci (Pinned)" : "🔓 Tab bebas melayang");
        });

        copyBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(`"${data.quote}" — Jeff Buckley (Lover, You Should've Come Over)`);
            showToast("✨ Lirik disalin ke clipboard!");
        });

        favBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            favBtn.classList.toggle("favorited");
            favBtn.textContent = favBtn.classList.contains("favorited") ? "❤️" : "🤍";
            showToast(favBtn.classList.contains("favorited") ? "❤️ Ditambahkan ke favorit" : "Dihapus dari favorit");
        });

        // Click card to seek audio
        card.addEventListener("dblclick", () => {
            audioEngine.seek(data.time);
            if (!audioEngine.isPlaying) audioEngine.play();
            showToast(`Lompat ke detik ${formatTime(data.time)}`);
        });

        return card;
    }

    // Render Poetic Fragments (Floating mini pills)
    function createPoeticPillDOM(fragment, index) {
        const pill = document.createElement("div");
        pill.className = "poetic-pill";
        pill.id = `fragment-${index}`;
        pill.innerHTML = `<span>${fragment.text}</span> <small style="color:var(--amber-primary); margin-left:6px;">${fragment.tag}</small>`;

        pill.addEventListener("click", () => {
            navigator.clipboard.writeText(fragment.text);
            showToast("Kutipan disalin!");
        });

        return pill;
    }

    // Populate Cards
    LYRICS_DATA.forEach(item => {
        const cardDOM = createLyricCardDOM(item);
        canvasContainer.appendChild(cardDOM);
        physics.registerCard(cardDOM, item.initialPos || { x: 50, y: 50 }, { id: item.id });
    });

    POETIC_FRAGMENTS.forEach((fragment, i) => {
        const pillDOM = createPoeticPillDOM(fragment, i);
        canvasContainer.appendChild(pillDOM);
        physics.registerCard(pillDOM, { x: fragment.x, y: fragment.y }, { id: `frag-${i}`, isFragment: true });
    });

    // 4. Audio Waveform Visualizer
    const waveCtx = waveformCanvas.getContext("2d");
    waveformCanvas.width = 65;
    waveformCanvas.height = 24;

    function renderWaveform() {
        const freqData = audioEngine.getFrequencyData();
        waveCtx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);

        const barCount = 14;
        const barWidth = 3;
        const gap = 1.5;

        for (let i = 0; i < barCount; i++) {
            const val = freqData[i * 2] || 0;
            const barHeight = Math.max(3, (val / 255) * waveformCanvas.height);
            const x = i * (barWidth + gap);
            const y = waveformCanvas.height - barHeight;

            waveCtx.fillStyle = audioEngine.isPlaying ? "#e6a756" : "rgba(230, 167, 86, 0.3)";
            waveCtx.fillRect(x, y, barWidth, barHeight);
        }

        requestAnimationFrame(renderWaveform);
    }
    renderWaveform();

    // 5. Audio Engine Event Callbacks
    audioEngine.onTimeUpdate = (currentSec, activeChord) => {
        timeCurrentLabel.textContent = formatTime(currentSec);
        const percent = (currentSec / audioEngine.duration) * 100;
        scrubberFill.style.width = `${percent}%`;

        if (activeChord) {
            activeChordBadge.textContent = activeChord;
        }

        // Active Card Sync
        const currentActive = LYRICS_DATA.find(item => currentSec >= item.time && currentSec < item.endTime);
        if (currentActive) {
            physics.setSpotlightCard(currentActive.id);
        }
    };

    audioEngine.onPlayStateChange = (playing) => {
        if (playing) {
            playPauseBtn.innerHTML = '<span style="font-size:16px;">⏸</span>';
            vinylIcon.classList.add("spinning");
        } else {
            playPauseBtn.innerHTML = '<span style="font-size:16px; margin-left:2px;">▶</span>';
            vinylIcon.classList.remove("spinning");
        }
    };

    // 6. Navigation Controls & Modes
    modeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            modeButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const mode = btn.dataset.mode;
            physics.setLayoutMode(mode);
            showToast(`Mode tata letak: ${btn.textContent.trim()}`);
        });
    });

    scatterBtn.addEventListener("click", () => {
        physics.scatterAll();
        showToast("🌪️ Mengacak posisi kartu melayang!");
    });

    transToggleBtn.addEventListener("click", () => {
        hideTranslations = !hideTranslations;
        transToggleBtn.classList.toggle("active", !hideTranslations);
        document.querySelectorAll(".lyric-card").forEach(c => {
            c.classList.toggle("hide-trans", hideTranslations);
        });
        showToast(hideTranslations ? "Terjemahan disembunyikan" : "Terjemahan ditampilkan");
    });

    // Search filter
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        document.querySelectorAll(".lyric-card").forEach(card => {
            if (!query) {
                card.classList.remove("search-matched", "dimmed");
                return;
            }
            const text = card.textContent.toLowerCase();
            if (text.includes(query)) {
                card.classList.add("search-matched");
                card.classList.remove("dimmed");
            } else {
                card.classList.remove("search-matched");
                card.classList.add("dimmed");
            }
        });
    });

    // 7. Player Controls
    playPauseBtn.addEventListener("click", () => {
        audioEngine.togglePlay();
    });

    scrubberWrap.addEventListener("click", (e) => {
        const rect = scrubberWrap.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percent = clickX / rect.width;
        const targetSec = percent * audioEngine.duration;
        audioEngine.seek(targetSec);
    });

    volumeSlider.addEventListener("input", (e) => {
        audioEngine.setMasterVolume(parseFloat(e.target.value));
    });

    rainToggle.addEventListener("click", () => {
        rainEnabled = !rainEnabled;
        rainToggle.classList.toggle("active", rainEnabled);
        audioEngine.setRainVolume(rainEnabled ? 0.25 : 0);
        showToast(rainEnabled ? "🌧️ Suara & partikel hujan aktif" : "Hujan dinonaktifkan");
    });

    vinylToggle.addEventListener("click", () => {
        vinylEnabled = !vinylEnabled;
        vinylToggle.classList.toggle("active", vinylEnabled);
        audioEngine.setVinylVolume(vinylEnabled ? 0.15 : 0);
        showToast(vinylEnabled ? "📻 Desis vinyl crackle aktif" : "Vinyl crackle dinonaktifkan");
    });

    if (customAudioInput) {
        customAudioInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                const url = URL.createObjectURL(file);
                audioEngine.loadCustomAudio(url);
                audioEngine.play();
                showToast(`🎵 Memutar audio kustom: ${file.name}`);
            }
        });
    }

    // 8. Custom Card Creation Modal
    function openModal(x = 50, y = 50) {
        clickPosForModal = { x, y };
        modalBackdrop.classList.add("is-open");
        inputQuote.focus();
    }

    function closeModal() {
        modalBackdrop.classList.remove("is-open");
        inputQuote.value = "";
        inputTranslation.value = "";
        inputTag.value = "";
    }

    newCardBtn.addEventListener("click", () => openModal(50, 50));
    modalCloseBtn.addEventListener("click", closeModal);
    modalBackdrop.addEventListener("click", (e) => {
        if (e.target === modalBackdrop) closeModal();
    });

    modalSubmitBtn.addEventListener("click", () => {
        const quote = inputQuote.value.trim();
        if (!quote) return;

        const translation = inputTranslation.value.trim();
        const tag = inputTag.value.trim() || "Catatan Pribadi";
        const newId = "custom-" + Date.now();

        const customData = {
            id: newId,
            time: Math.floor(audioEngine.currentTime),
            endTime: Math.floor(audioEngine.currentTime) + 30,
            section: "Kutipan Baru",
            tag: tag,
            chord: audioEngine.getCurrentChord(),
            quote: quote,
            lines: [quote],
            translation: translation,
            initialPos: clickPosForModal
        };

        const cardDOM = createLyricCardDOM(customData);
        canvasContainer.appendChild(cardDOM);
        physics.registerCard(cardDOM, clickPosForModal, { id: newId });

        closeModal();
        showToast("✨ Tab lirik kustom berhasil melayang!");
    });

    // Double click on background to create note
    window.addEventListener("dblclick", (e) => {
        if (e.target === canvasContainer || e.target === rainCanvas || e.target.tagName === "BODY") {
            const pctX = (e.clientX / window.innerWidth) * 100;
            const pctY = (e.clientY / window.innerHeight) * 100;
            openModal(pctX, pctY);
        }
    });

    // Utilities
    function formatTime(sec) {
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    }

    let toastTimeout;
    function showToast(msg) {
        toastNotice.textContent = msg;
        toastNotice.classList.add("show");
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toastNotice.classList.remove("show");
        }, 2400);
    }
});
