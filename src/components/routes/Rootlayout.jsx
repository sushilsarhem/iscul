import React from "react";
import { Outlet } from "react-router-dom";

export const Rootlayout = (children) => {
  return (
    <div>
      <Outlet />
    </div>
  );
};
