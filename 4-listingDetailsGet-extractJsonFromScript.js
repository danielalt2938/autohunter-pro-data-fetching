const fs = require("fs");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({
    headless: true, // Set false for debugging
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-blink-features=AutomationControlled",
    ],
  });

  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();

  // Set realistic viewport & user agent
  await page.setViewport({ width: 1366, height: 768 });
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
  );

  // Optional: set realistic headers
  await page.setExtraHTTPHeaders({
    "Accept-Language": "en-US,en;q=0.9",
  });

  // Optional: mimic human delay (not required but helps)
  await page.waitForTimeout(2000);

  // Go to the Facebook Marketplace listing
  const url =
    "https://www.facebook.com/marketplace/item/1306165770477763/?ref=category_feed&referral_code=undefined";
  await page.goto(url, { waitUntil: "networkidle2" });

  // Wait for body to load
  await page.waitForSelector("body", { timeout: 15000 });

  // Get HTML content
  const htmlContent = await page.content();
  fs.writeFileSync("facebook_listing.html", htmlContent, "utf8");
  console.log("✅ HTML content saved to facebook_listing.html");

  await context.close();
  await browser.close();
})();
