import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./App.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }
    
    try {
      const res = await axios.post("https://registrationform-ls2p.onrender.com", { email, password });
      localStorage.setItem("token", res.data.token);
      alert("Login successful");
      navigate("/home");
    } catch (err) {
      console.error("Login error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
        <p><Link to="/">Don't have an account? Register</Link></p>
      </form>
    </div>
  );
}

export default Login;
