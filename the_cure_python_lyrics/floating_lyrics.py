"""
=============================================================================
  Song: The Cure — Olivia Rodrigo
  Square Retro Error Dialog Tabs (Kotak • Kata per Kata • Arah Bebas)
  Beat Flashing: Hitam 🖤 • Putih 🤍 • Merah ❤️
  Audio: Authentic "The Cure" Track Playback (Pure Python / Tkinter / WinMM)
=============================================================================
"""

import tkinter as tk
import time
import random
import ctypes
import os
import sys

# ---------------------------------------------------------------------------
# 1. Pemutar Musik Bawaan Windows (MCI Native Audio)
# ---------------------------------------------------------------------------
class WindowsAudioPlayer:
    """Plays the authentic 'The Cure' audio natively via Windows MCI."""
    def __init__(self):
        self.winmm = ctypes.windll.winmm
        self.alias = "the_cure_error_bgm"
        self.audio_file = None
        self._find_audio_file()

    def _find_audio_file(self):
        possible_paths = [
            os.path.join(os.path.dirname(__file__), "the_cure.mp3"),
            os.path.join(os.path.dirname(__file__), "song.mp3"),
            os.path.join(os.path.dirname(__file__), "..", "song.mp3"),
            "the_cure.mp3",
            "song.mp3"
        ]
        for p in possible_paths:
            if os.path.exists(p):
                self.audio_file = os.path.abspath(p)
                break

    def play(self):
        if not self.audio_file:
            print("[!] File audio tidak ditemukan. Menjalankan animasi visual...")
            return
        try:
            self.stop()
            cmd_open = f'open "{self.audio_file}" type mpegvideo alias {self.alias}'
            self.winmm.mciSendStringW(cmd_open, None, 0, None)
            self.winmm.mciSendStringW(f"play {self.alias}", None, 0, None)
            print(f"[*] 🎵 Memutar audio: {os.path.basename(self.audio_file)}")
        except Exception as e:
            print(f"[!] Error memutar audio: {e}")

    def stop(self):
        try:
            self.winmm.mciSendStringW(f"stop {self.alias}", None, 0, None)
            self.winmm.mciSendStringW(f"close {self.alias}", None, 0, None)
        except Exception:
            pass


# ---------------------------------------------------------------------------
# 2. Palet Warna Beat: Hitam - Putih - Merah (Error Box Styling)
# ---------------------------------------------------------------------------
BEAT_THEMES = [
    # 0: Hitam Pekat dengan Border & Aksen Merah
    {
        "bg": "#0a0a0c",
        "border": "#ef4444",
        "titlebar_bg": "#1f090c",
        "titlebar_fg": "#ff4d6d",
        "text": "#ffffff",
        "icon": "#ef4444",
        "btn_bg": "#1c1917",
        "btn_fg": "#fca5a5"
    },
    # 1: Putih Flash Terang dengan Teks Hitam & Border Merah
    {
        "bg": "#ffffff",
        "border": "#dc2626",
        "titlebar_bg": "#fee2e2",
        "titlebar_fg": "#991b1b",
        "text": "#000000",
        "icon": "#dc2626",
        "btn_bg": "#f1f5f9",
        "btn_fg": "#0a0a0c"
    },
    # 2: Merah Membara dengan Teks & Border Putih
    {
        "bg": "#dc2626",
        "border": "#ffffff",
        "titlebar_bg": "#991b1b",
        "titlebar_fg": "#fef2f2",
        "text": "#ffffff",
        "icon": "#ffffff",
        "btn_bg": "#7f1d1d",
        "btn_fg": "#ffffff"
    },
    # 3: Hitam Gelap dengan Border Putih Bersih
    {
        "bg": "#000000",
        "border": "#ffffff",
        "titlebar_bg": "#1c1917",
        "titlebar_fg": "#ffffff",
        "text": "#ff3366",
        "icon": "#ffffff",
        "btn_bg": "#262626",
        "btn_fg": "#ffffff"
    }
]

# ---------------------------------------------------------------------------
# 3. Lirik Lagu The Cure - Olivia Rodrigo
# ---------------------------------------------------------------------------
SONG_TITLE = "the_cure.exe"

