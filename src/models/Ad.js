const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Ad = sequelize.define(
  "ad",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    media_url: { type: DataTypes.STRING, allowNull: false },
    media_type: { type: DataTypes.STRING, allowNull: false }, // image/video
    duration_seconds: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: "ad",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Ad;
