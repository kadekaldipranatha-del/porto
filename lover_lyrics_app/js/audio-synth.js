/**
 * Audio Synthesizer & Soundscape Engine for "Lover, You Should've Come Over"
 * Features:
 * - Polyphonic Acoustic Guitar / Rhodes Chord Synth for Jeff Buckley progression
 * - Procedural Rain & Vinyl Crackle sound generators
 * - HTML5 Audio Loader for local/custom MP3 with AudioContext Analyzer
 */

class AudioEngine {
    constructor() {
        this.ctx = null;
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 395; // ~6:35 song length
        this.volume = 0.8;
        this.isMuted = false;

        // Custom audio element
        this.audioEl = new Audio();
        this.hasCustomAudio = false;
        this.analyser = null;
        this.analyserData = null;

        // Ambient generators
        this.rainGain = null;
        this.vinylGain = null;
        this.synthGain = null;
        this.masterGain = null;

        this.rainNode = null;
        this.vinylNode = null;

        // Arpeggiator timer
        this.synthTimer = null;
        this.currentChordIndex = 0;

        // Callbacks
        this.onTimeUpdate = null;
        this.onPlayStateChange = null;

        // Song chords mapped to time ranges (Intro, Verse, Chorus, Bridge, Outro)
        this.chordTimeline = [
            { time: 0, chord: "Dmaj7", notes: [146.83, 220.00, 277.18, 329.63, 369.99] }, // D3, A3, C#4, E4, F#4
            { time: 24, chord: "G6/B", notes: [123.47, 196.00, 246.94, 293.66, 392.00] }, // B2, G3, B3, D4, G4
            { time: 46, chord: "Em9", notes: [82.41, 164.81, 196.00, 293.66, 329.63, 369.99] }, // E2, E3, G3, D4, E4, F#4
            { time: 68, chord: "A7sus4", notes: [110.00, 164.81, 220.00, 293.66, 329.63] }, // A2, E3, A3, D4, E4
            { time: 92, chord: "D", notes: [146.83, 220.00, 293.66, 369.99, 440.00] }, // D3, A3, D4, F#4, A4
            { time: 120, chord: "Bm7", notes: [123.47, 185.00, 220.00, 293.66, 369.99] }, // B2, F#3, A3, D4, F#4
            { time: 152, chord: "F#m7", notes: [92.50, 185.00, 220.00, 277.18, 369.99] }, // F#2, F#3, A3, C#4, F#4
            { time: 182, chord: "Gmaj7", notes: [98.00, 196.00, 246.94, 293.66, 369.99] }, // G2, G3, B3, D4, F#4
            { time: 215, chord: "Bm(add9)", notes: [123.47, 185.00, 277.18, 293.66, 369.99] }, // B2, F#3, C#4, D4, F#4
            { time: 255, chord: "A9", notes: [110.00, 164.81, 220.00, 277.18, 329.63, 440.00] }, // A2, E3, A3, C#4, E4, A4
            { time: 295, chord: "Dmaj7", notes: [146.83, 220.00, 277.18, 329.63, 369.99] },
            { time: 340, chord: "D(add9)", notes: [146.83, 220.00, 293.66, 329.63, 369.99] }
        ];
    }

    initContext() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();

            // Master Gain
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

            // Analyser
            this.analyser = this.ctx.createAnalyser();
            this.analyser.fftSize = 64;
            this.analyserData = new Uint8Array(this.analyser.frequencyBinCount);

            // Sub Gains
            this.synthGain = this.ctx.createGain();
            this.synthGain.gain.setValueAtTime(0.4, this.ctx.currentTime);

            this.rainGain = this.ctx.createGain();
            this.rainGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

            this.vinylGain = this.ctx.createGain();
            this.vinylGain.gain.setValueAtTime(0.15, this.ctx.currentTime);

