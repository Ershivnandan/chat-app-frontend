import axios from "axios";

const appClient = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URI,
    withCredentials: true,
    timeout: 120000
})

const loginUser = async() =>{
    await axios.post('')
}

export{
    loginUser
}