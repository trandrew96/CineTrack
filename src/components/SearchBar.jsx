import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "./icons/SearchIcon";

function SearchBar({ autoFocus }) {
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (event) => {
    event.preventDefault();
    setTitle("");

    navigate(`/search?s=${title}`);
  };

  return (
    <form onSubmit={handleSearch}>
      <div className="block flex rounded bg-gray-500">
        <input
          value={title}
          className="p-2 w-full bg-transparent text-black focus:outline-none placeholder:text-slate-900"
          placeholder="Search Movies... "
          onChange={(e) => setTitle(e.target.value)}
          id="search"
          autoFocus={autoFocus}
        />
        <button className="bg-transparent p-2" type="submit">
          <SearchIcon fill="#000" />
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
