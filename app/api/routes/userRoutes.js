import express from "express";
import { signUp, signIn, verifyAadhaar } from "../controllers/userController";

const router = express.Router();

router.post("/signup", signUp);

router.post("/signin", signIn);

router.post("/verify-aadhaar", verifyAadhaar);

export default router;
