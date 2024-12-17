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
  return apiClient.post("/users/login", data);
};

const signupUser = (data) => {
  return apiClient.post("/users/signup", data);
};

const googleLogin = () => {
  window.location.href = `${apiClient.defaults.baseURL}users/auth/google`;
};

const getUserChats = () => {
  return apiClient.get("/chats");
};

const getChatsByChatId = (chatId) => {
  return apiClient.post(`/chats/${chatId}`);
};

const sendMessage = (chatData) => {
  return apiClient.post(`/chats/send`, chatData);
};

const getUserDetails = async() => {
  try {
    const res =  await apiClient.get(`/users/getUser`);
    return res
  } catch (error) {
    return error
  }
};

const getUserByName = async (query) => {
  const res = await apiClient.get(`/users/getuserbyname?userName=${query}`);
  return res;
};

const addFriend = async (data) => {
  console.log(data)
  try {
    return await apiClient.post(`/friends/send-request`, data);
  } catch (error) {
    return error
  }
};

const getAllFriendRequests = async()=>{
  try {
    return await apiClient.get(`/friends/getAll-request`)
  } catch (error) {
    return error
  }
}

const acceptFriendRequest = async(data)=>{
  console.log(data)
  try {
    const res = await apiClient.post(`/friends/accept-request`, data);
    return res
  } catch (error) {
    return error
  }
}

const rejectFriendRequest = async(data)=>{
  try {
    const res = await apiClient.post(`/friends/reject-request`, data);
    return res
  } catch (error) {
    return error
  }
}

const getNotifications = async()=>{
  try {
    const res = await apiClient.get('/notifications/getNotification');
    return res
  } catch (error) {
    return error
  }
}

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
  getAllFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  getNotifications
};
