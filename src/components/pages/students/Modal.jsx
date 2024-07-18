import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrash,
  faFloppyDisk,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Modal.module.css";
import databases from "../../appwrite/appwrite";

const Modal = ({
  clicked,
  closeModal,
  student,
  handleDelete,
  handleOnUpdate,
}) => {
  const [formData, setFormData] = useState({
    rollno: student ? student.rollno : "",
    name: student ? student.name : "",
    address: student ? student.address : "",
  });
  const [disable, setDisable] = useState(true);

  useEffect(() => {
    if (student) {
      setFormData({
        rollno: student.rollno,
        name: student.name,
        address: student.address,
      });
    }
  }, [student]);

  if (!clicked || !student) {
    return null; // Do not render the modal if not clicked or student is null
  }
  //   console.log(student);

  // delete student from database
  async function deleteStudent() {
    try {
      const res = await databases.deleteDocument(
        import.meta.env.VITE_APPWRITE_USER_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_STUDENTS_COLLECTION,
        `${student.$id}`
      );
      if (res) {
        closeModal();
        handleDelete();
      }
    } catch (error) {
      // console.log("Error deleting student", error);
    }
  }

  // enable editing
  function enableEdit() {
    setDisable(!disable);
  }

  // handle input change
  function handleInputChange(name, value) {
    setFormData((prevValu) => ({
      ...prevValu,
      [name]: value,
    }));
  }

  // update student details
  async function updateStudentDetails() {
    try {
      const res = await databases.updateDocument(
        import.meta.env.VITE_APPWRITE_USER_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_STUDENTS_COLLECTION,
        student.$id,
        formData
      );

      if (res) {
        handleOnUpdate();
        closeModal();
        // console.log("Student Updated");
      }
    } catch (error) {
      // console.log("Error updating", error);
    }
  }

  return (
    <div className={`${styles.container} ${clicked ? styles.active : ""}`}>
      <div className={styles.wrapper}>
        <label htmlFor="rollno">Rollno:</label>
        <input
          type="text"
          name="rollno"
          value={formData.rollno}
          onChange={(event) => handleInputChange("rollno", event.target.value)}
          disabled={disable}
        />

        <label htmlFor="name">Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={(event) => handleInputChange("name", event.target.value)}
          disabled={disable}
        />

        <label htmlFor="address">Address:</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={(event) => handleInputChange("address", event.target.value)}
          disabled={disable}
        />

        <div className={styles.fontAwe}>
          <FontAwesomeIcon
            icon={faPenToSquare}
            className={`${styles.icon} ${styles.edit}`}
            onClick={enableEdit}
          />
          <FontAwesomeIcon
            icon={faTrash}
            className={`${styles.icon} ${styles.delete}`}
            onClick={deleteStudent}
          />
          <FontAwesomeIcon
            icon={faFloppyDisk}
            className={`${styles.icon} ${styles.save}`}
            onClick={updateStudentDetails}
          />
          <FontAwesomeIcon
            icon={faXmark}
            className={`${styles.icon} ${styles.cancel}`}
            onClick={() => (closeModal(), setDisable(true))}
          />
        </div>
      </div>
    </div>
  );
};

export default Modal;
