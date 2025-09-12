import pytest
from playwright.sync_api import Page

def test_playwright_demo(page: Page):
    # Go to Playwright website
    page.goto("https://playwright.dev/")

    # Check that title contains "Playwright"
    assert "Playwright" in page.title()

    # Click the "Get Started" link
    page.click("text=Get started")

    # Take a screenshot
    page.screenshot(path="demo_screenshot_pytest.png")
