import { Link } from "react-router-dom";

function FilmCarousel({ films, header }) {
  return (
    <div className="max-w-fit mx-auto">
      <ul className="w-full flex flex-nowrap gap-3 max-w-screen-md overflow-hidden overflow-scroll overflow-y-hidden py-2 now-playing-carousel">
        {films.map((movie, i) => {
          if (!movie.poster_path) return;

          return (
            <li className="w-24 h-fit shrink-0" key={i}>
              <Link to={`/film/${movie.id}`} key={i}>
                <div className="border-transparent border-2 hover:border-blue-500 rounded transition-all overflow-hidden">
                  {movie.poster_path != null && (
                    <img
                      src={movie.poster_path}
                      width="70"
                      height="105"
                      className="aspect-[2/3] w-full h-max"
                    />
                  )}
                  {!movie.poster_path && (
                    <img
                      src="/assets/poster-placeholder.png"
                      width="70"
                      height="105"
                      className="aspect-[2/3] w-full h-max"
                    />
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default FilmCarousel;
