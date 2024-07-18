import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import databases, { Query, account } from "../../appwrite/appwrite";
import RenderInfo from "./RenderInfo";
import styles from "./Info.module.css";

const Info = () => {
  const [user, setUser] = useState(null);
  const [infoToRender, setInfoToRender] = useState({});

  async function fetchData() {
    try {
      const res = await account.get();
      setUser(res);
      // console.log(res);
      const user = await databases.getDocument(
        import.meta.env.VITE_APPWRITE_USER_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID,
        res.$id
      );
      setInfoToRender(user);
      // console.log(user);
      // if (user.documents.length > 0) {
      //   setInfoToRender(user.documents[0]);
      // }
      setUser(res);
    } catch (error) {
      // console.error("Failed to fetch user data", error);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.info_detail}>
        <p>
          <strong>Name:</strong>
          {`${user.name.charAt(0).toUpperCase()}${user.name.slice(1)}`}
        </p>
        <p>
          <strong>Email:</strong>
          {user.email}
        </p>
      </div>
      <RenderInfo infos={infoToRender} />
      <Link to="/editprofile">
        <button>UPDATE</button>
      </Link>
    </div>
  );
};

export default Info;
