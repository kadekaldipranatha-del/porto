import urllib.request
import json
import re
import os

url = "https://www.tiktok.com/@ianmonie/video/7643343105600572693"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Referer": "https://www.tiktok.com/"
}

try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        
    print("Page fetched, size:", len(html))
    
    # Try finding SIGI_STATE or __UNIVERSAL_DATA_FOR_REHYDRATION__
    json_data_match = re.search(r'<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" [^>]*>(.*?)</script>', html)
    if not json_data_match:
        json_data_match = re.search(r'<script id="SIGI_STATE" [^>]*>(.*?)</script>', html)
        
    if json_data_match:
        raw_json = json_data_match.group(1)
        data = json.loads(raw_json)
        # Traverse dictionary to find audio url
        def find_keys(d, target):
            if isinstance(d, dict):
                for k, v in d.items():
                    if k == target and isinstance(v, str) and v.startswith("http"):
                        return v
                    res = find_keys(v, target)
                    if res: return res
            elif isinstance(d, list):
                for item in d:
                    res = find_keys(item, target)
                    if res: return res
            return None
            
        music_url = find_keys(data, "playUrl") or find_keys(data, "playAddr") or find_keys(data, "musicUrl")
        print("Found music/video URL:", music_url)
        if music_url:
            req_audio = urllib.request.Request(music_url, headers=headers)
            with urllib.request.urlopen(req_audio, timeout=15) as a_resp:
                content = a_resp.read()
                with open("the_cure_audio.mp3", "wb") as f:
                    f.write(content)
            print("Successfully saved the_cure_audio.mp3, size:", len(content))
    else:
        print("Universal data script tag not found")
except Exception as e:
    print("Error during extract:", e)
