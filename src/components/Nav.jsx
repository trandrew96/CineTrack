import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "./context";

import SearchBar from "./SearchBar";
import SearchIcon from "./icons/SearchIcon";
import MenuIcon from "./icons/MenuIcon";
import Close from "./icons/Close";

export default function Nav() {
  const { user } = useContext(UserContext);
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setMenuVisible(false);
    setSearchVisible(false);
  }, [location]);

  return (
    <>
      {/* DESKTOP NAV */}
      <nav className="sm:flex gap-10 items-center py-2 px-4 max-w-screen-lg w-full mx-auto z-50 nav-gradient font-bold">
        <div className="sm:mr-auto flex">
          <Link to="/">CineTrack</Link>

          {/* Open mobile-nav btn */}
          {!menuVisible && (
            <button
              className="ml-auto mr-2 sm:hidden"
              onClick={() => {
                setMenuVisible(!menuVisible);
                setSearchVisible(false);
              }}
            >
              <MenuIcon></MenuIcon>
            </button>
          )}
          {/* Close mobile-nav btn */}
          {menuVisible && (
            <button
              className="ml-auto mr-2 sm:hidden"
              onClick={() => {
                setMenuVisible(!menuVisible);
                setSearchVisible(false);
              }}
            >
              <Close />
            </button>
          )}

          {/* Open mobile searchbar */}
          <button
            onClick={() => {
              setSearchVisible(!searchVisible);
              setMenuVisible(false);
            }}
            className="sm:hidden"
          >
            <SearchIcon></SearchIcon>
          </button>
        </div>

        <div className="hidden sm:block">
          {user && (
            <>
              <Link to="/account" className="mr-5">
                Account
              </Link>
              <Link to="/watchlist">My Lists</Link>
            </>
          )}
        </div>

        {!user && (
          <>
            <Link to="/login" className="sm:block hidden">
              Sign In
            </Link>
            {/* <Link to="/signup">Sign Up</Link> */}
          </>
        )}
        {/* Desktop Searchbar */}
        <div className="hidden sm:block">
          <SearchBar />
        </div>
      </nav>

      {/* MOBILE NAV */}
      {menuVisible && (
        <nav className="bg-[#111419] drop-shadow-2xl w-full pl-4 pr-12 z-10 pb-6 absolute top-10">
          <ul>
            {!user && (
              <li>
                <Link to="/login">Sign In</Link>
              </li>
            )}
            {user && (
              <>
                <li>
                  <Link to="/account" className="md:mr-5">
                    Account
                  </Link>
                </li>
                <li>
                  <Link to="/watchlist">My Lists</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}

      {/* Mobile Searchbar */}
      {searchVisible && (
        <>
          <div className="bg-[#111419] drop-shadow-2xl w-full px-6 z-10 pb-6 absolute md:hidden top-10">
            <SearchBar autoFocus={true} />
          </div>
        </>
      )}
    </>
  );
}
