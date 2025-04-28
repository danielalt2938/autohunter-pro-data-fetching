const axios = require("axios");
const cheerio = require("cheerio");

const CRAIGSLIST_URL =
  "https://newyork.craigslist.org/search/cta?hasPic=1&sort=date";

async function fetchCarsFromCraigslist() {
  try {
    const { data: html } = await axios.get(CRAIGSLIST_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
      },
    });

    const $ = cheerio.load(html);
    const listings = [];

    $(".result-info").each((_, element) => {
      const title = $(element).find(".result-title").text();
      const url = $(element).find(".result-title").attr("href");
      const date = $(element).find("time").attr("datetime");

      listings.push({ title, url, date });
    });

    // Output top 10 results
    listings.slice(0, 10).forEach((car, i) => {
      console.log(`${i + 1}. ${car.title}`);
      console.log(`   ${car.url}`);
      console.log(`   Posted on: ${car.date}\n`);
    });
  } catch (error) {
    console.error("Error fetching Craigslist listings:", error.message);
  }
}

fetchCarsFromCraigslist();
