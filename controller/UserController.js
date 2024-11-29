import crypto from 'crypto';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Users from "../models/UserModel.js";
import PasswordReset from '../models/PasswordReset.js';
import sendEmail from './EmailController.js';
import { Op } from 'sequelize';
import { nanoid } from "nanoid";
import {google} from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();
import HTML_TEMPLATE from '../utils/htmlTemplate.js';
const appUrl = process.env.BASE_URL || 'http://localhost:5000';

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${appUrl}/api/v1/auth/google/callback`,
);
const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',

]

const profile = async(req,res) => {
    const { id } = req.params
    try {
        const user= await Users.findOne({
            where:{
                id: id
            },
            attributes: ['username', 'email', 'createdAt']

        })

        res.status(200).json({data: user})
    } catch (error) {
        
    }
}

const getUser = async(req, res) => {
    try {
        const users= await Users.findAll({
            attributes: ['id', 'username', 'email', "refresh_token"]
        });
        res.json(users);


    } catch (error) {
        console.error(error);

    }
}

const Register = async(req, res) => {
    
    const { username , email, password, confPassword }= req.body;
    
    
    if(password !== confPassword) return res.status(400).json({message: "password dan confirm password tidak cocok"})
    const id = nanoid(16);
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        const hasUser = await Users.findOne({
            where: {
                [Op.or]: [
                    {username: username},
                    {email: email}
                ]
            }
            
        });

        if(hasUser) return res.status(400).json({message: "username atau email sudah terdaftar"});


        await Users.create({
            id: id,
            username: username,
            email: email,
            password: hashPassword
        })
        res.status(201).json({message: "Register berhasil"});
        return
    } catch (error) {
        console.error(error);
        return;
    }
}

const Login = async(req, res) => { // login with email and password only , modify if login with usename also

    try {
        
        const user = await Users.findAll({
            where:{
                email: req.body.email
                
            }
        })
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if(!match) return res.status(400).json({message: "password salah"})
        const userId = user[0].id;
        const username = user[0].username;
        const email = user[0].email;
        const accessToken = jwt.sign({userId,username,email}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '30s'
        })

        const refreshToken = jwt.sign({userId,username,email}, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        })
        // console.log(userId,username,email);

        await Users.update({refresh_token: refreshToken}, {
            where:{
                id: userId
            }
        })


        // res.cookie('refreshToken', refreshToken,{
        //     httpOnly: true,
        //     maxAge: 24 * 60 * 60 * 1000,
        //     // secure:true //jika https
        // })

        return res.status(200).json({
            message: "Login berhasil",
            accessToken: accessToken,
            refreshToken: {
                token: refreshToken,
                expiresIn: '1d' // 1 hari
            },
        });
    } catch (error) {
        res.status(404).json({message: "email tidak ditemukan"})
    }
}

const redirectOauthLogin = async(req,res) => {
    // return res.redirect(authUrl);
    const authUrl= oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes.join(' '),
        include_granted_scopes:true
    })
    // console.log(authUrl);
    return res.redirect(authUrl)

}
const callbackOauthLogin = async (req, res) => {
    const { code } = req.query;
    // console.log("Authorization Code:", code); // Log kode otorisasi

    try {
        const { tokens } = await oauth2Client.getToken(code); // Mendapatkan token dari Google
        // console.log("Tokens Received:", tokens); // Log token yang diterima

        oauth2Client.setCredentials(tokens);

        const oauth2 = google.oauth2({
            auth: oauth2Client,
            version: 'v2'
        });
        const { data } = await oauth2.userinfo.get();
        // console.log("User Info:", data); // Log informasi pengguna

        if (!data.email || !data.name) {
            return res.status(400).json({ message: "Username atau email tidak ditemukan", data });
        }

        let user = await Users.findOne({
            where: { email: data.email }
        });
        const id = nanoid(16);
        if (!user) {
            user = await Users.create({
                id: id,
                username: data.name,
                email: data.email,
            });
        }

        const payload = {
            id: user.id,
            username: user.username,
            email: user.email
        };

        const secret = process.env.ACCESS_TOKEN_SECRET;
        const refresh_token = process.env.REFRESH_TOKEN_SECRET;

        const accessToken = jwt.sign(payload, secret, { expiresIn: '1h' });
        const refreshToken = jwt.sign(payload, refresh_token, { expiresIn: '1d' });

        await user.update({ refresh_token: refreshToken });

        // res.cookie('refreshToken', refreshToken, {
        //     httpOnly: true,
        //     maxAge: 24 * 60 * 60 * 1000, // 1 hari
        // });
        
        return res.status(200).json({
            message: "Login berhasil",
            accessToken: accessToken,
            refreshToken: {
                refreshToken: refreshToken,
                expiresIn: '1d' // 1 hari
            },

        });
        

    } catch (error) {
        console.error("Error during token exchange:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to exchange token", details: error.response?.data || error.message });
    }
};



const forgotPassword = async(req,res) => {
    const { email } = req.body;
    const user = await Users.findOne({
        where:{
            email: email
        }
    })
    if(!user) return res.status(400).json({message: "email tidak ditemukan" })
    
    await PasswordReset.destroy({
        where: {
            userId: user.id
        }
    });
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(resetToken, 10);
    const idToken = nanoid(16);

    await PasswordReset.create({
        id: idToken,
        userId: user.id,
        hashedToken: hashedToken,
        expiresAt: Date.now() + 2 * 60 * 1000 // 15 menit
    });

    
    const link = `${appUrl}/api/v1/reset-password/${user.id}/${resetToken}`;
  
    const emailContent = HTML_TEMPLATE(link)
    
    await sendEmail(email , 'Reset Your Password', emailContent)
    res.status(200).json({message: "reset password telah dikirim ke email anda"});


}

const getResetPassword = async(req,res) => {
    const { token, id } = req.params;
    const resetToken = await PasswordReset.findOne({
        where: {
            id: id
        }
    })
    if(!resetToken || resetToken.length === 0 ) {
        // return res.status(400).json({message: "token tidak ditemukan atau sudah kadaluarsa"});
        return res.render('reset-password', { id, token, error: 'token tidak ditemukan atau sudah kadaluarsa' });
    
    }
    if(Date.now() > resetToken.expiresAt) {
        await PasswordReset.destroy({
            where: {
                userId: id
            }
        });
        // return res.status(400).json({message: "token reset password sudah kadaluarsa"});
        res.render('reset-password', { id, token, error: 'token reset password sudah kadaluarsa' });

    }
    
    console.log(resetToken)
    if(!bcrypt.compareSync(token, resetToken.hashedToken)) {
        // return res.status(400).json({message: "token tidak valid"});  
        return res.render('reset-password', { id, token, error: 'token tidak valid' });

    }

    res.render('reset-password', { id, token, error: null });


}

const resetPassword = async(req,res) => {
    const { id, token} =req.params;
    const {password, password2} = req.body
    // console.log(req.params, req.body)
    if(password !== password2) {
        // return res.status(400).json({message: "password dan konfirmasi password tidak sama"});
        return res.render('reset-password', { id, token, error: 'password dan konfirmasi password tidak sama' });
    
    }


    try {        
        const user = await Users.findOne({
            where: {
                id: id
            }
        });
        if(user.password === password) {

            // return res.status(400).json({message: "password tidak boleh sama dengan password sebelumnya"});
            return res.render('reset-password', { id, token, error: 'password tidak boleh sama dengan password sebelumnya' });

        }
        if(!user){
            // return res.status(400).json({message: "user tidak ditemukan"});
            return res.render('reset-password', { id, token, error: 'user tidak ditemukan' });
        }
        
        const resetToken = await PasswordReset.findOne({
            where: {
                userId: user.id
                
            }
        });

        if(!resetToken || resetToken.length === 0 ) {
            // return res.status(400).json({message: "token tidak ditemukan atau sudah kadaluarsa"});
            return res.render('reset-password', { id, token, error: 'token tidak ditemukan atau sudah kadaluarsa' });
        
        }
        
        // Cek apakah token sudah expired
        if(Date.now() > resetToken.expiresAt) {
            await PasswordReset.destroy({
                where: {
                    userId: id
                }
            });
            // return res.status(400).json({message: "token reset password sudah kadaluarsa"});
            res.render('reset-password', { id, token, error: 'token reset password sudah kadaluarsa' });

        }
        
        
        if(!bcrypt.compareSync(token, resetToken.hashedToken)) {
            // return res.status(400).json({message: "token tidak valid"});  
            return res.render('reset-password', { id, token, error: 'token tidak valid' });

        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        
        await Users.update({password: hashedPassword}, {
            where:{
                id: id
            }
        })
        await PasswordReset.destroy({
            where: {
                userId: id
            }
        })
        res.status(200).json({message : 'password berhasil diubah'});
        // res.render('reset-password', { id, token, error: 'password tidak boleh sama dengan password sebelumnya' });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal mengubah password' }); 
    }
}


const logout = async(req,res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
        where:{
            refresh_token: refreshToken
        }
    })
    if(!user[0]) return res.sendStatus(204);
    const userId = user[0].id;
    await Users.update({refresh_token: null}, {
        where:{
            id: userId
        }
    })
    res.clearCookie('refreshToken');
    
    return res.sendStatus(200);
}


export{
profile,
 getUser,
 Register,
 Login,
 redirectOauthLogin,
 callbackOauthLogin,
 logout,
 forgotPassword,
 getResetPassword,
 resetPassword,

}

