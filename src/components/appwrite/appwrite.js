import {
  Client,
  Account,
  ID,
  Databases,
  Query,
  Storage,
  Functions,
} from "appwrite";

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) // Your API Endpoint
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID); // Your project ID

const account = new Account(client);
const databases = new Databases(client);
const functions = new Functions(client);
const storage = new Storage(client);

//fetch and return user
const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

// fetch and return user details from database
const fetchUserData = async (documentId) => {
  try {
    return await databases.getDocument(
      import.meta.env.VITE_APPWRITE_USER_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID,
      documentId
    );
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export default databases;

export {
  account,
  functions,
  Query,
  storage,
  ID,
  getCurrentUser,
  fetchUserData,
};
