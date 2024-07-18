import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Students.module.css";
import databases, { account, getCurrentUser } from "../../appwrite/appwrite";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchUser();
  }, []);
  const fetchUser = async () => {
    try {
      const user = await getCurrentUser();
      setLoading(false);

      if (user) {
        const fetchStudents = await databases.listDocuments(
          import.meta.env.VITE_APPWRITE_USER_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_STUDENTS_COLLECTION
        );
        const studentList = fetchStudents.documents;
        const newStudent = studentList.sort((a, b) => a.rollno - b.rollno);
        setStudents(newStudent);
        setLoading(false);
        // console.log(students);
      }
    } catch (error) {
      // console.log("fetch Failed!", error);
    }
  };

  if (loading) {
    <h3>Loading...., please wait!</h3>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.col1}>
        {students && students.length > 0 ? (
          students.map((data) => (
            <div key={data.rollno} className={styles.sub_col1}>
              <p className={styles.col_rol}>{data.rollno}</p>
              <p className={styles.col_name}>{data.name.slice(0, 21)}</p>
            </div>
          ))
        ) : (
          <p className={styles.empty_p}>Your student list is empty </p>
        )}
      </div>
      <div className={styles.col2}>
        <Link to="/managestudents">
          <button>Manage</button>
        </Link>
      </div>
    </div>
  );
};

export default Students;

/* <div className={styles.sub_col1}>
          <p className={styles.col_rol}>1</p>
          <p className={styles.col_name}>Sushil</p>
        </div> */
