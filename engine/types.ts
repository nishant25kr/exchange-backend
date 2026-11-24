import z from "zod"

export const IncomingQueueMessageSchema = z.union(
    [
        z.object({
            type: z.string(),
            payload: z.object({
                userId: z.number(),
                amount: z.number()
            })
        }),
        z.object({
            type: z.string(),
            payload: z.object({
                userId: z.number(),
                amount: z.number()
            })
        }),
    ]
)
 

