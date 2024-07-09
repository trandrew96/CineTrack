import { useContext } from "react";
import { UserContext } from "./context";
import { db } from "../config/firebase.config";
import {
  doc,
  getDocs,
  query,
  collection,
  where,
  deleteDoc,
} from "firebase/firestore";
function RemoveFromWatchlistBtn({ film, className }) {
  const { user } = useContext(UserContext);

  // Remove the film from the user's watchlist by updating doc in firestore
  const handleDelete = async () => {
    if (!user) return;

    // Get user's watchlist
    const q = query(
      collection(db, "lists"),
      where("owner", "==", user.uid),
      where("name", "==", "watchlist")
    );

    const querySnapshot = await getDocs(q);

    // get watchlist doc ref
    const docRef = doc(db, "lists", querySnapshot.docs[0].id);

    // delete film doc from watchlist
    await deleteDoc(
      doc(db, "lists", querySnapshot.docs[0].id, "films", String(film.id))
    );
  };
  return (
    <button onClick={handleDelete} className={className}>
      Saved to watchlist
    </button>
  );
}

export default RemoveFromWatchlistBtn;
