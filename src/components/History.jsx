import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  Filler,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

ChartJS.register(
  CategoryScale,
  Filler,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip
);

const History = ({ dataType }) => {
  const [stats, setStats] = useState([]);

  const options = {
    elements: {
      point: {
        radius: 0,
      },
    },
    responsive: true,
    aspectRatio: 1,
    maintainAspectRatio: true,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#fff",
        },
      },
      y: {
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0 a");
          },
          color: "#fff",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `COVID-19 ${dataType} history`,
        color: "#ffffff",
      },
    },
  };

  useEffect(() => {
    fetch(`https://disease.sh/v3/covid-19/historical/all?lastdays=all`)
      .then((response) => response.json())
      .then((data) => {
        const results = [];
        for (const line in data[dataType]) {
          const dataPoint = {
            x: line,
            y: data[dataType][line],
          };

          results.push(dataPoint);
        }
        setStats(results);
      });
  }, [dataType]);

  return (
    <>
      {stats?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                label: "New stats",
                data: stats,
                backgroundColor: "rgba(249, 115, 22, 0.5)",
                borderColor: "rgb(249, 115, 22)",
                color: "#fff",
                fill: true,
              },
            ],
          }}
          options={options}
        />
      )}
    </>
  );
};

export default History;
