// fetchProduct.js  –  save the full HTML for one Coaster SKU
// -----------------------------------------------------------
// npm i dotenv axios tough-cookie axios-cookiejar-support fs-extra
// Ensure package.json has  "type": "module"
// -----------------------------------------------------------
import "dotenv/config";
import axios from "axios";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import fs from "fs-extra";
import path from "path";

// ⬇  env fallbacks
const ITEM_NO = process.argv[2] || process.env.ITEM_NO || "224464";
const COOKIE_PATH = process.env.COOKIE_PATH || "./coasterCookies.json";
const OUT_FILE = process.env.OUT_FILE || `./${ITEM_NO}.html`;

const PRODUCT_URL = `https://coaster.coasteramer.com/customers/products/product.aspx?itemNo=${ITEM_NO}`;

(async () => {
  // 1️⃣  Load auth cookies from JSON file
  const jar = new CookieJar();
  const saved = await fs.readJson(COOKIE_PATH);
  saved.forEach((c) =>
    jar.setCookieSync(
      `${c.name}=${c.value}; Domain=${c.domain}; Path=${c.path}`,
      `https://${c.domain}`
    )
  );

  // 2️⃣  Axios instance wired to that cookie jar
  const client = wrapper(axios.create({ jar, withCredentials: true }));

  // 3️⃣  Fetch page
  const { data: html } = await client.get(PRODUCT_URL);

  if (html.includes("Login Center")) {
    throw new Error(
      "💥  Session expired—run coasterLogin.js to refresh cookies."
    );
  }

  // 4️⃣  Save
  await fs.writeFile(OUT_FILE, html, "utf8");
  console.log(`✅  Saved HTML → ${path.resolve(OUT_FILE)}`);
})();
