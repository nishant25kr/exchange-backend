import { createClient } from 'redis'

const client = createClient();

const sendClinet = createClient()
sendClinet.connect()

const USER_USD_BALANCES: Record<number, number> = {};
const STOCK_BALANCES: Record<string, Record<string, number>> = {};

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

            console.log("hello")
            if (parsedData.type == "onramp") {
                
                const userId = parsedData.payload.userId;
                if (!USER_USD_BALANCES[userId]) {
                    USER_USD_BALANCES[userId] = 0;
                }
                USER_USD_BALANCES[userId] += parsedData.payload.amount

                const return_queue = parsedData.payload.return_queue

                await sendClinet.lPush(`${return_queue}`, JSON.stringify({
                    balance: USER_USD_BALANCES[userId],
                    callbackId : parsedData.payload.callbackId
                }))

            }

            if (parsedData.type == "deposit") {
                const userId = parsedData.payload.userId;
                const ticker = parsedData.payload.ticker;
                const qty = parsedData.payload.qty
                if (!STOCK_BALANCES[userId]) {
                    STOCK_BALANCES[userId] = {}
                }

                if (!STOCK_BALANCES[userId][ticker]) {
                    (STOCK_BALANCES[userId]!)[ticker] = 0;
                }
                (STOCK_BALANCES[userId]!)[ticker] += qty;

            }

            if (parsedData.type == "get_balances") {
                const userId = parsedData.userId
                const balance = USER_USD_BALANCES[userId];
                console.log(balance)

                const return_queue = parsedData.queue

                sendClinet.lPush(return_queue, JSON.stringify({
                    balance: balance,
                    callback: parsedData.callbackId
                }))



            }
        }
    })
