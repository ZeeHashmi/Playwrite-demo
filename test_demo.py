# test.py
# Play a song on YouTube using Playwright (sync API).
# Usage: python test.py "artist - song name"  (quotes optional if multiple words)

import sys
import time
import urllib.parse
from playwright.sync_api import sync_playwright

DEFAULT_SONG = "I just want say that"
PLAY_SECONDS = 30  # how long to keep playing

def main(song: str):
    query = urllib.parse.quote_plus(song)
    search_url = f"https://www.youtube.com/results?search_query=I just want say that they dont really care about"

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)      # headless=False so you can see UI & allow autoplay
        context = browser.new_context()
        page = context.new_page()

        # Go directly to search results (more reliable than clicking site UI)
        page.goto(search_url, wait_until="networkidle")

        # Wait for results to appear (give YouTube time to load)
        try:
            page.wait_for_selector("ytd-video-renderer, ytd-grid-video-renderer", timeout=15000)
        except Exception:
            print("No video results found or page took too long to load.")
            browser.close()
            return

        # Click the first video title (user gesture to allow autoplay)
        try:
            # Try click on the common video title selector
            page.locator("ytd-video-renderer a#video-title").first.click(timeout=10000)
        except Exception:
            try:
                # fallback to thumbnail click
                page.locator("ytd-video-renderer ytd-thumbnail a").first.click(timeout=10000)
            except Exception as e:
                print("Failed to click first video result:", e)
                browser.close()
                return

        # Wait for the video element to be present
        try:
            page.wait_for_selector("video", timeout=15000)
        except Exception:
            print("Video element not found after navigation.")
            browser.close()
            return

        # Try to unmute and set volume via JS (some browsers mute autoplayed videos)
        try:
            page.evaluate("""() => {
                const v = document.querySelector('video');
                if (v) {
                    try { v.muted = false; v.volume = 1.0; } catch(e) {}
                }
            }""")
        except Exception:
            pass

        print(f"Playing '{song}' for {PLAY_SECONDS} seconds...")
        time.sleep(PLAY_SECONDS)

        browser.close()

if __name__ == "__main__":
    song = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else DEFAULT_SONG
    main(song)
