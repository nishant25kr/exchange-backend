import express, { Router } from 'express';
import { Pool } from "pg"
import { CreateUserSchema, DepositSchema, OnrampSchema, SigninUserSchema } from './types';
import { DATABASE_URL, JWT_SECRET } from './config';
import jwt from "jsonwebtoken"
import { middleware } from './middleware';
import { createClient } from 'redis'
import { db } from './src/prisma/db';

const client = createClient();
client.connect()

const prisma = db.orm.public
const app = express()
app.use(express.json())

app.post("/signup", async (req, res) => {
    const parsedData = CreateUserSchema.safeParse(req.body)
    if (!parsedData.success) {
        return res.status(411).json({
            message: "Validation failed"
        })
    }

    // const existingUser = await pool.query(`SELECT * FROM users WHERE username=$`,[parsedData.data.username])
    const existingUser = await prisma.User.where({ username: parsedData.data.username }).first();

    if (existingUser) {
        return res.status(411).json({
            messsage: "User already exist"
        })
    }

    // const newUser = await pool.query(`INSERT INTO users (username,password) VALUES ($1, $2) RETURNING id;`, [parsedData.data.username,parsedData.data.password]);
    const newUser = await prisma.User.create({
        username: parsedData.data.username,
        password: parsedData.data.password,
        available: 0,
        locked: 0
    })


    res.status(200).json({
        id: newUser.id,
        message: "Signup successfull"
    })

})

app.post("/signin", async (req, res) => {
    const parsedData = SigninUserSchema.safeParse(req.body)
    console.log("HELLO THERE")
    if (!parsedData.success) {
        return res.status(411).json({
            message: "Validation failed"
        })
    }

    // const existingUser = await pool.query(`SELECT * FROM users WHERE username=$`, [parsedData.data.username])
    const existingUser = await prisma.User.where({
        username: parsedData.data.username
    }).first();

    if (!existingUser) {
        return res.status(411).json({
            messsage: "User not exist"
        })
    }

    if (existingUser.password !== parsedData.data.password) {
        return res.status(403).json({
            message: "Wrong password"
        })
    }

    const token = jwt.sign({ id: existingUser.id, username: existingUser.username }, JWT_SECRET)

    res.status(200).json({
        token: token,
        message: "SignIn successfull"
    })

})

app.post("/onramp", middleware, async (req, res) => {
    const parsedData = OnrampSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(411).json({
            message: "Validation failed"
        })
    }
    
    await client.lPush("engine-queue", JSON.stringify({
        type : "onramp",
        payload: {
            userId: (req as any).user.id,
            amount: parsedData.data.usd,
            return_queue: parsedData.data.return_queue,
            callbackId: parsedData.data.callbackId
        }
    }))
    
    while (true) {
        console.log("inside")
        const value = await client.brPop("response_queue",5000)
        if(!value) continue;
        const data = JSON.parse(value.element)
        console.log(data);
        break;
    }
    
    return res.status(200).json({
        message: "Onramp completed"
    })
})

app.post("/deposit", middleware, async (req, res) => {
    const parsedData = DepositSchema.safeParse(req.body)
    if (!parsedData.success) {
        return res.status(411).json({
            message: "Validation failed"
        })
    }
    

    try {
        await client.lPush("engine-queue", JSON.stringify({
            type: "deposit",
            payload: {
                userId: (req as any).user.id,
                qty: parsedData.data.qty,
                ticker: parsedData.data.ticker,
                return_queue: parsedData.data.return_queue,
                callbackId: parsedData.data.callbackId
            }
        }))
    } catch (error) {
        return res.status(403).json({
            message: "Error while deposite"
        })
    }
})

app.get("/",(req,res) =>{
    res.status(200).json({
        message:"Hello there"
    })
})

app.listen(3000,()=>{
    console.log("hello from server")
})