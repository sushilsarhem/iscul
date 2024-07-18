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
          English: (
            parseFloat(marks.English || 0) +
            parseFloat(studentDataA1.english) * 0.25 +
            parseFloat(studentDataA2.english) * 0.25
          ).toFixed(2),
          Science: (
            parseFloat(marks.Science || 0) +
            parseFloat(studentDataA1.science) * 0.25 +
            parseFloat(studentDataA2.science) * 0.25
          ).toFixed(2),
          SoScience: (
            parseFloat(marks.SoScience || 0) +
            parseFloat(studentDataA1.sscience) * 0.25 +
            parseFloat(studentDataA2.sscience) * 0.25
          ).toFixed(2),
          Hindi: (
            parseFloat(marks.Hindi || 0) +
            parseFloat(studentDataA1.hindi) * 0.25 +
            parseFloat(studentDataA2.hindi) * 0.25
          ).toFixed(2),
          Manipuri: (
            parseFloat(marks.Manipuri || 0) +
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
        };

        console.log(finalMarks);
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
          English: (
            (parseFloat(marks.English || 0) +
              parseFloat(studentDataA3.english) * 0.25 +
              parseFloat(studentDataA4.english) * 0.25 +
              parseFloat(studentDataHY.english)) /
            2
          ).toFixed(2),
          Science: (
            (parseFloat(marks.Science || 0) +
              parseFloat(studentDataA3.science) * 0.25 +
              parseFloat(studentDataA4.science) * 0.25 +
              parseFloat(studentDataHY.science)) /
            2
          ).toFixed(2),
          SoScience: (
            (parseFloat(marks.SoScience || 0) +
              parseFloat(studentDataA3.sscience) * 0.25 +
              parseFloat(studentDataA4.sscience) * 0.25 +
              parseFloat(studentDataHY.dictation)) /
            2
          ).toFixed(2),
          Hindi: (
            (parseFloat(marks.Hindi || 0) +
              parseFloat(studentDataA3.hindi) * 0.25 +
              parseFloat(studentDataA4.hindi) * 0.25 +
              parseFloat(studentDataHY.hindi)) /
            2
          ).toFixed(2),
          Manipuri: (
            (parseFloat(marks.Manipuri || 0) +
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
        };

        console.log(finalMarks);
      }
    }

    ///////////////////////////////////////////////////////////////////////
    const data = {
      rollno: selectedRollno,
      name: selectedStudentName.toString(),
      class: teacher.classno,
      section: teacher.section,
      teacherId: teacher.$id,
      english: finalMarks.English || marks.English,
      science: finalMarks.Science || marks.Science,
      sscience: finalMarks.SoScience || marks.SoScience,
      hindi: finalMarks.Hindi || marks.Hindi,
      meiteimayek: finalMarks.Manipuri || marks.Manipuri,
      maths: finalMarks.Maths || marks.Maths,
      computer: finalMarks.Computer || marks.Computer,
      gk: finalMarks.GK || marks.GK,
      dictation: finalMarks.Dictation || marks.Dictation,
      arts: marks.Arts,
      passmark: passmark,
      fullmark: fullmark,
    };

    // console.log(data);
    const {
      english,
      science,
      sscience,
      hindi,
      meiteimayek,
      maths,
      computer,
      gk,
      dictation,
      arts,
    } = data;
    // Convert destructured data to floats and store in an array
    const marksArray = [
      parseFloat(english),
      parseFloat(science),
      parseFloat(sscience),
      parseFloat(hindi),
      parseFloat(meiteimayek),
      parseFloat(maths),
      parseFloat(computer),
      parseFloat(gk),
      parseFloat(dictation),
    ];

    // console.log(marksArray.length);

    let sum = marksArray.reduce((total, initialValu) => total + initialValu);
    const status = marksArray.some((mark) => mark < passmark) ? "FAIL" : "PASS";

    const numberOfSubjects = marksArray.length;
    let percentage = ((sum / (numberOfSubjects * fullmark)) * 100)
      .toFixed(2)
      .toString();
    // console.log("total mark is: ", sum);
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
        <h2>{data.assesstmentType} DATA ENTRY</h2>
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
