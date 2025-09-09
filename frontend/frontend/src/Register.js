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
        try {
            await axios.post("http://localhost:5000/register", { username, email, password });
            alert("Registration successful");
            navigate("/login");
        } catch (err) {
            alert(err.response.data.message);
        }
    };

    return (
        <div className="form-container">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} /><br />
                <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} /><br />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} /><br />
                <button type="submit">Register</button>
                <Link to="/login">Already have an account? Login</Link>
            </form>
        </div>
    );
}

export default Register;
