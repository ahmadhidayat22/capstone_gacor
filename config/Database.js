import  {Sequelize}  from 'sequelize';

const db= new Sequelize('nutrisee', 'root','123',{
    host: '127.0.0.1',
    dialect: 'mariadb' // default mysql
    
})

export default db;