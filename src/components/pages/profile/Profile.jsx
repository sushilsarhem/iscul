import React, { lazy, useState, Suspense } from "react";
import { Link } from "react-router-dom";
import styles from "./Profile.module.css";
import lists from "./MenuList";
import PhotoComp from "./PhotoComp";
import ManageStudents from "../students/ManageStudents";

const Info = lazy(() => import("./Info"));
const Students = lazy(() => import("./Students"));
// const Manage = lazy(() => import("../students/ManageStudents"));
// const Gallery = lazy(() => import("./Gallery"));

const Profile = () => {
  const [selectedList, setSelectedList] = useState(lists[0]);

  async function handleListChange(list) {
    setSelectedList(list);
    // console.log(list.id);
  }

  const renderComponents = (listId) => {
    switch (listId) {
      case 1:
        return <Info />;
      case 2:
        return <Students />;
      // case 3:
      //   return <ManageStudents />;
      default:
        return <h1>No list found!</h1>;
    }
  };

  // console.log(selectedList.id);
  return (
    <div className={styles.profile_wrapper}>
      <PhotoComp />

      <ul className={styles.menuLists}>
        {lists.map((list) => (
          <li
            key={list.id}
            to={list.link}
            onClick={() => handleListChange(list)}
            className={`${styles.menuLink} ${
              selectedList.id === list.id ? styles.isActive : ""
            }`}
          >
            {list.title}
          </li>
        ))}
      </ul>

      <div className={styles.content_wrapper}>
        {selectedList && (
          <div className={styles.container}>
            <p style={{ fontSize: "25px" }}>
              {selectedList.title.toLocaleUpperCase()}
            </p>
            <Suspense fallback={<div>Loading...</div>}>
              {renderComponents(selectedList.id)}
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
