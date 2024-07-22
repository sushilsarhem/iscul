import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import databases, {
  ID,
  Query,
  fetchUserData,
  getCurrentUser,
} from "../../appwrite/appwrite";
import styles from "./ExamControl.module.css";
import RenderMarks from "./RenderMarks";

const ExamControl = () => {
  const location = useLocation();
  const { data } = location.state;
  const { $id, assesstmentType, mainSubjects, optionals, fullmark, passmark } =
    data;
  const [teacher, setTeacher] = useState(null);
  const [studentsList, setStudentList] = useState([]);
  const [rollnos, setRollnos] = useState([]);
  const [selectedRollno, setSelectedRollno] = useState(null);
  const allSubjects = [...mainSubjects, ...optionals];
  const [marks, setMarks] = useState({});
  const [assesmentCollectionId, setAssesmentCollectionId] = useState(null);
  const [submitCount, setSubmitCount] = useState(0);
  const [ass1, setAss1] = useState({});
  const [ass2, setAss2] = useState(null);
  const [ass3, setAss3] = useState(null);
  const [ass4, setAss4] = useState(null);
  const [halfYearlyMarks, setHalfYearlyMarks] = useState(null);

  // console.log(allSubjects);

  useEffect(() => {
    fetchUser();
    // if (teacher && assesstmentType) {
    //   fetchPreviousAssessment(assesstmentType);
    // }
  }, []);

  // fetch user
  async function fetchUser() {
    try {
      const res = await getCurrentUser();
      if (res) {
        const teacherId = res.$id;
        const classno = res.classno;
        const section = res.section;
        // fetchTeacherData();
        try {
          const res = await fetchUserData(teacherId);
          setTeacher(res);
          // console.log(res);
          if (res) {
            try {
              const res = await databases.listDocuments(
                import.meta.env.VITE_APPWRITE_USER_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_STUDENTS_COLLECTION,
                [Query.equal("teacherId", teacherId)]
              );
              if (res) {
                fetchPreviousAssessment(
                  assesstmentType,
                  teacherId,
                  classno,
                  section
                );
              }
              setStudentList(res.documents);
              const roll = res.documents.map((item) => item.rollno);
              setRollnos(
                roll.sort((a, b) => {
                  return a - b;
                })
              );
            } catch (error) {
              // console.log(error);
            }
          }
        } catch (error) {
          // console.log(error);
        }
      }
    } catch (error) {
      // console.log(error);
    }
  }

  // handle marks input
  function handleMarksChange(subject, value) {
    // console.log(`Changing marks for ${subject} to ${value}`);
    setMarks((prevValu) => ({
      ...prevValu,
      [subject]: value,
    }));
  }

  useEffect(() => {
    const collcID = selectAssessment(assesstmentType);
    setAssesmentCollectionId(collcID);
    // console.log(collcID);
  }, []);

  // function to select assessment type
  function selectAssessment(assesstmentType) {
    switch (assesstmentType) {
      case "1st Assessment":
        return import.meta.env.VITE_APPWRITE_1_ASSESSMENT;

      case "2nd Assessment":
        return import.meta.env.VITE_APPWRITE_2_ASSESSMENT;

      case "3rd Assessment":
        return import.meta.env.VITE_APPWRITE_3_ASSESSMENT;

      case "4th Assessment":
        return import.meta.env.VITE_APPWRITE_4_ASSESSMENT;

      case "Half Yearly":
        return import.meta.env.VITE_APPWRITE_HY_ASSESSMENT;

      case "Final Exam":
        return import.meta.env.VITE_APPWRITE_FINAL_ASSESSMENT;

      default:
        return null;
    }
  }

  // function to fetch previous assessment marks to add in half-yearly and final
  const fetchPreviousAssessment = async (
    assesstmentType,
    teacherId,
    classno,
    section
  ) => {
    if (assesstmentType === "Half Yearly") {
      // fetch assessement 1 and 2 marks
      try {
        const res = await databases.listDocuments(
          import.meta.env.VITE_APPWRITE_USER_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_1_ASSESSMENT,
          [Query.equal("teacherId", teacherId)],
          [Query.equal("class", classno)],
          [Query.equal("section", section)]
        );
        const doc1 = res.documents;

        const sortedData1 = doc1.sort(
          (a, b) => parseInt(a.rollno) - parseInt(b.rollno)
        );
        setAss1(sortedData1);
        // console.log(sortedData);
        if (res) {
          const res = await databases.listDocuments(
            import.meta.env.VITE_APPWRITE_USER_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_2_ASSESSMENT,
            [Query.equal("teacherId", teacherId)],
            [Query.equal("class", classno)],
            [Query.equal("section", section)]
          );
          const doc2 = res.documents;

          const sortedData2 = doc2.sort(
            (a, b) => parseInt(a.rollno) - parseInt(b.rollno)
          );
          setAss2(sortedData2);
        }
      } catch (error) {
        // console.log("Unable to fetch data", error);
      }
      // console.log("Logging out A1 and A2");
    }
    if (assesstmentType === "Final Exam") {
      // fetch assessement 3 and 4 marks
      try {
        const res = await databases.listDocuments(
          import.meta.env.VITE_APPWRITE_USER_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_3_ASSESSMENT,
          [Query.equal("teacherId", teacherId)],
          [Query.equal("class", classno)],
          [Query.equal("section", section)]
        );
        const doc3 = res.documents;

        const sortedData3 = doc3.sort(
          (a, b) => parseInt(a.rollno) - parseInt(b.rollno)
        );
        setAss3(sortedData3);
        // console.log(sortedData);

        if (res) {
          const res = await databases.listDocuments(
            import.meta.env.VITE_APPWRITE_USER_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_4_ASSESSMENT,
            [Query.equal("teacherId", teacherId)],
            [Query.equal("class", classno)],
            [Query.equal("section", section)]
          );
          const doc4 = res.documents;

          const sortedData4 = doc4.sort(
            (a, b) => parseInt(a.rollno) - parseInt(b.rollno)
          );
          setAss4(sortedData4);
          // console.log(sortedData);
        }
        // fetch half yearly marks
        if (res) {
          const res = await databases.listDocuments(
            import.meta.env.VITE_APPWRITE_USER_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_HY_ASSESSMENT,
            [Query.equal("teacherId", teacherId)],
            [Query.equal("class", classno)],
            [Query.equal("section", section)]
          );
          const halfYearly = res.documents;

          const sortedData4 = halfYearly.sort(
            (a, b) => parseInt(a.rollno) - parseInt(b.rollno)
          );
          setHalfYearlyMarks(sortedData4);
        }
      } catch (error) {
        // console.log("Unable to fetch data", error);
      }

      // console.log("Logging out A3 and A4");
    }
  };

  // function to submit data
  async function handleSubmit(event) {
    event.preventDefault();
    const selectedStudentName = studentsList
      .filter((student) => student.rollno === selectedRollno)
      .map((student) => student.name);
    // console.log(selectedStudentName);
    // console.log(marks.Hindi);
    // console.log(studentsList);

    let finalMarks = { ...marks };
    //// Perform Half Yearly or Final Exam calculation
    if (assesstmentType === "Half Yearly") {
      const a1 = ass1.filter((data) => data.rollno == selectedRollno);
      const a2 = ass2.filter((data) => data.rollno == selectedRollno);

      if (a1.length > 0 && a2.length > 0) {
        const studentDataA1 = a1[0];
        const studentDataA2 = a2[0];

        finalMarks = {
          English1: (
            parseFloat(marks.English1 || 0) +
            parseFloat(studentDataA1.english1) * 0.25 +
            parseFloat(studentDataA2.english1) * 0.25
          ).toFixed(2),
          English2: (
            parseFloat(marks.English2 || 0) +
            parseFloat(studentDataA1.english2) * 0.25 +
            parseFloat(studentDataA2.english2) * 0.25
          ).toFixed(2),
          Science: (
            parseFloat(marks.Science || 0) +
            parseFloat(studentDataA1.science) * 0.25 +
            parseFloat(studentDataA2.science) * 0.25
          ).toFixed(2),
          Sscience: (
            parseFloat(marks.Sscience || 0) +
            parseFloat(studentDataA1.sscience) * 0.25 +
            parseFloat(studentDataA2.sscience) * 0.25
          ).toFixed(2),
          Hindi: (
            parseFloat(marks.Hindi || 0) +
            parseFloat(studentDataA1.hindi) * 0.25 +
            parseFloat(studentDataA2.hindi) * 0.25
          ).toFixed(2),
          Meiteimayek: (
            parseFloat(marks.Meiteimayek || 0) +
            parseFloat(studentDataA1.meiteimayek) * 0.25 +
            parseFloat(studentDataA2.meiteimayek) * 0.25
          ).toFixed(2),
          Maths: (
            parseFloat(marks.Maths || 0) +
            parseFloat(studentDataA1.maths) * 0.25 +
            parseFloat(studentDataA2.maths) * 0.25
          ).toFixed(2),
          Computer: (
            parseFloat(marks.Computer || 0) +
            parseFloat(studentDataA1.computer) * 0.25 +
            parseFloat(studentDataA2.computer) * 0.25
          ).toFixed(2),
          GK: (
            parseFloat(marks.GK || 0) +
            parseFloat(studentDataA1.gk) * 0.25 +
            parseFloat(studentDataA2.gk) * 0.25
          ).toFixed(2),
          Dictation: (
            parseFloat(marks.Dictation || 0) +
            parseFloat(studentDataA1.dictation) * 0.25 +
            parseFloat(studentDataA2.dictation) * 0.25
          ).toFixed(2),
          Moralvalue: (
            parseFloat(marks.Moralvalue || 0) +
            parseFloat(studentDataA1.moralvalue) * 0.25 +
            parseFloat(studentDataA2.moralvalue) * 0.25
          ).toFixed(2),
          Handwriting: (
            parseFloat(marks.Handwriting || 0) +
            parseFloat(studentDataA1.handwriting) * 0.25 +
            parseFloat(studentDataA2.handwriting) * 0.25
          ).toFixed(2),
          Conversation: (
            parseFloat(marks.Conversation || 0) +
            parseFloat(studentDataA1.conversation) * 0.25 +
            parseFloat(studentDataA2.conversation) * 0.25
          ).toFixed(2),
        };

        // console.log(finalMarks);
      }
    }
    /////////////////////////////////////////////////////

    // to handle for FINAL EXAM /////////////////////
    if (assesstmentType === "Final Exam") {
      const a3 = ass3.filter((data) => data.rollno == selectedRollno);
      const a4 = ass4.filter((data) => data.rollno == selectedRollno);
      const hY = halfYearlyMarks.filter(
        (data) => data.rollno == selectedRollno
      );

      if (a3.length > 0 && a4.length > 0) {
        const studentDataA3 = a3[0];
        const studentDataA4 = a4[0];
        const studentDataHY = hY[0];

        finalMarks = {
          English1: (
            (parseFloat(marks.English1 || 0) +
              parseFloat(studentDataA3.english1) * 0.25 +
              parseFloat(studentDataA4.english1) * 0.25 +
              parseFloat(studentDataHY.english1)) /
            2
          ).toFixed(2),
          English2: (
            (parseFloat(marks.English2 || 0) +
              parseFloat(studentDataA3.english2) * 0.25 +
              parseFloat(studentDataA4.english2) * 0.25 +
              parseFloat(studentDataHY.english2)) /
            2
          ).toFixed(2),
          Science: (
            (parseFloat(marks.Science || 0) +
              parseFloat(studentDataA3.science) * 0.25 +
              parseFloat(studentDataA4.science) * 0.25 +
              parseFloat(studentDataHY.science)) /
            2
          ).toFixed(2),
          Sscience: (
            (parseFloat(marks.Sscience || 0) +
              parseFloat(studentDataA3.sscience) * 0.25 +
              parseFloat(studentDataA4.sscience) * 0.25 +
              parseFloat(studentDataHY.sscience)) /
            2
          ).toFixed(2),
          Hindi: (
            (parseFloat(marks.Hindi || 0) +
              parseFloat(studentDataA3.hindi) * 0.25 +
              parseFloat(studentDataA4.hindi) * 0.25 +
              parseFloat(studentDataHY.hindi)) /
            2
          ).toFixed(2),
          Meiteimayek: (
            (parseFloat(marks.Meiteimayek || 0) +
              parseFloat(studentDataA3.meiteimayek) * 0.25 +
              parseFloat(studentDataA4.meiteimayek) * 0.25 +
              parseFloat(studentDataHY.meiteimayek)) /
            2
          ).toFixed(2),
          Maths: (
            (parseFloat(marks.Maths || 0) +
              parseFloat(studentDataA3.maths) * 0.25 +
              parseFloat(studentDataA4.maths) * 0.25 +
              parseFloat(studentDataHY.maths)) /
            2
          ).toFixed(2),
          Computer: (
            (parseFloat(marks.Computer || 0) +
              parseFloat(studentDataA3.computer) * 0.25 +
              parseFloat(studentDataA4.computer) * 0.25 +
              parseFloat(studentDataHY.computer)) /
            2
          ).toFixed(2),
          GK: (
            (parseFloat(marks.GK || 0) +
              parseFloat(studentDataA3.gk) * 0.25 +
              parseFloat(studentDataA4.gk) * 0.25 +
              parseFloat(studentDataHY.gk)) /
            2
          ).toFixed(2),
          Dictation: (
            (parseFloat(marks.Dictation || 0) +
              parseFloat(studentDataA3.dictation) * 0.25 +
              parseFloat(studentDataA4.dictation) * 0.25 +
              parseFloat(studentDataHY.dictation)) /
            2
          ).toFixed(2),
          Moralvalue: (
            (parseFloat(marks.Moralvalue || 0) +
              parseFloat(studentDataA3.moralvalue) * 0.25 +
              parseFloat(studentDataA4.moralvalue) * 0.25 +
              parseFloat(studentDataHY.moralvalue)) /
            2
          ).toFixed(2),
          Handwriting: (
            (parseFloat(marks.Handwriting || 0) +
              parseFloat(studentDataA3.handwriting) * 0.25 +
              parseFloat(studentDataA4.handwriting) * 0.25 +
              parseFloat(studentDataHY.handwriting)) /
            2
          ).toFixed(2),
          Conversation: (
            (parseFloat(marks.Conversation || 0) +
              parseFloat(studentDataA3.conversation) * 0.25 +
              parseFloat(studentDataA4.conversation) * 0.25 +
              parseFloat(studentDataHY.conversation)) /
            2
          ).toFixed(2),
        };

        // console.log(finalMarks);
      }
    }

    ///////////////////////////////////////////////////////////////////////
    const data = {
      rollno: selectedRollno,
      name: selectedStudentName.toString(),
      class: teacher.classno,
      section: teacher.section,
      teacherId: teacher.$id,
      english1: finalMarks.English1 || parseFloat(marks.English1),
      english2: finalMarks.English2 || parseFloat(marks.English2),
      science: finalMarks.Science || parseFloat(marks.Science),
      sscience: finalMarks.Sscience || parseFloat(marks.Sscience),
      hindi: finalMarks.Hindi || parseFloat(marks.Hindi),
      meiteimayek: finalMarks.Meiteimayek || parseFloat(marks.Meiteimayek),
      maths: finalMarks.Maths || parseFloat(marks.Maths),
      computer: finalMarks.Computer || parseFloat(marks.Computer),
      gk: finalMarks.GK || parseFloat(marks.GK) || 0,
      dictation: finalMarks.Dictation || parseFloat(marks.Dictation) || 0,
      moralvalue: finalMarks.Moralvalue || parseFloat(marks.Moralvalue) || 0,
      conversation:
        finalMarks.Conversation || parseFloat(marks.Conversation) || 0,
      handwriting: finalMarks.Handwriting || parseFloat(marks.Handwriting) || 0,
      // arts: (parseFloat(marks.Arts) || 0).toString(),
      passmark: passmark,
      fullmark: fullmark,
    };

    // console.log(data);

    // filtered the above data that matches allSubjects array /////////////////////////////////////////
    // Convert Arr values to lowercase
    const normalizedSubjects = allSubjects.map((item) => item.toLowerCase());

    // Create newArr with matching key-value pairs
    let subjectsMarks = [];

    for (const [key, value] of Object.entries(data)) {
      if (normalizedSubjects.includes(key.toLowerCase())) {
        // newData[key] = value;
        // console.log("true");
        subjectsMarks.push(parseFloat(value));
      }
      // console.log(`${key}: ${value}`);
    }

    // console.log(subjectsMarks);

    // const {
    //   english,
    //   science,
    //   sscience,
    //   hindi,
    //   meiteimayek,
    //   maths,
    //   computer,
    //   gk,
    //   dictation,
    //   // arts,
    // } = data;
    // // Convert destructured data to floats and store in an array
    // const marksArray = [
    //   parseFloat(english),
    //   parseFloat(science),
    //   parseFloat(sscience),
    //   parseFloat(hindi),
    //   parseFloat(meiteimayek),
    //   parseFloat(maths),
    //   parseFloat(computer),
    //   parseFloat(gk),
    //   parseFloat(dictation),
    // ];

    // console.log(marksArray.length);
    // console.log(marksArray);

    let sum = subjectsMarks.reduce((total, initialValu) => total + initialValu);
    const status = subjectsMarks.some((mark) => mark < passmark)
      ? "FAIL"
      : "PASS";

    // const numberOfSubjects = marksArray.length; // changed from previous
    const numberOfSubjects = allSubjects.length;
    let percentage = ((sum / (numberOfSubjects * fullmark)) * 100)
      .toFixed(2)
      .toString();
    // console.log("total mark is: ", sum);
    // console.log(numberOfSubjects);

    // console.log("percentage of the student is: ", percentage);
    // console.log("Status: ", status);
    const total = sum.toString();
    const datas = { ...data, total, percentage, status };

    const CollectionId = selectAssessment(assesstmentType);
    // setAssesmentCollectionId(CollectionId);
    try {
      const res = await databases.createDocument(
        import.meta.env.VITE_APPWRITE_USER_DATABASE_ID,
        CollectionId,
        ID.unique(),
        datas
      );

      // console.log("Document created");
      setSubmitCount((prevCount) => prevCount + 1);
      setSelectedRollno(null);
      setMarks({});
      // setBooks("");
      // setSubjectEnrich("");
    } catch (error) {
      // console.log("unable to create document", error);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div>
        <h2>{data.assesstmentType} ENTRY</h2>
      </div>

      <form className={styles.form_input}>
        <div className={styles.rollno}>
          <select
            name="rollno"
            id="rollno"
            value={selectedRollno || 0}
            onChange={(event) => setSelectedRollno(event.target.value)}
          >
            <option value="0" disabled>
              Roll:
            </option>
            {rollnos.map((rollno) => (
              <option key={rollno}>{rollno}</option>
            ))}
          </select>
        </div>

        <div className={styles.subjects}>
          {allSubjects.map((subject, index) => (
            <input
              key={index}
              type="text"
              name={subject}
              id={subject}
              value={marks[subject] || ""}
              placeholder={subject}
              onChange={(event) =>
                handleMarksChange(subject, event.target.value)
              }
            />
          ))}
          {assesstmentType === "Half Yearly" ||
          assesstmentType === "Final Exam" ? (
            <div>
              {/* <input
                type="text"
                name="prevasst"
                placeholder={`${
                  assesstmentType === "Half Yearly" ? "A1+A2" : "A3+A4"
                }`}
              /> */}
              {/* <input
                type="text"
                name="books"
                placeholder="Books"
                value={books}
                onChange={(e) => handleBooksChange(e.target.value)}
              />
              <input
                type="text"
                name="enrich"
                placeholder="Enrich"
                value={subjectEnrich}
                onChange={(e) => handleEnrichChange(e.target.value)}
              /> */}
              {/* <FontAwesomeIcon
                icon={faFloppyDisk}
                onClick={handleSubmit}
                style={{ fontSize: "30px", marginLeft: "10px" }}
              /> */}
              <button
                type="submit"
                onClick={handleSubmit}
                style={{ width: "auto", margin: "0 5px", padding: "0 8px" }}
              >
                ADD
              </button>
            </div>
          ) : (
            // <div className={styles.buton}>
            // <FontAwesomeIcon
            //   className={styles.buton}
            //   icon={faFloppyDisk}
            //   onClick={handleSubmit}
            // />
            <button
              type="submit"
              onClick={handleSubmit}
              style={{ width: "auto", margin: "0 5px", padding: "0 8px" }}
            >
              ADD
            </button>
            // </div>
          )}
        </div>
      </form>

      <RenderMarks
        assesstmentType={assesstmentType}
        assesmentCollectionId={assesmentCollectionId}
        submitCount={submitCount}
      />
    </div>
  );
};

export default ExamControl;
