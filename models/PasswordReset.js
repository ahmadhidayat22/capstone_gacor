import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize

const PasswordReset = db.define('PasswordReset' ,
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.STRING,

        },
        hashedToken: {
            type: DataTypes.STRING
        },
        expiresAt: {
            type: DataTypes.STRING
        }

  }
,{
    freezeTableName: true
})

export default PasswordReset;