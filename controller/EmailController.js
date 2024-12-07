import nodemailer from 'nodemailer';
import { mailConfig } from '../config/AuthConfig';
const transporter = nodemailer.createTransport({
    
    service: mailConfig.MAIL_SERVICE ,
    host: mailConfig.HOST,
    port: mailConfig.PORT,
    secure: mailConfig.SECURE,
    auth: {
        user: mailConfig.MAIL_USER,
        pass: mailConfig.MAIL_PASS
    }
});
const sendEmail = async(userMail, title, content) => {
    const message = "Hi there, you were emailed me through nodemailer"
    const mailOptions = {
        from: process.env.MAIL_ID,
        to: userMail,
        subject: title,
        text: message,
        html: content
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        
        console.log('reset password sent to:', userMail);
    } catch (error) {
        console.error('Error sending to email:', error);
    }
}

export default sendEmail