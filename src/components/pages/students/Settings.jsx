import React, { useState, useEffect } from "react";
import Select from "react-select";
import styles from "./Settings.module.css";
import assesstment from "./AssestList";
import databases from "../../appwrite/appwrite";
import { getCurrentUser, fetchUserData, ID } from "../../appwrite/appwrite";
import { subjectList, optionalList } from "./AssestList";
import RenderAssestment from "./RenderAssestment";

const Settings = () => {
  const [user, setUser] = useState(null);
  const [assesstmentDocId, setAssesstmentDocId] = useState(null);

  const [selectedAsst, setSelectedAsst] = useState("");
  const [selectSubject, setSelectedSubject] = useState([]);
  const [selectOptionals, setSelectOptionals] = useState([]);
  const [passMark, setPassMark] = useState("");
  const [fullMark, setFullMark] = useState("");
  const [formData, setFormData] = useState({});

  useEffect(() => {
    getUser();
  }, []);

  // fetch user details
  async function getUser() {
    try {
      const fetchedUser = await getCurrentUser();
      if (fetchedUser) {
        // setUser(fetchedUser);
        const documentId = fetchedUser.$id;
        // console.log("User:", fetchedUser);
        // console.log("Document ID:", documentId);

        try {
          const data = await fetchUserData(documentId);
          setUser(data);
          // console.log("User Data:", data);
        } catch (error) {
          // console.error("Error fetching user data:", error);
        }
      }
    } catch (error) {
      // console.error("Error fetching user:", error);
    }
  }

  // for handling assesstment change
  const handleSelected = (selectedOption) => {
    setSelectedAsst(selectedOption);
  };

  // for handling subject selection
  function handleSubjects(subjects) {
    setSelectedSubject(subjects);
  }

  // fro selecting optional subjects
  function handleOptionals(optionals) {
    setSelectOptionals(optionals);
  }

  const getAssessmentUpdateData = (assessmentType, docId) => {
    switch (assessmentType) {
      case "asst1":
        return { asst1: docId };
      case "asst2":
        return { asst2: docId };
      case "halfyearly":
        return { halfyearly: docId };
      case "asst3":
        return { asst3: docId };
      case "asst4":
        return { asst4: docId };
      case "final":
        return { final: docId };
      default:
        return {};
    }
  };

  // handle form add assesstent information to database
  async function handleSubmit(event) {
    event.preventDefault();
    const teacherId = user.$id;
    const asst = selectedAsst.label;
    const selectedSubjectValues = selectSubject.map((subject) => subject.value);
    const selectedOptionalValu = selectOptionals.map(
      (optional) => optional.value
    );
    try {
      const res = await databases.createDocument(
        import.meta.env.VITE_APPWRITE_USER_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_ASSTMNT_SETTING_COLLECTION,
        ID.unique(),
        {
          teacherId: teacherId,
          assesstmentType: asst,
          mainSubjects: selectedSubjectValues,
          optionals: selectedOptionalValu,
          fullmark: fullMark,
          passmark: passMark,
        }
      );
      // log out entered asst. documentID
      setAssesstmentDocId(res.$id);
      const docId = res.$id;
      if (res) {
        const docId = res.$id;
        // console.log("Uploaded successfully!");
        // update assesstment ID in database
        try {
          const assessmentUpdateData = getAssessmentUpdateData(
            selectedAsst.value,
            docId
          );
          // console.log(assessmentUpdateData);
          const resUpdate = await databases.updateDocument(
            import.meta.env.VITE_APPWRITE_USER_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID,
            user.$id,
            assessmentUpdateData
          );
          if (resUpdate) {
            // console.log("Updates in user database");
          }
        } catch (error) {
          // console.error("Error updating user document:", error);
        }
      }
    } catch (error) {
      // console.log("Error uploading asssesstment", error);
    }

    const data = {
      selectedAsst: asst,
      selectSubject: selectedSubjectValues,
      selectOptionals: selectedOptionalValu,
      fullMark,
      passMark,
    };
    setFormData(data);
    setSelectedAsst("");
    setSelectedSubject([]);
    setSelectOptionals([]);
    setPassMark("");
    setFullMark("");
  }
  // console.log(assesstmentDocId);
  // console.log(options);
  return (
    <div className={styles.container}>
      <h2>SET ASSESSMENT</h2>
      <div>
        <form className={styles.form_area} onSubmit={handleSubmit}>
          <label htmlFor="assessment">
            Assessment:
            <Select
              className={styles.options}
              options={assesstment}
              name="assessment"
              placeholder="select Asst."
              value={selectedAsst}
              onChange={handleSelected}
            />
          </label>

          <label htmlFor="subjects">
            Main subjects:
            <Select
              className={styles.options}
              options={subjectList}
              name="subjects"
              placeholder="main subjects"
              value={selectSubject}
              isMulti={true}
              onChange={handleSubjects}
            />
          </label>
          <label htmlFor="optional">
            Optional subjects:
            <Select
              className={styles.options}
              options={optionalList}
              name="optional"
              placeholder="optional "
              value={selectOptionals}
              isMulti={true}
              onChange={handleOptionals}
            />
          </label>
          <div className={styles.marks}>
            <label htmlFor="fullmark">F-mark:</label>
            <input
              type="text"
              placeholder="00"
              value={fullMark}
              onChange={(event) => setFullMark(event.target.value)}
            />
          </div>
          <div className={styles.marks}>
            <label htmlFor="passmark">P-mark:</label>
            <input
              type="text"
              placeholder="00"
              value={passMark}
              onChange={(event) => setPassMark(event.target.value)}
            />
          </div>
          <button type="submit" className={styles.add}>
            Add
          </button>
        </form>
      </div>
      {/* for rendering and deleting assessment  */}
      <RenderAssestment formData={formData} handleSubmit={handleSubmit} />
    </div>
  );
};

export default Settings;
