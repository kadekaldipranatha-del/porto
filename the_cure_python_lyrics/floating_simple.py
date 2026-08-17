import tkinter as tk
import time
import random
import ctypes
import os
import sys
from threading import Thread

def play_audio():
    for f in ["thecure.mp3", "the_cure.mp3", "song.mp3"]:
        p = os.path.abspath(os.path.join(os.path.dirname(__file__), f))
        if os.path.exists(p):
            winmm = ctypes.windll.winmm
            winmm.mciSendStringW("close bgm", None, 0, None)
            winmm.mciSendStringW(f'open "{p}" type mpegvideo alias bgm', None, 0, None)
            winmm.mciSendStringW("play bgm", None, 0, None)
            break

LYRICS_DATA = [
    {"start": 0.00, "mode": "bottom_to_top", "lane": "left", "life": 4.20,
     "words": [("OH,", 0.10), ("BECAUSE", 0.60), ("MY", 1.10), ("HEAD", 1.50), ("IS", 1.90), ("FULL", 2.25), ("OF", 2.60), ("POISON", 2.95)]},
    {"start": 4.10, "mode": "top_to_bottom", "lane": "right", "life": 4.00,
     "words": [("AND", 0.00), ("MY", 0.40), ("HEART", 0.80), ("IS", 1.25), ("FULL", 1.65), ("OF", 2.00), ("DOUBT", 2.35)]},
    {"start": 7.30, "mode": "center_static", "lane": "center", "life": 3.10,
     "words": [("I", 0.00), ("GOT", 0.35), ("TOXINS", 0.75), ("IN", 1.30), ("MY", 1.65), ("BLOODSTREAM", 2.00)]},
    {"start": 10.40, "mode": "top_to_bottom", "lane": "left", "life": 4.00,
     "words": [("YOU", 0.00), ("TRIED", 0.35), ("SO", 0.70), ("HARD", 1.10), ("TO", 1.55), ("SUCK", 1.95), ("'EM", 2.35), ("OUT", 2.65)]},
    {"start": 13.90, "mode": "bottom_to_top", "lane": "right", "life": 4.00,
     "words": [("AND", 0.00), ("IT", 0.35), ("FEELS", 0.75), ("LIKE", 1.35), ("MEDICATION", 1.80)]},
    {"start": 17.30, "mode": "center_static", "lane": "center", "life": 3.20,
     "words": [("AND", 0.00), ("IT'S", 0.35), ("GOOD", 0.75), ("FOR", 1.25), ("ME,", 1.65), ("IM", 2.05), ("SURE", 2.45)]},
    {"start": 20.60, "mode": "bottom_to_top", "lane": "left", "life": 5.40,
     "words": [("BUT", 0.00), ("IT", 0.30), ("DON'T", 0.65), ("MATTER", 1.05), ("HOW", 1.55), ("YOUR", 2.00), ("LOVE", 2.45), ("FEELS", 2.90), ("ANYMORE", 3.40)]},
    {"start": 25.80, "mode": "fullscreen_climax", "lane": "fullscreen", "life": 5.50,
     "words": [("IT'LL", 0.00), ("NEVER", 0.45), ("BE", 0.95), ("THE", 1.40), ("CURE", 1.85)]}
]

THEMES = [
    {"bg": "#faf6e9", "fg": "#0a0a0a"},
    {"bg": "#000000", "fg": "#ffffff"},
    {"bg": "#ffffff", "fg": "#000000"},
    {"bg": "#121214", "fg": "#f4f4f5"},
    {"bg": "#f5f0db", "fg": "#18181b"}
]

BLINK_INTERVAL = 0.200

