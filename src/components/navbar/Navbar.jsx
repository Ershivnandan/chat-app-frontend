import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import ThemeSwitch from "../theme/ThemeSwitch";
import { useAuth } from "../../context/AuthContext";
import {
  addFriend,
  getUserByName,
  getNotifications,
  getAllFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
} from "../../api/apiStore";
import { FaBell } from "react-icons/fa";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const Navbar = () => {
  const { user, userData, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationDropdownVisible, setIsNotificationDropdownVisible] =
    useState(false);
  const [isProfileDropdownVisible, setIsProfileDropdownVisible] =
    useState(false);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);

  const socket = io(import.meta.env.VITE_SERVER_URI);


  useEffect(() => {
    if (user) {
      socket.emit("join", { userId: user._id });

      // Listen for notifications
      socket.on("new_notification", (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        toast.info(notification.message); // Customize toast messages
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Fetch users based on search input
  const fetchUsers = async (query) => {
    if (!query) {
      setUsers([]);
      setIsDropdownVisible(false);
      return;
    }

    try {
      setIsSearching(true);
      const response = await getUserByName(query);
      setUsers(response.data.users);
      setIsDropdownVisible(true);
      setIsSearching(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setIsSearching(false);
    }
  };

  const debouncedFetchUsers = useCallback(debounce(fetchUsers, 400), []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedFetchUsers(value);
  };

  const handleAddFriend = async (friendId) => {
    try {
      const response = await addFriend({ friendId });
      toast.success("Friend request sent!");
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error("Failed to send friend request.");
    }
  };

  const fetchNotificationsAndFriendRequests = async () => {
    try {
      const [notificationsResponse, friendRequestsResponse] = await Promise.all([
        getNotifications(),          
        getAllFriendRequests()   
      ]);


      const mergedNotifications = [
        ...notificationsResponse.data,
        ...friendRequestsResponse.data,
      ];
      console.log(mergedNotifications)

      mergedNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(mergedNotifications);
   
    } catch (error) {
      console.error("Error fetching notifications and friend requests:", error);
    }
  };

  const handleAcceptRequest = async (requestId, username) => {
    try {
      const res = await acceptFriendRequest({ requestId });
      toast.success(`${username} is now your friend`);
      // Remove the notification for this accepted request
      setNotifications((prev) => prev.filter((notif) => notif._id !== requestId));
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleRejectRequest = async (requestId, username) => {
    try {
      const res = await rejectFriendRequest({ requestId });
      toast.warn(`${username}'s request has been removed`);
      // Remove the notification for this rejected request
      setNotifications((prev) => prev.filter((notif) => notif._id !== requestId));
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotificationsAndFriendRequests();
    }
  }, [user]);

  const toggleNotificationDropdown = () => {
    setIsNotificationDropdownVisible((prev) => !prev);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownVisible((prev) => !prev);
  };

  const toggleProfileModal = () => {
    setIsProfileModalVisible((prev) => !prev);
  };

  return (
    <div className="pt-2">
      {!user ? (
        <nav className="flex justify-between py-1 border border-black dark:border-white px-10 mx-5 rounded-full t-2 items-center">
          <div className="flex text-center items-center flex-col p-1">
            <img className="w-8" src="/logo.png" alt="" />
            <p className="font-extrabold text-gray-700 dark:text-gray-200 text-base">
              S <span className="font-medium text-gray-500">chat</span>
            </p>
          </div>
          <div className="flex justify-center gap-2 items-center">
            <ul className="flex gap-4 cursor-pointer font-medium">
              <li>About</li>
              <Link to={"/login"}>
                <li>Login</li>
              </Link>
            </ul>
            <ThemeSwitch />
          </div>
        </nav>
      ) : (
        <nav className=" text-white py-2 px-5 flex items-center">
          {/* Search bar */}
          <div className="w-[30%] relative flex justify-start">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search for users..."
              className="border border-gray-400 text-black rounded px-2 py-1 w-full"
            />
            {isSearching && <p className="text-gray-500 mt-2">Searching...</p>}
            {isDropdownVisible && users.length > 0 && (
              <div className="shadow-md mt-2 rounded w-80 max-h-60 overflow-y-auto absolute bg-gray-500 top-7">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="p-2 hover:bg-gray-400 cursor-pointer flex justify-between items-center"
                    onClick={() => handleAddFriend(user._id)}
                  >
                    <span>{user.username}</span>
                    <button className="bg-blue-500 text-white px-3 py-1 rounded">
                      Add Friend
                    </button>
                  </div>
                ))}
              </div>
            )}
            {isDropdownVisible && users.length === 0 && (
              <p className="text-gray-500 mt-2">No users found.</p>
            )}
          </div>

          <div className="w-full flex items-center gap-10 justify-end">
            {/* Notifications */}
            <div className="relative">
              <button
                className="relative focus:outline-none"
                onClick={toggleNotificationDropdown}
              >
                <FaBell className="text-xl" />
                {notifications && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1">
                    {notifications.length || 0}
                  </span>
                )}
              </button>

              {isNotificationDropdownVisible && (
                <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded max-h-60 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification._id}
                        className="p-2 hover:bg-gray-100 border-b flex justify-between items-center text-black"
                      >
                        <span>{notification.message}</span>
                        {notification.status === "pending" && (
                          <div className="flex gap-2 text-black">
                            <button
                              onClick={() =>
                                handleAcceptRequest(
                                  notification._id,
                                  notification.senderId.username
                                )
                              }
                              className="bg-green-500 text-white px-3 py-1 rounded"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() =>
                                handleRejectRequest(
                                  notification._id,
                                  notification.senderId.username
                                )
                              }
                              className="bg-red-500 text-white px-3 py-1 rounded"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {/* Show "Request Rejected" message for rejected friend requests */}
                        {notification.type === "friend_request_rejected" && (
                          <div className="text-red-500 text-sm">Request Rejected</div>
                        )}
                        {/* Show "Request Accepted" message for accepted friend requests */}
                        {notification.type === "friend_request_accepted" && (
                          <div className="text-green-500 text-sm">Request Accepted</div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="p-2 text-gray-500">No notifications</p>
                  )}
                </div>
              )}
            </div>

            {/* Profile and Dropdown */}
            <div className="relative">
              <div
                className="flex flex-col justify-center items-center gap-1 cursor-pointer"
                onClick={toggleProfileDropdown}
              >
                <img
                  src={userData?.profileImage || "/user.png"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
                <span>{userData?.username}</span>
              </div>

              {isProfileDropdownVisible && (
                <div className="absolute right-0 mt-2 bg-gray-500 text-black shadow-lg rounded flex flex-col gap-1 items-start">
                  <div
                    className="py-2 w-full cursor-pointer px-5 hover:bg-gray-400"
                    onClick={toggleProfileModal}
                  >
                    Update Profile
                  </div>
                  <div className="py-2 cursor-pointer px-5 hover:bg-gray-400 text-black flex items-center ">
                    <ThemeSwitch /> <span>Theme</span>
                  </div>
                  <div
                    className="py-2 w-full cursor-pointer px-5 hover:bg-gray-400"
                    onClick={logout}
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
      )}

      {/* Profile Modal */}
      {isProfileModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            {/* Profile update form goes here */}
            <h2 className="text-xl">Update Profile</h2>
            <button onClick={toggleProfileModal} className="mt-4 text-red-500">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
