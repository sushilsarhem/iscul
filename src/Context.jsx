import { createContext, useEffect, useState } from "react";
import { account } from "./components/appwrite/appwrite";
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, SetUser] = useState(false);
  return (
    <UserContext.Provider value={{ user, SetUser }}>
      {children}
    </UserContext.Provider>
  );
};
