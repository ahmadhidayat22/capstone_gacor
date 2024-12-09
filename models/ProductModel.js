import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Product = db.define("products", {
      id:{
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    protein: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    sugar: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    sodium: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    saturatedFat: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    calories: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    fiber: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    estVegetableContain: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    grade: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      references: {
        model: "users",
        key: "id",
      },
      timestamps: true,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

// Relasi dengan User
Product.associate = (models) => {
  Product.belongsTo(models.Users, {
    foreignKey: "userId",
    as: "user",
  });
};

export default Product;
