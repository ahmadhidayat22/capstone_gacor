import express from 'express';
import { 
    getUser, 
    Register,
    Login,
    redirectOauthLogin,
    callbackOauthLogin,
    forgotPassword,
    resetPassword,
    logout,
    getResetPassword,
    profile,
    verifyGoogleLogin

} from '../controller/UserController.js';

import { 
    getAllProducts, 
    getProductById, 
    createProduct
} from '../controller/ProductController.js';

import { verifyToken } from '../middleware/VerifyToken.js';
import { refreshToken } from '../controller/RefreshToken.js';
import { fetchNews } from '../controller/NewsController.js';
import { hardLimiter } from '../middleware/limiter.js';

const router = express.Router();

//news
router.get('/news', verifyToken, fetchNews);

//produk
router.get('/product', verifyToken, getAllProducts);
router.get('/product/:id', verifyToken, getProductById);
router.post('/product', verifyToken, createProduct);


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

export default router;