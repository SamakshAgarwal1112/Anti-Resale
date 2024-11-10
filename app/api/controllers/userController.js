import User from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const signUp = async (req, res) => {
    const { name, password, profilePicture, aadharNumber, aadharSoftCopy, isOrganization } = req.body;

    try {
        const existingUser = await User.findOne({ aadharNumber });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            aadharNumber,
            password: hashedPassword,
            profilePicture,
            aadharSoftCopy,
            isOrganization
        });

        await user.save();
        return res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        return res.status(500).json({ error: "Error registering user" });
    }
};

export const signIn = async (req, res) => {
    const { aadharNumber, password } = req.body;

    try {
        const user = await User.findOne({ aadharNumber });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid password" });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
        return res.status(200).json({ message: "Login successful", token });

    } catch (error) {
        return res.status(500).json({ error: "Error signing in" });
    }
};

export const verifyAadhaar = async (req, res) => {
    const { aadharNumber } = req.body;

    try {
        const user = await User.findOne({ aadharNumber });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }
        
        return res.status(200).json({profilePicture: profilePicture, aadharSoftCopy: aadharSoftCopy});

    } catch (error) {
        return res.status(500).json({ error: "Error fetching details" });
    }
};
