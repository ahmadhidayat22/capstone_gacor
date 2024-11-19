import express from 'express';
import db  from './config/Database.js';
import router from './routes/index.js'
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
let swaggerDocument = yaml.load('./swagger.yaml');
const url = process.env.BASE_URL || 'localhost:5000/api/v1'; // Set url 
swaggerDocument.servers = [{ url: url, description: 'Stagging api URL' }]

const app = express();
const port = process.env.PORT || 3000;

try {
    await db.authenticate();
    // await Users.sync(); // nyalakan code ini untuk membuat tabel di db, kemudian matikan
    
    console.log('database Connected')
} catch (error) {
    console.error(error);
    

}


const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, 
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // message: "Terlalu banyak permintaan dari IP ini, coba lagi nanti.",
  handler: (req,res) => {
      // bannedIps.add(req.ip);
      console.log(`Permintaan dari IP: ${req.ip} melebihi batas`);
      res.status(429).json({
          error: 'Terlalu banyak permintaan dari IP ini, coba lagi nanti'
      })
  }

})
app.use(limiter);
app.use((req, res, next) => {
    res.setTimeout(10000, () => { // timeout 5 detik
      res.status(503).json({ message: "Permintaan timeout. Silakan coba lagi." });
    });
    next();
});

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use((req,res, next) => {
  const now = new Date();
  const formattedDate = now.toLocaleString('en-US', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit', 
    hour12: false 
  });
  console.log(`${req.method} ${req.path} FROM ${req.ip} TIME: ${formattedDate} - SOURCE: ${req.get('user-agent')}`);
  next();
})
app.get('/', (req,res) => {
  res.send(" <a href= '/api/docs'>documentation </a>");
})

app.use("/api/v1/",router)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


