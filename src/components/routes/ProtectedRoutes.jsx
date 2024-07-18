import React, { useContext, useState } from "react";
import { UserContext } from "../../Context";
import { Link, Navigate, Outlet } from "react-router-dom";
import { Logout } from "./Logout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons/faBars";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import styles from "./ProtectedRoutes.module.css";

export const ProtectedRoutes = () => {
  const { logout } = Logout();
  const { user } = useContext(UserContext);
  const [isClicked, setIsClicked] = useState(false);

  function handleMenuClick() {
    setIsClicked(!isClicked);
    // console.log(isClicked);
  }
  return user ? (
    <div className={styles.wrapper}>
      <div className={styles.navbar}>
        <Link to="profile">
          <h1
            style={{
              backgroundColor: "#165a72",
              textAlign: "center",
              color: "whitesmoke",
              fontFamily: "Arial, Helvetica, sans-serif",
            }}
          >
            ISCUL
          </h1>
        </Link>

        <FontAwesomeIcon
          icon={isClicked ? faXmark : faBars}
          className={`${styles.menu_icon} ${isClicked ? styles.active : ""}`}
          onClick={handleMenuClick}
        />

        <div
          className={`${styles.logout_button}  ${
            isClicked ? styles.active : ""
          }`}
        >
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <Outlet />
    </div>
  ) : (
    <Navigate to="/login" replace />
  );
};
