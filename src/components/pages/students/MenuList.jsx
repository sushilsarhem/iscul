import React from "react";
import { Link } from "react-router-dom";
import lists from "./ListFormenu";

const MenuList = ({ styles }) => {
  return (
    <div className={styles.menu_pane}>
      <ul>
        {lists.map((list) => (
          <Link key={list.id} to={list.link}>
            <li>{list.label}</li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default MenuList;
