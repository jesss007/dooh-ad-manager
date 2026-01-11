const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Screen = sequelize.define(
  "screen",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    resolution: { type: DataTypes.STRING, allowNull: false },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
  },
  {
    tableName: "screen",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Screen;
