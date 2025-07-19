import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';

export const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);

  const [selectedImg, setSelectedImg] = useState(null);
  const navigate = useNavigate();

  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImg) {
      await updateProfile({ fullName: name, bio });
      navigate('/');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload = async () => {
      const base64Image = reader.result;
      await updateProfile({ profilePic: base64Image, fullName: name, bio });
      navigate('/');
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 
      flex items-center justify-center px-4 py-10">
      
      <div className="w-full max-w-3xl bg-slate-800/70 border border-slate-700 
        rounded-2xl shadow-xl flex items-center justify-between max-sm:flex-col-reverse p-6 gap-6">
        
        {/* --- Left: Form --- */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 flex-1 text-slate-100"
        >
          <h3 className="text-2xl font-semibold">Profile Details</h3>

          {/* Upload Image */}
          <label htmlFor="avatar" className="flex items-center gap-4 cursor-pointer">
            <input
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
              onChange={(e) => setSelectedImg(e.target.files[0])}
            />
            <img
              src={
                selectedImg
                  ? URL.createObjectURL(selectedImg)
                  : authUser?.profilePic || assets.avatar_icon
              }
              alt="avatar"
              className="w-12 h-12 rounded-full border border-slate-600 object-cover"
            />
            <span className="text-sm text-slate-400">Upload Profile Image</span>
          </label>

          {/* Name Input */}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            required
            className="p-3 rounded-md bg-slate-700 placeholder-slate-400 
              border border-slate-600 outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Bio Input */}
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Write a short bio..."
            required
            className="p-3 rounded-md bg-slate-700 placeholder-slate-400 
              border border-slate-600 outline-none focus:ring-2 focus:ring-purple-500"
          />

          {/* Save Button */}
          <button
            type="submit"
            className="py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 
              text-white rounded-full text-lg font-medium hover:opacity-90 transition"
          >
            Save
          </button>
        </form>

        {/* --- Right: Preview Image --- */}
        <img
          className="max-w-44 aspect-square rounded-full object-cover border border-slate-700 
            max-sm:mt-6"
          src={selectedImg ? URL.createObjectURL(selectedImg) : authUser?.profilePic || assets.logo_icon}
          alt="preview"
        />
      </div>
    </div>
  );
};
