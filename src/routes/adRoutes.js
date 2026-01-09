const express = require("express");
const fs = require("fs");
const path = require("path");

const Ad = require("../models/Ad");
const { upload } = require("../config/upload");

const router = express.Router();

// POST /api/ads (multipart/form-data)
router.post("/", upload.single("media"), async (req, res) => {
  try {
    const { title, duration_seconds } = req.body;

    if (!title) return res.status(400).json({ error: "title is required" });
    if (!duration_seconds) return res.status(400).json({ error: "duration_seconds is required" });
    if (!req.file) return res.status(400).json({ error: "media file is required" });

    const media_type = req.file.mimetype.startsWith("image/") ? "image" : "video";

    const ad = await Ad.create({
      title,
      duration_seconds: Number(duration_seconds),
      media_type,
      media_url: `/uploads/${req.file.filename}`,
    });

    return res.status(201).json(ad);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// GET /api/ads
router.get("/", async (req, res) => {
  try {
    const ads = await Ad.findAll({ order: [["created_at", "DESC"]] });
    return res.status(200).json(ads);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// DELETE /api/ads/:id
router.delete("/:id", async (req, res) => {
  try {
    const ad = await Ad.findByPk(req.params.id);
    if (!ad) return res.status(404).json({ error: "Ad not found" });

    // "/uploads/file.png" -> "uploads/file.png"
    const relativePath = ad.media_url.replace(/^\//, "");
    const filePath = path.join(process.cwd(), relativePath);

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await ad.destroy();
    return res.status(200).json({ message: "Ad deleted" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

module.exports = router;
