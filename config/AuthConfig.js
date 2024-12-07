import dotenv from 'dotenv';
dotenv.config();

export const authConfig ={
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
    ACCESS_TOKEN: process.env.ACCESS_TOKEN_SECRET || '',
    REFRESH_TOKEN: process.env.REFRESH_TOKEN_SECRET || '',
    REDIRECT_URLS: {
      web: 'http://localhost:3000/auth/google/callback',
      mobile: 'com.yourapp://oauth2redirect'
    }
  
}