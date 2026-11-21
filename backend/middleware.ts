import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "./config";

export const middleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = (req.headers.authorization)?.split(" ")[1] as string
    console.log("hii",token)
    try {
        const user = jwt.verify(token,JWT_SECRET) as JwtPayload;
        
        console.log(user)
        if(!user){
            throw new Error("Incorrect token")
        }
        (req as any).user! = user;

        next()
    } catch (error) {
        res.status(403).json({
            message:"Incorrect auth header"
        })
    }
}