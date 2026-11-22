import { createClient } from 'redis'

const client = createClient();
client.connect()
    .then(async()=>{
        while (true) {
            const value = await client.brPop("engin-queue",1000);
            if(!value) continue;
            console.log("value",value)
        }
    })