class SquareCard(tk.Toplevel):
    def __init__(self, parent, data):
        super().__init__(parent)
        sw = self.winfo_screenwidth()
        sh = self.winfo_screenheight()
        self.size = 340
        self.mode = data["mode"]
        self.lane = data.get("lane", "center")
        self.speed_y = float(sh + self.size + 80) / max(1, int(data["life"] * 60)) if self.mode != "center_static" else 0.0
        
        if self.lane == "left": self.x = float(max(40, int(sw * 0.08)))
        elif self.lane == "right": self.x = float(sw - self.size - max(40, int(sw * 0.08)))
        else: self.x = float((sw - self.size) // 2)

        center_y = (sh - self.size) // 2
        self.y = float(center_y) if self.mode == "center_static" else (float(sh + 10) if self.mode == "bottom_to_top" else float(-self.size - 10))

        self.overrideredirect(True)
        self.wm_attributes("-topmost", True)
        self.wm_attributes("-alpha", 0.98)
        self.geometry(f"{self.size}x{self.size}+{int(self.x)}+{int(self.y)}")

        t0 = THEMES[0]
        self.config(bg=t0["bg"])
        self.frame = tk.Frame(self, bg=t0["bg"], bd=0, highlightthickness=0, padx=26, pady=26)
        self.frame.pack(fill="both", expand=True)

        self.lbl = tk.Label(self.frame, text="", font=("Segoe UI", 16, "bold"), fg=t0["fg"], bg=t0["bg"], wraplength=285, justify="center", bd=0, highlightthickness=0)
        self.lbl.pack(fill="both", expand=True)

        self.cur_words = []
        self.last_theme_idx = -1
        self.start_t = time.time()
        for w, off in data["words"]:
            self.after(int(off * 1000), lambda word=w: self.add_w(word))

        self.render()
        self.after(int(data["life"] * 1000), lambda: self.destroy() if self.winfo_exists() else None)

    def add_w(self, word):
        if self.winfo_exists():
            self.cur_words.append(word)
            self.lbl.config(text=" ".join(self.cur_words))

    def render(self):
        if not self.winfo_exists(): return
        elapsed = time.time() - self.start_t
        t_idx = int(elapsed / BLINK_INTERVAL) % len(THEMES)
        if t_idx != self.last_theme_idx:
            self.last_theme_idx = t_idx
            t = THEMES[t_idx]
            self.config(bg=t["bg"])
            self.frame.config(bg=t["bg"])
            self.lbl.config(bg=t["bg"], fg=t["fg"])

        if self.mode == "bottom_to_top":
            self.y -= self.speed_y
            self.geometry(f"{self.size}x{self.size}+{int(self.x)}+{int(self.y)}")
        elif self.mode == "top_to_bottom":
            self.y += self.speed_y
            self.geometry(f"{self.size}x{self.size}+{int(self.x)}+{int(self.y)}")
        else:
            center_y = (self.winfo_screenheight() - self.size) // 2
            self.geometry(f"{self.size}x{self.size}+{int(self.x)}+{int(center_y)}")

        self.after(16, self.render)

class FullscreenDrop(tk.Toplevel):
    def __init__(self, parent, data):
        super().__init__(parent)
        sw = self.winfo_screenwidth()
        sh = self.winfo_screenheight()

        self.overrideredirect(True)
        self.wm_attributes("-topmost", True)
        self.geometry(f"{sw}x{sh}+0+0")

        self.config(bg="#000000")
        monumental_font_size = max(95, int(sw * 0.082))
        self.lbl = tk.Label(self, text="", font=("Segoe UI", monumental_font_size, "bold"), fg="#ffffff", bg="#000000", wraplength=int(sw * 0.96), justify="center")
        self.lbl.place(relx=0.5, rely=0.5, anchor="center")

        self.cur_words = []
        self.last_theme_idx = -1
        self.start_t = time.time()
        for w, off in data["words"]:
            self.after(int(off * 1000), lambda word=w: self.add_w(word))

        self.render()
        self.after(int(data["life"] * 1000), lambda: self.destroy() if self.winfo_exists() else None)

    def add_w(self, word):
        if self.winfo_exists():
            self.cur_words.append(word)
            self.lbl.config(text=" ".join(self.cur_words))

    def render(self):
        if not self.winfo_exists(): return
        elapsed = time.time() - self.start_t
        t_idx = int(elapsed / BLINK_INTERVAL) % len(THEMES)
        if t_idx != self.last_theme_idx:
            self.last_theme_idx = t_idx
            t = THEMES[t_idx]
            self.config(bg=t["bg"])
            self.lbl.config(bg=t["bg"], fg=t["fg"])
        self.after(16, self.render)

def main():
    print("memulai")
    root = tk.Tk()
    root.withdraw()
    cards = []
    Thread(target=play_audio, daemon=True).start()

    for item in LYRICS_DATA:
        if item["mode"] == "fullscreen_climax":
            def trigger_fs(d=item):
                for c in list(cards):
                    try: c.destroy()
                    except: pass
                cards.clear()
                FullscreenDrop(root, d)
            root.after(int(item["start"] * 1000), trigger_fs)
        else:
            root.after(int(item["start"] * 1000), lambda d=item: cards.append(SquareCard(root, d)))

    root.after(31500, root.quit)
    root.mainloop()

if __name__ == "__main__":
    main()
