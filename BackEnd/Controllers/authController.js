const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require("../Models/userModel");

const JWT_SECRET = process.env.JWT_SECRET || "THESECRECTKEY"; // Keep secret in .env

// Register
exports.register = async (req, res) => {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: "Email or Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, username, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "User registered successfully", userId: user._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: "Email and password required" });

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user._id, name: user.name, username: user.username, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

// Logout
exports.logout = async (req, res) => {
    try {
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

// Delete Account
exports.deleteAccount = async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }
    try {
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};
