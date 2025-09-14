const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection using environment variables
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => console.log("MongoDB connected to:", MONGODB_URI.includes('mongodb.net') ? 'Atlas Cloud' : 'Local Database'))
    .catch(err => console.log("MongoDB connection error:", err));

// User Schema
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model("User", UserSchema);

// Register API
app.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        console.log("Registration attempt:", { username, email });

        // Validate input
        if (!username || !email || !password) {
            console.log("Missing fields");
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check for existing email
        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) {
            console.log("Email already exists:", email);
            return res.status(400).json({ message: "Email already exists" });
        }

        // Check for existing username
        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            console.log("Username already exists:", username);
            return res.status(400).json({ message: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });

        await newUser.save();
        console.log("User registered successfully:", username);
        res.json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Registration error:", error);
        if (error.code === 11000) {
            // Duplicate key error
            if (error.keyPattern && error.keyPattern.username) {
                return res.status(400).json({ message: "Username already exists" });
            }
            if (error.keyPattern && error.keyPattern.email) {
                return res.status(400).json({ message: "Email already exists" });
            }
        }
        res.status(500).json({ message: "Server error during registration" });
    }
});

// Login API
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ message: "Login successful", token, user });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error during login" });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log("Server accessible from other devices on your network");
});
