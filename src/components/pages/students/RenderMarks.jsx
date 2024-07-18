import React, { useEffect, useState } from "react";
import databases, { getCurrentUser, Query } from "../../appwrite/appwrite";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import styles from "./RenderMarks.module.css";

const RenderMarks = ({
  assesstmentType,
  assesmentCollectionId,
  submitCount,
}) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [studentsList, setStudentList] = useState(null);

  useEffect(() => {
    if (assesmentCollectionId) {
      fetchUser();
    }
  }, [assesmentCollectionId, submitCount]);

  // fetch user and students exan report
  const fetchUser = async () => {
    try {
      const user = await getCurrentUser();
      setUser(user);
      setLoading(false);
      const userID = user.$id;
      const classno = user.class;
      const section = user.section;
      //   console.log(classno);
      // fetch student marks
      if (user) {
        try {
          const res = await databases.listDocuments(
            import.meta.env.VITE_APPWRITE_USER_DATABASE_ID,
            assesmentCollectionId,
            [Query.equal("teacherId", userID)],
            [Query.equal("class", classno)],
            [Query.equal("section", section)]
          );
          const stud = res.documents;
          // setStudentList(stud);
          // console.log(res.documents);
          const newSortedData = stud.sort(
            (a, b) => b.percentage - a.percentage
          );
          setStudentList(newSortedData);
          // console.log(newSortedData);
        } catch (error) {
          // console.log("unable to fetch assessment data", error);
        }
      }
    } catch (error) {
      // console.log(error);
      setLoading(true);
    }
  };

  // function to delete students exam data if there is mistake
  const deleteData = async (documentID) => {
    try {
      const res = await databases.deleteDocument(
        import.meta.env.VITE_APPWRITE_USER_DATABASE_ID,
        assesmentCollectionId,
        documentID
      );
      if (res) {
        fetchUser();
        // console.log("document deleted");
      }
    } catch (error) {
      // console.log("Error deleting data", error);
    }
  };

  // function to calculate ranks

  if (loading) {
    <h1>loading</h1>;
  }

  return (
    <div className={styles.wrapper}>
      <h2>{`${assesstmentType} report`}</h2>
      {studentsList && studentsList.length ? (
        studentsList.map((data, index = 0) => (
          <div key={index} className={styles.container}>
            <div className={styles.items}>
              <label htmlFor="rollno">Rollno</label>
              <input type="text" value={data.rollno} readOnly />
            </div>
            <div className={`${styles.name} ${styles.items}`}>
              <label htmlFor="rollno">Name</label>
              <input type="text" value={data.name} readOnly />
            </div>
            <div className={styles.items}>
              <label htmlFor="rollno">Class</label>
              <input type="text" value={data.class} readOnly />
            </div>
            <div className={styles.items}>
              <label htmlFor="rollno">Section</label>
              <input type="text" value={data.section} readOnly />
            </div>
            <div className={styles.items}>
              <label htmlFor="rollno">English</label>
              <input type="text" value={data.english} readOnly />
            </div>
            <div className={styles.items}>
              <label htmlFor="rollno">Science</label>
              <input type="text" value={data.science} readOnly />
            </div>
            <div className={styles.items}>
              <label htmlFor="rollno">S.Sc</label>
              <input type="text" value={data.sscience} readOnly />
            </div>
            <div className={styles.items}>
              <label htmlFor="rollno">M.M</label>
              <input type="text" value={data.meiteimayek} readOnly />
            </div>
            <div className={styles.items}>
              <label htmlFor="rollno">Hindi</label>
              <input type="text" value={data.hindi} readOnly />
            </div>
            <div className={styles.items}>
              <label htmlFor="rollno">Maths</label>
              <input type="text" value={data.maths} readOnly />
            </div>
            <div className={styles.items}>
              <label htmlFor="rollno">Computer</label>
              <input type="text" value={data.computer} readOnly />
            </div>
            <div className={styles.items}>
              <label htmlFor="rollno">G.K</label>
              <input type="text" value={data.gk} readOnly />
            </div>
            <div className={styles.items}>
              <label htmlFor="rollno">Arts</label>
              <input type="text" value={data.arts} readOnly />
            </div>
            <div className={styles.items}>
              <label htmlFor="rollno">Dictation</label>
              <input type="text" value={data.dictation} readOnly />
            </div>
            <div className={styles.items}>
              <label htmlFor="fullmark">F.M</label>
              <input type="text" value={data.fullmark} readOnly />
            </div>
            <div className={styles.items}>
              <label htmlFor="passmark">P.M</label>
              <input type="text" value={data.passmark} readOnly />
            </div>
            <div className={styles.items}>
              <label htmlFor="total">Total</label>
              <input type="text" value={data.total} readOnly />
            </div>
            <div className={styles.items}>
              <label htmlFor="percent">P.C</label>
              <input type="text" value={data.percentage} readOnly />
            </div>
            {/* {assesstmentType === "Half Yearly" && (
              <>
                <div className={styles.items}>
                  <label htmlFor="books">Books</label>
                  <input type="text" value={data.books} readOnly />
                </div>
                <div className={styles.items}>
                  <label htmlFor="enrich">Enrich</label>
                  <input type="text" value={data.enrich} readOnly />
                </div>
              </>
            )} */}
            <div className={styles.items}>
              <label htmlFor="status">Status</label>
              <input
                type="text"
                value={data.status}
                style={{
                  color: "white",
                  backgroundColor: `${data.status == "PASS" ? "green" : "red"}`,
                }}
                readOnly
              />
            </div>

            <div className={styles.items}>
              <label htmlFor="rank">Rank</label>
              <input
                type="text"
                value={`${data.status === "PASS" ? index + 1 : "nil"}`}
                readOnly
              />
            </div>

            {/* this will be used for editing in future
            <div className={styles.icons}>
              <FontAwesomeIcon
                icon={faPenToSquare}
                style={{ color: "green" }}
              />
            </div> */}
            <div className={styles.icons}>
              <FontAwesomeIcon
                icon={faTrashCan}
                style={{ color: "#be2625" }}
                onClick={() => deleteData(data.$id)}
              />
            </div>
            {/*  this will be used for saving in future
            <div className={styles.icons}>
              <FontAwesomeIcon icon={faFloppyDisk} style={{ color: "green" }} />
            </div> */}
          </div>
        ))
      ) : (
        <p>"no data found!"</p>
      )}
    </div>
  );
};

export default RenderMarks;
