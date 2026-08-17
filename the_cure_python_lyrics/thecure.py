import tkinter as tk
import time
import random
import ctypes
import os
import sys

class WindowsAudio:
    def __init__(self):
        self.winmm = ctypes.windll.winmm
        self.alias = "thecure_bgm"
        self.audio_path = None
        for f in ["thecure.mp3", "the_cure.mp3", "song.mp3"]:
            p = os.path.abspath(os.path.join(os.path.dirname(__file__), f))
            if os.path.exists(p):
                self.audio_path = p
                break

    def preload_and_play(self):
        if not self.audio_path: return
        try:
            self.stop()
            cmd_open = f'open "{self.audio_path}" type mpegvideo alias {self.alias}'
            self.winmm.mciSendStringW(cmd_open, None, 0, None)
            self.winmm.mciSendStringW(f"play {self.alias}", None, 0, None)
        except Exception:
            pass

    def stop(self):
        try:
            self.winmm.mciSendStringW(f"stop {self.alias}", None, 0, None)
            self.winmm.mciSendStringW(f"close {self.alias}", None, 0, None)
        except Exception:
            pass

LYRICS_DATA = [
    {
        "start": 0.00, "mode": "bottom_to_top", "lane": "left", "life": 4.20,
        "words": [("OH,", 0.10), ("BECAUSE", 0.60), ("MY", 1.10), ("HEAD", 1.50), ("IS", 1.90), ("FULL", 2.25), ("OF", 2.60), ("POISON", 2.95)]
    },
    {
        "start": 4.10, "mode": "top_to_bottom", "lane": "right", "life": 4.00,
        "words": [("AND", 0.00), ("MY", 0.40), ("HEART", 0.80), ("IS", 1.25), ("FULL", 1.65), ("OF", 2.00), ("DOUBT", 2.35)]
    },
    {
        "start": 7.30, "mode": "center_static", "lane": "center", "life": 3.10,
        "words": [("I", 0.00), ("GOT", 0.35), ("TOXINS", 0.75), ("IN", 1.30), ("MY", 1.65), ("BLOODSTREAM", 2.00)]
    },
    {
        "start": 10.40, "mode": "top_to_bottom", "lane": "left", "life": 4.00,
        "words": [("YOU", 0.00), ("TRIED", 0.35), ("SO", 0.70), ("HARD", 1.10), ("TO", 1.55), ("SUCK", 1.95), ("'EM", 2.35), ("OUT", 2.65)]
    },
    {
        "start": 13.90, "mode": "bottom_to_top", "lane": "right", "life": 4.00,
        "words": [("AND", 0.00), ("IT", 0.35), ("FEELS", 0.75), ("LIKE", 1.35), ("MEDICATION", 1.80)]
    },
    {
        "start": 17.30, "mode": "center_static", "lane": "center", "life": 3.20,
        "words": [("AND", 0.00), ("IT'S", 0.35), ("GOOD", 0.75), ("FOR", 1.25), ("ME,", 1.65), ("IM", 2.05), ("SURE", 2.45)]
    },
    {
        "start": 20.60, "mode": "bottom_to_top", "lane": "left", "life": 5.40,
        "words": [("BUT", 0.00), ("IT", 0.30), ("DON'T", 0.65), ("MATTER", 1.05), ("HOW", 1.55), ("YOUR", 2.00), ("LOVE", 2.45), ("FEELS", 2.90), ("ANYMORE", 3.40)]
    },
    {
        "start": 25.80, "mode": "fullscreen_climax", "lane": "fullscreen", "life": 5.50,
        "words": [("IT'LL", 0.00), ("NEVER", 0.45), ("BE", 0.95), ("THE", 1.40), ("CURE", 1.85)]
    }
]

BEAT_THEMES = [
    {"bg": "#faf6e9", "fg": "#0a0a0a"},
    {"bg": "#000000", "fg": "#ffffff"},
    {"bg": "#ffffff", "fg": "#000000"},
    {"bg": "#121214", "fg": "#f4f4f5"},
    {"bg": "#f5f0db", "fg": "#18181b"}
]

BLINK_INTERVAL = 0.200

