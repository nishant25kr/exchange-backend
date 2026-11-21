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
    usd: z.number()
})

export const DepositSchema = z.object({
    ticker: z.string(),
    qty: z.string()
})
