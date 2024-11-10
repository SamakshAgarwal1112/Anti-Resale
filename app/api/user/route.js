// File: app/api/user/route.js
import { signUp, signIn, verifyAadhaar } from "../../controllers/userController";

export async function POST(req, res) {
    if (req.url === '/signup') {
        return signUp(req, res);
    }
    if (req.url === '/signin') {
        return signIn(req, res);
    }
    if (req.url === '/verifyAadhaar') {
        return verifyAadhaar(req, res);
    }
    res.status(404).json({ error: "Route not found" });
}
