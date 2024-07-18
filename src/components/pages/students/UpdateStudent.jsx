import React, { useState, useEffect } from "react";
import styles from "./UpdateStudent.module.css";
import databases, { account, ID } from "../../appwrite/appwrite";
import RenderStudents from "./RenderStudents";

const UpdateStudent = () => {
  const [options, setOptions] = useState([]);
  const [user, setUser] = useState(null);
  const [inputValu, setInputValu] = useState({
    rollno: "",
    name: "",
    address: "",
  });

  // fetch user to get ID
  async function fetchUser() {
    try {
      const res = await account.get();
      setUser(res); // Save the user data to the state
      // console.log(res.$id);
    } catch (error) {
      // console.log(error);
    }
  }

  // render on load
  useEffect(() => {
    fetchUser();
    selectRoll();
  }, []);

  // taking data input
  function handleValuChange(event) {
    const { name, value } = event.target;
    setInputValu((prevValu) => ({
      ...prevValu,
      [name]: value,
    }));
  }

  // document submission and storing
  async function handleInputSubmit(event) {
    event.preventDefault();
    const { rollno, name, address } = inputValu;
    try {
      const res = await databases.createDocument(
        import.meta.env.VITE_APPWRITE_USER_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_STUDENTS_COLLECTION,
        ID.unique(),
        {
          teacherId: user.$id,
          rollno,
          name,
          address,
        }
      );
      if (res) {
        // console.log("student submitted!");
      }
      setInputValu({
        rollno: "",
        name: "",
        address: "",
      });
    } catch (error) {
      // console.log(error);
    }
  }

  // generating rollno
  function selectRoll() {
    let optionsArray = [];
    for (let i = 1; i <= 50; i++) {
      optionsArray.push(i);
    }
    setOptions(optionsArray);
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h2>FILL IN STUDENTS' DETAILS</h2>
        <form className={styles.student_input} onSubmit={handleInputSubmit}>
          <h3>Enter Data:</h3>
          <span>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              name="name"
              value={inputValu.name}
              onChange={handleValuChange}
              placeholder="enter student name"
              required
              autoFocus
            />
          </span>

          <span>
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              name="address"
              value={inputValu.address}
              onChange={handleValuChange}
              placeholder="enter address"
              required
            />
          </span>

          <span style={{ display: "flex", flexDirection: "row" }}>
            <span>
              <label htmlFor="rollno">Rollno:</label>
              <select
                name="rollno"
                id="rollno"
                value={inputValu.rollno || 0}
                onChange={handleValuChange}
                required
              >
                <option value="0" disabled>
                  Rollno
                </option>
                {options.map((rollno) => (
                  <option key={rollno} value={rollno}>
                    {rollno}
                  </option>
                ))}
              </select>
            </span>

            <span className={styles.button}>
              <button type="submit">Add</button>
            </span>
          </span>
        </form>
      </div>
      <div className={styles.render_students}>
        <RenderStudents user={user} handleInputSubmit={handleInputSubmit} />
      </div>
    </div>
  );
};

export default UpdateStudent;
