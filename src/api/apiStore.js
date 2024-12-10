import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI,
  withCredentials: true,
  timeout: 120000,
});

apiClient.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("authToken");

    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

const loginUser = (data) => {
  return apiClient.post("users/login", data);
};

const signupUser = (data) => {
  return apiClient.post("users/signup", data);
};

const googleLogin = () => {
  window.location.href = `${apiClient.defaults.baseURL}users/auth/google`;
};

const getUserChats = () => {
  return apiClient.get("chats");
};

const getChatsByChatId = (chatId) => {
  return apiClient.post(`chats/${chatId}`);
};

const sendMessage = (chatData) => {
  return apiClient.post(`chats/send`, chatData);
};

const getUserDetails = () => {
  return apiClient.get(`users/getUser`);
};

const getUserByName = async (query) => {
  const res = await apiClient.get(`users/getuserbyname?userName=${query}`);
  return res;
};

const addFriend = async (friendId) => {
  try {
    return await apiClient.post(`friends/send-request`, friendId);
  } catch (error) {
    return error
  }
};

export {
  loginUser,
  signupUser,
  getUserChats,
  getChatsByChatId,
  sendMessage,
  googleLogin,
  getUserDetails,
  getUserByName,
  addFriend,
};
