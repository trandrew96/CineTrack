import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useSearchParams, Link } from "react-router-dom";
import { UserContext } from "./context";
import { db, search_api } from "../config/firebase.config";
import Description from "./Description";
import {
  query,
  collection,
  where,
  getDocs,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import SaveToWatchlistBtn from "./SaveToWatchlistBtn";
import RemoveFromWatchlistBtn from "./RemoveFromWatchlistBtn";

function Search() {
  const { user } = useContext(UserContext);
  const [watchlist, setWatchlist] = useState([]);
  const [movies, setMovies] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("s");
  const page = searchParams.get("page");

  // search movie db via title
  useEffect(() => {
    if (!search) return;

    let endpoint =
      search_api + `?title=${search}` + (page ? `&page=${page}` : "");

    axios.get(endpoint).then((res) => {
      setMovies(res.data);

      // console.log("search results:", res.data);
    });
  }, [search, page]);

  const handleNextPage = () => {
    setSearchParams({
      s: search,
      page: page ? parseInt(page) + 1 : 2,
    });
    window.scrollTo(0, 0);
  };

  const handlePrevPage = () => {
    setSearchParams({
      s: search,
      page: page ? parseInt(page) - 1 : 1,
    });
    window.scrollTo(0, 0);
  };

  // Grab user watchlist
  useEffect(() => {
    if (!user) return;

    const getWatchlist = async () => {
      try {
        const q = query(
          collection(db, "lists"),
          where("owner", "==", user.uid),
          where("name", "==", "watchlist")
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log("Error: watchlist not found");
          // await addDoc(collection(db, "lists"), {
          //   owner: user.uid,
          //   name: "watchlist",
          //   films: [],
          // });
        }

        setWatchlist(querySnapshot.docs[0].data().films);

        // const q = query(collection(db, "lists", user.uid, "watchlist"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          setWatchlist(querySnapshot.docs[0].data().films);
        });
      } catch (err) {
        console.log(err);
      }
    };

    getWatchlist();
  }, [user]);

  useEffect(() => {
    // console.log("watchlist changed:", watchlist);
  }, [watchlist]);

  return (
    <>
      {/* <pre>{JSON.stringify(watchlist, null, "\t")}</pre> */}
      {/* <pre>{JSON.stringify(movies, null, "\t")}</pre> */}
      {/* {<pre>{JSON.stringify(user, null, "\t")}</pre>} */}
      <main className="flex md:py-6 justify-items-center lg:max-w-screen-lg mx-auto">
        <section className="flex flex-col gap-3 w-full">
          <h1 className="text-md md:mb-8">
            Found at least {movies?.total_results || 1} matches for “{search}”
          </h1>
          <h1 className="text-2xl">Titles</h1>
          <hr className="mb-4 max-w-24" />
          {movies &&
            movies.results.map((film, i) => (
              <div className="mb-2" key={i}>
                <div className="flex gap-2">
                  <div className="w-fit">
                    <Link to={"/film/" + film.id} className="block">
                      {film.poster_path != null && (
                        <img
                          src={film.poster_path}
                          width="70"
                          height="105"
                          className="aspect-[2/3] h-max min-w-14 md:min-w-28"
                        />
                      )}
                      {!film.poster_path && (
                        <img
                          src="/assets/poster-placeholder.png"
                          width="70"
                          height="105"
                          className="aspect-[2/3] h-max min-w-14 md:min-w-28"
                        />
                      )}
                    </Link>
                  </div>
                  <div>
                    <Link to={"/film/" + film.id} className="text-xl font-bold">
                      {film.original_title}
                    </Link>
                    <span className="ml-2">{film.release_date}</span>
                    <Description description={film.overview} />
                    {user &&
                      watchlist &&
                      watchlist.some(
                        (currentFilm) => currentFilm.id === film.id
                      ) && (
                        <RemoveFromWatchlistBtn
                          film={{
                            title: film.original_title,
                            id: Number(film.id),
                            year: film.release_date,
                            poster: film.poster_path,
                          }}
                          className="bg-green-700 px-3 rounded mr-24 hover:bg-orange-500 transition duration-150"
                        />
                      )}

                    {user &&
                      watchlist &&
                      !watchlist.some(
                        (currentFilm) => currentFilm.id === film.id
                      ) && (
                        <SaveToWatchlistBtn
                          film={{
                            title: film.original_title,
                            id: Number(film.id),
                            year: film.release_date,
                            poster: film.poster_path,
                          }}
                          className="bg-gray-700 px-3 rounded mr-24"
                        />
                      )}
                  </div>
                </div>
              </div>
            ))}
        </section>
      </main>

      <section className="mb-24 flex gap-8 justify-center">
        {page && parseInt(page) > 1 && (
          <button onClick={() => handlePrevPage()}>Previous Page</button>
        )}
        <button onClick={() => handleNextPage()}>Next Page</button>
      </section>
    </>
  );
}

export default Search;
