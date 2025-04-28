const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

(async () => {
  try {
    const response = await axios.get(
      "https://www.facebook.com/StudioCodeBlock/",
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          "Accept-Language": "en-US,en;q=0.9",
        },
        maxRedirects: 5,
      }
    );

    // Save raw HTML
    fs.writeFileSync("facebook_page.html", response.data);

    // Load into cheerio for parsing (you won't get much due to JS rendering)
    const $ = cheerio.load(response.data);

    // Example: try to get the <title>
    const title = $("title").text();
    console.log("Page title:", title);
  } catch (error) {
    console.error("Error fetching the page:", error.message);
  }
})();
