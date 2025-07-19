import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";


export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {

    const [messages, setMessages] = useState([]); // for messages
    const [users, setUsers] = useState([]); // for user list
    const [selectedUser, setSelectedUser] = useState(null); // store id of users to whom we want to chat
    const [unseenMessages, setUnseenMessages] = useState({}); // no. of msgs unseen are stored (key : value)

    const {socket, axios} = useContext(AuthContext);

    // func to get all users for sidebar
    const getUsers = async () => {
        try {
           const { data } = await axios.get("/api/messages/users");
           if(data.success) {
            setUsers(data.users);
            setUnseenMessages(data.unseenMessages);
           }
        } catch (error) {
            toast.error(error.message);
        }
    }
    
    // func to get msg for selected user
    
    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`api/messages/${userId}`);
            if(data.success) {
                setMessages(data.messages)
            }
        } catch (error) {
            toast.error(error.message);
        }
    }   

    // func to send msg to selected user
    const sendMessage = async (messageData) => {
        try {
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if(data.success) {
                setMessages((prevMessages) => [...prevMessages, data.newMessage]);
            }
            else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // func to subscribe to msg for selected user (to get mesg instantly)

    const subscribeToMessages = async () => {
        if(!socket) return;

        socket.on("new Message", (newMessage) => {
            if(selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seen = true;
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            } else {
                setUnseenMessages((prevUnseenMessages) => ({
                    ...prevUnseenMessages, [newMessage.senderId] : 
                    prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
                }))
            }
        });
    }

    // func to unsub from msg

    const unSubscribeFromMessages = () => {
        if(socket) {
            socket.off("newMessage");
        }
    }

    useEffect(()=>{
        subscribeToMessages();
        return () => unSubscribeFromMessages();
    },[socket, selectedUser])

    const value = {
        messages, users, selectedUser, getUsers, getMessages,
        sendMessage, setSelectedUser, unseenMessages, setUnseenMessages 
    }

    return (
    <ChatContext.Provider value={value}>
            { children }
    </ChatContext.Provider>
    )
} 