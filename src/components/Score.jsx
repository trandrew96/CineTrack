import React from "react";

function Score({ score }) {
  let bgColor;
  switch (true) {
    case score < 5:
      bgColor = "bg-red-500";
      break;
    case score < 6.5:
      bgColor = "bg-yellow-500";
      break;
    default:
      bgColor = "bg-green-500";
  }

  if (score == 0) return;

  return (
    <div className="text-center">
      <h3 className="mb-2">Score</h3>
      <div
        className={
          "w-fit mx-auto rounded-full p-3 text-black text-xl font-bold mb-2 " +
          bgColor
        }
      >
        {String(score).slice(0, 3)}
      </div>
      {/* <span className="text-sm italic">({film.vote_count} votes)</span> */}
    </div>
  );
}

export default Score;
