const axios = require("axios");
const fs = require("fs");

const url =
  "https://www.facebook.com/marketplace/item/972971497925330/?ref=search&referral_code=null&referral_story_type=post";

axios
  .get(url, {
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "max-age=0",
      dpr: "2",
      priority: "u=0, i",
      "sec-ch-prefers-color-scheme": "dark",
      "sec-ch-ua":
        '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
      "sec-ch-ua-full-version-list":
        '"Google Chrome";v="135.0.7049.85", "Not-A.Brand";v="8.0.0.0", "Chromium";v="135.0.7049.85"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-model": '""',
      "sec-ch-ua-platform": '"macOS"',
      "sec-ch-ua-platform-version": '"13.5.0"',
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      "viewport-width": "1680",
      cookie:
        "datr=vY0FaF1cikG-3u8dqblFiqnl; sb=vY0FaEZdCeykDQu9js2r1LN-; ps_l=1; ps_n=1; fr=0GqUd9w36E1YUaToS..BoBZLG..AAA.0.0.BoBZLG.AWdX0HhMRg25dy7bA-WyX5ImwJA; wd=1680x416",
    },
  })
  .then((response) => {
    fs.writeFileSync("fb_page.html", response.data);
    console.log("✅ HTML saved to fb_page.html");
  })
  .catch((error) => {
    console.error("❌ Error fetching page:", error.message);
  });
