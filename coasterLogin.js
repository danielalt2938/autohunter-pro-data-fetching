// coasterLogin.js  (ES-module)
import puppeteer from "puppeteer";
import fs from "fs-extra";
import "dotenv/config";

const LOGIN_URL = "https://coaster.coasteramer.com/account/login/default.aspx";
const COOKIE_PATH = "./coasterCookies.json";

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  // 1️⃣  open login page
  await page.goto(LOGIN_URL, { waitUntil: "networkidle0" });

  // 2️⃣  fill in credentials
  // These generic selectors work on the current Coaster markup.
  // If Coaster changes IDs, use DevTools to update them.
  await page.type("input[type=text],input[name*=UserName]", "108267");
  await page.type("input[type=password],input[name*=Password]", "Coaster!123");

  // 3️⃣  click the first submit-type button and wait for navigation
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle0" }),
    page.click("input[type=submit],button[type=submit]"),
  ]);

  // 4️⃣  basic sanity check
  if (page.url().includes("/login")) {
    throw new Error("❌ Login failed – check selectors or credentials");
  }
  console.log("✅ Logged in – saving cookie jar");

  // 5️⃣  dump cookies
  const cookies = await page.cookies();
  await fs.writeJson(COOKIE_PATH, cookies, { spaces: 2 });

  await browser.close();
})();
