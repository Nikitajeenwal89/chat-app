import express from "express";
import {Signup,login,updateProfile,checkAuth}from "../controllers/userController.js";
import { protectRoute } from "../Middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", Signup);
userRouter.post("/login", login);
userRouter.put("/update-profile", protectRoute, updateProfile);
userRouter.get("/check", protectRoute, checkAuth);

export default userRouter;