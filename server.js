import express from 'express';
import db  from './config/Database.js';
import Users from './models/UserModel.js';
import router from './routes/index.js'
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';


const app = express();
const port = process.env.PORT || 3000;
try {
    await db.authenticate();
    // await Users.sync(); // nyalakan code ini untuk membuat tabel di db, kemudian matikan
    
    console.log('database Connected')
} catch (error) {
    console.error(error);
    

}
// const timeout = [1000, 2000,3000, 5000,6000];
// const rand = Math.floor(Math.random() * timeout.length);
// const randomTimeout = timeout[rand];

app.use((req, res, next) => {
    res.setTimeout(5000, () => { // timeout 5 detik
      res.status(503).json({ message: "Permintaan timeout. Silakan coba lagi." });
    });
    next();
  });

app.use(cookieParser());
app.use(express.json());
app.use("/api/v1/",router)


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


