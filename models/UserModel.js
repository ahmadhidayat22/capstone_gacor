import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize

const Users = db.define('users', {
    id:{
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    username:{
        type: DataTypes.STRING,
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false
    },
    password:{
        type: DataTypes.STRING,
        
    },
    refresh_token:{
        type: DataTypes.STRING,
     
    }
},{
    freezeTableName: true
})

export default Users;