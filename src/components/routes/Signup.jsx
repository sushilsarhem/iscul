import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";
import { account } from "../appwrite/appwrite";
import { UserContext } from "../../Context";

export const Signup = () => {
  const { user, SetUser } = useContext(UserContext);

  const [name, SetName] = useState("");
  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");

  // console.log(user);

  const navigate = useNavigate();

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
  }, [user, SetUser, navigate]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await account.create("unique()", email, password, name);

      const session = await account.createEmailPasswordSession(email, password);
      await account.createVerification(
        import.meta.env.VITE_APPWRITE_VERIFY_URL
      );

      // console.log("verification email sent");

      // const response = await databases.createDocument(
      //   import.meta.env.VITE_APPWRITE_USER_DATABASE_ID,
      //   import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID,
      //   "unique()",
      //   {
      //     userId: res.$id,
      //     firstname: firstname,
      //     lastname: lastname,
      //     phone: phone,
      //   }
      // );
      // console.log("Account created");

      SetName("");
      // SetLastName("");
      SetEmail("");
      // SetPhone("");
      SetPassword("");
      navigate("/verifyalert");
    } catch (error) {
      // console.log("ERROR", error);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.brand}>ISKUL</h1>
      {/* <h1 className="signup-heading">Let's get started</h1> */}

      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="name">NAME:</label>
        <input
          type="text"
          name="name"
          value={name}
          onKeyDown={handleKeyDown}
          onChange={(event) => SetName(event.target.value)}
          placeholder=" enter name"
          required
          autoFocus
        />

        <label htmlFor="email">EMAIL:</label>
        <input
          type="email"
          name="email"
          onChange={(event) => SetEmail(event.target.value)}
          value={email}
          placeholder=" enter email address"
          required
        />

        <label htmlFor="password">PASSWORD:</label>
        <input
          type="password"
          name="password"
          onChange={(event) => SetPassword(event.target.value)}
          value={password}
          placeholder=" enter password"
          required
        />

        <button type="submit" className={styles.button}>
          CREATE
        </button>
      </form>
      <Link className={styles.login} to="login">
        click here to Login
      </Link>
    </div>
  );
};

export default Signup;

{
  /* <label htmlFor="lastname">LAST NAME:</label>
        <input
          type="text"
          name="lastname"
          onChange={(event) => SetLastName(event.target.value)}
          value={lastname}
          placeholder=" enter lastname"
          required
        /> */
}

// <label htmlFor="phone">PHONE:</label>
// <input
//   type="phone"
//   name="phone"
//   onChange={(event) => SetPhone(event.target.value)}
//   value={phone}
//   placeholder=" enter phone number"
//   required
// />

// const [lastname, SetLastName] = useState("");

// const [phone, SetPhone] = useState("");
