const axios = require("axios");
const qs = require("querystring");
const fs = require("fs");

const url = "https://www.facebook.com/ajax/bulk-route-definitions/";

const headers = {
  "accept": "*/*",
  "accept-language": "en-US,en;q=0.9",
  "content-type": "application/x-www-form-urlencoded",
  "priority": "u=1, i",
  "sec-ch-prefers-color-scheme": "dark",
  "sec-ch-ua": "\"Google Chrome\";v=\"135\", \"Not-A.Brand\";v=\"8\", \"Chromium\";v=\"135\"",
  "sec-ch-ua-full-version-list": "\"Google Chrome\";v=\"135.0.7049.85\", \"Not-A.Brand\";v=\"8.0.0.0\", \"Chromium\";v=\"135.0.7049.85\"",
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-model": "\"\"",
  "sec-ch-ua-platform": "\"macOS\"",
  "sec-ch-ua-platform-version": "\"13.5.0\"",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "x-asbd-id": "359341",
  "x-fb-lsd": "AVoURmX9Zfk",
  "cookie": "datr=2_4BaGgupfa2ni59DhKjtVMi; sb=2_4BaBYRhH8nEr5tn3qdAs9t; fr=0ZEfc1t70ZCdxJQwj..BoAgMd..AAA.0.0.BoAgMd.AWdjqp7k1GPA9tu6cgp3DfuzDIY; wd=1680x330",
  "Referer": "https://www.facebook.com/marketplace/dallas/search/?query=sofa&maxPrice=500",
  "Referrer-Policy": "strict-origin-when-cross-origin"
};

const body = qs.stringify({
  "route_urls[0]": "/marketplace",
  "route_urls[1]": "/marketplace/dallas/vehicles",
  "route_urls[2]": "/marketplace/dallas/propertyrentals",
  "route_urls[3]": "/marketplace/dallas/apparel",
  "route_urls[4]": "/marketplace/dallas/classifieds",
  "route_urls[5]": "/marketplace/dallas/electronics",
  "route_urls[6]": "/marketplace/dallas/entertainment",
  "route_urls[7]": "/marketplace/dallas/family",
  "route_urls[8]": "/marketplace/dallas/free",
  "route_urls[9]": "/marketplace/dallas/garden",
  "route_urls[10]": "/marketplace/dallas/hobbies",
  "route_urls[11]": "/marketplace/dallas/home",
  "route_urls[12]": "/marketplace/dallas/home-improvements",
  "route_urls[13]": "/marketplace/dallas/propertyforsale",
  "route_urls[14]": "/marketplace/dallas/instruments",
  "routing_namespace": "fb_comet",
  "__aaid": "0",
  "__user": "0",
  "__a": "1",
  "__req": "6",
  "__hs": "20196.HYP:comet_loggedout_pkg.2.1...0",
  "dpr": "2",
  "__ccg": "EXCELLENT",
  "__rev": "1022019538",
  "__s": "wc46u0:slbzaq:b747kv",
  "__hsi": "7494562170883176251",
  "__dyn": "7xe6E5q5U5ObwKBBwno6u5U4e1ZxG3q32360O819oe8hw2nVE4W0qa0FE2awpU1vohwGwQw9m0EA2C0iK0D85m1CK0zEkxe2GewbS2S1uw8W5U4q09yyES0gq0Lo6-3u362-0VE6O1FwhE7W0wWwIxW1owmU1gU",
  "__csr": "g_pcDri4nOikjuyfGhAgCBBrCK-ax6H-9AF584EKfxK6UqzoaomBgvBwZwwyE422q6bxW8G78GaxSbg4u10xK69UG5obFU0q0DBU1KodAl4Q01wByE980I60-80FO0kK7o09kE03xcyo1GU0deE17U0zkE1-o06S60hO025500QlxS0dZw33U0b6C06w49yE0h3y46-0fuw4iwr8",
  "__comet_req": "15",
  "lsd": "AVoURmX9Zfk",
  "jazoest": "2982",
  "__spin_r": "1022019538",
  "__spin_b": "trunk",
  "__spin_t": "1744963734",
  "__crn": "comet.fbweb.CometMarketplaceSearchRoute"
});

axios.post(url, body, { headers })
  .then(res => {
    const raw = res.data;
    const cleaned = raw.replace(/^for\s*\(;;\);/, "");

    try {
      const parsed = JSON.parse(cleaned);
      fs.writeFileSync("fb_response.json", JSON.stringify(parsed, null, 2));
      console.log("✅ Response saved to fb_response.json");
    } catch (e) {
      fs.writeFileSync("fb_response_raw.txt", raw);
      console.warn("⚠️ Couldn't parse JSON. Raw response saved to fb_response_raw.txt");
    }
  })
  .catch(err => {
    console.error("❌ Error:", err.response?.data || err.message);
  });
