import { useEffect, useState, useContext } from "react";
import { UserContext } from "./context";
import { Link, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { db, movie_api } from "../config/firebase.config";
import FilmCarousel from "./FilmCarousel";
import WatchProviders from "./WatchProviders";
import Score from "./Score";
import FilmPageSkeleton from "./FilmPageSkeleton";
import Hero from "./Hero";
import Cast from "./Cast";
import SaveToWatchlistBtn from "./SaveToWatchlistBtn";
import RemoveFromWatchlistBtn from "./RemoveFromWatchlistBtn";
import {
  query,
  collection,
  where,
  getDocs,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import ToggleSaveMenu from "./ToggleSaveMenu";

function FilmPage() {
  const { user } = useContext(UserContext);
  const [film, setFilm] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [watchlist, setWatchlist] = useState([]);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipText, setTooltipText] = useState("Copy to clipboard");
  const [mobileTooltipText, setMobileTooltipText] = useState("Share");

  const location = useLocation();

  let params = useParams();

  // Get movie info
  useEffect(() => {
    setIsLoading(true);
    window.scrollTo(0, 0);

    axios
      .get(movie_api + `?id=${params.id}`, {
        "Access-Control-Allow-Credentials": true,
      })
      .then((res) => {
        // console.log(res.data);
        setFilm(res.data);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  }, [location]);

  // Grab user watchlist
  useEffect(() => {
    const getWatchlist = async () => {
      try {
        const q = query(
          collection(db, "lists"),
          where("owner", "==", user.uid),
          where("name", "==", "watchlist")
        );

        let querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log("Error: watchlist not found");
        }

        // get real-time updates on watchlist doc and update watchlist state so save/unsave buttons can update in real-time
        const unsubs = onSnapshot(
          collection(db, "lists", querySnapshot.docs[0].id, "films"),
          (doc) => {
            setWatchlist(doc.docs.map((doc) => doc.data()));
          }
        );

        // const watchlistQuerySnaphot = await getDocs(
        //   collection(db, "lists", querySnapshot.docs[0].id, "films")
        // )

        // setWatchlist(watchlistQuerySnaphot.docs.map((doc) => doc.data()));
      } catch (err) {
        console.log(err);
      }
    };

    if (!user) return;

    getWatchlist();
  }, [user]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setTooltipText(`Copied to clipboard`);
  };

  if (isLoading) return <FilmPageSkeleton />;

  return (
    <>
      {/* BACKDROP */}
      <div className="hidden md:block">
        <Hero img={film.backdrop_path_w1280} />
      </div>
      <div className="md:hidden">
        <Hero img={film.backdrop_path_w780} />
      </div>

      {/* <pre>{JSON.stringify(watchlist, null, "\t")}</pre> */}

      <main className="md:grid md:grid-cols-8 gap-8 max-w-screen-lg mx-auto pb-8">
        {/* Poster Section */}
        <section className="md:col-span-2 flex">
          <div className="md:hidden">
            <h2 className="text-xl mb-2">{film.original_title}</h2>
            <span className="text-xs">DIRECTED BY</span>
            <h3 className="font-bold text-sm">
              {film.credits.crew
                .filter((member) => {
                  return member.job == "Director";
                })
                .map((director, i) => {
                  if (i == 0) {
                    return <span key={i}>{director.name} </span>;
                  }
                  return (
                    <span key={i}>
                      {"  "}& {director.name}
                    </span>
                  );
                })}
            </h3>
            <p className="mt-6 text-sm">
              {film.release_date.slice(0, 4)} • {film.runtime} mins
            </p>
          </div>
          <div className="ml-auto md:ml-0">
            {film.poster_path && (
              <img
                src={film.poster_path}
                className="w-24 md:w-full rounded shadow block mb-4"
              />
            )}
            {!film.poster_path && (
              <img
                src="/src/assets/poster-placeholder.png"
                className="block mb-4"
              />
            )}

            <div className="hidden md:block">
              <WatchProviders providers={film?.watch_providers_ca} />
            </div>
          </div>
        </section>

        <div className="col-span-6 md:grid md:grid-cols-6 gap-8">
          {/* Title, Director, Year Section */}
          <header className="col-span-6 hidden md:inline">
            <span className="text-4xl mb-4">{film.original_title}</span>
            <span className="ml-2">{film.release_date.slice(0, 4)}</span>
            <p className="mt-4">
              Directed by{" "}
              {film.credits.crew
                .filter((member) => {
                  return member.job == "Director";
                })
                .map((director, i) => {
                  if (i == 0) {
                    return <span key={i}>{director.name}</span>;
                  }
                  return (
                    <span key={i}>
                      {"  "}& {director.name}
                    </span>
                  );
                })}
            </p>
          </header>

          {/* Middle Content Section (movie desc, cast) */}
          <section className="col-span-4 mt-6">
            <p className="mb-14">{film.overview}</p>

            <div className="md:hidden">
              <Score score={film.vote_average} />
            </div>

            <div className="md:hidden mb-14">
              <WatchProviders providers={film?.watch_providers_ca} />
            </div>

            <Cast cast={film.credits.cast} />
            <br />
            <h3>GENRES</h3>
            <p className="mb-12">
              {film.genres &&
                film.genres
                  .reduce((acc, genre) => acc + genre.name + " | ", "")
                  .slice(0, -3)}
            </p>

            <span className="hidden md:inline">{film.runtime}m&nbsp; </span>

            {film.imdb_id && (
              <>
                <span>More at {"  "}</span>
                <a
                  href={"https://www.imdb.com/title/" + film.imdb_id}
                  className="border"
                >
                  IMDB
                </a>
              </>
            )}
          </section>

          {/* Like/Save Section */}
          <section className="hidden md:block col-span-2 mt-6">
            <div className="flex flex-col divide-y divide-black rounded-lg bg-slate-700 text-center mb-20">
              {user &&
                watchlist &&
                watchlist.some((currentFilm) => currentFilm.id === film.id) && (
                  <RemoveFromWatchlistBtn
                    film={{
                      title: film.original_title,
                      id: Number(film.id),
                      year: film.release_date,
                      poster: film.poster_path,
                    }}
                    className={"py-2"}
                  />
                )}

              {user &&
                watchlist &&
                !watchlist.some(
                  (currentFilm) => Number(currentFilm.id) === Number(film.id)
                ) && (
                  <SaveToWatchlistBtn
                    film={{
                      title: film.original_title,
                      id: Number(film.id),
                      year: film.release_date,
                      poster: film.poster_path,
                    }}
                    className={"py-2"}
                  />
                )}

              {user && <ToggleSaveMenu movie={film} className={"py-2"} />}

              {!user && (
                <div className={"py-2"}>
                  <Link to="/login">Sign in to save movies</Link>
                </div>
              )}
              <div className="py-2 tooltip">
                <button
                  onClick={copyToClipboard}
                  onMouseEnter={() => setTooltipVisible(true)}
                  onMouseLeave={() => {
                    setTooltipVisible(false);
                    setTooltipText("Copy to clipboard");
                  }}
                >
                  Share
                </button>
                <span
                  className={`tooltiptext transition-opacity`}
                  id="myTooltip"
                >
                  {tooltipText}
                </span>
              </div>
            </div>

            <Score score={film.vote_average} />
          </section>
        </div>
      </main>

      <aside className="md:grid grid-cols-8 gap-8 max-w-screen-lg mx-auto mb-12">
        <div className="col-span-6 col-start-3">
          <h2 className="text-sm mb-2 mt-12">SIMILAR FILMS</h2>
          <FilmCarousel header={"SIMILAR FILMS"} films={film.similar} />
        </div>
      </aside>

      {/* Button to open menu on mobile for saving, sharing, etc */}
      <button
        onClick={() => setShowMobileMenu(true)}
        className="w-12 h-12 rounded-full bg-green-500 fixed bottom-8 right-4 md:hidden"
      >
        +
      </button>

      {/* POPUP mobile menu with save btn, share, etc. */}
      {showMobileMenu && (
        <>
          <div
            className="fixed w-full h-screen bg-black/[.5] bottom-0 left-0"
            onClick={() => setShowMobileMenu(false)}
          ></div>
          <div className="flex flex-col divide-y divide-slate-800 h-fit bg-slate-700 text-center mt-auto fixed bottom-0 left-0 w-full">
            <div className="text-left px-4 py-2">
              <h4 className="text-md text-xl font-semibold">
                {film.original_title}
              </h4>
              <span className="text-sm text-slate-300">
                {film.release_date.slice(0, 4)}
              </span>
            </div>
            {user &&
              watchlist &&
              watchlist.some((currentFilm) => currentFilm.id === film.id) && (
                <RemoveFromWatchlistBtn
                  film={{
                    title: film.original_title,
                    id: Number(film.id),
                    year: film.release_date,
                    poster: film.poster_path,
                  }}
                  className={"py-2"}
                />
              )}

            {user &&
              watchlist &&
              !watchlist.some((currentFilm) => currentFilm.id === film.id) && (
                <SaveToWatchlistBtn
                  film={{
                    title: film.original_title,
                    id: Number(film.id),
                    year: film.release_date,
                    poster: film.poster_path,
                  }}
                  className={"py-2"}
                />
              )}
            {user && <ToggleSaveMenu movie={film} className={"py-2"} />}
            {!user && (
              <div className="py-2 text-md font-semibold">
                <Link to="/login">Sign in to save movies</Link>
              </div>
            )}
            <div className="py-2 text-md font-semibold">
              <button
                onClick={() => {
                  copyToClipboard();
                  setMobileTooltipText("Copied to clipboard");
                }}
              >
                {mobileTooltipText}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default FilmPage;
