import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  faSquareCaretDown,
  faSquareCaretUp,
} from "@fortawesome/free-solid-svg-icons";
import databases, {
  getCurrentUser,
  fetchUserData,
  ID,
  Query,
} from "../../appwrite/appwrite";
import styles from "./RenderAsst.module.css";

const RenderAssestment = ({ formData, handleSubmit }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [active, setActive] = useState({});

  useEffect(() => {
    getUser();
  }, [handleSubmit]);

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
          // console.log("User Data:", data);
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
      const updatedData = data.documents.map((doc) => ({
        ...doc,
        allSubjects: [...doc.mainSubjects, ...doc.optionals],
      }));
      setUserData(updatedData);

      // console.log(data.documents);
    } catch (error) {
      // console.log("error fetching assesstment list", error);
    }
  };

  // function to delete assestment
  const handleDelete = async (documentId) => {
    try {
      const res = await databases.deleteDocument(
        import.meta.env.VITE_APPWRITE_USER_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_ASSTMNT_SETTING_COLLECTION,
        documentId
      );

      // console.log("deleted assessment documentID is:", documentId);
      // console.log("Assesstment deleted!");
      fetchAssmnt();
    } catch (error) {
      // console.log("Unable to delete assesstment", error);
    }
  };

  // handle dropdown
  function handleDrop(index) {
    setActive((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  }

  if (loading) {
    return <h2>Loading..</h2>;
  }

  return (
    <div className={styles.wrapper}>
      <h3>YOUR ASSESSMENT LIST</h3>

      {userData && userData.length ? (
        userData.map((data, index) => (
          <div key={index} className={styles.container}>
            <div className={styles.accordian}>
              <p>{data.assesstmentType}:</p>
              <FontAwesomeIcon
                icon={active[index] ? faSquareCaretUp : faSquareCaretDown}
                className={styles.icon}
                onClick={() => handleDrop(index)}
              />
            </div>

            <div
              className={`${active[index] ? styles.active : styles.dropDown}`}
            >
              {data.allSubjects.map((sub) => (
                <div>{sub}</div>
              ))}
              <div className={styles.fullmark}>Fullmark:{data.fullmark}</div>
              <div className={styles.passmark}>Passmark:{data.passmark}</div>
              <FontAwesomeIcon
                icon={faTrash}
                className={styles.delete}
                onClick={() => handleDelete(data.$id)}
              />
            </div>
            {/* <div className={styles.three}> */}

            {/* </div> */}
          </div>
        ))
      ) : (
        <p>No assessment found!</p>
      )}
    </div>
  );
};

export default RenderAssestment;

{
  /* <div className={styles.three}>
                <p className={styles.fullmark}>{data.fullmark}</p>
                <p className={styles.passmark}>{data.passmark}</p>
                <FontAwesomeIcon
                  icon={faTrash}
                  className={styles.delete}
                  onClick={() => handleDelete(data.$id)}
                />
              </div> */
}
