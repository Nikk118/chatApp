import { create } from "zustand";
import {axiosInstant} from "../lib/axios.js"
import toast from "react-hot-toast";
import { io } from "socket.io-client";



const BASE_URL=import.meta.env.MODE==="development"?"http://localhost:8000":"/";
export const useAuthStore = create((set,get) => ({
  authUser: null,
  isSignUp:false,
  isLogin:false,
  isUpdatingProfile:false,
  isCheckingAuth: true,
  onlineUsers:[],
  socket:null,
 


  checkAuth: async () => {
    try {
      const res = await axiosInstant.get("/user/currentUser");
      // Assuming res.data contains the user data
      set({ authUser: res.data.data });  // Storing only the user data
      get().connectSocket();
    } catch (error) {
      console.log("error", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  
  signup:async(data)=>{
    set({isSignUp:true})
    try {
      const res=await axiosInstant.post("/user/signUp",data);
      set({authUser:res.data.data})
      toast.success("signup successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }finally{
      set({isSignUp:false})
    }
  },

  login:async(data)=>{
    set({isLogin:true})
    try {
      const res = await axiosInstant.post("/user/login",data);
      set({authUser:res.data.data});
      toast.success("logged in successfully");
      get().connectSocket();
    } catch (error) {
      console.log(error.response.data);
       // Output: Invalid credentials
      toast.error(error.response.data.message);
    }
  },
  logout:async()=>{
    try {
      await axiosInstant.get("/user/logout");
      set({authUser:null})
      toast.success("logout successfully");
      get().disconnectSocket();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    try {
      set({ isUpdatingProfile: true });
      const res = await axiosInstant.patch("/user/updateProfile", data);
      console.log(res.data);
  
      set({ authUser: res.data.data }); 
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in updateProfile:", error);
  
      // Check if the error response exists
      const errorMessage = error?.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL,{
      query:{
        userId:authUser._id
      }
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers",(userIds)=>{
      set({onlineUsers:userIds})
    })    
  },
  disconnectSocket: () => {
    if (get().socket?.connected)  get().socket.disconnect();
    
  },
  
}));
