import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  now_playing_api,
  popular_api,
  upcoming_api,
} from "../config/firebase.config";
import axios from "axios";
import HomeSkeleton from "./HomeSkeleton";
import Hero from "./Hero";
import FilmCarousel from "./FilmCarousel";

function Home() {
  const [nowPlaying, setNowPlaying] = useState(null);
  const [popular, setPopular] = useState(null);
  const [upcoming, setUpcoming] = useState(null);
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    axios.get(now_playing_api).then((res) => {
      setNowPlaying(res.data);
      // console.log("now playing:", res.data);
    });

    axios.get(popular_api).then((res) => {
      setPopular(res.data);
      // console.log("popular:", res.data);
    });

    axios.get(upcoming_api).then((res) => {
      setUpcoming(res.data);
      // console.log("upcoming:", res.data);
    });
  }, []);

  useEffect(() => {
    if (nowPlaying && popular && upcoming) {
      setIsLoading(false);
    }
  }, [nowPlaying, popular, upcoming]);

  if (loading) return <HomeSkeleton />;

  return (
    <div className="">
      <main className="">
        <Hero img={"/hero.jpg"} text={"Track films you want to see."} />

        {/* NOW PLAYING */}
        <div className="max-w-screen-md mx-auto mt-12 mb-12">
          <h2 className="text-sm mb-2">NOW PLAYING</h2>
          <FilmCarousel films={nowPlaying.results} />
        </div>

        {/* UPCOMING */}
        <div className="max-w-screen-md mx-auto mt-12 mb-12">
          <h2 className="text-sm mb-2">UPCOMING</h2>
          <FilmCarousel films={upcoming.results} />
        </div>

        {/* POPULAR */}
        <div className="max-w-screen-md mx-auto mt-12 mb-12">
          <h2 className="text-sm mb-2">POPULAR</h2>
          <FilmCarousel films={popular.results} />
        </div>

        {/* Copywriting */}
        <section className="max-w-screen-md mx-auto mb-10">
          {/* <h2>Discover. Track. Enjoy.</h2> */}
          <h3 className="text-2xl">
            Your Ultimate Movie and TV Show Companion
          </h3>
          <p className="mb-8">
            At CineTrack, we understand that keeping track of all the movies and
            TV shows you want to watch can be overwhelming. That's why we've
            created a platform that makes it easy to discover, organize, and
            enjoy your favorite content.
          </p>

          <h3 className="text-2xl">Explore Our Extensive Database</h3>
          <p className="mb-8">
            With an extensive collection of movies and TV shows, CineTrack is
            your go-to source for information on any title. Whether you're
            looking for the latest blockbuster, a hidden gem, or your next
            binge-worthy series, we've got you covered.
          </p>

          <h3 className="text-2xl">Personalized Watchlists</h3>
          <p className="mb-8">
            Create and customize your own watchlists with ease. Add movies and
            TV shows you want to watch later, and never miss out on anything you
            love. Our intuitive interface ensures that your watchlist is always
            just a click away.
          </p>

          <h3 className="text-2xl">Connect with a Community</h3>
          <p className="mb-8">
            Join a passionate community of movie and TV enthusiasts. Share your
            thoughts, rate titles, and see what others are saying. Discover new
            favorites through community recommendations and reviews.
          </p>

          <h3 className="text-2xl">Stay Updated</h3>
          <p className="mb-8">
            Get the latest updates on new releases, trending titles, and
            must-watch lists. With CineTrack, you'll always be in the know about
            what's hot in the world of entertainment.
          </p>

          <h3 className="text-2xl">Start Your Journey</h3>
          <p className="mb-8">
            Sign up today and start building your ultimate watchlist. Whether
            you're a casual viewer or a dedicated cinephile, CineTrack is here
            to enhance your viewing experience.
          </p>
        </section>
      </main>
    </div>
  );
}

export default Home;
