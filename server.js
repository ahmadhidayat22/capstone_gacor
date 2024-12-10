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
import { softLimiter, timeout } from './middleware/limiter.js';
import  AuditLog  from './utils/auditLog.js';
import path from 'path'
import { fileURLToPath } from 'url';

// Definisikan __dirname secara manual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let swaggerDocument = yaml.load('./swagger.yaml');
const url = process.env.BASE_URL || 'http://localhost:5000'; // Set url 
swaggerDocument.servers = [{ url: `${url}api/v1/`, description: 'Stagging api URL' }]

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
    //await syncTable();
    
    console.log('database Connected')
} catch (error) {
    console.error(error);
    
}


app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
// app.set('trust proxy', true)
app.use(softLimiter);
app.use(timeout);
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(AuditLog);

app.get('/', (req,res) => {
  res.send(" <a href= '/api/docs'>documentation </a>");
})
app.get('/not-found', (req,res) => {
    res.render('404');
})
app.use("/api/v1/",router)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


