import jwt from 'jsonwebtoken';
import { authConfig } from '../config/AuthConfig.js';

export class TokenUtils {
    static expiresAccessToken = '1d';
    static expiresRefreshToken = '7d';

    static generateAccessToken(user)
    {
        return jwt.sign(
            { 
              id: user.id, 
              username: user.username,
              email: user.email, 
              createdAt: user.createdAt,
            }, 
            authConfig.ACCESS_TOKEN,
            { expiresIn: TokenUtils.expiresAccessToken }
        );

    }

    static generateRefreshToken(user)
    {
        return jwt.sign(
            {
                id: user.id 
            },
            authConfig.REFRESH_TOKEN,
            { expiresIn: TokenUtils.expiresRefreshToken }
          );
    }

    static verifyAccessToken(token) {
        try {
          return jwt.verify(token, authConfig.ACCESS_TOKEN);
        } catch (error) {
          return null;
        }
    }
    static verifyRefreshToken(token) {
        try {
          return jwt.verify(token, authConfig.REFRESH_TOKEN);
        } catch (error) {
          return null;
        }
    }

}