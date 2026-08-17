import ctypes
import os
import time

winmm = ctypes.windll.winmm
path = os.path.abspath("thecure.mp3")
winmm.mciSendStringW("close tst", None, 0, None)
winmm.mciSendStringW(f'open "{path}" type mpegvideo alias tst', None, 0, None)
winmm.mciSendStringW("play tst from 18000", None, 0, None)

print("Playing from 18.0s...")
buf = ctypes.create_unicode_buffer(128)
start = time.time()
while time.time() - start < 13:
    winmm.mciSendStringW("status tst position", buf, 128, None)
    pos_ms = int(buf.value) if buf.value else 0
    print(f"Current Audio Time: {pos_ms/1000.0:.2f}s")
    time.sleep(0.5)

winmm.mciSendStringW("stop tst", None, 0, None)
winmm.mciSendStringW("close tst", None, 0, None)
