 // initDB.js
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const User = require("../models/user.js"); // Make sure the path is correct
const initData = require("../init/data.js");
require("dotenv").config();

const MONGO_URL = process.env.MONGO_URL;
const SESSION_SECRET = process.env.SESSION_SECRET;

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("✅ Connected to MongoDB");
}

// Initialize the database
const initDB = async () => {
  try {
    // Clear existing data
    await Listing.deleteMany({});
    await User.deleteMany({});

    // Create a default user (owner)
    const defaultUser = new User({
      username: "admin",
      email: "admin@example.com",
    });
    const registeredUser = await User.register(defaultUser, "password123");
    console.log("✅ Default user created:", registeredUser.username);

    // Add owner and default images to each listing
    const dataWithOwnersAndImages = initData.data.map((listing) => ({
      ...listing,
      owner: registeredUser._id,
      image: listing.image && listing.image.url
        ? listing.image
        : {
            filename: "listingimage",
            url: "https://images.unsplash.com/photo-1579765875513-0d711aeeaa3a?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=1000",
          },
    }));

    await Listing.insertMany(dataWithOwnersAndImages);
    console.log("🌱 Database initialized with sample listings!");
  } catch (err) {
    console.error("❌ Error initializing database:", err);
  } finally {
    mongoose.connection.close();
  }
};

main().then(() => initDB());


