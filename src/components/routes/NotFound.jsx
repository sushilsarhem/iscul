import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginTop: "50px",
        textDecoration: "none",
      }}
    >
      <h2>Sorry - Page Not Found</h2>
      <Link
        to="/"
        style={{
          color: "green",
          cursor: "pointer",
        }}
      >
        <h2>HOME</h2>
      </Link>
    </div>
  );
};

export default NotFound;
