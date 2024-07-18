import React from "react";
import { Link } from "react-router-dom";

export const VerifyAlert = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#8399A8",
      }}
    >
      <h1>Verification link sent to your email.</h1>
      <Link to="/" style={{ color: "whitesmoke" }}>
        <h2>HOME</h2>
      </Link>
    </div>
  );
};

export default VerifyAlert;
