const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const CampaignAd = sequelize.define(
  "campaign_ad",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    campaign_id: { type: DataTypes.UUID, allowNull: false },
    ad_id: { type: DataTypes.UUID, allowNull: false },
    play_order: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: "campaign_ad",
    timestamps: false,
    underscored: true,
  }
);

module.exports = CampaignAd;
