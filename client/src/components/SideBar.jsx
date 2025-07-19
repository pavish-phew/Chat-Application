import React, { useContext, useEffect, useState } from 'react';
import assets from './../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';

const SideBar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);

  const { logout, onlineUsers } = useContext(AuthContext);

  const [input, setInput] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  useEffect(() => {
    getUsers();
  }, [onlineUsers, unseenMessages]);

  return (
    <div
      className={`bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 h-full px-6 rounded-2xl overflow-y-scroll
    text-slate-100 shadow-2xl border border-slate-700/50 ${
      selectedUser ? 'max-md:hidden' : ''
    }`}
    >
      {/* Sticky logo/menu area with consistent padding */}
      <div className="sticky top-0 z-30 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 -mx-6 px-6 py-4">
        <div className="flex justify-between items-center">
          <img
            src={assets.logo}
            alt="logo"
            className="max-w-40 filter brightness-110"
          />

          {/* Menu with click toggle */}  
          <div className="relative">
            <img
              onClick={() => setMenuOpen((prev) => !prev)}
              src={assets.menu_icon}
              alt="menu"
              className="max-h-5 cursor-pointer hover:scale-110 transition-transform duration-200 filter brightness-125"
            />
            {menuOpen && (
              <div
                className="absolute top-full right-0 z-20 w-36 p-4 rounded-xl mt-2
              bg-slate-800/95 border border-slate-600/70 text-slate-100
              backdrop-blur-sm shadow-xl"
              >
                <p
                  onClick={() => {
                    navigate('/profile');
                    setMenuOpen(false);
                  }}
                  className="cursor-pointer text-sm hover:text-blue-400 transition-colors py-1"
                >
                  Edit Profile
                </p>
                <hr className="my-3 border-t border-slate-600/50" />
                <p
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="cursor-pointer text-sm hover:text-red-400 transition-colors py-1"
                >
                  Logout
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content area with proper spacing */}
      <div className="pt-2">
        {/* Search Box */}
        <div
          className="bg-slate-800/70 rounded-2xl flex items-center gap-3 mb-6
        py-4 px-5 border border-slate-700/50 hover:border-slate-600/70 transition-all duration-200"
        >
          <img
            src={assets.search_icon}
            alt="search"
            className="w-4 opacity-70"
          />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-transparent border-none outline-none
            text-slate-100 text-sm placeholder-slate-400 flex-1"
            placeholder="Search conversations..."
          />
        </div>

        {/* User List */}
        <div className="flex flex-col space-y-2">
          {filteredUsers.map((user, index) => (
            <div
              onClick={() => {
                setSelectedUser(user);
                setUnseenMessages((prev) => ({
                  ...prev,
                  [user._id]: 0,
                }));
              }}
              key={index}
              className={`relative flex items-center gap-4 p-4 pl-5
              rounded-xl cursor-pointer max-sm:text-sm transition-all duration-200 hover:bg-slate-800/50 
              ${
                selectedUser?._id === user._id &&
                'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 shadow-lg'
              }`}
            >
              <div className="relative">
                <img
                  src={user?.profilePic || assets.avatar_icon}
                  alt=""
                  className="w-12 h-12 rounded-full border-2 border-slate-600/50 shadow-md"
                />
                {onlineUsers.includes(user._id) && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-800 shadow-sm"></div>
                )}
              </div>
              <div className="flex flex-col leading-6 flex-1">
                <p className="font-medium text-slate-100">{user.fullName}</p>
                {onlineUsers.includes(user._id) ? (
                  <span className="text-green-400 text-xs font-medium">
                    Active now
                  </span>
                ) : (
                  <span className="text-slate-400 text-xs">Offline</span>
                )}
              </div>
              {unseenMessages[user._id] > 0 && (
                <div
                  className="absolute top-3 right-4 text-xs h-6 w-6
                flex justify-center items-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 
                text-white font-bold shadow-lg animate-pulse"
                >
                  {unseenMessages[user._id]}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideBar;