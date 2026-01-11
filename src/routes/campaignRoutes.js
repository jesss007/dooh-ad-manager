const express = require("express");
const { Op } = require("sequelize");

const Campaign = require("../models/Campaign");
const CampaignScreen = require("../models/CampaignScreen");
const CampaignAd = require("../models/CampaignAd");
const Screen = require("../models/Screen");
const Ad = require("../models/Ad");

const router = express.Router();

function isValidDate(d) {
  return d instanceof Date && !isNaN(d.getTime());
}

// POST /api/campaigns
// body example:
// {
//   "start_time":"2026-01-05T10:00:00Z",
//   "end_time":"2026-01-05T12:00:00Z",
//   "screen_ids":["...","..."],
//   "ads":[{"ad_id":"...","play_order":1},{"ad_id":"...","play_order":2}]
// }
router.post("/", async (req, res) => {
  try {
    const { start_time, end_time, screen_ids, ads } = req.body;

    if (!start_time || !end_time) {
      return res.status(400).json({ error: "start_time and end_time are required" });
    }
    if (!Array.isArray(screen_ids) || screen_ids.length === 0) {
      return res.status(400).json({ error: "screen_ids must be a non-empty array" });
    }
    if (!Array.isArray(ads) || ads.length === 0) {
      return res.status(400).json({ error: "ads must be a non-empty array" });
    }

    const start = new Date(start_time);
    const end = new Date(end_time);

    if (!isValidDate(start) || !isValidDate(end)) {
      return res.status(400).json({ error: "start_time/end_time must be valid ISO datetime" });
    }
    if (start >= end) {
      return res.status(400).json({ error: "start_time must be before end_time" });
    }

    // Validate screens exist
    const screensFound = await Screen.findAll({ where: { id: screen_ids } });
    if (screensFound.length !== screen_ids.length) {
      return res.status(400).json({ error: "One or more screen_ids are invalid" });
    }

    // Validate ads exist + play_order
    const adIds = ads.map((a) => a.ad_id);
    const adsFound = await Ad.findAll({ where: { id: adIds } });
    if (adsFound.length !== adIds.length) {
      return res.status(400).json({ error: "One or more ad_id are invalid" });
    }
    for (const a of ads) {
      if (!a.play_order || Number(a.play_order) < 1) {
        return res.status(400).json({ error: "Each ad must have play_order >= 1" });
      }
    }

    // ✅ NO OVERLAPS on same screen:
    // overlap if: newStart < existingEnd AND newEnd > existingStart
    const overlapping = await CampaignScreen.findOne({
      where: { screen_id: screen_ids },
      include: [
        {
          model: Campaign,
          required: true,
          where: {
            start_time: { [Op.lt]: end },
            end_time: { [Op.gt]: start },
          },
        },
      ],
    });

    if (overlapping) {
      return res.status(400).json({ error: "Campaign overlaps with an existing campaign on one of the screens" });
    }

    // Create campaign + join rows
    const campaign = await Campaign.create({ start_time: start, end_time: end });

    // link screens
    await CampaignScreen.bulkCreate(
      screen_ids.map((sid) => ({ campaign_id: campaign.id, screen_id: sid }))
    );

    // link ads
    await CampaignAd.bulkCreate(
      ads.map((a) => ({
        campaign_id: campaign.id,
        ad_id: a.ad_id,
        play_order: Number(a.play_order),
      }))
    );

    return res.status(201).json({
      id: campaign.id,
      start_time: campaign.start_time,
      end_time: campaign.end_time,
      screen_ids,
      ads,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// GET /api/campaigns (optional but useful)
router.get("/", async (req, res) => {
  try {
    const campaigns = await Campaign.findAll({ order: [["created_at", "DESC"]] });
    return res.status(200).json(campaigns);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});


CampaignScreen.belongsTo(Campaign, { foreignKey: "campaign_id" });

module.exports = router;
