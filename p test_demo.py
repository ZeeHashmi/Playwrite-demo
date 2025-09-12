from playwright.sync_api import sync_playwright

def test_playwright_demo():
    with sync_playwright() as p:
        # Launch browser
        browser = p.chromium.launch(headless=False)  # set True if you don’t want to see it
        page = browser.new_page()

        # Go to Playwright website
        page.goto("https://playwright.dev/")

        # Check the title contains "Playwright"
        assert "Playwright" in page.title()

        # Click the "Get Started" link
        page.click("text=Get started")

        # Take a screenshot
        page.screenshot(path="demo_screenshot_python.png")

        browser.close()

if __name__ == "__main__":
    test_playwright_demo()
browser = p.chromium.launch(headless=False)
context = browser.new_context(record_video_dir="videos/")
page = context.new_page()