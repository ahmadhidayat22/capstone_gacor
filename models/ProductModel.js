import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Product = db.define(
  "products",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gradien: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM("makanan", "minuman"),
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
