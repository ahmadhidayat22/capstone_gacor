import jwt from 'jsonwebtoken';
import { TokenUtils }  from '../utils/tokenUtils.js';

export const verifyToken = (req, res, next) => {
    const authHeader= req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    
    if(token == null) return res.sendStatus(401);
    const decoded = TokenUtils.verifyAccessToken(token);

    if(!decoded) return res.sendStatus(403);
    
    req.email = decoded.email;
    req.userId = decoded.userId;
    next();

    // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,decoded) => {
    //     if(err) {
    //         return res.sendStatus(403)};
    //     req.email = decoded.email;
    //     req.userId = decoded.userId;
    //     next();
        
    // } )
    
}
