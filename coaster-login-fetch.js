import axios from "axios";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import * as cheerio from "cheerio";
import "dotenv/config";

const LOGIN_URL = "https://coaster.coasteramer.com/account/login/default.aspx";
const PRODUCT_URL =
  "https://coaster.coasteramer.com/customers/products/product.aspx?itemNo=224464";

(async () => {
  // 1) Prepare axios with a persistent cookie jar
  const jar = new CookieJar();
  const client = wrapper(axios.create({ jar, withCredentials: true }));

  // 2) GET the login page to pick up initial cookies + hidden fields
  const loginPage = await client.get(LOGIN_URL);
  const $ = cheerio.load(loginPage.data);
  const viewState = $("#__VIEWSTATE").val();
  const eventVal = $("#__EVENTVALIDATION").val();
  const gen = $("#__VIEWSTATEGENERATOR").val();

  // 3) POST the credentials + hidden tokens
  const payload = new URLSearchParams({
    __VIEWSTATE: viewState,
    __VIEWSTATEGENERATOR: gen,
    __EVENTVALIDATION: eventVal,
    ctl00$MainContent$txtUserName: "108267",
    ctl00$MainContent$txtPassword: "Coaster!123",
    ctl00$MainContent$btnLogin: "Sign in",
  });

  await client.post(LOGIN_URL, payload, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  // 4) Now hit any product page with the authenticated cookies
  const product = await client.get(PRODUCT_URL);
  console.log(product.data.substring(0, 500)); // first 500 chars
})();
