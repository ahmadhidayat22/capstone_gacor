
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Users from "../models/UserModel.js";
import { Op } from 'sequelize';
import { nanoid } from "nanoid";


export const getUser = async(req, res) => {
    try {
        const users= await Users.findAll({
            attributes: ['id', 'username', 'email']
        });
        res.json(users);


    } catch (error) {
        console.error(error);
    }
}

export const Register = async(req, res) => {
    
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

export const Login = async(req, res) => { // login with email and password only , modify if login with usename also

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
            expiresIn: '10s'
        })

        const refreshToken = jwt.sign({userId,username,email}, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        })
        console.log(userId,username,email);

        await Users.update({refresh_token: refreshToken}, {
            where:{
                id: userId
            }
        })


        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            // secure:true //jika https
        })

        res.json({accessToken});

    } catch (error) {
        res.status(404).json({message: "email tidak ditemukan"})
    }
}