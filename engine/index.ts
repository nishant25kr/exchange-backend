import { createClient } from 'redis'

const client = createClient();
client.connect()
    .then(async()=>{
        while (true) {
            console.log("finding"+ Math.random())
            const value = await client.rPop("engin-queue");
            if(!value) continue;
            console.log("value",value)
            break;
        }
    })