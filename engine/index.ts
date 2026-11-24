import { createClient } from 'redis'
import { IncomingQueueMessageSchema } from './types';

const client = createClient();

const USER_USD_BALANCES: Record<number, number> = {};
const STOCK_BALANCES : Record<string, Record<string, number>> =  {};
setInterval(() => {
    console.log(USER_USD_BALANCES)
}, 2000);

client.connect()
    .then(async () => {
        while (true) {
            const value = await client.brPop("engine-queue", 1000);
            if (!value) {
                continue;
            }
            const data = JSON.parse(value.element) 
            
            const parsedData = IncomingQueueMessageSchema.safeParse(data)
            
            console.log(parsedData)
            if(parsedData.success){
                console.log("hello")
                if(parsedData.data.type == "onramp"){
                    const userId = parsedData.data.payload.userId;
                    if(!USER_USD_BALANCES[userId]){
                        USER_USD_BALANCES[userId] = 0;
                    }
                    USER_USD_BALANCES[userId] += parsedData.data.payload.amount
                }
                if(parsedData.data.type == "deposit"){
                    const userId = parsedData.data.payload.userId;
                    const ticker = parsedData.data.payload.ticker;
                }
            }else{
                continue;
            }
        }
    })
