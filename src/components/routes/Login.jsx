import React, { useEffect } from "react";
import styles from "./Login.module.css";
import { UserContext } from "../../Context";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { account } from "../appwrite/appwrite";

const Login = () => {
  const navigate = useNavigate();
  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");
  const { user, SetUser } = useContext(UserContext);
  const [loginError, setLoginError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Check if user is already logged in
    const checkUserSession = async () => {
      try {
        const userData = await account.get(); // Assumes `account.get()` fetches current user session
        if (userData) {
          SetUser(true);
          navigate("/profile");
        }
      } catch (error) {
        // console.log("No active session found", error);
      }
    };

    checkUserSession();
  }, [SetUser, navigate]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const res = await account.createEmailPasswordSession(email, password);
      SetEmail("");
      SetPassword("");
      if (res) {
        SetUser(true);
        // console.log("Login Successsful");
        // console.log(res);
        navigate("/profile");
      }
    } catch (error) {
      setLoginError(true);
      setErrorMessage("Invalid credentials. Please try again.");
      alert("Unable to login!");
      // console.error("Login error:", error);
    }
  }
  return (
    <div className={styles.wrapper}>
      <h1>ISCUL</h1>
      {loginError && <p className={styles.errorMessage}>{errorMessage}</p>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="email">EMAIL:</label>
        <input
          className={loginError ? styles.inputerror : ""}
          type="email"
          name="email"
          placeholder="enter email"
          value={email}
          onKeyDown={handleKeyDown}
          onChange={(event) => SetEmail(event.target.value)}
          autoFocus
          required
        />

        <label htmlFor="password">PASSWORD:</label>
        <input
          className={loginError ? styles.inputerror : ""}
          type="password"
          name="password"
          placeholder="enter password"
          value={password}
          onChange={(event) => SetPassword(event.target.value)}
          required
        />

        <button type="submit">LOGIN</button>
      </form>
      <Link className={styles.signup} to="/">
        Click here to Signup
      </Link>
    </div>
  );
};

export default Login;
