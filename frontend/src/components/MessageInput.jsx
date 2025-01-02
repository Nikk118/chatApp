import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {

const [text,setText]=useState("");
const {sendMessage}=useChatStore();
const [isSendingMsg,setIsSendingMsg]=useState(false)

const handleSendMessage=async(e)=>{
    e.preventDefault();
    if (!text.trim()||isSendingMsg) {
      return
    }
    setIsSendingMsg(true);
    try {
        await sendMessage({ text: text.trim() });
        setText("");
    } catch (error) {
        console.log("error while sending message");
    }finally{
      setIsSendingMsg(false)
    }
}

  return (
    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
    <div className="flex-1 flex gap-2">
      <input
        type="text"
        className="w-full input input-bordered rounded-lg input-sm sm:input-md"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      </div> 
      <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim()}
        >
          <Send size={22} />
        </button>
      </form>
  )
}

export default MessageInput
