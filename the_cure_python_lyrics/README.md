# 💜 Olivia Rodrigo — The Cure (Floating Desktop Lyrics Python)

Proyek animasi lirik lagu **Olivia Rodrigo — "The Cure"** dalam bahasa **Python** murni, di mana setiap bait lirik akan muncul sebagai **tab/kartu melayang (*floating cards/tabs*)** langsung di layar desktop laptop Anda!

---

## 📁 File Skrip Python

| File | Deskripsi |
| :--- | :--- |
| [**`floating_lyrics.py`**](file:///C:/Users/LENOVO/.gemini/antigravity/scratch/the_cure_python_lyrics/floating_lyrics.py) | **Skrip Utama**: Tab lirik melayang dengan efek fisika melayang halus (*floating drift*), border neon estetis (Lilac/Rose/Peach), efek ketik *typewriter*, transparansi *glassmorphism*, kontrol master di atas layar, dan bisa digeser (*draggable*) dengan mouse. |
| [**`floating_simple.py`**](file:///C:/Users/LENOVO/.gemini/antigravity/scratch/the_cure_python_lyrics/floating_simple.py) | **Versi Ringkas (45 Baris)**: Skrip minimalis berbasis `threading` & `tkinter` yang langsung memunculkan tab-tab lirik melayang di berbagai koordinat layar. |
| [**`the_cure.py`**](file:///C:/Users/LENOVO/.gemini/antigravity/scratch/the_cure_python_lyrics/the_cure.py) | Skrip versi terminal dengan warna TrueColor RGB dan ASCII banner. |
| [**`index.html`**](file:///C:/Users/LENOVO/.gemini/antigravity/scratch/the_cure_python_lyrics/index.html) | Web Simulator alternatif (jika ingin melihat preview di browser). |

---

## 🚀 Cara Menjalankan di Laptop

Tidak memerlukan `pip install` apa pun karena menggunakan modul bawaan Python (`tkinter`, `threading`, `time`)!

### 1. Jalankan Skrip Tab Melayang Utama
Buka PowerShell / Command Prompt / Terminal VS Code, lalu jalankan:

```powershell
python C:\Users\LENOVO\.gemini\antigravity\scratch\the_cure_python_lyrics\floating_lyrics.py
```

### 2. Jalankan Versi Sederhana
```powershell
python C:\Users\LENOVO\.gemini\antigravity\scratch\the_cure_python_lyrics\floating_simple.py
```

---

## ✨ Fitur Tab Melayang (`floating_lyrics.py`)

1. **Selalu Melayang di Atas Layar (*Always On Top*)**: Tab-tab lirik akan tetap melayang di atas aplikasi apa pun yang sedang Anda buka (VS Code, Spotify, Browser, Wallpaper, dll.).
2. **Efek Fisika Melayang (*Smooth Drift*)**: Setiap tab akan melayang pelan dan memantul halus di pinggir layar monitor Anda.
3. **Dapat Digeser (*Draggable*)**: Klik dan tahan mouse pada tab mana saja untuk memindahkannya ke posisi yang Anda sukai.
4. **Efek Ketik Karaoke (*Typewriter Animation*)**: Teks lirik diketik satu per satu sesuai irama lagu.
5. **Master Control Bar**: Widget kecil elegan di bagian atas layar untuk mengulang (*Restart*) atau menutup (*Exit*) semua tab sekaligus.
