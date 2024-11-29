import Users from './models/UserModel.js';
import News from './models/NewsModel.js';
import PasswordReset from './models/PasswordReset.js'


import express from 'express';
import db  from './config/Database.js';
import router from './routes/index.js'
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
// import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { softLimiter } from './middleware/limiter.js';
import  AuditLog  from './utils/auditLog.js';

let swaggerDocument = yaml.load('./swagger.yaml');
const url = process.env.BASE_URL || 'localhost:5000/api/v1'; // Set url 
swaggerDocument.servers = [{ url: url, description: 'Stagging api URL' }]

const app = express();
const port = process.env.PORT || 3000;
app.set('view engine', 'ejs');

try {
    await db.authenticate();
    // await Users.sync(); // nyalakan code ini untuk membuat tabel di db, kemudian matikan
    // await News.sync(); // nyalakan code ini untuk membuat tabel di db, kemudian matikan
    // await PasswordReset.sync();
    
    console.log('database Connected')
} catch (error) {
    console.error(error);
    

}


app.use(softLimiter);
app.use((req, res, next) => {
    res.setTimeout(10000, () => { // timeout 5 detik
      res.status(503).json({ message: "Permintaan timeout. Silakan coba lagi." });
    });
    next();
});

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use(AuditLog);

// app.use((req,res, next) => {
//   const now = new Date();
//   const formattedDate = now.toLocaleString('en-US', { 
//     year: 'numeric', 
//     month: '2-digit', 
//     day: '2-digit', 
//     hour: '2-digit', 
//     minute: '2-digit', 
//     second: '2-digit', 
//     hour12: false 
//   });
//   console.log(`${req.method} ${req.path} FROM ${req.headers['x-real-ip'] ||req.headers['x-forwarded-for']?.split(',')[0] || req.ip}  TIME: ${formattedDate} - SOURCE: ${req.get('user-agent')}`);
//   next();
// })
app.use(express.urlencoded({ extended: true }));

app.get('/', (req,res) => {
  res.send(" <a href= '/api/docs'>documentation </a>");
})

app.use("/api/v1/",router)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


