/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import ThemeSwitch from "../theme/ThemeSwitch";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { addFriend, getUserByName } from "../../api/apiStore";

const Navbar = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const fetchUsers = async (query) => {
    if (!query) {
      setUsers([]);
      setIsDropdownVisible(false);
      return;
    }

    try {
      setIsSearching(true);
      const response = await getUserByName(query);
      console.log(response.data.users)
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
      const response = addFriend(friendId)
      console.log("Friend request sent:", response.data);
      alert("Friend request sent!");
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert("Failed to send friend request.");
    }
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
        <nav className="mt-2 text-white p-10">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search for users..."
            className="border border-gray-400 rounded px-2 py-1 w-80"
          />
          {isSearching && <p className="text-gray-500 mt-2">Searching...</p>}
          {isDropdownVisible && users.length > 0 && (
            <div className=" shadow-md mt-2 rounded w-80 max-h-60 overflow-y-auto">
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
        </nav>
      )}
    </div>
  );
};

export default Navbar;
