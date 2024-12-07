import Users from './models/UserModel.js';
import News from './models/NewsModel.js';
import Product from './models/ProductModel.js';
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
const url = process.env.BASE_URL || 'http://localhost:5000'; // Set url 
swaggerDocument.servers = [{ url: `${url}/api/v1/`, description: 'Stagging api URL' }]

const app = express();
const port = process.env.PORT || 8080;

const syncTable = async() => {
    await Users.sync(); // nyalakan code ini untuk membuat tabel di db, kemudian matikan
    await Product.sync(); // nyalakan code ini untuk membuat tabel di db, kemudian matikan
    await News.sync(); // nyalakan code ini untuk membuat tabel di db, kemudian matikan

    await PasswordReset.sync();
    
}

try {
    await db.authenticate();
    // await syncTable();
    
    console.log('database Connected')
} catch (error) {
    console.error(error);
    
}


app.set('view engine', 'ejs');
// app.set('trust proxy', true)
app.use(softLimiter);
app.use((req, res, next) => {
    res.setTimeout(20000, () => { // timeout 20 detik
      res.status(503).json({ message: "Permintaan timeout. Silakan coba lagi." });
    });
    next();
});

app.use(cors());
app.use(cookieParser());
app.use(express.json());

// app.use(AuditLog);


app.use(express.urlencoded({ extended: true }));

app.get('/', (req,res) => {
  res.send(" <a href= '/api/docs'>documentation </a>");
})

app.use("/api/v1/",router)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


