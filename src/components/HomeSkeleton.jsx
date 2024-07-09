import React from "react";

function HomeSkeleton() {
  return (
    <div>
      <div className="skeleton max-w-screen-lg mx-auto h-52 md:h-64 lg:h-96 lg:h-80 mb-8 absolute inset-0"></div>
      <div className="h-80"></div>
      <main className="max-w-screen-md mx-auto mb-48">
        <div className="skeleton h-32 mb-8"></div>
        <div className="skeleton h-32 mb-8"></div>
        <div className="skeleton h-32 mb-8"></div>
        <div className="skeleton h-32 mb-8"></div>
        <div className="skeleton h-32 mb-8"></div>
        <div className="skeleton h-32 mb-8"></div>
      </main>
    </div>
  );
}

export default HomeSkeleton;
