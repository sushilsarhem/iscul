import React, { useEffect, useState } from "react";
import { account, storage, ID } from "../../appwrite/appwrite";
import databases from "../../appwrite/appwrite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import styles from "./CoverPic.module.css";

const CoverPic = () => {
  const [user, setUser] = useState(null);
  const [coverPic, setCoverPic] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  // fetch user
  async function fetchUser() {
    try {
      const res = await account.get("current");
      setUser(res.$id);
      fetchFile(res.$id);
    } catch (error) {
      // console.error("Error fetching user:", error);
    }
  }

  // handle file selection
  async function handleCoverPic(event) {
    const file = event.target.files[0];
    if (file) {
      const res = await uploadCoverPic(file);
      if (res) {
        fetchFile(user);
      }
    }
  }

  // update cover picture
  async function uploadCoverPic(file) {
    try {
      const userDocument = await databases.getDocument(
        import.meta.env.VITE_APPWRITE_USER_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID,
        user
      );

      // check if cover picture already exist
      if (userDocument.coverpic) {
        // delete the existing cover picture
        await storage.deleteFile(
          import.meta.env.VITE_APPWRITE_COV_PIC_STORAGE_ID,
          userDocument.coverpic
        );
      }

      // else upload the new file
      const uploadedFile = await storage.createFile(
        import.meta.env.VITE_APPWRITE_COV_PIC_STORAGE_ID,
        ID.unique(),
        file
      );

      // update in database with new file ID
      await updateInDb(user, uploadedFile.$id);
      return true;
    } catch (error) {
      // console.error("Cover picture update failed:", error);
      return false;
    }
  }

  // update user document in database
  async function updateInDb(userId, fileId) {
    try {
      await databases.updateDocument(
        import.meta.env.VITE_APPWRITE_USER_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID,
        userId,
        { coverpic: fileId } // Update the profilepic with the fileId directly
      );
      // console.log("Database updated successfully");
    } catch (error) {
      // console.error("Error updating database:", error);
    }
  }

  // Fetch file URL from storage
  async function fetchFile(userId) {
    try {
      const userDocument = await databases.getDocument(
        import.meta.env.VITE_APPWRITE_USER_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID,
        userId
      );

      if (userDocument.coverpic) {
        const res = await storage.getFileView(
          import.meta.env.VITE_APPWRITE_COV_PIC_STORAGE_ID,
          userDocument.coverpic
        );
        setCoverPic(res.href);
      } else {
        setCoverPic(null);
      }
    } catch (error) {
      setCoverPic(null);
      // console.error("Error fetching file:", error);
    }
  }

  return (
    <div className={styles.cover_container}>
      <img src={coverPic || "/TreesandMoon.jpg"} alt="profile_cover" />

      <label htmlFor="update2" className={styles.cover_upload}>
        <FontAwesomeIcon icon={faCamera} className={styles.camera_icon} />
      </label>
      <input type="file" id="update2" onChange={handleCoverPic} />
    </div>
  );
};

export default CoverPic;
