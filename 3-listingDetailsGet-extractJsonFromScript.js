const axios = require("axios");

const url = "https://www.facebook.com/api/graphql/";

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
  "x-fb-friendly-name": "MarketplacePDPContainerQuery",
  "x-fb-lsd": "AVp9xfowq-A",
  cookie:
    "datr=vY0FaF1cikG-3u8dqblFiqnl; sb=vY0FaEZdCeykDQu9js2r1LN-; ps_l=1; ps_n=1; fr=0GqUd9w36E1YUaToS..BoBZLG..AAA.0.0.BoBZS1.AWeYlQZpSm1ffM7GAmtVg49VylU; wd=1680x517",
  Referer: "https://www.facebook.com/marketplace/nyc/vehicles/",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

const body = `av=0&__aaid=0&__user=0&__a=1&__req=2i&__hs=20201.HYP%3Acomet_loggedout_pkg.2.1...0&dpr=2&__ccg=EXCELLENT&__rev=1022162254&__s=ad0jzb%3Axvu262%3Apimp53&__hsi=7496629467048255841&__dyn=7xeUmwlEnwn8K2Wmh0no6u5U4e1ZyUW3q32360CEbo19oe8hw2nVE4W0qa0FE2awpUO0n24oaEd82lwv89k2C1Fwc60D85m1mzXw8W58jwGzE6G1iwJK14xm0zK5o4q0Gpo8o1o8bUGdw46wbS1LwTwNwLwFg2Xwr86C13G1-w8eEb8uwm85K0UE62&__csr=gP2IDd48y59ShkF3vlaQK-GKQjAGQHAat2Z4CHUGFawFgV24qFWF4CyUHDzpV8CaAxKcogxCfzpQay8-FohKq9x22CbHzoy2668ybxry89822hEaEoxK58oAw0nJU093rU0KS0fJw04nAU1po0siw3gOw7QyUS0hC6Q0j20YE0icw0FDw5Sw0Nbweu1G8Eogscy01WS02_i0edw1Wd00hpC6A09xw2W810pS0n6&__comet_req=15&lsd=AVp9xfowq-A&jazoest=2995&__spin_r=1022162254&__spin_b=trunk&__spin_t=1745445064&__crn=comet.fbweb.CometMarketplaceMotorsCategoryRoute&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=MarketplacePDPContainerQuery&variables=%7B%22feedbackSource%22%3A56%2C%22feedLocation%22%3A%22MARKETPLACE_MEGAMALL%22%2C%22referralCode%22%3A%22undefined%22%2C%22scale%22%3A2%2C%22targetId%22%3A%221306165770477763%22%2C%22useDefaultActor%22%3Afalse%2C%22__relay_internal__pv__CometUFIShareActionMigrationrelayprovider%22%3Atrue%2C%22__relay_internal__pv__GHLShouldChangeSponsoredDataFieldNamerelayprovider%22%3Afalse%2C%22__relay_internal__pv__GHLShouldChangeAdIdFieldNamerelayprovider%22%3Afalse%2C%22__relay_internal__pv__CometIsReplyPagerDisabledrelayprovider%22%3Afalse%2C%22__relay_internal__pv__IsWorkUserrelayprovider%22%3Afalse%2C%22__relay_internal__pv__CometUFIReactionsEnableShortNamerelayprovider%22%3Afalse%2C%22__relay_internal__pv__MarketplacePDPRedesignrelayprovider%22%3Afalse%2C%22__relay_internal__pv__MarketplacePDPCTARedesignrelayprovider%22%3Afalse%2C%22__relay_internal__pv__MarketplacePDPTailRedesignrelayprovider%22%3Afalse%2C%22__relay_internal__pv__MarketplacePDPBSGRedesignrelayprovider%22%3Afalse%7D&server_timestamps=true&doc_id=10049798765070506`;

(async () => {
  try {
    const response = await axios.post(url, body, { headers });
    console.log("✅ Success:\n", response.data);
  } catch (error) {
    console.error(
      "❌ Request failed:",
      error.response?.status,
      error.response?.data?.error || error.message
    );
  }
})();
