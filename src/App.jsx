import { useState, useEffect } from "react";
import { auth } from "./config/firebase.config";
import { onAuthStateChanged } from "firebase/auth";
import { Routes, Route, Outlet } from "react-router-dom";
import "./App.css";
import { UserContext, SaveMenuContext } from "./components/context";

import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./components/Home";
import SearchPage from "./components/SearchPage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Watchlist from "./components/Watchlist";
import Account from "./components/Account";
import FilmPage from "./components/FilmPage";

// LISTEN TO MULTIPLE DOCS IN A COLLECTION
import SaveMenu from "./components/SaveMenu";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <SaveMenu />
      <Nav />
      <div className="mt-2 md:mt-4 lg:mt-8 px-4">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

function App() {
  const [user, setUser] = useState(undefined);
  // Save-movie-to-list variables
  const [saveMenuVisiblity, setSaveMenuVisibility] = useState(false);
  const [movie, setMovie] = useState(undefined);

  // Set user context on user login/logout
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        // console.log("Current user: ", uid);

        let userInfo = {
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          displayName: user.displayName,
          providerDate: user.providerData,
        };

        setUser(userInfo);

        // const q = query(collection(db, "lists", user.uid, "watchlist"));
        // const unsubscribe = onSnapshot(q, (querySnapshot) => {
        //   const films = [];
        //   querySnapshot.forEach((doc) => {
        //     films.push(doc.id);
        //   });
        //   setWatchlist(films);
        //   // console.log("Current Watchlist: ", films.join(", "));
        // });
      } else {
        // User is signed out
        setUser(null);
        console.log("User is signed out");
      }
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <SaveMenuContext.Provider
        value={{ saveMenuVisiblity, setSaveMenuVisibility, movie, setMovie }}
      >
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/account" element={<Account />} />
            <Route
              path="/film/:id"
              loader={({ params }) => {
                console.log(params);
              }}
              element={<FilmPage />}
            />
          </Route>
        </Routes>
      </SaveMenuContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