LYRICS_DATA = [
    {
        "text": "And my head is full of poison",
        "err_code": "0x0000001A_POISON",
        "duration": 3.1
    },
    {
        "text": "And my heart is full of doubt",
        "err_code": "0x0000002B_DOUBT",
        "duration": 3.1
    },
    {
        "text": "I got toxins in my bloodstream",
        "err_code": "0x0000003C_TOXINS",
        "duration": 3.0
    },
    {
        "text": "You tried hard to suck 'em out",
        "err_code": "0x0000004D_OVERFLOW",
        "duration": 3.2
    },
    {
        "text": "And it feels like medication",
        "err_code": "0x0000005E_MEDICATION",
        "duration": 3.1
    },
    {
        "text": "And it's good for me, I'm sure",
        "tag": "SYSTEM_DIAGNOSTIC",
        "err_code": "0x0000006F_CHECK_OK",
        "duration": 3.3
    },
    {
        "text": "But it don't matter how your love feels anymore",
        "err_code": "0x00000070_FATAL_CRASH",
        "duration": 3.8
    },
    {
        "text": "It'll never be the cure",
        "err_code": "0x00000081_NO_CURE_FOUND",
        "duration": 3.2
    },
    {
        "text": "It'll never be the cure...",
        "err_code": "0x00000099_CORE_HALTED",
        "duration": 4.0
    }
]


