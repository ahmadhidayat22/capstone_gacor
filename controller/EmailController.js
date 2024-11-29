import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
    
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure:false,
    auth: {
        user: process.env.MAIL_ID,
        pass: process.env.MAIL_PASS
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