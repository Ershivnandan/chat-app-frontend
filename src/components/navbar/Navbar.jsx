/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import ThemeSwitch from "../theme/ThemeSwitch";
import { useAuth } from "../../context/AuthContext";
import { addFriend, getUserByName, getNotifications, acceptFriendRequest, rejectFriendRequest } from "../../api/apiStore";
import { FaBell } from "react-icons/fa";
import { toast } from "react-toastify";

const Navbar = () => {
  const { user, userData, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationDropdownVisible, setIsNotificationDropdownVisible] =
    useState(false);

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
      const response = await addFriend(friendId);
      alert("Friend request sent!");
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert("Failed to send friend request.");
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      console.log(response);
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleAcceptRequest = async(requestId, username)=>{
    try {
      const res = await acceptFriendRequest({requestId})
      console.log(res)
      toast.success(`${username} is now your friend`)
    } catch (error) {
      console.log(error.message)
    }
  }
  const handleRejectRequest = async(requestId, username)=>{
    try {
      const res = await rejectFriendRequest({requestId});
      console.log(res)
      toast.warn(`${username} request has removed`)
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const toggleNotificationDropdown = () => {
    setIsNotificationDropdownVisible((prev) => !prev);
  };

  return (
    <div className="pt-5">
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
        <nav className="mt-2 text-white p-10 flex items-center justify-between">
          {/* Search bar */}
          <div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search for users..."
              className="border border-gray-400 rounded px-2 py-1 w-80"
            />
            {isSearching && <p className="text-gray-500 mt-2">Searching...</p>}
            {isDropdownVisible && users.length > 0 && (
              <div className="shadow-md mt-2 rounded w-80 max-h-60 overflow-y-auto">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
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

          {/* Notifications */}
          <div className="relative">
            <button
              className="relative focus:outline-none"
              onClick={toggleNotificationDropdown}
            >
              <FaBell className="text-xl" />
              {notifications.length >= 0 && (
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
                      className="p-2 hover:bg-gray-100 border-b flex justify-between items-center"
                    >
                      <span>{notification.message}</span>
                      {notification && (
                        <div className="flex gap-2 text-black">
                          <p>{notification.senderId.username} sent you friend request</p>
                          <button onClick={()=> handleAcceptRequest(notification._id, notification.senderId.username)} className="bg-green-500 text-white px-3 py-1 rounded">
                            Accept
                          </button>
                          <button onClick={()=> handleRejectRequest(notification._id, notification.senderId.username)} className="bg-red-500 text-white px-3 py-1 rounded">
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="p-2 text-gray-500">No notifications</p>
                )}
              </div>
            )}
          </div>

          <ThemeSwitch />
          <div>
            {userData && (
              <p className="dark:text-white text-black">{userData.username}</p>
            )}
          </div>

          <div onClick={logout} className="cursor-pointer">Logout</div>
        </nav>
      )}
    </div>
  );
};

export default Navbar;
