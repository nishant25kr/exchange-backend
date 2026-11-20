import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "./config";

export const middleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = (req.headers.authorization)?.split(" ")[1] as string
    try {
        const user = jwt.verify(token,JWT_SECRET) as JwtPayload;
        
        if(!user){
            throw new Error("Incorrect token")
        }

        (req as any).user = user;
    } catch (error) {
        res.status(403).json({
            message:"Incorrect auth header"
        })
    }
}