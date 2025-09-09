import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/login", { email, password });
      localStorage.setItem("token", res.data.token);
      alert("Login successful");
      navigate("/home");
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} /><br />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} /><br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
