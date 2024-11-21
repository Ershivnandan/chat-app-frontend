import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URI,
    withCredentials: true,
    timeout: 120000
});

apiClient.interceptors.request.use(
    function (config){
        const token = localStorage.getItem("authToken");

        config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    function (error){
        return Promise.reject(error)
    }
)

const loginUser =  (data) =>{
    return apiClient.post('users/login', data)
}

const signupUser = (data)=> {
    return apiClient.post('users/signup', data)
}

const googleLogin = () => {
    window.location.href = `${apiClient.defaults.baseURL}users/auth/google`;
  };
  

const getUserChats = () =>{
    return apiClient.get('chats')
}

const getChatsByChatId = (chatId)=>{
    return apiClient.post(`chats/${chatId}`)
}

const sendMessage = (chatData)=>{
    return apiClient.post(`chats/send`, chatData)
}

export{
    loginUser,
    signupUser,
    getUserChats,
    getChatsByChatId,
    sendMessage,
    googleLogin,
}