import ctypes
import os
import time

winmm = ctypes.windll.winmm
path = os.path.abspath("thecure.mp3")
winmm.mciSendStringW("close test_bgm", None, 0, None)
winmm.mciSendStringW(f'open "{path}" type mpegvideo alias test_bgm', None, 0, None)
winmm.mciSendStringW("play test_bgm", None, 0, None)

print("Started test_bgm. Monitoring positions...")
buf = ctypes.create_unicode_buffer(128)
start_t = time.time()
while time.time() - start_t < 10:
    winmm.mciSendStringW("status test_bgm position", buf, 128, None)
    pos_ms = int(buf.value) if buf.value else 0
    elapsed_real = int((time.time() - start_t) * 1000)
    print(f"Real: {elapsed_real}ms | MCI Position: {pos_ms}ms")
    time.sleep(1.0)

winmm.mciSendStringW("stop test_bgm", None, 0, None)
winmm.mciSendStringW("close test_bgm", None, 0, None)
