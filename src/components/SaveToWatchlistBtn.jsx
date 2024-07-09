import { useContext } from "react";
import { UserContext } from "./context";
import { db } from "../config/firebase.config";
import {
  doc,
  where,
  getDocs,
  setDoc,
  collection,
  query,
} from "firebase/firestore";

function SaveToWatchlistBtn({ film, className }) {
  const { user } = useContext(UserContext);

  // Save the film to the user's watchlist by adding doc to firestore
  const handleSave = async () => {
    try {
      // Get user's watchlist
      const q = query(
        collection(db, "lists"),
        where("owner", "==", user.uid),
        where("name", "==", "watchlist")
      );

      const querySnapshot = await getDocs(q);

      // User watchlist doesn't exist
      if (querySnapshot.empty) {
        console.log("error: using watchlist not found");
        return;
      }

      // Add film to user's watchlist
      if (!querySnapshot.empty) {
        await setDoc(
          doc(db, "lists", querySnapshot.docs[0].id, "films", String(film.id)),
          {
            id: film.id,
            title: film.title,
            poster: film.poster,
          }
        );
      }
    } catch (error) {
      console.log("Error adding to watchlist: ", error);
    }
  };

  return (
    <button className={className} onClick={handleSave}>
      Save to watchlist
    </button>
  );
}

export default SaveToWatchlistBtn;