            // Connections
            this.synthGain.connect(this.masterGain);
            this.rainGain.connect(this.masterGain);
            this.vinylGain.connect(this.masterGain);

            this.masterGain.connect(this.analyser);
            this.analyser.connect(this.ctx.destination);

            // Setup Ambient
            this.setupRainGenerator();
            this.setupVinylGenerator();
        }

        if (this.ctx.state === "suspended") {
            this.ctx.resume();
        }
    }

    setupRainGenerator() {
        const bufferSize = this.ctx.sampleRate * 3;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            // Pink noise filtering
            lastOut = (lastOut + (0.02 * white)) / 1.02;
            data[i] = lastOut * 3.5;
        }

        const rainSource = this.ctx.createBufferSource();
        rainSource.buffer = buffer;
        rainSource.loop = true;

        const rainFilter = this.ctx.createBiquadFilter();
        rainFilter.type = "lowpass";
        rainFilter.frequency.setValueAtTime(1200, this.ctx.currentTime);

        rainSource.connect(rainFilter);
        rainFilter.connect(this.rainGain);
        rainSource.start(0);
        this.rainNode = rainSource;
    }

    setupVinylGenerator() {
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            // Random crackle pops
            if (Math.random() < 0.001) {
                data[i] = (Math.random() * 2 - 1) * 0.8;
            } else if (Math.random() < 0.008) {
                data[i] = (Math.random() * 2 - 1) * 0.2;
            } else {
                data[i] = (Math.random() * 2 - 1) * 0.015;
            }
        }

        const vinylSource = this.ctx.createBufferSource();
        vinylSource.buffer = buffer;
        vinylSource.loop = true;

        const vinylFilter = this.ctx.createBiquadFilter();
        vinylFilter.type = "bandpass";
        vinylFilter.frequency.setValueAtTime(2800, this.ctx.currentTime);
        vinylFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);

        vinylSource.connect(vinylFilter);
        vinylFilter.connect(this.vinylGain);
        vinylSource.start(0);
        this.vinylNode = vinylSource;
    }

    playPluckedNote(freq, timeOffset, velocity = 0.5) {
        if (!this.ctx || !this.isPlaying) return;

        const startTime = this.ctx.currentTime + timeOffset;
        const osc = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        // Warm guitar tone combination: triangle + subtle warm sine overtone
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, startTime);

        osc2.type = "sine";
        osc2.frequency.setValueAtTime(freq * 2, startTime); // Harmonic shimmer

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(freq * 4, startTime);
        filter.frequency.exponentialRampToValueAtTime(Math.max(100, freq * 1.2), startTime + 1.8);

        // Pluck Envelope
        noteGain.gain.setValueAtTime(0, startTime);
        noteGain.gain.linearRampToValueAtTime(velocity * 0.35, startTime + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 2.2);

        osc.connect(filter);
        osc2.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(this.synthGain);

        osc.start(startTime);
        osc2.start(startTime);
        osc.stop(startTime + 2.5);
        osc2.stop(startTime + 2.5);
    }

    playChordArpeggio(notes, durationSec = 3.2) {
        if (!this.ctx || !this.isPlaying) return;

        // Pluck strings with natural acoustic fingerpicking pattern
        const pattern = [0, 1, 2, 3, 2, 1, 4, 3];
        const step = durationSec / pattern.length;

        pattern.forEach((noteIdx, i) => {
            if (notes[noteIdx]) {
                const freq = notes[noteIdx];
                const delay = i * step;
                const vel = (i === 0 || i === 4) ? 0.65 : 0.45; // Emphasize bass note
                this.playPluckedNote(freq, delay, vel);
            }
        });
    }

    startSynthLoop() {
        if (this.synthTimer) clearInterval(this.synthTimer);

        const tick = () => {
            if (!this.isPlaying) return;

            // Find matching chord based on currentTime
            let currentChord = this.chordTimeline[0];
            for (let i = 0; i < this.chordTimeline.length; i++) {
                if (this.currentTime >= this.chordTimeline[i].time) {
                    currentChord = this.chordTimeline[i];
                }
            }

            if (!this.hasCustomAudio) {
                this.playChordArpeggio(currentChord.notes, 3.2);
            }

            this.currentTime += 1;
            if (this.currentTime >= this.duration) {
                this.currentTime = 0;
            }

            if (this.onTimeUpdate) {
                this.onTimeUpdate(this.currentTime, currentChord.chord);
            }
        };

        tick();
        this.synthTimer = setInterval(tick, 1000);
    }

    play() {
        this.initContext();
        this.isPlaying = true;

        if (this.hasCustomAudio && this.audioEl.src) {
            this.audioEl.play().catch(e => console.log("Audio play error:", e));
        }

        this.startSynthLoop();
        if (this.onPlayStateChange) this.onPlayStateChange(true);
    }

    pause() {
        this.isPlaying = false;
        if (this.synthTimer) {
            clearInterval(this.synthTimer);
            this.synthTimer = null;
        }

        if (this.hasCustomAudio) {
            this.audioEl.pause();
        }

        if (this.onPlayStateChange) this.onPlayStateChange(false);
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    seek(timeSeconds) {
        this.currentTime = Math.max(0, Math.min(this.duration, timeSeconds));
        if (this.hasCustomAudio) {
            this.audioEl.currentTime = this.currentTime;
        }
        if (this.onTimeUpdate) {
            const chord = this.getCurrentChord();
            this.onTimeUpdate(this.currentTime, chord);
        }
    }

    getCurrentChord() {
        let currentChord = this.chordTimeline[0].chord;
        for (let i = 0; i < this.chordTimeline.length; i++) {
            if (this.currentTime >= this.chordTimeline[i].time) {
                currentChord = this.chordTimeline[i].chord;
            }
        }
        return currentChord;
    }

    setMasterVolume(val) {
        this.volume = val;
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : val, this.ctx.currentTime);
        }
        if (this.hasCustomAudio) {
            this.audioEl.volume = this.isMuted ? 0 : val;
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.setMasterVolume(this.volume);
        return this.isMuted;
    }

    setRainVolume(val) {
        if (this.rainGain && this.ctx) {
            this.rainGain.gain.setValueAtTime(val, this.ctx.currentTime);
        }
    }

    setVinylVolume(val) {
        if (this.vinylGain && this.ctx) {
            this.vinylGain.gain.setValueAtTime(val, this.ctx.currentTime);
        }
    }

    loadCustomAudio(url) {
        this.initContext();
        this.audioEl.src = url;
        this.hasCustomAudio = true;

        this.audioEl.onloadedmetadata = () => {
            this.duration = this.audioEl.duration || 395;
        };

        this.audioEl.ontimeupdate = () => {
            this.currentTime = this.audioEl.currentTime;
            if (this.onTimeUpdate) {
                this.onTimeUpdate(this.currentTime, this.getCurrentChord());
            }
        };

        try {
            const source = this.ctx.createMediaElementSource(this.audioEl);
            source.connect(this.masterGain);
        } catch (e) {
            // In case already connected
        }
    }

    getFrequencyData() {
        if (this.analyser && this.analyserData) {
            this.analyser.getByteFrequencyData(this.analyserData);
            return this.analyserData;
        }
        // Simulated harmonic spectrum when synth is playing
        const mock = new Uint8Array(32);
        if (this.isPlaying) {
            const time = performance.now() * 0.003;
            for (let i = 0; i < 32; i++) {
                const base = Math.sin(time + i * 0.4) * 0.5 + 0.5;
                const decay = Math.max(0.1, 1 - (i / 32));
                mock[i] = Math.floor(base * decay * 200 + Math.random() * 25);
            }
        }
        return mock;
    }
}

// Global Audio Engine Instance
const audioEngine = new AudioEngine();
