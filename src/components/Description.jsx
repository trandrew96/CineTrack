import React, { useState } from "react";

function Description({ description }) {
  const [displayFull, setDisplayFull] = useState(false);

  if (description.length <= 200)
    return (
      <p className="text-sm text-gray-400 mb-4 text-wrap">
        <>{description}</>
      </p>
    );

  return (
    <p className="text-sm text-gray-400 mb-4 text-wrap">
      {displayFull && (
        <>
          {description}
          <span
            className="text-white hover:cursor-pointer"
            onClick={() => setDisplayFull(!displayFull)}
          >
            {" "}
            x
          </span>
        </>
      )}

      {!displayFull && (
        <>
          {description.substring(0, 200)}
          <span
            className="text-white hover:cursor-pointer"
            onClick={() => setDisplayFull(!displayFull)}
          >
            {" "}
            ...more
          </span>
        </>
      )}
    </p>
  );
}

export default Description;
