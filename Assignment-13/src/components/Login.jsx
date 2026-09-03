import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const { error } = await login(email, password);

    setSubmitting(false);
    if (error) setError(error.message);
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>MyStore Login</h2>
        <p className="login-subtitle">Sign in to view your cart</p>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && <p className="login-error">{error}</p>}

        {/* Button is type="submit" by default inside a <form>, so the
            form's onSubmit above handles the click — no onClick needed here. */}
        <Button
          label={submitting ? "Signing in..." : "Login"}
          variant="primary"
        />
      </form>
    </div>
  );
}
