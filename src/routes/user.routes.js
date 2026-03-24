import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verify } from "jsonwebtoken";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([            // this is middleware : is se kya hoga ki app images bhej paoge jab aap post man pe image bhejoge
        {
            name: "avatar",
            maxCount : 1
        },
        {
            name: "coverImage",
            maxCount:1
        }
    ]),
    registerUser
    )
router.route("/login").post(loginUser)

// Secured Routes
router.route("/logout").post(verifyJWT, logoutUser)
export default router