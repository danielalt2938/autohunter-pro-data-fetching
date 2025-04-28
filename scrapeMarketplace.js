const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const url =
    "https://www.facebook.com/marketplace/item/972971497925330/?ref=search&referral_code=null&referral_story_type=post";

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36"
  );

  await page.goto(url, {
    waitUntil: "networkidle2",
    timeout: 60000,
  });

  // Fallback: use setTimeout to simulate wait
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const html = await page.content();
  fs.writeFileSync("fb_marketplace_item.html", html);

  console.log("✅ HTML saved to fb_marketplace_item.html");

  await browser.close();
})();
