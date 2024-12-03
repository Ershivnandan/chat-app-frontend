import  { useEffect, useState } from "react";
import { socket } from "../../utils/socket/Socket"
import axios from "axios";


const HomePage = () => {
  const [notifications, setNotifications] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

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

  return (
    <div className="home-page">
      <div className="sidebar">
        <h2>Chats</h2>
        {/* <ul>
          {chats && chats.map((chat) => (
            <li key={chat._id} onClick={() => openChat(chat._id)}>
              Chat with {chat.participants.join(", ")}
            </li>
          ))}
        </ul> */}
      </div>
      <div className="content">
        {activeChat ? (
          <div className="chat-window">
            <h2>Chat</h2>
            <div className="messages">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`message ${
                    message.sender === localStorage.getItem("userId")
                      ? "sent"
                      : "received"
                  }`}
                >
                  {message.content}
                </div>
              ))}
            </div>
            <div className="message-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        ) : (
          <h2>Select a chat to start messaging</h2>
        )}
      </div>
      <div className="notifications">
        <h2>Notifications</h2>
        <ul>
          {notifications.map((notification, index) => (
            <li key={index}>{notification.message}</li>
          ))}
        </ul>
        <h2>Friend Requests</h2>
        {/* <ul>
          {friendRequests && friendRequests.map((request) => (
            <li key={request._id}>
              {request.sender.username}
              <button onClick={() => handleAcceptRequest(request._id)}>
                Accept
              </button>
            </li>
          ))}
        </ul> */}
      </div>
    </div>
  );
};

export default HomePage;
