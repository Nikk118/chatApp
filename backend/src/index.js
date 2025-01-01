
import dotenv from 'dotenv';
dotenv.config(); 

import connectDB from "./db/index.js"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./router/user.router.js"
import messageRouter from "./router/message.router.js"


import { app, server } from "./utils/socket.js"; 
import path from "path";



app.use(cors({
  origin: "http://localhost:5173",  // Your React app's URL
  credentials: true,  // Allow cookies to be sent
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static("public"))
app.use(cookieParser())

const __dirname=path.resolve();

  
  

app.use("/api/v1/user",userRouter)

app.use("/api/v1/message",messageRouter)

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}
 server.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running hii on port: ${process.env.PORT || 3000}`)
  connectDB()
});



