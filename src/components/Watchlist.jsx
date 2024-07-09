import { React, useEffect, useState, useContext } from "react";
import { UserContext } from "./context";
import { db } from "../config/firebase.config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

function Watchlist() {
  const { user } = useContext(UserContext);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lists, setLists] = useState([]);

  // Get all user's lists
  useEffect(() => {
    const getLists = async () => {
      try {
        setLoading(true);

        const q = query(
          collection(db, "lists"),
          where("owner", "==", user.uid)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) return;

        let newLists = [];

        // Get all films in each list
        for (const doc of querySnapshot.docs) {
          const listQuerySnaphot = await getDocs(
            collection(db, "lists", doc.id, "films")
          );

          // console.log(listQuerySnaphot);
          let newList = {
            id: doc.id,
            name: doc.data().name,
            films: listQuerySnaphot.docs.map((doc) => doc.data()),
          };

          newLists.push(newList);
        }

        setLists(newLists);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      getLists();
    }
  }, [user]);

  // Get user watchlist
  useEffect(() => {
    const getWatchlist = async () => {
      try {
        setLoading(true);

        const q = query(
          collection(db, "lists"),
          where("owner", "==", user.uid),
          where("name", "==", "watchlist")
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Retrieve movies in watchlist (one time)
          const watchlistQuerySnaphot = await getDocs(
            collection(db, "lists", querySnapshot.docs[0].id, "films")
          );
          setMovies(watchlistQuerySnaphot.docs.map((doc) => doc.data()));
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      getWatchlist();
    }
  }, [user]);

  const handleListChange = (e) => {
    // console.log("list changed", e.target.value);
    for (const list of lists) {
      if (list.name === e.target.value) {
        setMovies(list.films);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {/* <pre>{JSON.stringify(movies, null, "\t")}</pre> */}
      <main className="w-fit mx-auto">
        {user && (
          <section>
            {/* <label htmlFor="lists">Your lists: </label> */}
            <select
              id="lists"
              name="lists"
              onChange={(e) => handleListChange(e)}
              className="text-xl bg-slate-500 rounded mb-2"
            >
              <option value="watchlist">watchlist</option>
              {lists.map((list, i) => {
                if (list.name == "watchlist") return;

                return (
                  <option value={list.name} key={list.id}>
                    {list.name}
                  </option>
                );
              })}
            </select>
            {/* <h1>
              <pre>{JSON.stringify(list, null, "\t")}</pre>
            </h1> */}
          </section>
        )}
        <section>
          <h1 className="text-sm mb-1">{movies.length} FILM(S)</h1>
          {/* <hr className="" />
          <div className="justify-end flex gap-3">
            <button className="text-xs">GENRE</button>
            <button className="text-xs">Sort by</button>
          </div> */}
          <hr className="mb-4" />
        </section>
        <section className="grid grid-cols-4 md:grid-cols-5 gap-2 w-fit">
          {user &&
            movies.map((movie, i) => (
              <Link
                to={"/film/" + movie.id}
                className="text-xl font-bold"
                key={i}
              >
                <div key={i} className="shrink-0 bg-black">
                  <p>{JSON.stringify()}</p>
                  <img
                    src={movie.poster}
                    className="w-32 h-fit rounded shadow-lg border-gray-500/50 border"
                  />
                </div>
              </Link>
            ))}
        </section>
      </main>
    </div>
  );
}

export default Watchlist;
