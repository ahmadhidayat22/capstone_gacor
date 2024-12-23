import jwt from 'jsonwebtoken';
import Users from '../models/UserModel.js';


export const refreshToken = async(req,res ) => {
    try {
        const { refreshToken } = req.body;
        console.log(req.body);
        
        if(!refreshToken) return res.sendStatus(401);
        const user = await Users.findAll({
            where:{
                refresh_token: refreshToken
            }
        })     

        if(!user[0]) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
            if(err) return res.sendStatus(403);
            const userId = user[0].id;
            const username = user[0].username;
            const email = user[0].email;

            const accessToken = jwt.sign({userId,username,email}, process.env.ACCESS_TOKEN_SECRET , {
                expiresIn: '15s'
            })
            res.json({accessToken});
            return
        })


    } catch (error) {
        console.error(error);
        return;
        
    }
}