class WordByWordSquareWindow(tk.Toplevel):
    def __init__(self, parent, data):
        super().__init__(parent)
        self.data = data
        self.words = data["words"]
        self.total_life = data["life"]
        self.mode = data["mode"]
        self.lane = data.get("lane", "center")
        
        self.screen_w = self.winfo_screenwidth()
        self.screen_h = self.winfo_screenheight()
        self.size = 340
        
        if self.lane == "left":
            self.cur_x = float(max(40, int(self.screen_w * 0.08)))
        elif self.lane == "right":
            self.cur_x = float(self.screen_w - self.size - max(40, int(self.screen_w * 0.08)))
        else:
            self.cur_x = float((self.screen_w - self.size) // 2)
            
        center_y = (self.screen_h - self.size) // 2
        
        if self.mode == "center_static":
            self.cur_y = float(center_y)
            self.speed_y = 0.0
        elif self.mode == "bottom_to_top":
            self.cur_y = float(self.screen_h + 10)
            total_dist = float(self.screen_h + self.size + 80)
            self.speed_y = total_dist / max(1, int(self.total_life * 60))
        else:
            self.cur_y = float(-self.size - 10)
            total_dist = float(self.screen_h + self.size + 80)
            self.speed_y = total_dist / max(1, int(self.total_life * 60))

        self.overrideredirect(True)
        self.wm_attributes("-topmost", True)
        self.wm_attributes("-alpha", 0.98)
        self.geometry(f"{self.size}x{self.size}+{int(self.cur_x)}+{int(self.cur_y)}")
        
        t0 = BEAT_THEMES[0]
        self.config(bg=t0["bg"])
        
        self.card_frame = tk.Frame(self, bg=t0["bg"], bd=0, highlightthickness=0, padx=26, pady=26)
        self.card_frame.pack(fill="both", expand=True)
        
        self.lyric_label = tk.Label(
            self.card_frame,
            text="",
            font=("Segoe UI", 16, "bold"),
            fg=t0["fg"],
            bg=t0["bg"],
            wraplength=285,
            justify="center",
            anchor="center",
            bd=0,
            highlightthickness=0
        )
        self.lyric_label.pack(fill="both", expand=True)
        
        self.is_dragging = False
        for w in (self, self.card_frame, self.lyric_label):
            w.bind("<Button-1>", self.on_drag_start)
            w.bind("<B1-Motion>", self.on_drag_motion)
            w.bind("<ButtonRelease-1>", self.on_drag_stop)
            
        self.current_word_list = []
        self.last_theme_idx = -1
        self.is_destroyed = False
        self.start_time = time.time()
        
        for word, offset_s in self.words:
            self.after(int(offset_s * 1000), lambda w=word: self.append_word(w))
            
        self.render_loop()
        self.after(int(self.total_life * 1000), self.safe_destroy)

    def on_drag_start(self, event):
        self.is_dragging = True
        self.drag_x = event.x_root - self.winfo_x()
        self.drag_y = event.y_root - self.winfo_y()

    def on_drag_motion(self, event):
        if self.is_dragging and not self.is_destroyed and self.winfo_exists():
            self.cur_x = event.x_root - self.drag_x
            self.cur_y = event.y_root - self.drag_y
            self.geometry(f"+{int(self.cur_x)}+{int(self.cur_y)}")

    def on_drag_stop(self, event):
        self.is_dragging = False

    def append_word(self, word):
        if self.is_destroyed or not self.winfo_exists(): return
        self.current_word_list.append(word)
        self.lyric_label.config(text=" ".join(self.current_word_list))

    def render_loop(self):
        if self.is_destroyed or not self.winfo_exists(): return
        
        elapsed = time.time() - self.start_time
        theme_idx = int(elapsed / BLINK_INTERVAL) % len(BEAT_THEMES)
        if theme_idx != self.last_theme_idx:
            self.last_theme_idx = theme_idx
            t = BEAT_THEMES[theme_idx]
            self.config(bg=t["bg"])
            self.card_frame.config(bg=t["bg"])
            self.lyric_label.config(bg=t["bg"], fg=t["fg"])
            
        if not self.is_dragging:
            if self.mode == "bottom_to_top":
                self.cur_y -= self.speed_y
                self.geometry(f"{self.size}x{self.size}+{int(self.cur_x)}+{int(self.cur_y)}")
            elif self.mode == "top_to_bottom":
                self.cur_y += self.speed_y
                self.geometry(f"{self.size}x{self.size}+{int(self.cur_x)}+{int(self.cur_y)}")
            else:
                center_y = (self.screen_h - self.size) // 2
                self.geometry(f"{self.size}x{self.size}+{int(self.cur_x)}+{int(center_y)}")
                
        self.after(16, self.render_loop)

    def safe_destroy(self):
        self.is_destroyed = True
        if self.winfo_exists(): self.destroy()

class FullscreenClimaxWindow(tk.Toplevel):
    def __init__(self, parent, data):
        super().__init__(parent)
        self.words = data["words"]
        self.total_life = data["life"]
        
        self.screen_w = self.winfo_screenwidth()
        self.screen_h = self.winfo_screenheight()
        
        self.overrideredirect(True)
        self.wm_attributes("-topmost", True)
        self.geometry(f"{self.screen_w}x{self.screen_h}+0+0")
        
        t0 = BEAT_THEMES[1]
        self.config(bg=t0["bg"])
        
        self.container = tk.Frame(self, bg=t0["bg"], bd=0, highlightthickness=0)
        self.container.pack(fill="both", expand=True)
        
        monumental_font_size = max(95, int(self.screen_w * 0.082))
        self.title_label = tk.Label(
            self.container,
            text="",
            font=("Segoe UI", monumental_font_size, "bold"),
            fg=t0["fg"],
            bg=t0["bg"],
            wraplength=int(self.screen_w * 0.96),
            justify="center",
            anchor="center"
        )
        self.title_label.place(relx=0.5, rely=0.5, anchor="center")
        
        self.current_word_list = []
        self.last_theme_idx = -1
        self.is_destroyed = False
        self.start_time = time.time()
        
        for word, offset_s in self.words:
            self.after(int(offset_s * 1000), lambda w=word: self.append_word(w))
            
        self.render_loop()
        self.after(int(self.total_life * 1000), self.safe_destroy)

    def append_word(self, word):
        if self.is_destroyed or not self.winfo_exists(): return
        self.current_word_list.append(word)
        self.title_label.config(text=" ".join(self.current_word_list))

    def render_loop(self):
        if self.is_destroyed or not self.winfo_exists(): return
        elapsed = time.time() - self.start_time
        theme_idx = int(elapsed / BLINK_INTERVAL) % len(BEAT_THEMES)
        if theme_idx != self.last_theme_idx:
            self.last_theme_idx = theme_idx
            t = BEAT_THEMES[theme_idx]
            self.config(bg=t["bg"])
            self.container.config(bg=t["bg"])
            self.title_label.config(bg=t["bg"], fg=t["fg"])
        self.after(16, self.render_loop)

    def safe_destroy(self):
        self.is_destroyed = True
        if self.winfo_exists(): self.destroy()

class MasterController:
    def __init__(self, root):
        self.root = root
        self.root.withdraw()
        
        self.audio = WindowsAudio()
        self.active_windows = []
        self.fullscreen_window = None
        
        self.root.bind_all("<Escape>", lambda e: self.close())
        self.start_session()
        
    def start_session(self):
        self.clear_windows()
        self.audio.preload_and_play()
        
        for item in LYRICS_DATA:
            delay_ms = int(item["start"] * 1000)
            if item["mode"] == "fullscreen_climax":
                self.root.after(delay_ms, lambda d=item: self.trigger_fullscreen_climax(d))
            else:
                self.root.after(delay_ms, lambda d=item: self.active_windows.append(WordByWordSquareWindow(self.root, d)))

        self.root.after(31500, self.close)

    def trigger_fullscreen_climax(self, data):
        self.clear_windows()
        if self.root.winfo_exists():
            self.fullscreen_window = FullscreenClimaxWindow(self.root, data)

    def clear_windows(self):
        for w in list(self.active_windows): w.safe_destroy()
        self.active_windows.clear()
        if self.fullscreen_window:
            self.fullscreen_window.safe_destroy()
            self.fullscreen_window = None

    def close(self):
        self.audio.stop()
        self.clear_windows()
        self.root.destroy()
        sys.exit(0)

def main():
    print("memulai")
    root = tk.Tk()
    app = MasterController(root)
    root.mainloop()

if __name__ == "__main__":
    main()
