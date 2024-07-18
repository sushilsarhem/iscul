import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/routes/Home";
import Signup from "./components/routes/Signup";
import Login from "./components/routes/Login";
import { ProtectedRoutes } from "./components/routes/ProtectedRoutes";
import PublicRoute from "./components/routes/PublicRoute";
import VerifyAlert from "./components/routes/VerifyAlert";
import VerifyUser from "./components/routes/VerifyUser";
import Students from "./components/pages/profile/Students";
import Profile from "./components/pages/profile/Profile";
import Info from "./components/pages/profile/Info";
import EditProfile from "./components/pages/profile/EditProfile";
import ManageStudents from "./components/pages/students/ManageStudents";
import UpdateStudent from "./components/pages/students/UpdateStudent";
import Settings from "./components/pages/students/Settings";
import Examination from "./components/pages/students/Examination";
import ExamControl from "./components/pages/students/ExamControl";
import NotFound from "./components/routes/NotFound";
const App = () => {
  const router = createBrowserRouter([
    {
      element: <PublicRoute />,
      children: [
        { path: "/", index: true, element: <Home /> },
        { path: "signup", element: <Signup /> },
        { path: "login", element: <Login /> },
        { path: "verifyalert", element: <VerifyAlert /> },
      ],
    },
    {
      element: <ProtectedRoutes />,
      children: [
        { path: "profile", element: <Profile /> },
        { path: "editprofile", element: <EditProfile /> },
        { path: "managestudents", element: <ManageStudents /> },
        { path: "updatestudent", element: <UpdateStudent /> },
        { path: "settings", element: <Settings /> },
        // { path: "settings", element: <Settings /> },
        { path: "examination", element: <Examination /> },
        { path: "examcontrol", element: <ExamControl /> },
      ],
    },
    { path: "verifyuser", element: <VerifyUser /> },
    { path: "*", element: <NotFound /> },
  ]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
