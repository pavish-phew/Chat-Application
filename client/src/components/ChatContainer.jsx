import React, { useContext, useEffect, useRef, useState } from 'react';
import assets from '../assets/assets';
import { formatMessageTime } from '../lib/utils';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ChatContainer = () => {
  const {
    messages,
    selectedUser,
    setSelectedUser,
    sendMessage,
    getMessages,
  } = useContext(ChatContext);

  const { authUser, onlineUsers } = useContext(AuthContext);

  const chatAreaRef = useRef(null); // Ref for chat scroll container
  const scrollEnd = useRef(null);   // Ref for bottom of chat
  const [input, setInput] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Send message handler
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (input.trim() === '') return;
    await sendMessage({ text: input.trim() });
    setInput('');
  };

  // Send image handler
  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Select an image file');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  // Fetch messages on selected user change
  useEffect(() => {
    if (selectedUser) getMessages(selectedUser._id);
    // eslint-disable-next-line
  }, [selectedUser,messages]);

  

  // Show scroll button when not near bottom
  useEffect(() => {
    const chatArea = chatAreaRef.current;
    if (!chatArea) return;
    const handleScroll = () => {
      const threshold = 200;
      const isNearBottom =
        chatArea.scrollHeight - chatArea.scrollTop - chatArea.clientHeight < threshold;
      setShowScrollButton(!isNearBottom);
    };

    chatArea.addEventListener('scroll', handleScroll);
    return () => chatArea.removeEventListener('scroll', handleScroll);
  }, []);

  return selectedUser ? (
    <div className="h-full overflow-scroll relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="flex items-center gap-4 py-4 mx-6 border-b border-slate-700/50 bg-slate-800/30 backdrop-blur-sm rounded-t-2xl">
        <div className="relative">
          <img
            src={selectedUser.profilePic || assets.avatar_icon}
            alt=""
            className="w-10 h-10 rounded-full border-2 border-slate-600/50 shadow-md"
          />
          {onlineUsers.includes(selectedUser._id) && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-800"></div>
          )}
        </div>
        <div className="flex-1">
          <p className="text-lg font-medium text-slate-100">{selectedUser.fullName}</p>
          <span className={`text-xs font-medium ${
            onlineUsers.includes(selectedUser._id) ? 'text-green-400' : 'text-slate-400'
          }`}>
            {onlineUsers.includes(selectedUser._id) ? 'Active now' : 'Offline'}
          </span>
        </div>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt=""
          className="md:hidden max-w-7 cursor-pointer hover:scale-110 transition-transform duration-200 filter brightness-125"
        />
        <img src={assets.help_icon} alt="" className="max-md:hidden max-w-5 cursor-pointer hover:scale-110 transition-transform duration-200 filter brightness-125" />
      </div>

      {/* Chat area */}
      <div
        ref={chatAreaRef}
        className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-4 pb-12 bg-slate-900/50"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-3 mb-4 ${
              msg.senderId === authUser._id ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.senderId !== authUser._id && (
              <div className="flex flex-col items-center">
                <img
                  src={selectedUser?.profilePic || assets.avatar_icon}
                  alt=""
                  className="w-8 h-8 rounded-full border-2 border-slate-600/50"
                />
                <p className="text-xs text-slate-400 mt-1">{formatMessageTime(msg.createdAt)}</p>
              </div>
            )}

            <div className={`max-w-xs lg:max-w-md ${
              msg.senderId === authUser._id ? 'order-1' : 'order-2'
            }`}>
              {msg.image ? (
                <img
                  src={msg.image}
                  alt=""
                  className="max-w-[280px] border border-slate-600/50 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div
                  className={`px-4 py-3 rounded-2xl shadow-md ${
                    msg.senderId === authUser._id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md'
                      : 'bg-slate-700/70 text-slate-100 rounded-bl-md border border-slate-600/50'
                  }`}
                >
                  <p className="text-sm leading-relaxed break-words">{msg.text}</p>
                </div>
              )}
            </div>

            {msg.senderId === authUser._id && (
              <div className="flex flex-col items-center order-2">
                <img
                  src={authUser?.profilePic || assets.avatar_icon}
                  alt=""
                  className="w-8 h-8 rounded-full border-2 border-slate-600/50"
                />
                <p className="text-xs text-slate-400 mt-1">{formatMessageTime(msg.createdAt)}</p>
              </div>
            )}
          </div>
        ))}
        <div ref={scrollEnd} />
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
         <button
            onClick={() =>
            scrollEnd.current?.scrollIntoView({ behavior: 'smooth' })
          }
            className='fixed bottom-24 right-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 z-10 group hover:scale-110'
            title='Scroll to bottom'
          >
            <svg 
              className='w-5 h-5 group-hover:translate-y-0.5 transition-transform' 
              fill='currentColor' 
              viewBox='0 0 20 20'
            >
              <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z' clipRule='evenodd' />
            </svg>
          </button>
      )}

      {/* Bottom area input */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-4 p-4 bg-slate-800/80 backdrop-blur-sm border-t border-slate-700/50">
        <div className="flex-1 flex items-center bg-slate-700/50 px-4 py-2 rounded-2xl border border-slate-600/50 hover:border-slate-500/70 transition-all duration-200">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) => (e.key === 'Enter' ? handleSendMessage(e) : null)}
            type="text"
            placeholder="Type your message..."
            className="flex-1 text-sm py-2 bg-transparent border-none outline-none text-slate-100 placeholder-slate-400"
          />
          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept="image/png, image/jpg"
            hidden
          />
          <label htmlFor="image" className="cursor-pointer hover:scale-110 transition-transform duration-200">
            <img
              src={assets.gallery_icon}
              alt=""
              className="w-5 ml-2 filter brightness-125 hover:brightness-150"
            />
          </label>
        </div>
        <button
          onClick={handleSendMessage}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
        >
          <img
            src={assets.send_button}
            alt=""
            className="w-5 h-5 filter brightness-0 invert"
          />
        </button>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-4 text-slate-400 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 max-md:hidden h-full">
      <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 shadow-xl">
        <img src={assets.logo_icon} alt="" className="max-w-16 mx-auto mb-4 filter brightness-125" />
        <p className="text-xl font-medium text-slate-200 text-center">Chat Anytime, Anywhere</p>
        <p className="text-sm text-slate-400 text-center mt-2">Select a conversation to start messaging</p>
      </div>
    </div>
  );
};

export default ChatContainer;