# ---------------------------------------------------------------------------
# 4. Tab Error Berbentuk Kotak (Square) dengan Animasi Per Kata & Arah Bebas
# ---------------------------------------------------------------------------
class SquareErrorBox:
    """A square (1:1 aspect ratio) retro error dialog box that types word-by-word."""
    
    def __init__(self, master, data, on_finished_callback=None):
        self.master = master
        self.data = data
        self.on_finished_callback = on_finished_callback
        
        self.screen_w = master.winfo_screenwidth()
        self.screen_h = master.winfo_screenheight()
        
        # BENTUK KOTAK (Square 340 x 340 piksel)
        self.box_size = 340
        
        # Posisi dan arah acak bebas di layar monitor
        self.x = float(random.randint(60, max(80, self.screen_w - self.box_size - 60)))
        self.y = float(random.randint(60, max(80, self.screen_h - self.box_size - 60)))
        
        # Kecepatan melayang acak ke segala arah bebas (vx, vy)
        self.vx = random.choice([-2.0, -1.2, 1.2, 2.0]) * random.uniform(0.7, 1.2)
        self.vy = random.choice([-1.8, -1.0, 1.0, 1.8]) * random.uniform(0.7, 1.2)
        
        self.is_destroyed = False
        self.is_dragging = False
        
        # TopLevel Window
        self.win = tk.Toplevel(master)
        self.win.overrideredirect(True)          # Tanpa border OS default
        self.win.wm_attributes("-topmost", True)  # Selalu melayang di atas semua aplikasi
        self.win.wm_attributes("-alpha", 0.96)
        self.win.geometry(f"{self.box_size}x{self.box_size}+{int(self.x)}+{int(self.y)}")
        
        # Theme Awal
        self.theme_idx = 0
        t = BEAT_THEMES[self.theme_idx]
        
        # Outer Border Box (Kotak tebal bergaya dialog box retro)
        self.outer_frame = tk.Frame(self.win, bg=t["border"], bd=4, relief="ridge")
        self.outer_frame.pack(fill="both", expand=True)
        
        # Titlebar Retro Error Tab
        self.titlebar = tk.Frame(self.outer_frame, bg=t["titlebar_bg"], height=32)
        self.titlebar.pack(fill="x")
        
        self.title_icon = tk.Label(
            self.titlebar, text=" ❌", font=("Segoe UI", 9, "bold"),
            fg=t["titlebar_fg"], bg=t["titlebar_bg"]
        )
        self.title_icon.pack(side="left")
        
        self.title_label = tk.Label(
            self.titlebar, text=f"Error: {SONG_TITLE} — {data['err_code']}",
            font=("Segoe UI", 8, "bold"), fg=t["titlebar_fg"], bg=t["titlebar_bg"]
        )
        self.title_label.pack(side="left", padx=4)
        
        self.close_btn = tk.Label(
            self.titlebar, text=" ✕ ", font=("Segoe UI", 9, "bold"),
            fg=t["titlebar_fg"], bg=t["titlebar_bg"], cursor="hand2"
        )
        self.close_btn.pack(side="right")
        self.close_btn.bind("<Button-1>", lambda e: self.destroy())
        
        # Body Frame (Kotak Tengah)
        self.body_frame = tk.Frame(self.outer_frame, bg=t["bg"], padx=18, pady=16)
        self.body_frame.pack(fill="both", expand=True)
        
        # Error Icon Besar & Header
        self.icon_frame = tk.Frame(self.body_frame, bg=t["bg"])
        self.icon_frame.pack(fill="x", pady=(0, 10))
        
        self.big_icon = tk.Label(
            self.icon_frame, text="⛔ CRITICAL ERROR",
            font=("Segoe UI", 11, "bold"), fg=t["icon"], bg=t["bg"]
        )
        self.big_icon.pack(anchor="w")
        
        # Tempat Lirik Per Kata (Font Tebal, Wrap Pas di Kotak)
        self.lyric_label = tk.Label(
            self.body_frame,
            text="",
            font=("Consolas", 15, "bold"),
            fg=t["text"],
            bg=t["bg"],
            wraplength=290,
            justify="left",
            anchor="nw"
        )
        self.lyric_label.pack(fill="both", expand=True, pady=6)
        
        # Footer Tombol Klasik [ Abort ] [ Retry ] [ Ignore ]
        self.btn_bar = tk.Frame(self.body_frame, bg=t["bg"])
        self.btn_bar.pack(fill="x", pady=(8, 0))
        
        self.btn1 = tk.Label(self.btn_bar, text="[ Abort ]", font=("Segoe UI", 8, "bold"), fg=t["btn_fg"], bg=t["btn_bg"], padx=8, pady=4, relief="groove")
        self.btn1.pack(side="left", padx=2)
        
        self.btn2 = tk.Label(self.btn_bar, text="[ Retry ]", font=("Segoe UI", 8, "bold"), fg=t["btn_fg"], bg=t["btn_bg"], padx=8, pady=4, relief="groove")
        self.btn2.pack(side="left", padx=2)
        
        self.btn3 = tk.Label(self.btn_bar, text="[ The Cure ]", font=("Segoe UI", 8, "bold"), fg="#ffffff", bg="#dc2626", padx=8, pady=4, relief="groove")
        self.btn3.pack(side="right", padx=2)
        
        # Mouse Dragging
        for w in (self.win, self.outer_frame, self.titlebar, self.title_icon, self.title_label, self.body_frame, self.icon_frame, self.big_icon, self.lyric_label):
            w.bind("<Button-1>", self.on_drag_start)
            w.bind("<B1-Motion>", self.on_drag_motion)
            w.bind("<ButtonRelease-1>", self.on_drag_stop)
            
        # Pisahkan lirik menjadi KATA PER KATA
        self.words = data["text"].split()
        self.word_index = 0
        
        # Hitung jeda waktu antar kata berdasarkan durasi lirik
        total_words = len(self.words)
        self.word_delay_ms = int((data["duration"] * 0.75 / max(1, total_words)) * 1000)
        
        # Mulai Munculkan Kata per Kata, Kedip Beat, dan Gerak Melayang Bebas
        self.type_word()
        self.beat_flash_loop()
        self.physics_drift_loop()
        
        # Hilang otomatis saat durasi lirik habis & panggil kotak error baru
        auto_destroy_ms = int(data["duration"] * 1000)
        self.win.after(auto_destroy_ms, self.finish_and_destroy)

    # -----------------------------------------------------------------------
    # Munculkan Lirik KATA PER KATA
    # -----------------------------------------------------------------------
    def type_word(self):
        if self.is_destroyed or not self.win.winfo_exists():
            return
            
        if self.word_index <= len(self.words):
            current_words = " ".join(self.words[:self.word_index])
            cursor = " █" if self.word_index < len(self.words) else ""
            self.lyric_label.config(text=current_words + cursor)
            self.word_index += 1
            self.win.after(self.word_delay_ms, self.type_word)
        else:
            self.lyric_label.config(text=" ".join(self.words))

    # -----------------------------------------------------------------------
    # Kedip Beat Hitam - Putih - Merah
    # -----------------------------------------------------------------------
    def beat_flash_loop(self):
        if self.is_destroyed or not self.win.winfo_exists():
            return
            
        self.theme_idx = (self.theme_idx + 1) % len(BEAT_THEMES)
        t = BEAT_THEMES[self.theme_idx]
        
        try:
            self.outer_frame.config(bg=t["border"])
            self.titlebar.config(bg=t["titlebar_bg"])
            self.title_icon.config(bg=t["titlebar_bg"], fg=t["titlebar_fg"])
            self.title_label.config(bg=t["titlebar_bg"], fg=t["titlebar_fg"])
            self.close_btn.config(bg=t["titlebar_bg"], fg=t["titlebar_fg"])
            self.body_frame.config(bg=t["bg"])
            self.icon_frame.config(bg=t["bg"])
            self.big_icon.config(bg=t["bg"], fg=t["icon"])
            self.lyric_label.config(bg=t["bg"], fg=t["text"])
            self.btn_bar.config(bg=t["bg"])
            self.btn1.config(bg=t["btn_bg"], fg=t["btn_fg"])
            self.btn2.config(bg=t["btn_bg"], fg=t["btn_fg"])
        except Exception:
            pass
            
        # Tempo beat lagu The Cure (~220ms per beat)
        self.win.after(220, self.beat_flash_loop)

    # -----------------------------------------------------------------------
    # Pergerakan Melayang Bebas di Layar (Arah Bebas)
    # -----------------------------------------------------------------------
    def physics_drift_loop(self):
        if self.is_destroyed or not self.win.winfo_exists():
            return
            
        if not self.is_dragging:
            self.x += self.vx
            self.y += self.vy
            
            # Pantulan dinding monitor
            margin = 20
            if self.x <= margin:
                self.x = margin
                self.vx = abs(self.vx)
            elif self.x + self.box_size >= self.screen_w - margin:
                self.x = self.screen_w - margin - self.box_size
                self.vx = -abs(self.vx)
                
            if self.y <= margin + 40:
                self.y = margin + 40
                self.vy = abs(self.vy)
            elif self.y + self.box_size >= self.screen_h - margin - 40:
                self.y = self.screen_h - margin - 40 - self.box_size
                self.vy = -abs(self.vy)
                
            self.win.geometry(f"+{int(self.x)}+{int(self.y)}")
            
        self.win.after(20, self.physics_drift_loop)

    # -----------------------------------------------------------------------
    # Mouse Dragging
    # -----------------------------------------------------------------------
    def on_drag_start(self, event):
        self.is_dragging = True
        self.drag_start_x = event.x_root - self.win.winfo_x()
        self.drag_start_y = event.y_root - self.win.winfo_y()

    def on_drag_motion(self, event):
        if self.is_dragging and not self.is_destroyed and self.win.winfo_exists():
            self.x = event.x_root - self.drag_start_x
            self.y = event.y_root - self.drag_start_y
            self.win.geometry(f"+{int(self.x)}+{int(self.y)}")

    def on_drag_stop(self, event):
        self.is_dragging = False

    # -----------------------------------------------------------------------
    # Selesai, Hilang, & Munculkan Kotak Error Baru
    # -----------------------------------------------------------------------
    def finish_and_destroy(self):
        if self.is_destroyed:
            return
        self.is_destroyed = True
        
        if self.on_finished_callback:
            self.on_finished_callback()
            
        self.destroy()

    def destroy(self):
        self.is_destroyed = True
        try:
            if self.win.winfo_exists():
                self.win.destroy()
        except Exception:
            pass


