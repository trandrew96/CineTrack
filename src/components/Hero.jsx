import React from "react";

function Hero({ img, text }) {
  if (!img) return;

  return (
    <>
      <div className="h-52 lg:h-80"></div>
      <section
        className="hero max-w-screen-lg mt-10 sm:mt-0 h-52 md:h-64 lg:h-96 w-full bg-[center_top_-.5rem] bg-cover bg-no-repeat mx-auto md:mb-8 absolute inset-0"
        style={{ backgroundImage: `url('${img}')` }}
      >
        <div className="hero-gradient h-full">
          {text && (
            <h1 className="text-lg md:text-2xl lg:text-4xl text-center absolute bottom-20 w-full">
              {text}
            </h1>
          )}
        </div>
      </section>
      {/*  bg-gradient-to-r from-[#111419] via-transparent to-[#111419] */}
    </>
  );
}

export default Hero;
