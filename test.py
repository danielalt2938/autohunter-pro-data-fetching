import os
import time
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from playwright.sync_api import sync_playwright

# Load credentials from .env file
load_dotenv()
FB_EMAIL = os.getenv("FB_EMAIL")
FB_PASS = os.getenv("FB_PASS")

CITY_MAP = {
    'New York': 'nyc',
    'Los Angeles': 'la',
    'Las Vegas': 'vegas',
    'Chicago': 'chicago',
    'Houston': 'houston',
    'Dallas': 'dallas',
    'Austin': 'austin',
    'Arlington': 'arlington',
    'San Antonio': 'sanantonio',
}

def scrape_facebook_marketplace(city, query="sofa", max_price=1000):
    if not FB_EMAIL or not FB_PASS:
        print("❌ FB_EMAIL and FB_PASS must be set in the .env file.")
        return

    if city not in CITY_MAP:
        print(f"❌ City '{city}' not supported. Please add it to the CITY_MAP.")
        return

    city_code = CITY_MAP[city]
    search_url = f"https://www.facebook.com/marketplace/{city_code}/search/?query={query}&maxPrice={max_price}"
    login_url = "https://www.facebook.com/login/device-based/regular/login/"

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()

        # Login to Facebook
        page.goto(login_url)
        time.sleep(2)

        try:
            page.fill('input[name="email"]', FB_EMAIL)
            page.fill('input[name="pass"]', FB_PASS)
            page.click('button[name="login"]')
            time.sleep(4)
        except Exception as e:
            print("⚠️ Login may have failed. Skipping to marketplace...")
        
        page.goto(search_url)
        time.sleep(5)

        # Scroll to load more results (can be increased)
        for _ in range(3):
            page.keyboard.press('End')
            time.sleep(2)

        html = page.content()
        soup = BeautifulSoup(html, 'html.parser')
        browser.close()

        listings = soup.find_all('div', class_='x9f619 x78zum5 x1r8uery xdt5ytf x1iyjqo2 xs83m0k x1e558r4 x150jy0e x1iorvi4 xjkvuk6 xnpuxes x291uyu x1uepa24')
        
        if not listings:
            print("⚠️ No listings found. Facebook may be blocking scraping attempts or structure has changed.")
        
        print(f"\n📦 Found {len(listings)} listings in {city} for '{query}' under ${max_price}:\n")

        for idx, listing in enumerate(listings):
            try:
                title = listing.find('span', class_='x1lliihq x6ikm8r x10wlt62 x1n2onr6').text
                price = listing.find('span', class_='x193iq5w').text
                image = listing.find('img')['src']
                post_url = "https://facebook.com" + listing.find('a', href=True)['href']
                location = listing.find('span', class_='x1lliihq x6ikm8r x10wlt62 x1n2onr6 xlyipyv xuxw1ft x1j85h84').text

                print(f"🟢 Listing {idx + 1}")
                print(f"🛋️ Title: {title}")
                print(f"💵 Price: {price}")
                print(f"📍 Location: {location}")
                print(f"🖼️ Image: {image}")
                print(f"🔗 Link: {post_url}")
                print("-" * 50)
            except Exception as e:
                print(f"⚠️ Skipping a listing due to error: {e}")

if __name__ == "__main__":
    city_input = input("Enter city (e.g., Dallas, Houston): ").strip()
    keyword = input("Enter search term (default 'sofa'): ").strip() or "sofa"
    max_price = input("Enter max price (default 1000): ").strip()
    max_price = int(max_price) if max_price.isdigit() else 1000
    scrape_facebook_marketplace(city_input, keyword, max_price)
