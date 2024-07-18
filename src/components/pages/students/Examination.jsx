import React, { useState, useEffect } from "react";
import databases, {
  getCurrentUser,
  fetchUserData,
} from "../../appwrite/appwrite";
import styles from "./Examination.module.css";
import { Link } from "react-router-dom";

const Examination = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    getUser();
  }, []);

  // fetch user data
  async function getUser() {
    try {
      const fetchedUser = await getCurrentUser();
      if (fetchedUser) {
        const documentId = fetchedUser.$id;
        try {
          const data = await fetchUserData(documentId);
          setUser(data);
          if (data) {
            fetchAssmnt();
          }
          //   console.log("User Data:", data);
          setLoading(false);
        } catch (error) {
          // console.error("Error fetching user data:", error);
        }
      }
    } catch (error) {
      // console.error("Error fetching user:", error);
    }
  }

  // fetch aseestment list
  const fetchAssmnt = async () => {
    // const documentId = user.$id;
    try {
      const data = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_USER_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_ASSTMNT_SETTING_COLLECTION
      );
      setUserData(data.documents);
      //   console.log(data.documents);
    } catch (error) {
      // console.log("error fetching assesstment list", error);
    }
  };
  if (loading) {
    return <h2>Loading..</h2>;
  }
  // console.log(userData);
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>SELECT EXAMINATION</h2>
      {userData && userData.length ? (
        userData.map((data, index) => (
          <div key={index} className={styles.container}>
            <Link to="/examcontrol" state={{ data: data }}>
              {data.assesstmentType}
            </Link>
          </div>
        ))
      ) : (
        <h2>Not found!</h2>
      )}
    </div>
  );
};

export default Examination;
