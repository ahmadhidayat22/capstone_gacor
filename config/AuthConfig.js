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

export const mailConfig={
  MAIL_USER: process.env.MAIL_ID,
  MAIL_PASS: process.env.MAIL_PASS,
  MAIL_SERVICE: "gmail",
  HOST: "smtp.gmail.com",
  PORT: 587,
  SECURE :false,

}