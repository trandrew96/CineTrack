import React from "react";

function WatchProviders({ providers }) {
  if (!providers) return;

  let rentBuyProviders;
  let rentBuyProvidersHeading;

  if (providers?.rent && providers?.buy) {
    rentBuyProviders = providers.rent;
    rentBuyProvidersHeading = "Rent/Buy";
  } else if (providers?.rent) {
    rentBuyProviders = providers.rent;
    rentBuyProvidersHeading = "Rent";
  } else if (providers?.buy) {
    rentBuyProviders = providers.buy;
    rentBuyProvidersHeading = "Buy";
  }

  return (
    <div>
      <h3>WHERE TO WATCH (🇨🇦)</h3>
      {providers?.flatrate && (
        <>
          <h3>Stream</h3>
          <div className="flex flex-wrap mb-2 gap-2">
            {providers.flatrate.map((provider, i) => (
              <img
                src={provider.logo_path}
                className="w-8 h-8 mb-2 rounded"
                key={i}
              />
            ))}
          </div>
        </>
      )}

      {rentBuyProviders && (
        <>
          <h3>{rentBuyProvidersHeading}</h3>
          <div className="flex flex-wrap mb-2 gap-2">
            {rentBuyProviders.map((provider, i) => (
              <img
                src={provider.logo_path}
                className="w-8 h-8 mb-2 rounded"
                key={i}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default WatchProviders;
