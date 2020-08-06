import React from "react";
import "./Table.css";
import numeral from "numeral";

function Table({ countries }) {
  return (
    <div className="table">
      <table>
        <tbody>
          {countries.map(({ country, countryInfo, cases }) => (
            <tr key={country}>
              {/* <td>{country}</td> */}
              <td><img className="table-flag" src={countryInfo.flag} alt=""/></td>
              <td>{country}</td>
              <td>
                <strong>{numeral(cases).format(0, 0)}</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
