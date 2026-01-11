const express = require("express");
const Screen = require("../models/Screen");

const router = express.Router();

function validateCreate(body) {
  const { name, location, resolution, status } = body;
  if (!name || !location || !resolution) return "name, location, resolution are required";
  if (status && !["active", "inactive"].includes(status)) return "status must be active or inactive";
  return null;
}

// POST /api/screens
router.post("/", async (req, res) => {
  try {
    const errMsg = validateCreate(req.body);
    if (errMsg) return res.status(400).json({ error: errMsg });

    const screen = await Screen.create(req.body);
    return res.status(201).json(screen);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// GET /api/screens
router.get("/", async (req, res) => {
  try {
    const screens = await Screen.findAll({ order: [["created_at", "DESC"]] });
    return res.status(200).json(screens);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// PUT /api/screens/:id
router.put("/:id", async (req, res) => {
  try {
    const screen = await Screen.findByPk(req.params.id);
    if (!screen) return res.status(404).json({ error: "Screen not found" });

    const { status } = req.body;
    if (status && !["active", "inactive"].includes(status)) {
      return res.status(400).json({ error: "status must be active or inactive" });
    }

    await screen.update(req.body);
    return res.status(200).json(screen);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

module.exports = router;
