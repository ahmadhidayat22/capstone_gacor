import express from 'express';
import { 
    getUser, 
    Register,
    Login,
    // redirectOauthLogin,
    // callbackOauthLogin,
    forgotPassword,
    resetPassword,
    logout,
    getResetPassword,
    profile,
    verifyGoogleLogin

} from '../controller/UserController.js';

import { 
    getAllProducts, 
    // getProductByName, 
    createProduct,
    getAllProductsbyUserId,
    _deleteProduct,
} from '../controller/ProductController.js';
import { Predict } from '../controller/Predict.js';
import { verifyToken } from '../middleware/VerifyToken.js';
import { refreshToken } from '../controller/RefreshToken.js';
import { fetchNews } from '../controller/NewsController.js';
import { hardLimiter } from '../middleware/limiter.js';
import { upload } from '../middleware/multer.js';

const router = express.Router();

//news
router.get('/news', verifyToken, fetchNews);

//produk
router.get('/product/history', verifyToken, getAllProductsbyUserId);
// router.post('/product/search', verifyToken, getProductByName); // not used
router.post('/product', upload, createProduct); // 2 middleware
router.get('/product', verifyToken, getAllProducts);

router.get('/users',verifyToken, getUser);
router.get('/profile',verifyToken, profile)
router.post('/register', Register);
router.post('/login', Login);
router.post('/token', refreshToken);

// router.get('/auth/google', redirectOauthLogin);
// router.get('/auth/google/callback', callbackOauthLogin);

router.post('/forgot-password', hardLimiter, forgotPassword);
router.get('/reset-password/:id/:token', getResetPassword);
router.post('/reset-password/:id/:token', hardLimiter, resetPassword);

router.delete('/logout', logout);

router.get('/verify-google-login', verifyGoogleLogin);

// router.post('/predict', Predict)

router.delete('/product', verifyToken, _deleteProduct); // hanya untuk "admin/dev"
export default router;