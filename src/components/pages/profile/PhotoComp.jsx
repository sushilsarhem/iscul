import React, { useEffect, useState } from "react";
import { account, storage } from "../../appwrite/appwrite";
import styles from "./PhotoComp.module.css";
import ProfilePic from "./ProfilePic";
import CoverPic from "./CoverPic";

const PhotoComp = () => {
  // const [user, setUser] = useState(null);

  // async function fetchUser() {
  //   try {
  //     const data = await account.get();
  //     setUser(data);
  //   } catch (error) {
  //     console.error("Error fetching user account: ", error);
  //   }
  // }

  // useEffect(() => {
  //   fetchUser();
  // }, []);
  return (
    <div className={styles.photo_container}>
      {/* <div className={styles.profile_pic}> */}
      <ProfilePic />
      {/* </div> */}

      {/* <div className={styles.profile_cover}> */}
      <CoverPic />
      {/* </div> */}
    </div>
  );
};

export default PhotoComp;
