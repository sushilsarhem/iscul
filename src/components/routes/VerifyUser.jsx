import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { account } from "../appwrite/appwrite";

export const VerifyUser = () => {
  const [params] = useSearchParams();
  const userId = params.get("userId");
  const secret = params.get("secret");
  const navigate = useNavigate();
  const [message, setMessage] = useState(
    "Please wait while we verify your account..."
  );

  useEffect(() => {
    if (userId && secret) {
      verifyUser(userId, secret);
    }
  }, [userId, secret]);

  async function verifyUser(userId, secret) {
    try {
      const res = await account.updateVerification(userId, secret);
      if (res) {
        // console.log("Email verification successful!");
        // alert("Account verified! Redirecting...");
        navigate("/profile");
      }
    } catch (error) {
      // console.error("Verification failed with error: ", error);
      if (error) {
        setMessage(
          "Invalid verification token. Please check your email and try again."
        );
      } else {
        setMessage("Verification failed! Please try again later.");
      }
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        alignItems: "center",
        color: "white",
      }}
    >
      <h1>{message}</h1>
    </div>
  );
};

export default VerifyUser;

// Earlier code
// import React, { useEffect, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { account } from "../appwrite/appwrite";

// export const VerifyUser = () => {
//   const [params] = useSearchParams();
//   const userId = params.get("userId");
//   const secret = params.get("secret");
//   const navigate = useNavigate();

//   // // useEffect(() => {
//   // //   if (userId && secret) {
//   // //     verifyUser(userId, secret);
//   // //   }
//   // // }, []);

//   // async function verifyUser() {
//   //   try {
//   //     const res = await account.updateVerification(userId, secret);
//   //     if (res) {
//   //       alert("Account verified! Redirecting....");
//   //       navigate("/profile");
//   //     }
//   //   } catch (error) {
//   //     console.error("Verification failed with error: ", error);
//   //     // alert("Verification failed!");
//   //   }
//   // }
//   // verifyUser();
//   useEffect(() => {
//     if (userId && secret) {
//       verifyUser();
//     }
//   }, [userId, secret]);

//   async function verifyUser() {
//     try {
//       const res = await account.updateVerification(userId, secret);
//       if (res) {
//         alert("Account verified! Redirecting...");
//         navigate("/profile");
//       }
//     } catch (error) {
//       console.error("Verification failed with error: ", error);
//       alert("Verification failed! Please try again later.");
//     }
//   }

//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         minHeight: "100vh",
//         alignItems: "center",
//         color: "white",
//       }}
//     >
//       <h1>Please wait while we verify your account...</h1>
//     </div>
//   );
// };

// export default VerifyUser;
