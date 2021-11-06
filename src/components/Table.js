import React from "react";

export default function Table({ columns, data }) {
  return (
    <table className="table">
      <tbody>
        <tr>
          {columns.map(({ Header }) => (
            <th key={Header}>{Header}</th>
          ))}
        </tr>
        <tr>
          {data.map((rowData) => (
            <td key={rowData.grade}>
              {rowData.currentBalance.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}
