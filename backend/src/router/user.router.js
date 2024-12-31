import { Router } from "express";
import { userLogin, userSignUp,userLogout,getCurrentUser,updateProfile} from "../controller/user.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router()

router.route("/signUp").post(userSignUp)

router.route("/login").post(userLogin)

router.route("/logout").get(verifyJWT,userLogout)

router.route("/currentUser").get(verifyJWT,getCurrentUser)

router.route("/updateProfile").patch(verifyJWT,upload.single("profilePicture"),updateProfile)


export default router