import z from "zod"

export const CreateUserSchema = z.object({
    username: z.string(),
    password: z.string()
})

export const SigninUserSchema = z.object({
    username: z.string(),
    password: z.string()
})

export const OnrampSchema = z.object({
    usd: z.number(),
    return_queue: z.string(),
    callbackId: z.number()
})

export const DepositSchema = z.object({
    ticker: z.string(),
    qty: z.string(),
    return_queue: z.string(),
    callbackId: z.number()
})
