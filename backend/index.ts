import express, { Router } from 'express';
import { Pool } from "pg"
import { CreateUserSchema, SigninUserSchema } from './types';
import { DATABASE_URL, JWT_SECRET } from './config';
import jwt from "jsonwebtoken"
import { middleware } from './middleware';
import { createClient } from 'redis'

const client = createClient();
client.connect()

const app = express()
const pool = new Pool({
    connectionString: DATABASE_URL
})


app.post("/signup",async(req,res) => {
    const parsedData = CreateUserSchema.safeParse(req.body)

    if(!parsedData.success){
        return res.status(411).json({
            message: "Validation failed"
        })
    }
    
    const existingUser = await pool.query(`SELECT * FROM users WHERE username=$`,[parsedData.data.username])

    if(existingUser.rowCount != 0){
        return res.status(411).json({
            messsage:"User already exist"
        })
    }

    const newUser = await pool.query(`INSERT INTO users (username,password) VALUES ($1, $2) RETURNING id;`, [parsedData.data.username,parsedData.data.password]);

    res.status(200).json({
        id: newUser.rows[0].id,
        message:"Signup successfull"
    })

})

app.post("/signin",async(req,res) => {
    const parsedData = SigninUserSchema.safeParse(req.body)

    if(!parsedData.success){
        return res.status(411).json({
            message: "Validation failed"
        })
    }
    
    const existingUser = await pool.query(`SELECT * FROM users WHERE username=$`,[parsedData.data.username])

    if(existingUser.rowCount == 0){
        return res.status(411).json({
            messsage:"User not exist"
        })
    }

    if(existingUser.rows[0].password !== parsedData.data.password){
        return res.status(403).json({
            message:"Wrong password"
        })
    }

    const token = jwt.sign({id:existingUser.rows[0].id, username: existingUser.rows[0].username },JWT_SECRET)

    res.status(200).json({
        token: token,
        message:"SignIn successfull"
    })

})

app.post("/onramp",middleware, async(req,res) => {

})