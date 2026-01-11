const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Campaign = sequelize.define(
  "campaign",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    start_time: { type: DataTypes.DATE, allowNull: false },
    end_time: { type: DataTypes.DATE, allowNull: false },
  },
  {
    tableName: "campaign",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Campaign;
