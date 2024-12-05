import  {Sequelize}  from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
const db= new Sequelize(process.env.DB_NAME , process.env.DB_USER ,process.env.DB_PASSWORD ,{
    host: process.env.DB_HOST , // localhost
    port: process.env.DB_PORT, // 3306
    dialect: process.env.DB_DIALECT, // default mysql
})  
export default db;