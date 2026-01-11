const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors({ origin: "http://localhost:4200" }));

app.use(express.json());


app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

const screenRoutes = require("./routes/screenRoutes");
console.log("Mounting /api/screens routes");
app.use("/api/screens", screenRoutes);

const playlistRoutes = require("./routes/playlistRoutes");
app.use("/api/screens", playlistRoutes);


const adRoutes = require("./routes/adRoutes");
app.use("/api/ads", adRoutes);

const campaignRoutes = require("./routes/campaignRoutes");
app.use("/api/campaigns", campaignRoutes);

module.exports = app;
