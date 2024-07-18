import React from "react";

const RenderInfo = ({ infos }) => {
  const {
    firstname,
    lastname,
    address,
    schoolname,
    schooladdress,
    classno,
    section,
    subjects,
  } = infos;
  const infoEntries = [
    { key: "First Name", value: firstname },
    { key: "Last Name", value: lastname },
    { key: "Address", value: address },
    { key: "School Name", value: schoolname },
    { key: "School Address", value: schooladdress },
    { key: "Class", value: classno },
    { key: "Section", value: section },
    {
      key: "Subjects",
      value: Array.isArray(subjects) ? subjects.join(", ") : "",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        gap: "10px",
        // backgroundColor: "red",
      }}
    >
      {infoEntries.map((entry, index) => (
        <div key={index}>
          <p>
            <b>{entry.key}:</b>
            <span>{entry.value}</span>
          </p>
        </div>
      ))}
    </div>
  );
};

export default RenderInfo;
//   const updatedInfo = Object.entries(infos)
//     .filter(([key, value]) => value !== "" && value !== undefined)
//     .map(([key, value]) => (
//       <p key={key}>
//         <strong>{key}:</strong> {value}
//       </p>
//     ));

//   return <div>{updatedInfo}</div>;
// };
