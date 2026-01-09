require("dotenv").config();
require("./models/index");

// Register models (IMPORTANT: before sync)
require("./models/Screen");
require("./models/Ad");


const app = require("./app");
const { sequelize } = require("./config/db");

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    // 1️⃣ Connect to DB
    await sequelize.authenticate();
    console.log("✅ DB connected");

    // 2️⃣ Create tables if they don’t exist
    await sequelize.sync();
    console.log("✅ DB synced");

    // 3️⃣ Start server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Startup failed:", err.message);
    process.exit(1);
  }
}

start();
