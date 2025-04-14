import { ApifyClient } from "apify-client";
import admin from "firebase-admin";
import fs from "fs";

// Load Firebase service account
const serviceAccount = JSON.parse(fs.readFileSync("./keys.json", "utf-8"));

// Initialize Firebase
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue; // ✅ Import FieldValue for timestamps

// Apify Client
const client = new ApifyClient({
  token: "apify_api_A5jMsA5kRWvlZBTkWMUmErYictL0S93Ye3pJ",
});

const input = {
  urls: ["https://www.facebook.com/marketplace/nyc/cars/"],
};

const run = await client
  .actor("curious_coder/facebook-marketplace")
  .call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();

// Save to Firestore
for (const item of items) {
  const formattedItem = {
    id: item.id,
    title: item.marketplace_listing_title ?? "",
    listingUrl: item.listingUrl ?? "",
    price: {
      raw: item?.listing_price?.amount ?? null,
      display: item?.listing_price?.formatted_amount ?? null,
      cents: item?.listing_price?.amount_with_offset_in_currency ?? null,
    },
    city: item?.location?.reverse_geocode?.city ?? "",
    city_display: item?.location?.city_page?.display_name ?? "",
    image: item?.primary_listing_photo?.image?.uri ?? "",
    delivery_types: item?.delivery_types ?? [],
    status: {
      is_sold: item.is_sold ?? false,
      is_pending: item.is_pending ?? false,
      is_live: item.is_live ?? false,
    },
    createdAt: FieldValue.serverTimestamp(), // ✅ Firestore server-side timestamp
  };

  await db.collection("facebook-marketplace").doc(item.id).set(formattedItem);
}

console.log("✅ All items saved to Firestore with timestamps!");
