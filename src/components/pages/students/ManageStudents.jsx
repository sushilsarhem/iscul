import React from "react";
import MenuList from "./MenuList";
import styles from "./ManageStudents.module.css";

const ManageStudents = () => {
  return (
    <div className={styles.wrapper}>
      <MenuList styles={styles}>left</MenuList>
    </div>
  );
};

export default ManageStudents;
