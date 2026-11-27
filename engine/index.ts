import { createClient } from 'redis'

const client = createClient();

const sendClinet = createClient()
sendClinet.connect()

const USER_USD_BALANCES: Record<number, number> = {};
const STOCK_BALANCES: Record<number, Record<string, number>> = {};

setInterval(() => {
    console.log("USD:", USER_USD_BALANCES)
    console.log("Stock:", STOCK_BALANCES)
}, 2000);

client.connect()
    .then(async () => {
        while (true) {
            const value = await client.brPop("engine-queue", 1000);
            if (!value) {
                continue;
            }
            const parsedData = JSON.parse(value.element)
            console.log(parsedData)
            console.log("hello")

            if (parsedData.type == "onramp") {
                
                const userId = parsedData.payload.userId;
                if (!USER_USD_BALANCES[userId]) {
                    USER_USD_BALANCES[userId] = 0;
                }
                USER_USD_BALANCES[userId] += parsedData.payload.amount

                await sendClinet.HSET(String(parsedData.payload.callbackId), {USD: USER_USD_BALANCES[userId]})
            }

            if (parsedData.type == "deposit") {
                const userId = parsedData.payload.userId;
                const ticker = parsedData.payload.ticker;
                const qty = parsedData.payload.qty
                const return_queue = parsedData.payload.return_queue

                if (!STOCK_BALANCES[userId]) {
                    STOCK_BALANCES[userId] = {}
                }

                if (!STOCK_BALANCES[userId][ticker]) {
                    (STOCK_BALANCES[userId]!)[ticker] = 0;
                }
                (STOCK_BALANCES[userId]!)[ticker] += qty;

                await sendClinet.HSET(String(parsedData.payload.callbackId), STOCK_BALANCES[userId])
            }

            if (parsedData.type == "get_balances") {
                console.log("inside")
                console.log(parsedData)
                const userId = parsedData.payload.userId
                let balance;
                if(!USER_USD_BALANCES[userId]){
                    balance = 0
                }else{
                    balance =  USER_USD_BALANCES[userId]
                }
                console.log(balance)
                await sendClinet.HSET(String(parsedData.payload.callbackId), { USD: balance })
            }
        }
    })
