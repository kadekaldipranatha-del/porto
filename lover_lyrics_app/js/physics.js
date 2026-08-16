/**
 * Physics & Floating Motion Engine for Lyric Cards
 * Handles multi-axis organic floating, momentum inertia dragging, 3D tilt, collision bouncing,
 * and algorithmic layout transformations (Storm, Orbit, Cascade, Spotlight).
 */

class FloatingPhysicsEngine {
    constructor(container) {
        this.container = container;
        this.cards = [];
        this.activeMode = "drift"; // 'drift', 'spotlight', 'orbit', 'cascade', 'grid'
        this.isPaused = false;

        // Mouse tracking for magnetic repulsion & 3D tilt
        this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, active: false };
        this.dragState = null;
        this.topZIndex = 100;

        this.animFrameId = null;
        this.lastTime = performance.now();

        this.initEvents();
        this.startLoop();
    }

    initEvents() {
        window.addEventListener("mousemove", (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.mouse.active = true;

            if (this.dragState) {
                this.handleDragMove(e.clientX, e.clientY);
            }
        });

        window.addEventListener("mouseup", () => {
            if (this.dragState) {
                this.handleDragEnd();
            }
        });

        window.addEventListener("touchmove", (e) => {
            if (e.touches.length > 0) {
                this.mouse.x = e.touches[0].clientX;
                this.mouse.y = e.touches[0].clientY;
                this.mouse.active = true;
                if (this.dragState) {
                    this.handleDragMove(this.mouse.x, this.mouse.y);
                }
            }
        }, { passive: true });

        window.addEventListener("touchend", () => {
            if (this.dragState) {
                this.handleDragEnd();
            }
        });

        window.addEventListener("resize", () => {
            this.handleResize();
        });
    }

    registerCard(cardEl, initialPercentPos = { x: 50, y: 50 }, options = {}) {
        const rect = cardEl.getBoundingClientRect();
        const width = rect.width || 320;
        const height = rect.height || 180;

        const startX = (window.innerWidth * (initialPercentPos.x / 100)) - (width / 2);
        const startY = (window.innerHeight * (initialPercentPos.y / 100)) - (height / 2);

        // Clamped inside bounds
        const x = Math.max(20, Math.min(window.innerWidth - width - 20, startX));
        const y = Math.max(70, Math.min(window.innerHeight - height - 90, startY));

        const cardObj = {
            id: options.id || "card-" + Math.random().toString(36).substr(2, 9),
            el: cardEl,
            x: x,
            y: y,
            targetX: x,
            targetY: y,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            width: width,
            height: height,
            pinned: false,
            minimized: false,
            spotlight: false,
            isFragment: !!options.isFragment,
            
            // Organic wave oscillation parameters
            phaseX: Math.random() * Math.PI * 2,
            phaseY: Math.random() * Math.PI * 2,
            speedX: 0.0008 + Math.random() * 0.0012,
            speedY: 0.0010 + Math.random() * 0.0015,
            ampX: 12 + Math.random() * 22,
            ampY: 14 + Math.random() * 26,
            rotAmp: 1.5 + Math.random() * 2.5,
            currentRot: (Math.random() - 0.5) * 4,
            tiltX: 0,
            tiltY: 0,

            // Orbit properties
            orbitAngle: Math.random() * Math.PI * 2,
            orbitRadius: 180 + Math.random() * 280,
            orbitSpeed: (Math.random() > 0.5 ? 1 : -1) * (0.0003 + Math.random() * 0.0004)
        };

        this.cards.push(cardObj);
        this.attachCardInteractions(cardObj);
        this.updateCardDOM(cardObj);
        return cardObj;
    }

    attachCardInteractions(card) {
        const header = card.el.querySelector(".window-header") || card.el;

        const startDrag = (clientX, clientY) => {
            this.bringToFront(card);
            card.vx = 0;
            card.vy = 0;
            this.dragState = {
                card: card,
                startX: clientX,
                startY: clientY,
                initialCardX: card.x,
                initialCardY: card.y,
                lastX: clientX,
                lastY: clientY,
                lastTime: performance.now(),
                history: []
            };
            card.el.classList.add("is-dragging");
        };

        header.addEventListener("mousedown", (e) => {
            if (e.target.closest(".window-btn") || e.target.closest("button") || e.target.closest("a")) return;
            e.preventDefault();
            startDrag(e.clientX, e.clientY);
        });

        header.addEventListener("touchstart", (e) => {
            if (e.target.closest(".window-btn") || e.target.closest("button") || e.target.closest("a")) return;
            if (e.touches.length > 0) {
                startDrag(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: false });

        // 3D Card Hover Tilt
        card.el.addEventListener("mousemove", (e) => {
            if (this.dragState && this.dragState.card === card) return;
            const rect = card.el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) / (rect.width / 2);
            const dy = (e.clientY - cy) / (rect.height / 2);

            card.tiltX = -dy * 8;
            card.tiltY = dx * 8;
        });

        card.el.addEventListener("mouseleave", () => {
            card.tiltX = 0;
            card.tiltY = 0;
        });

        card.el.addEventListener("click", () => {
            this.bringToFront(card);
        });
    }

    handleDragMove(clientX, clientY) {
        if (!this.dragState) return;
        const { card, startX, startY, initialCardX, initialCardY, lastX, lastY, lastTime, history } = this.dragState;

        const dx = clientX - startX;
        const dy = clientY - startY;

        card.x = initialCardX + dx;
        card.y = initialCardY + dy;
        card.targetX = card.x;
        card.targetY = card.y;

        const now = performance.now();
        const dt = Math.max(1, now - lastTime);

        // Keep drag history for smooth momentum throw
        history.push({
            vx: (clientX - lastX) / dt * 16,
            vy: (clientY - lastY) / dt * 16,
            time: now
        });

        if (history.length > 5) history.shift();

        this.dragState.lastX = clientX;
        this.dragState.lastY = clientY;
        this.dragState.lastTime = now;
    }

    handleDragEnd() {
        if (!this.dragState) return;
        const { card, history } = this.dragState;
        card.el.classList.remove("is-dragging");

        // Calculate average velocity for momentum release
        if (history.length > 0 && !card.pinned) {
            let sumVx = 0, sumVy = 0;
            history.forEach(h => {
                sumVx += h.vx;
                sumVy += h.vy;
            });
            card.vx = Math.max(-12, Math.min(12, sumVx / history.length));
            card.vy = Math.max(-12, Math.min(12, sumVy / history.length));
        }

        this.dragState = null;
    }

    bringToFront(card) {
        this.topZIndex += 1;
        card.el.style.zIndex = this.topZIndex;
    }

    togglePin(cardId) {
        const card = this.cards.find(c => c.id === cardId);
        if (card) {
            card.pinned = !card.pinned;
            card.el.classList.toggle("is-pinned", card.pinned);
            if (card.pinned) {
                card.vx = 0;
                card.vy = 0;
            }
            return card.pinned;
        }
        return false;
    }

    toggleMinimize(cardId) {
        const card = this.cards.find(c => c.id === cardId);
        if (card) {
            card.minimized = !card.minimized;
            card.el.classList.toggle("is-minimized", card.minimized);
            // Recalculate dimensions
            setTimeout(() => {
                const rect = card.el.getBoundingClientRect();
                card.width = rect.width;
                card.height = rect.height;
            }, 300);
        }
    }

    setLayoutMode(mode) {
        this.activeMode = mode;
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const total = this.cards.length;

        this.cards.forEach((card, idx) => {
            card.spotlight = false;
            card.el.classList.remove("is-spotlight", "dimmed");

            if (mode === "cascade") {
                const colWidth = 340;
                const cols = Math.max(1, Math.floor(window.innerWidth / colWidth));
                const col = idx % cols;
                const row = Math.floor(idx / cols);
                card.targetX = 40 + col * (colWidth + 20) + (row % 2) * 15;
                card.targetY = 90 + row * 90;
            } else if (mode === "orbit") {
                const angle = (idx / total) * Math.PI * 2;
                const radius = Math.min(cx - 160, cy - 100, 220 + (idx % 3) * 60);
                card.targetX = cx + Math.cos(angle) * radius - (card.width / 2);
                card.targetY = cy + Math.sin(angle) * (radius * 0.75) - (card.height / 2);
            } else if (mode === "grid") {
                const cols = Math.max(1, Math.floor((window.innerWidth - 60) / 360));
                const col = idx % cols;
                const row = Math.floor(idx / cols);
                card.targetX = 40 + col * 360;
                card.targetY = 90 + row * 240;
            }
        });
    }

    setSpotlightCard(cardId) {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;

        this.cards.forEach(card => {
            if (card.id === cardId) {
                card.spotlight = true;
                this.bringToFront(card);
                card.el.classList.add("is-spotlight");
                card.el.classList.remove("dimmed");
                // Center target
                card.targetX = cx - (card.width / 2);
                card.targetY = cy - (card.height / 2) - 20;
            } else {
                card.spotlight = false;
                card.el.classList.remove("is-spotlight");
                if (this.activeMode === "spotlight") {
                    card.el.classList.add("dimmed");
                } else {
                    card.el.classList.remove("dimmed");
                }
            }
        });
    }

    scatterAll() {
        this.cards.forEach(card => {
            card.targetX = 30 + Math.random() * (window.innerWidth - card.width - 60);
            card.targetY = 80 + Math.random() * (window.innerHeight - card.height - 150);
            card.vx = (Math.random() - 0.5) * 4;
            card.vy = (Math.random() - 0.5) * 4;
        });
    }

    updatePhysics(now, dt) {
        const timeSec = now * 0.001;
        const maxX = window.innerWidth;
        const maxY = window.innerHeight;

        this.cards.forEach(card => {
            if (this.dragState && this.dragState.card === card) {
                // Currently dragged
                this.updateCardDOM(card);
                return;
            }

            if (card.pinned) {
                this.updateCardDOM(card);
                return;
            }

            // Mode specific behaviors
            if (this.activeMode === "drift") {
                // Organic wave motion
                const waveX = Math.sin(timeSec * card.speedX * 1000 + card.phaseX) * card.ampX;
                const waveY = Math.cos(timeSec * card.speedY * 1000 + card.phaseY) * card.ampY;

                // Friction damping on free velocity
                card.vx *= 0.96;
                card.vy *= 0.96;

                // Apply velocity and subtle continuous drift
                card.x += card.vx + Math.sin(timeSec + card.phaseX) * 0.15;
                card.y += card.vy + Math.cos(timeSec + card.phaseY) * 0.15;

                // Magnetic mouse repulsion (subtle gentle push away from cursor)
                if (this.mouse.active) {
                    const cardCx = card.x + card.width / 2;
                    const cardCy = card.y + card.height / 2;
                    const distDx = cardCx - this.mouse.x;
                    const distDy = cardCy - this.mouse.y;
                    const dist = Math.hypot(distDx, distDy);
                    const repelRadius = 160;

                    if (dist < repelRadius && dist > 1) {
                        const force = (1 - (dist / repelRadius)) * 1.5;
                        card.vx += (distDx / dist) * force;
                        card.vy += (distDy / dist) * force;
                    }
                }

                // Smooth rotation drift
                card.currentRot = Math.sin(timeSec * 0.5 + card.phaseX) * card.rotAmp;

            } else if (this.activeMode === "orbit") {
                // Galaxy orbit loop
                card.orbitAngle += card.orbitSpeed * dt * 60;
                const cx = window.innerWidth / 2;
                const cy = window.innerHeight / 2;
                card.targetX = cx + Math.cos(card.orbitAngle) * card.orbitRadius - (card.width / 2);
                card.targetY = cy + Math.sin(card.orbitAngle) * (card.orbitRadius * 0.7) - (card.height / 2);

                // Lerp towards target
                card.x += (card.targetX - card.x) * 0.05;
                card.y += (card.targetY - card.y) * 0.05;

            } else if (this.activeMode === "cascade" || this.activeMode === "grid" || card.spotlight) {
                // Lerp smoothly to target layout coordinates
                const lerpFactor = card.spotlight ? 0.12 : 0.06;
                card.x += (card.targetX - card.x) * lerpFactor;
                card.y += (card.targetY - card.y) * lerpFactor;
            }

            // Boundary collision bounce
            const padding = 15;
            const bottomMargin = 90; // for bottom player bar
            const topMargin = 70; // for top navigation bar

            if (card.x < padding) {
                card.x = padding;
                card.vx = Math.abs(card.vx) * 0.6;
            } else if (card.x + card.width > maxX - padding) {
                card.x = maxX - padding - card.width;
                card.vx = -Math.abs(card.vx) * 0.6;
            }

            if (card.y < topMargin) {
                card.y = topMargin;
                card.vy = Math.abs(card.vy) * 0.6;
            } else if (card.y + card.height > maxY - bottomMargin) {
                card.y = maxY - bottomMargin - card.height;
                card.vy = -Math.abs(card.vy) * 0.6;
            }

            this.updateCardDOM(card);
        });
    }

    updateCardDOM(card) {
        const transform = `translate3d(${card.x.toFixed(1)}px, ${card.y.toFixed(1)}px, 0) ` +
            `rotate(${card.currentRot.toFixed(2)}deg) ` +
            `perspective(1000px) rotateX(${card.tiltX.toFixed(2)}deg) rotateY(${card.tiltY.toFixed(2)}deg)`;

        card.el.style.transform = transform;
    }

    handleResize() {
        this.cards.forEach(card => {
            const rect = card.el.getBoundingClientRect();
            card.width = rect.width;
            card.height = rect.height;
        });
        if (this.activeMode !== "drift") {
            this.setLayoutMode(this.activeMode);
        }
    }

    startLoop() {
        const loop = (now) => {
            const dt = Math.min(32, now - this.lastTime);
            this.lastTime = now;

            if (!this.isPaused) {
                this.updatePhysics(now, dt);
            }

            this.animFrameId = requestAnimationFrame(loop);
        };
        this.animFrameId = requestAnimationFrame(loop);
    }
}
