import { ApifyClient } from "apify-client";
import admin from "firebase-admin";
import * as fs from "fs";

// Load your service account
const serviceAccount = JSON.parse(fs.readFileSync("./keys.json", "utf-8"));

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Initialize the ApifyClient
const client = new ApifyClient({
  token: "apify_api_A5jMsA5kRWvlZBTkWMUmErYictL0S93Ye3pJ",
});

// Prepare input
const input = {
  urls: ["https://www.facebook.com/marketplace/nyc/cars/"],
};

// Run Apify Actor
const run = await client
  .actor("curious_coder/facebook-marketplace")
  .call(input);

// Get dataset items
const { items } = await client.dataset(run.defaultDatasetId).listItems();

// Save each item to Firestore
for (const item of items) {
  await db.collection("facebook-marketplace").doc(item.id).set(item);
}

console.log("✅ Data saved to Firestore!");
