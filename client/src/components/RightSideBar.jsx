import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'

const RightSideBar = () => {

  const { selectedUser, messages } = useContext(ChatContext)

  const { logout, onlineUsers } = useContext(AuthContext)

  const [msgImages, setMsgImages] = useState([])

  // get all imgs from the msgs and set them to state

  useEffect(() => {
    setMsgImages(
      messages.filter(msg => msg.image).map(msg => msg.image)
    )
  }, [messages])


  return selectedUser && (
    <div className={`bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 w-full relative overflow-y-scroll rounded-l-2xl shadow-2xl border border-slate-700/50
      ${selectedUser ? "max-md:hidden" : ""}`}>

      <div className='pt-8 flex flex-col items-center gap-4 text-sm font-light mx-auto px-6'>
        <div className='relative'>
          <img src={selectedUser?.profilePic || assets.avatar_icon} alt=""
            className='w-24 h-24 rounded-full border-4 border-slate-600/50 shadow-lg' />
          {onlineUsers.includes(selectedUser._id) && (
            <div className='absolute -bottom-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-4 border-slate-800 shadow-md'></div>
          )}
        </div>
        
        <div className='text-center'>
          <h1 className='text-2xl font-semibold text-slate-100 mb-2'>
            {selectedUser.fullName}
          </h1>
          <div className='flex items-center justify-center gap-2 mb-3'>
            <span className={`w-2 h-2 rounded-full ${onlineUsers.includes(selectedUser._id) ? 'bg-green-400' : 'bg-slate-500'}`}></span>
            <span className={`text-sm font-medium ${onlineUsers.includes(selectedUser._id) ? 'text-green-400' : 'text-slate-400'}`}>
              {onlineUsers.includes(selectedUser._id) ? 'Active now' : 'Offline'}
            </span>
          </div>
          <p className='text-slate-300 leading-relaxed'>{selectedUser.bio}</p>
        </div>
      </div>

      <hr className='border-slate-700/50 my-6 mx-6' />
      
      <div className='px-6 text-sm'>
        <div className='flex items-center gap-2 mb-4'>
          <svg className='w-5 h-5 text-slate-400' fill='currentColor' viewBox='0 0 20 20'>
            <path fillRule='evenodd' d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z' clipRule='evenodd' />
          </svg>
          <p className='font-medium text-slate-200'>Media</p>
          <span className='bg-slate-700/50 text-slate-300 text-xs px-2 py-1 rounded-full'>{msgImages.length}</span>
        </div>
        
        {msgImages.length > 0 ? (
          <div className='max-h-[250px] overflow-y-scroll grid grid-cols-2 gap-3 pr-2'>
            {msgImages.map((url, index) => (
              <div key={index} onClick={() => window.open(url)}
                className='cursor-pointer rounded-xl overflow-hidden hover:scale-105 transition-transform duration-200 shadow-md border border-slate-700/50'>
                <img src={url} alt="" className='w-full h-20 object-cover hover:brightness-110 transition-all duration-200' />
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center py-8 text-slate-400'>
            <svg className='w-12 h-12 mx-auto mb-3 opacity-50' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z' clipRule='evenodd' />
            </svg>
            <p className='text-sm'>No media shared yet</p>
          </div>
        )}
      </div>

      <div className='absolute bottom-6 left-1/2 transform -translate-x-1/2 w-full px-6'>
        <button onClick={() => logout()}
          className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none text-sm font-medium py-3 px-6 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 shadow-lg'>
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default RightSideBar