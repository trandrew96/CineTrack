import { useContext, useEffect, useState } from "react";
import { UserContext, SaveMenuContext } from "./context";
import { db } from "../config/firebase.config";
import {
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  collection,
  addDoc,
} from "firebase/firestore";

function SaveMenu() {
  const [loading, setLoading] = useState(true);
  const [checkboxes, setCheckboxes] = useState({
    watchlist: false,
  });

  const [showCreateList, setShowCreateList] = useState(false);
  const [newListName, setNewListName] = useState("");

  const { user, watchlist } = useContext(UserContext);
  const { saveMenuVisiblity, setSaveMenuVisibility, movie } =
    useContext(SaveMenuContext);

  useEffect(() => {
    const getLists = async () => {
      try {
        const q = query(
          collection(db, "lists"),
          where("owner", "==", user.uid)
        );

        const querySnapshot = await getDocs(q);
        console.log(user.uid, "lists:");

        let newCheckboxes = {};

        // iterate over all lists user has and determine which ones contain the current film
        for (const list of querySnapshot.docs) {
          // console.log(list.id, `(${list.data().name})`, " => ", list.data());

          // Get all films contained in the current list
          const q2 = query(collection(db, "lists", list.id, "films"));
          const films = [];

          const querySnapshot2 = await getDocs(q2);
          querySnapshot2.forEach((doc) => {
            films.push(doc.data().id);
          });
          console.log(list.id, list.data().name, "has these films: ", films);

          // determine if this list contains our current film
          // let newCheckboxes = { ...checkboxes };
          newCheckboxes[list.data().name] = films.some(
            (filmId) => filmId == movie.id
          );
        }

        setCheckboxes(newCheckboxes);
        console.log("New checkboxes:", newCheckboxes);
      } catch (err) {
        console.log(err);
        // setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      setLoading(false);
      return;
    }
    getLists();
  }, [saveMenuVisiblity]);

  // Add/remove film to list when checkbox is clicked
  const handleChange = async (e) => {
    let newCheckboxes = { ...checkboxes };
    newCheckboxes[e.target.name] = !checkboxes[e.target.name];
    setCheckboxes(newCheckboxes);

    console.log(
      `checkbox '${e.target.name}' clicked, new value: ${e.target.checked}`
    );

    // Get the list doc
    const q = query(
      collection(db, "lists"),
      where("owner", "==", user.uid),
      where("name", "==", e.target.name)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return;

    // Add film to the list that was clicked on
    if (e.target.checked) {
      try {
        await setDoc(
          doc(db, "lists", querySnapshot.docs[0].id, "films", String(movie.id)),
          {
            id: movie.id,
            title: movie.title,
            poster: movie.poster_path,
          }
        );
      } catch (error) {
        console.log("Error saving movie: ", error);
      }
    }

    // Delete film from list
    if (!e.target.checked) {
      try {
        await deleteDoc(
          doc(db, "lists", querySnapshot.docs[0].id, "films", String(movie.id))
        );
      } catch (error) {
        console.log("Error deleting movie: ", error);
      }
    }
  };

  const createList = async () => {
    try {
      const newListDocRef = await addDoc(collection(db, "lists"), {
        owner: user.uid,
        name: newListName,
      });

      let newCheckboxes = { ...checkboxes };
      newCheckboxes[newListName] = false;
      setCheckboxes(newCheckboxes);
      setNewListName("");
    } catch (error) {
      console.log("Error creating new list ", error);
    }
  };

  if (!saveMenuVisiblity) return;

  if (loading) return <></>;

  return (
    <div className="fixed flex flex-col justify-center h-screen w-screen z-50 bg-black/[.5]">
      <div className="w-fit mx-auto bg-zinc-700 p-5 rounded">
        <div className="flex mb-5 gap-5">
          <h3 className="text-lg font-semibold">Save movie to...</h3>
          <button onClick={() => setSaveMenuVisibility(false)}>X</button>
        </div>
        <div>
          {/* <pre>{JSON.stringify(lists, null, "\t")}</pre> */}
          {/* <pre>{JSON.stringify(movie.title, null, "\t")}</pre>
          <pre>{JSON.stringify(movie.id, null, "\t")}</pre>
          <pre>{JSON.stringify(movie.poster_path, null, "\t")}</pre>
          <pre>{JSON.stringify(checkboxes, null, "\t")}</pre> */}
          {/* <pre>{JSON.stringify(watchlist, null, "\t")}</pre> */}
        </div>
        <ul>
          <li>
            <input
              type="checkbox"
              id="watchlist"
              name="watchlist"
              onChange={(e) => handleChange(e)}
              checked={checkboxes["watchlist"]}
            />
            <label htmlFor="watchlist" className="ml-2 text-lg font-semibold">
              watchlist
            </label>
            {/* <pre>
                  {key}: {JSON.stringify(checkboxes[key], null, "\t")}
                </pre> */}
          </li>
          {Object.keys(checkboxes).map((key) => {
            if (key == "watchlist") return;

            return (
              <>
                <li>
                  <input
                    type="checkbox"
                    id={key}
                    name={key}
                    onChange={(e) => handleChange(e)}
                    checked={checkboxes[key]}
                  />
                  <label htmlFor={key} className="ml-2 text-lg font-semibold">
                    {key}
                  </label>
                  {/* <pre>
                  {key}: {JSON.stringify(checkboxes[key], null, "\t")}
                </pre> */}
                </li>
              </>
            );
          })}
          <li>
            <button
              className="text-lg font-semibold"
              onClick={() => setShowCreateList(!showCreateList)}
            >
              + Create new list
            </button>
            <br />
            {showCreateList && (
              <>
                <input
                  onChange={(e) => setNewListName(e.target.value)}
                  value={newListName}
                  type="text"
                  placeholder="List name"
                  className="px-2"
                />
                <button className="bg-blue-500 px-2" onClick={createList}>
                  Create List
                </button>
              </>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SaveMenu;
