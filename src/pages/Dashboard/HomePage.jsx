import  { useEffect, useState } from "react";
import { socket } from "../../utils/socket/Socket"
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { getUserDetails } from "../../api/apiStore";
import ChatArea from "../../components/chat/ChatArea";


const HomePage = () => {
  const [notifications, setNotifications] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const {userData, setUserData}  = useAuth();

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await axios.get("/friends/getAll-request", {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        setFriendRequests(response.data);
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };

    const fetchChats = async () => {
      try {
        const response = await axios.get("/chats", {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        setChats(response.data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchFriendRequests();
    fetchChats();

    socket.on("friendRequest", (notification) => {
      setNotifications((prev) => [...prev, notification]);
    });

    socket.on("newMessage", (message) => {
      if (message.chatId === activeChat?._id) {
        setMessages((prev) => [...prev, message]);
      } else {
        setNotifications((prev) => [...prev, { type: "message", message }]);
      }
    });

    return () => {
      socket.off("friendRequest");
      socket.off("newMessage");
    };
  }, [activeChat]);

  const handleAcceptRequest = async (requestId) => {
    try {
      await axios.post(
        "/friends/accept-request",
        { requestId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
      );
      setFriendRequests((prev) =>
        prev.filter((request) => request._id !== requestId)
      );
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const openChat = async (chatId) => {
    try {
      setActiveChat(chatId);
      const response = await axios.get(`/chats/${chatId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setMessages(response.data);
    } catch (error) {
      console.error("Error opening chat:", error);
    }
  };

  const sendMessage = async () => {
    try {
      await axios.post(
        "/chats/send",
        { chatId: activeChat, content: newMessage },
        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
      );
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const fetchUserData = async()=>{
    try {
      const res = await getUserDetails();
      setUserData(res.data)
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(()=>{
    fetchUserData()
  },[])

  return (
    <>
      <div className="flex px-5">
        <div className="w-[30%] border border-red-500"></div>
        <div className="w-full border border-e-blue-500">
            <ChatArea/>
        </div>
      </div>
    </>
  );
};

export default HomePage;
