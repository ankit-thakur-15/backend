import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

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

export default router