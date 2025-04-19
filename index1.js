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
  "x-fb-lsd": "AVpD-jEXHuA",
  cookie:
    "datr=YSQDaMMsdSthO2Wna3jiF2w6; sb=YSQDaIfnyvszF4Dhe7f8yFcM; ps_l=1; ps_n=1; wd=1680x330",
  Referer:
    "https://www.facebook.com/marketplace/dallas/search/?query=cars&maxPrice=500",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

const body = `route_urls[0]=%2Fmarketplace%2Fitem%2F972971497925330%2F%3Fref%3Dsearch%26referral_code%3Dnull%26referral_story_type%3Dpost%26__tn__%3D!%253AD&route_urls[1]=%2Fmarketplace%2Fitem%2F614621071345273%2F%3Fref%3Dsearch%26referral_code%3Dnull%26referral_story_type%3Dpost%26__tn__%3D!%253AD&route_urls[2]=%2Fmarketplace%2Fitem%2F1171384351003329%2F%3Fref%3Dsearch%26referral_code%3Dnull%26referral_story_type%3Dpost%26__tn__%3D!%253AD&route_urls[3]=%2Fmarketplace%2Fitem%2F1338161540195483%2F%3Fref%3Dsearch%26referral_code%3Dnull%26referral_story_type%3Dpost%26__tn__%3D!%253AD&route_urls[4]=%2Fmarketplace%2Fitem%2F666497929466002%2F%3Fref%3Dsearch%26referral_code%3Dnull%26referral_story_type%3Dpost%26__tn__%3D!%253AD&route_urls[5]=%2Fmarketplace%2Fitem%2F902105038490092%2F%3Fref%3Dsearch%26referral_code%3Dnull%26referral_story_type%3Dpost%26__tn__%3D!%253AD&route_urls[6]=%2Fmarketplace%2Fitem%2F1168518461241305%2F%3Fref%3Dsearch%26referral_code%3Dnull%26referral_story_type%3Dpost%26__tn__%3D!%253AD&route_urls[7]=%2Fmarketplace%2Fitem%2F619661474307638%2F%3Fref%3Dsearch%26referral_code%3Dnull%26referral_story_type%3Dpost%26__tn__%3D!%253AD&route_urls[8]=%2Fmarketplace%2Fitem%2F1018903686956185%2F%3Fref%3Dsearch%26referral_code%3Dnull%26referral_story_type%3Dpost%26__tn__%3D!%253AD&route_urls[9]=%2Fmarketplace%2Fitem%2F873828704893776%2F%3Fref%3Dsearch%26referral_code%3Dnull%26referral_story_type%3Dpost%26__tn__%3D!%253AD&route_urls[10]=%2Fmarketplace%2Fitem%2F918392190451239%2F%3Fref%3Dsearch%26referral_code%3Dnull%26referral_story_type%3Dpost%26__tn__%3D!%253AD&route_urls[11]=%2Fmarketplace%2Fitem%2F1164000091976432%2F%3Fref%3Dsearch%26referral_code%3Dnull%26referral_story_type%3Dpost%26__tn__%3D!%253AD&route_urls[12]=%2Fmarketplace%2Fitem%2F289085890808595%2F%3Fref%3Dsearch%26referral_code%3Dnull%26referral_story_type%3Dpost%26__tn__%3D!%253AD&route_urls[13]=%2Fmarketplace%2Fitem%2F1109930647596334%2F%3Fref%3Dsearch%26referral_code%3Dnull%26referral_story_type%3Dpost%26__tn__%3D!%253AD&route_urls[14]=%2Fmarketplace%2Fitem%2F9130781616968355%2F%3Fref%3Dsearch%26referral_code%3Dnull%26referral_story_type%3Dpost%26__tn__%3D!%253AD&routing_namespace=fb_comet&__aaid=0&__user=0&__a=1&__req=7&__hs=20197.HYP%3Acomet_loggedout_pkg.2.1...0&dpr=2&__ccg=EXCELLENT&__rev=1022049426&__s=aj91mc%3Axia3jk%3Aharcwp&__hsi=7494875767904420804&__dyn=7xe6E5q5U5ObwKBBwno6u5U4e1ZxG3q32360O819oe8hw2nVE4W0qa0FE2awpU1vohwGwQw9m0EA2C0iK0D85m1CK0zEkxe2GewbS2S1uw8W5U4q09yyES0gq0Lo6-3u362-0VE6O1FwhE7W0wWwIxW1owmU1gU&__csr=gzs89HSx2Fl9iTnZkt4TDQujDhy5oy8BGaBKiqmu2Sui5oG2C26byUpyEJ0DwEzogz8cUjxammdz8kx62m5omx61Tg9EaF9Fpo0qEJ5Cg0ze0qC0yAl00lIU4W0vC0Go18o0hJK0AU088o03Fkw9Pw0Kka0bSxtw3W80LO01vrzj0ho34w3E80kdg0deU9o0xG0fAw0kX-0hq9g0Za0Iqxx058w8C&__comet_req=15&lsd=AVpD-jEXHuA&jazoest=2893&__spin_r=1022049426&__spin_b=trunk&__spin_t=1745036749&__crn=comet.fbweb.CometMarketplaceSearchRoute`;

axios
  .post(url, body, { headers })
  .then((res) => {
    const raw = res.data;
    const cleaned = raw.replace(/^for\s*\(;;\);/, "");

    try {
      const parsed = JSON.parse(cleaned);
      fs.writeFileSync(
        "fb_cars_response.json",
        JSON.stringify(parsed, null, 2)
      );
      console.log("✅ Saved response to fb_cars_response.json");
    } catch (e) {
      fs.writeFileSync("fb_cars_raw.txt", raw);
      console.warn("⚠️ Could not parse JSON. Raw saved to fb_cars_raw.txt");
    }
  })
  .catch((err) => {
    console.error("❌ Request failed:", err.response?.data || err.message);
  });
