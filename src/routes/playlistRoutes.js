const express = require("express");
const { Op } = require("sequelize");

const Campaign = require("../models/Campaign");
const CampaignScreen = require("../models/CampaignScreen");
const CampaignAd = require("../models/CampaignAd");
const Ad = require("../models/Ad");

const router = express.Router();

// GET /api/screens/:screenId/playlist?at=ISO_DATE
router.get("/:screenId/playlist", async (req, res) => {
  try {
    const { screenId } = req.params;
    const at = req.query.at ? new Date(req.query.at) : new Date();

    if (isNaN(at.getTime())) {
      return res.status(400).json({ error: "Invalid 'at' datetime. Use ISO format." });
    }

    // Find campaigns attached to this screen
    const screenCampaignLinks = await CampaignScreen.findAll({
      where: { screen_id: screenId },
      attributes: ["campaign_id"],
    });

    const campaignIds = screenCampaignLinks.map((x) => x.campaign_id);

    if (campaignIds.length === 0) {
      return res.status(200).json({ screen_id: screenId, at, campaign_id: null, ads: [] });
    }

    // Find active campaign at time `at`
    const activeCampaign = await Campaign.findOne({
      where: {
        id: campaignIds,
        start_time: { [Op.lte]: at },
        end_time: { [Op.gte]: at },
      },
      order: [["start_time", "DESC"]],
    });

    if (!activeCampaign) {
      return res.status(200).json({ screen_id: screenId, at, campaign_id: null, ads: [] });
    }

    // Get ads for that campaign ordered by play_order
    const campaignAds = await CampaignAd.findAll({
      where: { campaign_id: activeCampaign.id },
      order: [["play_order", "ASC"]],
    });

    const adIds = campaignAds.map((x) => x.ad_id);
    const ads = await Ad.findAll({ where: { id: adIds } });

    // merge play_order into ads
    const adsWithOrder = campaignAds.map((ca) => {
      const ad = ads.find((a) => a.id === ca.ad_id);
      return {
        ad_id: ca.ad_id,
        play_order: ca.play_order,
        title: ad?.title,
        media_url: ad?.media_url,
        media_type: ad?.media_type,
        duration_seconds: ad?.duration_seconds,
      };
    });

    return res.status(200).json({
      screen_id: screenId,
      at,
      campaign_id: activeCampaign.id,
      ads: adsWithOrder,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

module.exports = router;
