import z from "zod"

export const OnrampIncomingMessageSchema = z.object({
    type: z.string(),
    payload: z.object({
        userId: z.number(),
        amount: z.number()
    })
})

const DepositeIncomingMessageSchema = z.object({
    type: z.string(),
    payload: z.object({
        userId: z.number(),
        ticker: z.string(),
        qty: z.number()
    })
})

