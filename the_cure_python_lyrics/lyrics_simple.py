"""
=============================================================================
  Song: The Cure - Olivia Rodrigo
  Simple / Threaded TikTok Trend Python Script
=============================================================================
"""

import sys
import time
from threading import Thread

def type_text(text, delay=0.07):
    for char in text:
        sys.stdout.write(char)
        sys.stdout.flush()
        time.sleep(delay)
    print()

def sing_line(line, line_delay, char_speed):
    time.sleep(line_delay)
    type_text(line, char_speed)

def main():
    print("\n--- Olivia Rodrigo: The Cure ---\n")
    
    # Format: (lyric_line, start_delay_in_seconds, typing_speed_per_char)
    lyrics = [
        ("And my head is full of poison", 0.0, 0.075),
        ("And my heart is full of doubt", 3.0, 0.080),
        ("I got toxins in my bloodstream", 6.0, 0.070),
        ("You tried hard to suck 'em out", 9.0, 0.075),
        ("And it feels like medication", 12.0, 0.080),
        ("And it's good for me, I'm sure", 15.0, 0.080),
        ("But it don't matter how your love feels anymore", 18.0, 0.060),
        ("It'll never be the cure", 22.0, 0.095),
        ("It'll never be the cure...", 25.0, 0.110),
    ]

    threads = []
    for line, delay, speed in lyrics:
        t = Thread(target=sing_line, args=(line, delay, speed))
        threads.append(t)
        t.start()

    for t in threads:
        t.join()

    print("\n💜 Done!")

if __name__ == "__main__":
    main()
