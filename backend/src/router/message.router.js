import { Router } from "express";
import {verifyJWT} from "../middleware/auth.middleware.js"
import {getUserForSidebar,getMessages,sendMessage} from "../controller/message.controller.js"
const router = Router()

router.route("/allUsers").get(verifyJWT,getUserForSidebar)

router.route("/getMessages/:id").get(verifyJWT,getMessages)

router.route("/sendMessage/:id").post(verifyJWT,sendMessage)

export default router
