import express from "express";
import { signUp, signIn, verifyAadhaar } from "../controllers/userController";
import {uploadImage} from '../middlewares/multerMiddlware';

const router = express.Router();

router.post("/signup", uploadImage.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'aadharSoftCopy', maxCount: 1 }
]), signUp);

router.post("/signin", signIn);

router.post("/verify-aadhaar", verifyAadhaar);

export default router;
