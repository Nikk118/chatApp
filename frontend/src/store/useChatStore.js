import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstant } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";


export const useChatStore=create((set,get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,


    getUsers:async()=>{
        try {
            set({isUsersLoading:true});
            const res=await axiosInstant.get("/message/allUsers");
            set({users:res.data.data});
        } catch (error) {
            console.log("error in get users",error);
            toast.error("something went wrong");
           
        }finally{
            set({isUsersLoading:false})
        }
    },

    getMessages:async(userId)=>{
        try {
            set({isMessagesLoading:true});
            const res = await axiosInstant.get(`/message/getMessages/${userId}`);
            set({messages:res.data.data});
        } catch (error) {
            toast.error("something went wrong");
        }finally{
            set({isMessagesLoading:false});
        }
    },


    // todo:optimize later
    setSelectedUser:async(selectedUser)=>{
        set({selectedUser:selectedUser})
    },


    sendMessage:async(messageData)=>{
        const {messages,selectedUser}=get();
        console.log(messageData)
        try {
            const res = await axiosInstant.post(`/message/sendMessage/${selectedUser._id}`, messageData);
            console.log("Message sent successfully:", res.data);
            const updatedMessages = [...messages, res.data.data];
            toast.success("message sent successfully");
            set({ messages: updatedMessages });
        } catch (error) {
            toast.error("something went wrong");
        }
    },


    subscribeToMessages:()=>{
        const {setSelectedUser}=get();
        if (!setSelectedUser) {
            return;
        }

        const socket=useAuthStore.getState().socket;

        const selectedUser=get().selectedUser;

        socket.on("newMessage",(newmessage)=>{
            if(newmessage.senderId!==selectedUser._id) return;

            set({messages:[...get().messages,newmessage]})
        })
    },
    unsubscribefromMessages:()=>{
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },
}))