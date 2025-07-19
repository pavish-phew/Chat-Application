// used to store func or state var for the whole site

import { createContext, useEffect, useState } from "react";
import axios  from 'axios';
import toast from "react-hot-toast";
import {io} from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem("token"));

    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    // check if user is authenticated and if so, set the user data and connect
    // the socket

    const checkAuth = async () => {
        try {
            const {data} = await axios.get("/api/auth/check");
            if(data.success)
            {
                setAuthUser(data.user);
                connectSocket(data.user);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // login func to handle user authentication and socket conn

    const login = async (state, credentials) => {
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credentials);
            if(data.success)
            {
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token);
                localStorage.setItem("token", data.token);
                toast.success(data.message);
            }
            else{
                toast.error(data.message);

            }
        } catch (error) {
            toast.error(error.message);
        }
    }


    // logout func to handle user logout and socket disconnection

    const logout = async () => {
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        axios.defaults.headers.common["token"] = null;
        toast.success("Logged Out Successfully");
        socket.disconnect();
    }

    // update profile func to handle user progfile updates

    const updateProfile = async (body) => {
        try {
            const {data} = await axios.put("/api/auth/update-profile", body);
            if(data.success){
                setAuthUser(data.user);
                toast.success("Profile Updated Successfully");
            }
        } catch (error) {
            toast.error(error.message);    
        }
    }

    // conenct socket func to handle socket conn and online users update

    const connectSocket = (userData) => {
        if(!userData || socket?.connected) {
            return;
        }
        const newSocket = io(backendUrl, {
            query: {
                userId : userData._id,
            }
        });
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds);
        })
    }

    useEffect(() => {
        if(token){
            axios.defaults.headers.common["token"] = token;
        }
        checkAuth()
    },[])

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}