import React, { useContext, useState } from 'react';
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';

export const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign Up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (currState === "Sign Up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }
    login(currState === "Sign Up" ? 'signup' : 'login', { fullName, email, password, bio });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 
      flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col px-6 py-12">
      
      {/* --- Left Logo --- */}
      <img src={assets.logo_big} alt="logo" className="w-[min(30vw,250px)] drop-shadow-lg" />

      {/* --- Right Form --- */}
      <form
        onSubmit={onSubmitHandler}
        className="bg-slate-800/70 border border-slate-700 text-slate-100 
          p-8 rounded-2xl shadow-xl flex flex-col gap-6 max-w-md w-full"
      >
        <div className="flex justify-between items-center">
          <h2 className="font-medium text-2xl">{currState}</h2>
          {isDataSubmitted && (
            <img
              onClick={() => setIsDataSubmitted(false)}
              src={assets.arrow_icon}
              alt="back"
              className="w-5 cursor-pointer hover:scale-110 transition-transform"
            />
          )}
        </div>

        {currState === "Sign Up" && !isDataSubmitted && (
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name"
            required
            className="p-3 rounded-md bg-slate-700 placeholder-slate-400 border border-slate-600 outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}

        {!isDataSubmitted && (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className="p-3 rounded-md bg-slate-700 placeholder-slate-400 border border-slate-600 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="p-3 rounded-md bg-slate-700 placeholder-slate-400 border border-slate-600 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </>
        )}

        {currState === "Sign Up" && isDataSubmitted && (
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Provide a short bio..."
            required
            className="p-3 rounded-md bg-slate-700 placeholder-slate-400 border border-slate-600 outline-none focus:ring-2 focus:ring-purple-500"
          />
        )}

        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white 
          rounded-md font-medium hover:opacity-90 transition-opacity"
        >
          {currState === "Sign Up" ? "Create Account" : "Login Now"}
        </button>

        <div className="flex items-center gap-2 text-sm text-slate-400">
          <input type="checkbox" className="accent-blue-500" />
          <p>Agree to the terms of use & privacy policy</p>
        </div>

        <div className="text-sm text-slate-400 text-center">
          {currState === "Sign Up" ? (
            <p>
              Already have an account?{" "}
              <span
                onClick={() => {
                  setCurrState("Login");
                  setIsDataSubmitted(false);
                }}
                className="text-blue-400 cursor-pointer font-medium"
              >
                Login here
              </span>
            </p>
          ) : (
            <p>
              Create an account{" "}
              <span
                onClick={() => setCurrState("Sign Up")}
                className="text-purple-400 cursor-pointer font-medium"
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};
