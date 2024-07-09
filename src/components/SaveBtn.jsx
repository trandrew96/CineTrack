import { useContext, useEffect, useState } from "react";
import { UserContext } from "./context";
import { db } from "../config/firebase.config";
import {
  doc,
  where,
  getDocs,
  getDoc,
  deleteDoc,
  addDoc,
  updateDoc,
  arrayUnion,
  collection,
  query,
} from "firebase/firestore";

function SaveBtn({ movie, saveStyle, unsaveStyle }) {
  const { user } = useContext(UserContext);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user has saved this movie to their watchlist
  useEffect(() => {
    const getWatchlist = async () => {
      try {
        setLoading(true);
        setIsWatchlisted(false);

        // if (
        //   querySnapshot.docs[0].data().films.some((film) => {
        //     // console.log("film.id", film.id, "movie.id", movie.id);
        //     return film.id === movie.id;
        //   })
        // ) {
        //   console.log("mark this movie as saved?", movie.id);
        //   setIsWatchlisted(true);
        // }
      } catch (err) {
        console.log(err);
        // setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (!user) return;

    getWatchlist();
  }, [movie]);

  // Save the movie to the user's watchlist by adding doc to firestore
  const handleSave = async () => {
    // console.log(user.uid, "is trying to save", movie.id.toString());

    try {
      // Get user's watchlist
      const q = query(
        collection(db, "lists"),
        where("owner", "==", user.uid),
        where("name", "==", "watchlist")
      );

      const querySnapshot = await getDocs(q);

      // User watchlist doesn't exist, so create it
      if (querySnapshot.empty) {
        console.log("user doesn't have a watchlist yet. creating one now");
        await addDoc(collection(db, "lists"), {
          owner: user.uid,
          name: "watchlist",
          films: [
            {
              id: Number(movie.id),
              title: movie.title,
              poster: movie.poster,
            },
          ],
        });
      }

      // Add movie to user's watchlist
      if (!querySnapshot.empty) {
        const docRef = doc(db, "lists", querySnapshot.docs[0].id);
        await updateDoc(docRef, {
          films: arrayUnion({
            id: Number(movie.id),
            title: movie.title,
            poster: movie.poster,
          }),
        });
      }
      setIsWatchlisted(true);
    } catch (error) {
      console.log("Error adding to watchlist: ", error);
    }
  };

  // Remove the movie from the user's watchlist by deleting doc from firestore
  const handleDelete = async () => {
    if (!user) return;

    let movieId = movie.id.toString();
    // console.log(user.uid, `is trying to unsave ${movieId} (${movie.title})`);

    // get document
    const docRef = doc(db, "lists", user.uid, "watchlist", movieId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // console.log("Document data:", docSnap.data());
      await deleteDoc(docRef);
    } else {
      // docSnap.data() will be undefined in this case
      // console.log("No such document!");
    }
  };

  if (loading) return <></>;

  if (user && isWatchlisted)
    return (
      <button className={unsaveStyle} onClick={handleDelete}>
        Saved to your watchlist
      </button>
    );

  return (
    <button className={saveStyle} onClick={handleSave}>
      Save to watchlist
    </button>
  );
}

export default SaveBtn;
