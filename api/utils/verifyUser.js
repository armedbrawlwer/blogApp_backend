import jwt from "jsonwebtoken";

import { errorHandler } from "./error.js";

export const verifyToken = async(req,res,next)=>{
        const token = req.cookies.access_token
        console.log(token)
        if(!token) {
            return next(errorHandler(401,'no token found for user'))
        }
        jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
            if(err)
            {
                return (errorHandler(401,'unathorized'))
            }
            req.user = user;
            next();
        })
}