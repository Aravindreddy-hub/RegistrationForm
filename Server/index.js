const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection - Replace with your MongoDB Atlas connection string
// For local development, use: "mongodb://127.0.0.1:27017/facebook-clone"
// For production/sharing, use MongoDB Atlas connection string
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://aravind1:Ramlaxman@cluster0.yq3mrlk.mongodb.net/facebook-clone?retryWrites=true&w=majority";

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

        const token = jwt.sign({ id: user._id }, "secretkey", { expiresIn: "1h" });
        res.json({ message: "Login successful", token, user });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error during login" });
    }
});

app.listen(5000, '0.0.0.0', () => {
    console.log("Server running on http://localhost:5000");
    console.log("Server accessible from other devices on your network");
});

// Export for Vercel
module.exports = app;
