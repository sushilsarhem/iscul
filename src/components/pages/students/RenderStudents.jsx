import React, { useEffect, useState } from "react";
import databases, { account } from "../../appwrite/appwrite";
import { Query } from "../../appwrite/appwrite";
import styles from "./RenderStudents.module.css";
import Modal from "./Modal";

const RenderStudents = ({ handleInputSubmit }) => {
  const [userId, setUser] = useState(null);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clicked, setClicked] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // fetch user details
  async function fetchUser() {
    try {
      const res = await account.get();
      if (res) {
        setUser(res.$id);
      }
    } catch (error) {
      // console.error("Error fetching user", error);
    }
  }
  // console.log(userId);

  useEffect(() => {
    try {
      const userId = fetchUser();
      if (userId) {
        fetchStudentsList();
      }
    } catch (error) {
      // console.log(error);
    }
  }, [handleInputSubmit]);

  async function fetchStudentsList() {
    try {
      const res = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_USER_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_STUDENTS_COLLECTION,
        [Query.equal("teacherId", [userId])]
      );
      if (res) {
        setLists(res.documents.sort((a, b) => a.rollno - b.rollno));
        // console.log(res.documents);
        // console.log("Fetch successful");
        setLoading(false);
      }
    } catch (error) {
      // console.log("Error fetching students list:", error);
    }
  }

  // open modal on list select and pass info
  async function openModal(list) {
    setClicked(true);
    setSelectedStudent(list);

    // console.log("student clicked", list);
  }

  // close modal
  async function closeModal() {
    setClicked(false);
    setSelectedStudent(null);
  }

  // handle after deletion
  function handleDelete() {
    fetchStudentsList();
  }

  // handle after update
  function handleOnUpdate() {
    fetchStudentsList();
  }

  // console.log(lists);
  if (loading) {
    return <h1>Loading..</h1>;
  }

  return (
    <div className={styles.wrapper}>
      {lists.length ? (
        <table className={styles.students_table}>
          <thead>
            <tr className={styles.table_heading}>
              <th>Rollno:</th>
              <th>Name:</th>
              <th>Address:</th>
            </tr>
          </thead>
          <tbody>
            {lists.map((list, index) => (
              <tr
                key={index}
                className={styles.table_data}
                onClick={() => openModal(list)}
              >
                <td>{list.rollno}</td>
                <td>{list.name}</td>
                <td>{list.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <h2>your student list is empty</h2>
      )}

      <Modal
        clicked={clicked}
        closeModal={closeModal}
        student={selectedStudent}
        handleDelete={handleDelete}
        handleOnUpdate={handleOnUpdate}
      />
    </div>
  );
};

export default RenderStudents;
