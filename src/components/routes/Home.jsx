import React from "react";
import { Signup } from "./Signup";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <div className={styles.wrapper}>
      <div className={`${styles.section} ${styles.hidden}`}>
        <img src="/pexels-cottonbro-5076520.jpg" alt="happy using system" />
        <div className={styles.overtop}>
          <h3>WELCOME TO</h3>
          <h1>"ISKUL"</h1>
          <h5>YOUR ULTIMATE PLATFORM FOR STREAMLINED WORK</h5>
          {/* <h4>NOW YOU HAVE THE PLATFORM TO EASE YOUR WORK</h4> */}
          {/* <h2>Welcome to EKUN, your ultimate streamlined work platform.</h2> */}
        </div>
      </div>
      <div className={styles.section}>
        <Signup />
      </div>
    </div>
  );
};

export default Home;
