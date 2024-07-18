import React, { useContext } from "react";
import { account } from "../appwrite/appwrite";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Context";

export const Logout = () => {
  const { user, SetUser } = useContext(UserContext);
  const navigate = useNavigate();

  async function logout() {
    try {
      await account.deleteSession("current");
      SetUser(false);
      // console.log("Logout");
      navigate("/login");
      // window.location.href = "/login";
    } catch (error) {
      // console.log("Error logging you out", error);
    }
  }

  return { logout };
};
