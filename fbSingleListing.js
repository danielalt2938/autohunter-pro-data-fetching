const axios = require("axios");
const fs = require("fs");

const url = "https://www.facebook.com/ajax/bulk-route-definitions/";

const headers = {
  accept: "*/*",
  "accept-language": "en-US,en;q=0.9",
  "content-type": "application/x-www-form-urlencoded",
  priority: "u=1, i",
  "sec-ch-prefers-color-scheme": "dark",
  "sec-ch-ua":
    '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
  "sec-ch-ua-full-version-list":
    '"Google Chrome";v="135.0.7049.85", "Not-A.Brand";v="8.0.0.0", "Chromium";v="135.0.7049.85"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-model": '""',
  "sec-ch-ua-platform": '"macOS"',
  "sec-ch-ua-platform-version": '"13.5.0"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "x-asbd-id": "359341",
  "x-fb-lsd": "AVpr-4I4vEE",
  cookie:
    "datr=ySkDaEGBfc7ImEzuU0mtcp0L; sb=ySkDaITuaYZeVJMHhInd4Fx6; ps_l=1; ps_n=1; wd=1680x331",
  Referer:
    "https://www.facebook.com/marketplace/item/972971497925330/?ref=search&referral_code=null&referral_story_type=post",
  "Referrer-Policy": "origin-when-cross-origin",
};

const body =
  "route_urls[0]=%2Fmarketplace%2Fitem%2F972971497925330%2F%3Fref%3Dsearch%26referral_code%3Dnull%26referral_story_type%3Dpost&routing_namespace=fb_comet&__aaid=0&__user=0&__a=1&__req=2&__hs=20197.HYP%3Acomet_loggedout_pkg.2.1...0&dpr=2&__ccg=EXCELLENT&__rev=1022052908&__s=q8hesf%3A44rpzj%3A9nftkz&__hsi=7494959162731110258&__dyn=7xe6E5q5U5ObwKBBwno6u5U4e0C8dEc8co38w4BwUx609vCwjE1EE2Cw8G1Dw5Zx62G3i0Bo2ygao1aU2swlo6qU2exi4UaEW1GwkEbo4y5o2exu16w2oEGdw46wbS1LwTwNwLweq1Iwqo4q1-w8eEb8uwm85K0ke&__csr=gUyC99Ois_TraGrl9fWCBF5AKlaA4eXHJCJei9CzEiUkx-fK5UnAwgVVo8UvwEy8mwEyEhK5FUnAyocbDwyxW1FJwFwHCw0y8gDyFkEuhA01wlwjE1-o2Fw4xw16OU2jw0wxw0eDe030W9l02S8dEpxG0eCw6Gg1nE05-an9w4aw3E80jXz403jG2m08rw3V805f104lyK0fhwbe646E1bE&__comet_req=15&lsd=AVpr-4I4vEE&jazoest=2855&__spin_r=1022052908&__spin_b=trunk&__spin_t=1745056166&__crn=comet.fbweb.CometMarketplaceHoistedPermalinkRoute";

axios
  .post(url, body, { headers })
  .then((res) => {
    const raw = res.data;
    const cleaned = raw.replace(/^for\s*\(;;\);/, "");

    try {
      const parsed = JSON.parse(cleaned);
      fs.writeFileSync(
        "fb_single_listing_response.json",
        JSON.stringify(parsed, null, 2)
      );
      console.log("✅ Saved response to fb_single_listing_response.json");
    } catch (e) {
      fs.writeFileSync("fb_single_listing_raw.txt", raw);
      console.warn(
        "⚠️ Could not parse JSON. Raw response saved to fb_single_listing_raw.txt"
      );
    }
  })
  .catch((err) => {
    console.error("❌ Request failed:", err.response?.data || err.message);
  });
