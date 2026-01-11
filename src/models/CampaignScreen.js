const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const CampaignScreen = sequelize.define(
  "campaign_screen",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    campaign_id: { type: DataTypes.UUID, allowNull: false },
    screen_id: { type: DataTypes.UUID, allowNull: false },
  },
  {
    tableName: "campaign_screen",
    timestamps: false,
    underscored: true,
  }
);
const Campaign = require("./Campaign");
CampaignScreen.belongsTo(Campaign, { foreignKey: "campaign_id" });

module.exports = CampaignScreen;
