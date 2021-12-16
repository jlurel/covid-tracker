import React from "react";
import numeral from "numeral";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";

const SetViewOnClick = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);

  return null;
};

const Map = ({ center, countries, zoom, dataType }) => {
  const options = {
    cases: {
      pathOptions: { color: "orange" },
      size: 100,
    },
    deaths: {
      pathOptions: { color: "red" },
      size: 50,
    },
    recovered: {
      pathOptions: { color: "green" },
      size: 100,
    },
  };

  return (
    <div className="map h-max rounded shadow-xl mx-6 bg-slate-700">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {countries?.map((country) => {
          const lat = country.countryInfo.lat;
          const long = country.countryInfo.long;

          const latLong = [lat, long];

          return (
            <CircleMarker
              key={country.country}
              center={latLong}
              pathOptions={options[dataType].pathOptions}
              radius={Math.sqrt(country[dataType]) / options[dataType].size}
            >
              <Popup>
                <div className="container text-left">
                  <img src={country.countryInfo.flag} alt={country.country} />
                  <h1 className="text-xs text-center">{country.country}</h1>
                  <p className="my-1">{`Cases: ${numeral(country.cases).format(
                    "0,0"
                  )}`}</p>
                  <p className="my-1">{`Recovered: ${numeral(
                    country.recovered
                  ).format("0,0")}`}</p>
                  <p className="my-1">{`Deaths: ${numeral(
                    country.deaths
                  ).format("0,0")}`}</p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
        <SetViewOnClick center={center} zoom={zoom} />
      </MapContainer>
    </div>
  );
};

export default Map;
