import React from "react";
import numeral from "numeral";

const Table = ({ data, dataType }) => {
  const countries = data?.sort((a, b) => b[dataType] - a[dataType]);
  return (
    <table className="h-1/3 w-full table-auto border-collapse border border-gray-400">
      <tbody className="table-row-group">
        {countries?.map((country) => (
          <tr key={country.country}>
            <td className="w-2/3 p-2 border border-gray-300 table-cell">
              {country.country}
            </td>
            <td className="w-1/3 p-2 border border-gray-300 table-cell">
              {numeral(country[dataType]).format("0,0")}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
