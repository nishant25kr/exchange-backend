import { test, describe, expect } from "bun:test";
import axios from "axios";

const BACKEND_URL = "http://localhost:3000"


test("signup is working fine", async () => {
    const username = "Nishant" + Math.random()
    const password = '123123'

    const response = await axios.post(`${BACKEND_URL}/signup`, {
        username,
        password

    })

    expect(response.status).toBe(200)
    expect(response.data.message).toBe("Signup successfull")
})


test("signin is workin fine", async () => {
    const username = "Nishant" + Math.random()
    const password = '123123'

    const signupResponse = await axios.post(`${BACKEND_URL}/signup`, {
        username,
        password
    })
    expect(signupResponse.status).toBe(200)
    expect(signupResponse.data.message).toBe("Signup successfull")

    const signInresponse = await axios.post(`${BACKEND_URL}/signin`, {
        username,
        password
    })
    expect(signInresponse.status).toBe(200)
    expect(signInresponse.data.message).toBe("SignIn successfull")

})

test("onramp works fine", async () => {
    const username = "Nishant" + Math.random()
    const password = '123123'

    const signupResponse = await axios.post(`${BACKEND_URL}/signup`, {
        username,
        password
    })
    expect(signupResponse.status).toBe(200)
    expect(signupResponse.data.message).toBe("Signup successfull")

    const signInresponse = await axios.post(`${BACKEND_URL}/signin`, {
        username,
        password
    })
    expect(signInresponse.status).toBe(200)
    expect(signInresponse.data.message).toBe("SignIn successfull")

    const token = signInresponse.data.token

    const onrampResponse = await axios.post(`${BACKEND_URL}/onramp`, {
        usd: 10
    }, {
        headers:{
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })

    console.log("onramp response",onrampResponse.data)
})