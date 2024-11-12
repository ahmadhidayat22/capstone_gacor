import  {Sequelize}  from 'sequelize';

const db= new Sequelize('nutrisee', 'root','',{
    host: 'localhost',
    dialect: 'mysql'
    
})

export default db;