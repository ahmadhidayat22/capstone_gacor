import express from 'express';
import { 
    getUser, 
    Register,
    Login,


} from '../controller/User.js';

import { verifyToken } from '../middleware/VerifyToken.js';
import { refreshToken } from '../controller/RefreshToken.js';

const router = express.Router();


router.get('/user',verifyToken, getUser);
router.post('/register', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.get('/test-delay', (req,res) => {
    const timeout = [50,100, 200,300];
    const rand = Math.floor(Math.random() * timeout.length);
    const randomTimeout = timeout[rand];
    setTimeout(() => {
        res.send("testing timeout");
    }, randomTimeout)
})

export default router;