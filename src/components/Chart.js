import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function Chart({ resultSet }) {
  return (
    <ResponsiveContainer width="95%" height={500}>
      <BarChart data={resultSet}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="grade" />
        <YAxis
          domain={["0", "auto"]}
          tickFormatter={(value) =>
            new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumSignificantDigits: 4,
            }).format(value)
          }
          width={100}
        />
        <Tooltip
          formatter={(value) =>
            new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumSignificantDigits: 4,
            }).format(value)
          }
        />
        <Bar
          dataKey="currentBalance"
          barSize={100}
          fill="rgba(106, 110, 229)"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
