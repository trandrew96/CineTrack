import { useContext } from "react";
import { SaveMenuContext } from "./context";

function ToggleSaveMenu({ movie, className }) {
  const { setSaveMenuVisibility, setMovie } = useContext(SaveMenuContext);

  // console.log(movie);

  return (
    <button
      onClick={() => {
        setMovie(movie);
        setSaveMenuVisibility(true);
      }}
      className={className}
    >
      Save to a list
    </button>
  );
}

export default ToggleSaveMenu;
