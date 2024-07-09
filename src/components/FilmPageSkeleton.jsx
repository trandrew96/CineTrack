import React from "react";

function FilmPageSkeleton() {
  return (
    <>
      <div>
        <div className="skeleton max-w-screen-lg mx-auto h-52 md:h-64 lg:h-96 lg:h-80 mb-8 absolute inset-0"></div>
        <div className="h-80"></div>
        <main className="md:grid md:grid-cols-8 gap-8 max-w-screen-lg mx-auto mb-48">
          <section className="skeleton md:col-span-2 flex h-72"></section>
          <section className="col-span-4 h-fit gap-8 flex flex-col">
            <div className="skeleton h-32"></div>
            <div className="skeleton h-32"></div>
            <div className="skeleton h-64"></div>
            <div className="skeleton h-12"></div>
            <div className="skeleton h-12"></div>
          </section>
          <section className="skeleton hidden md:block col-span-2 h-44"></section>
        </main>
      </div>
    </>
  );
}

export default FilmPageSkeleton;