# ---------------------------------------------------------------------------
# 5. Master Controller Application
# ---------------------------------------------------------------------------
class MasterErrorLyricsApp:
    def __init__(self, root):
        self.root = root
        self.root.overrideredirect(True)
        self.root.wm_attributes("-topmost", True)
        self.root.wm_attributes("-alpha", 0.96)
        
        self.screen_w = self.root.winfo_screenwidth()
        self.screen_h = self.root.winfo_screenheight()
        
        # Panel Kontrol Mini di Pojok Kanan Atas
        ctrl_w, ctrl_h = 390, 48
        self.root.geometry(f"{ctrl_w}x{ctrl_h}+{self.screen_w - ctrl_w - 20}+15")
        
        # Audio Player Init
        self.audio = WindowsAudioPlayer()
        
        # Frame Styling
        self.frame = tk.Frame(self.root, bg="#0a0a0c", bd=2, highlightbackground="#ef4444", highlightthickness=2)
        self.frame.pack(fill="both", expand=True)
        
        # Drag bar master
        def start_d(e): self._dx, self._dy = e.x_root - self.root.winfo_x(), e.y_root - self.root.winfo_y()
        def do_d(e): self.root.geometry(f"+{e.x_root - self._dx}+{e.y_root - self._dy}")
        self.frame.bind("<Button-1>", start_d)
        self.frame.bind("<B1-Motion>", do_d)
        
        info = tk.Frame(self.frame, bg="#0a0a0c")
        info.pack(side="left", padx=10)
        tk.Label(info, text="❌ The Cure — Error Tabs", font=("Segoe UI", 9, "bold"), fg="#ffffff", bg="#0a0a0c").pack(anchor="w")
        self.status_lbl = tk.Label(info, text="Kotak • Per Kata • Arah Bebas ⚡", font=("Segoe UI", 8), fg="#ef4444", bg="#0a0a0c")
        self.status_lbl.pack(anchor="w")
        
        btns = tk.Frame(self.frame, bg="#0a0a0c")
        btns.pack(side="right", padx=6)
        
        self.restart_btn = tk.Button(
            btns, text="🔄 Ulang", font=("Segoe UI", 8, "bold"),
            fg="#ffffff", bg="#1f1416", activebackground="#ef4444", activeforeground="#ffffff",
            bd=0, padx=6, pady=2, cursor="hand2", command=self.restart
        )
        self.restart_btn.pack(side="left", padx=3)
        
        self.close_btn = tk.Button(
            btns, text="✕ Tutup", font=("Segoe UI", 8, "bold"),
            fg="#ffffff", bg="#dc2626", activebackground="#b91c1c", activeforeground="#ffffff",
            bd=0, padx=6, pady=2, cursor="hand2", command=self.close
        )
        self.close_btn.pack(side="left", padx=3)
        
        self.current_box = None
        self.seq_index = 0
        self.is_running = True
        
        # Mulai Sesi Musik & Kotak Error Melayang
        self.start_session()
        
    def start_session(self):
        self.is_running = True
        self.seq_index = 0
        if self.current_box:
            self.current_box.destroy()
            self.current_box = None
            
        # Putar Audio Asli The Cure
        self.audio.play()
        
        # Mulai Kotak Error Pertama
        self.spawn_next_error_box()

    def spawn_next_error_box(self):
        if not self.is_running or not self.root.winfo_exists():
            return
            
        if self.seq_index >= len(LYRICS_DATA):
            print("[*] 💜 Selesai! Semua lirik telah ditampilkan.")
            self.status_lbl.config(text="Selesai! Klik 'Ulang' untuk memutar lagi ✨")
            return
            
        data = LYRICS_DATA[self.seq_index]
        self.seq_index += 1
        
        # Buat Kotak Error Baru
        self.current_box = SquareErrorBox(
            self.root,
            data,
            on_finished_callback=self.spawn_next_error_box
        )

    def restart(self):
        self.start_session()

    def close(self):
        self.is_running = False
        self.audio.stop()
        if self.current_box:
            self.current_box.destroy()
        self.root.destroy()
        sys.exit(0)


def main():
    print("\n=================================================================")
    print("  ❌ OLIVIA RODRIGO — THE CURE (SQUARE ERROR TABS)")
    print("  Format: Kotak (1:1) • Lirik Muncul Per Kata • Arah Bebas")
    print("  Warna: Hitam 🖤 • Putih 🤍 • Merah ❤️ Sesuai Beat Musik")
    print("=================================================================")
    print("  [▶] Memutar audio asli 'The Cure' di latar belakang...")
    print("  [⚠️] Tab kotak error muncul di koordinat bebas di layar laptop.")
    print("  [⚡] Lirik muncul per kata dengan kedip beat.")
    print("  [✨] Kotak hilang saat lirik habis dan muncul kotak baru!")
    print("  [✕] Klik '✕ Tutup' di panel pojok untuk keluar.\n")
    
    root = tk.Tk()
    app = MasterErrorLyricsApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
