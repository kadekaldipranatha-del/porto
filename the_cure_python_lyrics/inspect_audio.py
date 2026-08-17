import os
import ctypes

winmm = ctypes.windll.winmm
path = os.path.abspath("thecure.mp3")
winmm.mciSendStringW(f'open "{path}" type mpegvideo alias chk', None, 0, None)
buf = ctypes.create_unicode_buffer(128)
winmm.mciSendStringW('status chk length', buf, 128, None)
winmm.mciSendStringW('close chk', None, 0, None)
duration_ms = int(buf.value) if buf.value else 0
print(f"thecure.mp3 duration: {duration_ms} ms ({duration_ms/1000.0:.2f} s)")
