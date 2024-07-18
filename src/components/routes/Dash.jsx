import React from "react";
import { Logout } from "./Logout";
import styles from "./Dash.module.css";
import lists from "../utils/DashComponents";
import { Link } from "react-router-dom";

const Dash = () => {
  // const { logout } = Logout();
  // console.log("Dash");
  return (
    <div className={styles.wrapper}>
      <h1>Dashboard</h1>
      <ul className={styles.lists}>
        {lists.map((list) => (
          <Link key={list.id} to={list.link}>
            <li>{list.title}</li>
          </Link>
        ))}
      </ul>

      {/* <button onClick={logout}>Logout</button> */}
    </div>
  );
};

export default Dash;
