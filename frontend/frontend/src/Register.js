import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./App.css";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!username || !email || !password) {
            alert("Please fill in all fields");
            return;
        }
        
        try {
            await axios.post("http://localhost:5000/register", { username, email, password });
            alert("Registration successful");
            navigate("/login");
        } catch (err) {
            console.error("Registration error:", err);
            if (err.response && err.response.data && err.response.data.message) {
                alert(err.response.data.message);
            } else {
                alert("Registration failed. Please try again.");
            }
        }
    };

    return (
        <div className="form-container">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input 
                    placeholder="Username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                /><br />
                <input 
                    placeholder="Email" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                /><br />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                /><br />
                <button type="submit">Register</button>
                <p><Link to="/login">Already have an account? Login</Link></p>
            </form>
        </div>
    );
}

export default Register;
