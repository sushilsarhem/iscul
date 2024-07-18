import React, { useEffect, useState } from "react";
import { account, storage, ID } from "../../appwrite/appwrite";
import databases from "../../appwrite/appwrite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import styles from "./ProfilePic.module.css";

const ProfilePic = () => {
  const [user, setUser] = useState(null);
  const [picture, setPicture] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  // Fetch user information
  async function fetchUser() {
    try {
      const res = await account.get("current");
      setUser(res.$id);
      fetchFile(res.$id);
    } catch (error) {
      // console.error("Error fetching user:", error);
    }
  }

  // Handle file selection
  async function handleSelect(event) {
    const file = event.target.files[0];
    if (file) {
      const res = await updateProfilePicture(file);
      if (res) {
        fetchFile(user); // Fetch the new file after uploading
      }
    }
  }

  // Update profile picture
  async function updateProfilePicture(file) {
    try {
      const userDocument = await databases.getDocument(
        import.meta.env.VITE_APPWRITE_USER_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID,
        user
      );

      // Check if a profile picture already exists
      if (userDocument.profilepic) {
        // Delete the existing profile picture from storage
        await storage.deleteFile(
          import.meta.env.VITE_APPWRITE_PRO_PIC_STORAGE_ID,
          userDocument.profilepic
        );
      }

      // Upload the new file
      const uploadedFile = await storage.createFile(
        import.meta.env.VITE_APPWRITE_PRO_PIC_STORAGE_ID,
        ID.unique(),
        file
      );

      // Update the database with the new file ID
      await updateInDb(user, uploadedFile.$id);
      return true;
    } catch (error) {
      // console.error("Profile picture update failed:", error);
      return false;
    }
  }

  // Update user document in the database
  async function updateInDb(userId, fileId) {
    try {
      await databases.updateDocument(
        import.meta.env.VITE_APPWRITE_USER_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID,
        userId,
        { profilepic: fileId } // Update the profilepic with the fileId directly
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

      if (userDocument.profilepic) {
        const res = await storage.getFileView(
          import.meta.env.VITE_APPWRITE_PRO_PIC_STORAGE_ID,
          userDocument.profilepic
        );
        setPicture(res.href);
      } else {
        setPicture(null);
      }
    } catch (error) {
      setPicture(null);
      // console.error("Error fetching file:", error);
    }
  }

  return (
    <div className={styles.profile_container}>
      <img src={picture || "/profilepic.png"} alt="profile_pic" />
      <label htmlFor="update" className={styles.uploadbutton}>
        <FontAwesomeIcon icon={faCamera} className={styles.camera_icon} />
      </label>
      <input type="file" id="update" onChange={handleSelect} />
    </div>
  );
};

export default ProfilePic;
