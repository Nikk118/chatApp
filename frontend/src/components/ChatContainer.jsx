import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { useAuthStore } from "../store/useAuthStore";
import {formatMessageTime} from "../lib/utils"
import MessageSkeleton from "./MessageSkeleton";

const ChatContainer = () => {
  const { messages, getMessages,
     isMessagesLoading, selectedUser,subscribeToMessages,unsubscribefromMessages } =useChatStore();
  const { authUser } = useAuthStore();
  const messageref=useRef(null)

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return ()=> unsubscribefromMessages();
  }, [selectedUser, getMessages,subscribeToMessages,unsubscribefromMessages]);

useEffect(()=>{
  if (messageref.current && messages) {
    
    messageref.current.scrollIntoView({ behavior: "smooth" });
  }
    
},[messages])

if (isMessagesLoading) {
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <MessageSkeleton />
      <MessageInput />
    </div>
  );
}

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
           ref={messageref}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePicture || "/vite.svg"
                      : selectedUser.profilePicture || "/vite.svg"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
