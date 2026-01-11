const Screen = require("./Screen");
const Ad = require("./Ad");
const Campaign = require("./Campaign");
const CampaignScreen = require("./CampaignScreen");
const CampaignAd = require("./CampaignAd");

// Campaign <-> Screen (many-to-many)
Campaign.belongsToMany(Screen, { through: CampaignScreen, foreignKey: "campaign_id" });
Screen.belongsToMany(Campaign, { through: CampaignScreen, foreignKey: "screen_id" });

// Campaign <-> Ad (many-to-many, with play_order in join table)
Campaign.belongsToMany(Ad, { through: CampaignAd, foreignKey: "campaign_id" });
Ad.belongsToMany(Campaign, { through: CampaignAd, foreignKey: "ad_id" });

module.exports = { Screen, Ad, Campaign, CampaignScreen, CampaignAd };
