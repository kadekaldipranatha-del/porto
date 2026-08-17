"""
=============================================================================
  Song: The Cure
  Artist: Olivia Rodrigo
  Python Lyrics Typewriter Animation
  Trend: TikTok / Reels Coding Aesthetic
=============================================================================
"""

import sys
import time
import os

# Enable ANSI escape sequences on Windows Command Prompt / PowerShell
if os.name == 'nt':
    os.system('')

# ANSI Color & Style Codes (TrueColor RGB & 256 Colors)
RESET        = "\033[0m"
BOLD         = "\033[1m"
DIM          = "\033[2m"
ITALIC       = "\033[3m"

# Aesthetic Palette (Olivia Rodrigo Lilac / Rose / Sunset Glow)
PURPLE_LIGHT = "\033[38;2;216;180;254m"
PURPLE_MAIN  = "\033[38;2;168;85;247m"
ROSE_PINK    = "\033[38;2;244;114;182m"
CYAN_SOFT    = "\033[38;2;125;211;252m"
AMBER_WARM   = "\033[38;2;251;191;36m"
CORAL_RED    = "\033[38;2;248;113;113m"
NEON_LILAC   = "\033[38;2;192;132;252m"

BANNER = f"""{PURPLE_MAIN}{BOLD}
   ___  _ _       _          ____           _        _             
  / _ \\| (_)_   _(_) __ _   |  _ \\ ___   __| |_ __  (_) __ _  ___  
 | | | | | \\ \\ / / |/ _` |  | |_) / _ \\ / _` | '__| | |/ _` |/ _ \\ 
 | |_| | | |\\ V /| | (_| |  |  _ < (_) | (_| | |    | | (_| | (_) |
  \\___/|_|_| \\_/ |_|\\__,_|  |_| \\_\\___/ \\__,_|_|    |_|\\__, |\\___/ 
                                                        |___/       
{RESET}{ROSE_PINK}               ♫ The Cure — Olivia Rodrigo ♫{RESET}
{DIM}  =============================================================={RESET}
"""

def print_typewriter(text: str, char_delay: float = 0.075, color_code: str = RESET, prefix: str = "  ♪  "):
    """Prints text character by character with smooth typewriter effect."""
    sys.stdout.write(f"{DIM}{prefix}{RESET}{color_code}")
    sys.stdout.flush()
    
    for char in text:
        sys.stdout.write(char)
        sys.stdout.flush()
        time.sleep(char_delay)
        
    sys.stdout.write(RESET + "\n")
    sys.stdout.flush()

def main():
    # Clear screen for a clean aesthetic terminal
    os.system('cls' if os.name == 'nt' else 'clear')
    
    print(BANNER)
    time.sleep(1.0)
    
    print(f"{CYAN_SOFT}  [▶] Playing track... Turn up the volume & enjoy 🎧{RESET}\n")
    time.sleep(1.2)
    
    # Lyrics structure: (lyric_line, char_typing_delay, pause_after_line, color)
    lyrics = [
        ("And my head is full of poison", 0.075, 0.50, PURPLE_LIGHT),
        ("And my heart is full of doubt", 0.080, 0.60, ROSE_PINK),
        ("I got toxins in my bloodstream", 0.070, 0.45, NEON_LILAC),
        ("You tried hard to suck 'em out", 0.075, 0.80, AMBER_WARM),
        ("And it feels like medication", 0.080, 0.50, CYAN_SOFT),
        ("And it's good for me, I'm sure", 0.080, 0.75, ROSE_PINK),
        ("But it don't matter how your love feels anymore", 0.060, 0.60, CORAL_RED),
        ("It'll never be the cure", 0.095, 0.85, BOLD + PURPLE_LIGHT),
        ("It'll never be the cure...", 0.110, 1.50, BOLD + ROSE_PINK),
    ]
    
    # Run through the lyrics
    for line, char_speed, line_pause, color in lyrics:
        print_typewriter(line, char_delay=char_speed, color_code=color)
        time.sleep(line_pause)
        
    print()
    print(f"{DIM}  --------------------------------------------------------------{RESET}")
    print(f"{PURPLE_MAIN}{BOLD}  💜 Finished. Thanks for listening! {RESET}{DIM}(Code by Antigravity){RESET}\n")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n\n{CORAL_RED}  [■] Playback stopped by user.{RESET}\n")
