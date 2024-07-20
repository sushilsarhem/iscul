import React, { useState } from "react";
import databases, { account } from "../../appwrite/appwrite";
import styles from "./EditProfile.module.css";
import Select from "react-select";
import subjects from "./SubjectLists";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [selectedOption, setSelectedOption] = useState([]);
  const navigate = useNavigate();

  const [enteredValue, setEnteredValue] = useState({
    firstname: "",
    lastname: "",
    address: "",
    schoolname: "",
    schooladdress: "",
    classno: "",
    section: "",
    subjects: [],
    // testing parameter
    prfilepic: "",
    coverpic: "",
    /////////////////
  });
  const handleInput = (identifier, value) => {
    setEnteredValue((prevValue) => ({
      ...prevValue,
      [identifier]: value,
    }));
    // console.log(enteredValue);
  };
  const handleSelected = (selectedOption) => {
    setSelectedOption(selectedOption);
    const vale = selectedOption.map((option) => option.value);
    setEnteredValue((prevValue) => ({
      ...prevValue,
      subjects: vale,
    }));
  };

  //previous code for submit
  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   const user = await account.get();
  //   const {
  //     firstname,
  //     lastname,
  //     address,
  //     schoolname,
  //     schooladdress,
  //     classno,
  //     section,
  //     subjects,
  //     profilepic,
  //     coverpic,
  //   } = enteredValue;
  //   try {
  //     const checkUserExist = await databases.getDocument(
  //       import.meta.env.VITE_APPWRITE_USER_DATABASE_ID,
  //       import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID,
  //       user.$id
  //     );
  //     if (checkUserExist) {
  //       const res = await databases.updateDocument(
  //         import.meta.env.VITE_APPWRITE_USER_DATABASE_ID,
  //         import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID,
  //         user.$id,
  //         {
  //           // userId: user.$id,
  //           firstname,
  //           lastname,
  //           address,
  //           schoolname,
  //           schooladdress,
  //           classno,
  //           section,
  //           subjects,
  //           // profilepic: "",
  //           // coverpic: "",
  //         }
  //       );
  //       // console.log(res);
  //       setEnteredValue({
  //         firstname: "",
  //         lastname: "",
  //         address: "",
  //         schoolname: "",
  //         schooladdress: "",
  //         classno: "",
  //         section: "",
  //         subjects: [],
  //       });
  //       setSelectedOption([]);
  //       if (res) {
  //         navigate("/profile");
  //       }
  //       // console.log(enteredValue);
  //     } else {
  //       const res = await databases.createDocument(
  //         import.meta.env.VITE_APPWRITE_USER_DATABASE_ID,
  //         import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID,
  //         user.$id,
  //         // "unique()",
  //         {
  //           userId: user.$id,
  //           firstname,
  //           lastname,
  //           address,
  //           schoolname,
  //           schooladdress,
  //           classno,
  //           section,
  //           subjects,
  //           profilepic: "",
  //           coverpic: "",
  //         }
  //       );
  //       console.log(res);
  //       setEnteredValue({
  //         firstname: "",
  //         lastname: "",
  //         address: "",
  //         schoolname: "",
  //         schooladdress: "",
  //         classno: "",
  //         section: "",
  //         subjects: [],
  //       });
  //       setSelectedOption([]);
  //       if (res) {
  //         navigate("/profile");
  //       }
  //       // console.log(enteredValue);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const user = await account.get();
    const {
      firstname,
      lastname,
      address,
      schoolname,
      schooladdress,
      classno,
      section,
      subjects,
      profilepic,
      coverpic,
    } = enteredValue;

    try {
      await databases.updateDocument(
        import.meta.env.VITE_APPWRITE_USER_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID,
        user.$id,
        {
          firstname,
          lastname,
          address,
          schoolname,
          schooladdress,
          classno,
          section,
          subjects,
          profilepic,
          coverpic,
        }
      );
    } catch (error) {
      if (error.code === 404) {
        // Document not found
        try {
          await databases.createDocument(
            import.meta.env.VITE_APPWRITE_USER_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID,
            user.$id,
            {
              userId: user.$id,
              firstname,
              lastname,
              address,
              schoolname,
              schooladdress,
              classno,
              section,
              subjects,
              profilepic,
              coverpic,
            }
          );
        } catch (createError) {
          console.error("Failed to create document:", createError);
        }
      } else {
        console.error("Failed to update document:", error);
      }
    }

    navigate("/profile");
  };

  return (
    <div className={styles.profile_container}>
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="firstname">First name:</label>
        <input
          type="text"
          name="firstname"
          value={enteredValue.firstname}
          onChange={(event) => handleInput("firstname", event.target.value)}
          autoFocus
          // required
        />

        <label htmlFor="lastname">Last name:</label>
        <input
          type="text"
          name="lastname"
          value={enteredValue.lastname}
          onChange={(event) => handleInput("lastname", event.target.value)}
          // required
        />

        <label htmlFor="address">Address:</label>
        <input
          type="text"
          name="address"
          value={enteredValue.address}
          onChange={(event) => handleInput("address", event.target.value)}
          // required
        />

        <label htmlFor="school">School name:</label>
        <input
          type="text"
          name="schoolname"
          value={enteredValue.schoolname}
          onChange={(event) => handleInput("schoolname", event.target.value)}
          // required
        />

        <label htmlFor="schooladdress">School address:</label>
        <input
          type="text"
          name="schooladdress"
          value={enteredValue.schooladdress}
          onChange={(event) => handleInput("schooladdress", event.target.value)}
          // required
        />

        <label htmlFor="classno">Class:</label>
        <input
          type="text"
          name="classno"
          value={enteredValue.classno}
          onChange={(event) => handleInput("classno", event.target.value)}
          // required
        />

        <label htmlFor="section">Section:</label>
        <input
          type="text"
          name="section"
          value={enteredValue.section}
          onChange={(event) => handleInput("section", event.target.value)}
          // required
        />

        <label htmlFor="subjects">Select subjects:</label>
        <Select
          className={styles.options}
          options={subjects}
          name="subjects"
          placeholder="select subject"
          value={selectedOption}
          isMulti={true}
          onChange={handleSelected}
          // maxMenuHeight={150}
          menuPlacement="top"
          // menuPortalTarget={document.body} // Ensures the dropdown is rendered in the body
        />
        <button type="submit">UPDATE</button>
      </form>
    </div>
  );
};

export default Profile;
