import { useState } from "react";
import "../index.css";
import "./Login.css";

interface LoginProps {
  onLoginSuccess: (username: string, role: string) => void;
}

function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState({ content: "", color: "" });

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setMessage({ content: "", color: "" });

    const endpoint = isRegistering ? "/api/register" : "/api/login";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage({ content: data.error || "Error", color: "orange" });
      return;
    }

    localStorage.setItem("token", data.token);

    if (isRegistering) {
      setMessage({ content: "Registered successfully.", color: "green" });
      setIsRegistering(false);
      setPassword("");
    } else {
      console.log("Loged in:", data.username);
      onLoginSuccess(data.username, data.role);
    }
  };
  return (
    <div className="login-container">
      <h2>{isRegistering ? "Register" : "Login"}</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <input
          className="loginInput"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="loginInput"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          style={{
            fontSize: "min(130%, 14px)",
            borderRadius: "10px",
            padding: "10px",
          }}
          type="submit"
        >
          {isRegistering ? "Register" : "Log in"}
        </button>
      </form>

      {message && <p style={{ color: message.color }}>{message.content}</p>}

      <p
        style={{
          marginTop: "10px",
          fontSize: "min(160%, 18px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        Dont have an account?
        <button
          style={{
            fontSize: "min(70%, 14px)",
            borderRadius: "10px",
            padding: "10px",
          }}
          onClick={() => {
            setIsRegistering(!isRegistering);
            setMessage({ content: "", color: "" });
            setPassword("");
          }}
        >
          {isRegistering ? "Switch to login form" : "Switch to register form"}
        </button>
      </p>
    </div>
  );
}

export default Login;
