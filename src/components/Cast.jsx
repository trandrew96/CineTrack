import { useState } from "react";

function Cast({ cast }) {
  const [castList, setCastlist] = useState(cast.slice(0, 29));

  return (
    <>
      <h3 className="mb-2">CAST</h3>{" "}
      <div className="flex flex-wrap">
        {castList.map((member, i) => {
          return (
            <span
              className="rounded mr-2 mb-2 px-2 bg-[#282b2f] text-gray-200"
              key={i}
            >
              {member.name}
            </span>
          );
        })}
        {castList.length <= 29 && cast.length > 29 && (
          <button
            className="rounded px-2 mb-2 bg-[#282b2f] text-gray-200"
            onClick={() => setCastlist(cast)}
          >
            Show All...
          </button>
        )}
      </div>
    </>
  );
}

export default Cast;
