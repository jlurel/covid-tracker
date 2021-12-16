import React, { useEffect, useState } from "react";
import numeral from "numeral";

import History from "./components/History";
import StatCard from "./components/StatCard";
import Map from "./components/Map";
import "leaflet/dist/leaflet.css";
import Table from "./components/Table";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState();
  const [countries, setCountries] = useState([]);
  const [countriesData, setCountriesData] = useState([]);
  const [mapCenter, setMapCenter] = useState([46, 2]);
  const [mapZoom, setMapZoom] = useState(2);
  const [dataType, setDataType] = useState("cases");

  const handleSelectChange = async (event) => {
    const requestUrl =
      event.target.value === "worldwide"
        ? `https://disease.sh/v3/covid-19/all`
        : `https://disease.sh/v3/covid-19/countries/${event.target.value}`;

    await fetch(requestUrl)
      .then((response) => response.json())
      .then((data) => {
        setStats(data);
        if (event.target.value !== "worldwide") {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(5);
        } else {
          setMapCenter([46, 2]);
          setMapZoom(2);
        }
      });
  };

  useEffect(() => {
    const getGlobalStats = async () => {
      setLoading(true);
      await fetch(`https://disease.sh/v3/covid-19/all`)
        .then((response) => response.json())
        .then((data) => {
          setStats(data);
          setLoading(false);
        });
    };
    getGlobalStats();
  }, []);

  useEffect(() => {
    const getCountries = async () => {
      setLoading(true);
      await fetch(`https://disease.sh/v3/covid-19/countries`)
        .then((response) => response.json())
        .then((data) => {
          const results = data.map((country) => ({
            name: country.country,
            iso: country.countryInfo.iso3,
          }));
          setCountries(results);
          const sortedResults = data.sort((a, b) => b.cases - a.cases);
          setCountriesData(sortedResults);
          setLoading(false);
        });
    };

    getCountries();
  }, []);

  return (
    !loading && (
      <div className="container h-full mx-auto p-6 bg-slate-100 dark:bg-gray-900">
        <div className="h-5/6 max-h-screen grid grid-cols-1 md:gap-4 md:grid-cols-3">
          <div className="col-span-2 overflow-auto p-2 rounded bg-white dark:bg-gray-700 dark:text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-between">
              <h1 className="text-lg md:text-2xl text-center md:text-left font-bold">
                Covid-19 Tracker
              </h1>
              <select
                name="countries"
                id="countries"
                className="w-2/3 border-2 border-slate-300 rounded p-2 place-self-center md:place-self-end dark:bg-gray-700 dark:text-white"
                onChange={handleSelectChange}
              >
                <option value="worldwide">Worldwide</option>
                {countries?.map((country) => (
                  <option value={country.iso} key={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <StatCard
                title="Coronavirus cases"
                today={numeral(stats?.todayCases).format("0 a")}
                total={numeral(stats?.cases).format("0 a")}
                color="text-orange-500"
                active={dataType === "cases"}
                onClick={() => setDataType("cases")}
              />
              <StatCard
                title="Recovered"
                today={numeral(stats?.todayRecovered).format("0 a")}
                total={numeral(stats?.recovered).format("0 a")}
                color="text-green-500"
                active={dataType === "recovered"}
                onClick={() => setDataType("recovered")}
              />
              <StatCard
                title="Coronavirus cases"
                today={numeral(stats?.todayDeaths).format("0 a")}
                total={numeral(stats?.deaths).format("0 a")}
                color="text-red-500"
                active={dataType === "deaths"}
                onClick={() => setDataType("deaths")}
              />
            </div>
            <Map
              countries={countriesData}
              center={mapCenter}
              zoom={mapZoom}
              dataType={dataType}
            />
          </div>
          <div className="max-h-fit my-2 md:my-0 py-2 rounded bg-white dark:bg-gray-700 dark:text-white">
            <h2 className="text-xl text-center capitalize">{`${dataType} by country`}</h2>
            <div className="max-h-48 lg:max-h-96 mx-6 border-2 border-slate-100 overflow-y-scroll shadow-md rounded">
              <Table data={countriesData} dataType={dataType} />
            </div>
            <div className="max-h-fit px-2 rounded shadow-xl m-6 bg-slate-700 dark:shadow-slate-900">
              <History dataType={dataType} />
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default App;
