"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/card";
import { type Currency, formatCurrency } from "@/lib/currency";

export interface SIPYear {
  year: number;
  age: number;
  monthlyInvestment: number;
  withdrawal: number;
  interestEarned: number;
  endCorpus: number;
  phase: "accumulation" | "withdrawal";
}

interface SIPChartProps {
  data: SIPYear[];
  currency: Currency;
}

export default function SIPChart({ data, currency }: SIPChartProps) {
  const [showInvestment, setShowInvestment] = useState(true);
  const [showCorpus, setShowCorpus] = useState(true);
  const [showWithdrawals, setShowWithdrawals] = useState(true);

  // Prepare chart data with cumulative values
  const chartData = data.map((item, idx) => {
    // Calculate cumulative investment
    let cumulativeInvestment = 0;
    for (let i = 0; i <= idx; i++) {
      cumulativeInvestment += data[i].monthlyInvestment * 12;
    }

    // Calculate cumulative withdrawals
    let cumulativeWithdrawals = 0;
    for (let i = 0; i <= idx; i++) {
      cumulativeWithdrawals += data[i].withdrawal;
    }

    return {
      year: item.year,
      age: item.age,
      investment: cumulativeInvestment,
      corpus: item.endCorpus,
      withdrawals: cumulativeWithdrawals,
    };
  });

  return (
    <Card className="border border-border bg-card p-6">
      <h2 className="text-xl font-semibold text-foreground mb-4">
        SIP Projection Over Time
      </h2>

      {/* Toggle Controls */}
      <div className="flex flex-wrap gap-4 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showInvestment}
            onChange={(e) => setShowInvestment(e.target.checked)}
            className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
          />
          <span className="text-sm text-foreground flex items-center gap-1">
            <span className="w-3 h-3 bg-green-600 rounded-full"></span>
            Investment
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showCorpus}
            onChange={(e) => setShowCorpus(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm text-foreground flex items-center gap-1">
            <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
            Corpus
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showWithdrawals}
            onChange={(e) => setShowWithdrawals(e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
          />
          <span className="text-sm text-foreground flex items-center gap-1">
            <span className="w-3 h-3 bg-purple-600 rounded-full"></span>
            Withdrawals
          </span>
        </label>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="year"
            stroke="hsl(var(--muted-foreground))"
            label={{
              value: "Year",
              position: "insideBottom",
              offset: -5,
            }}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            tickFormatter={(value) =>
              `${(value / (currency === "INR" ? 1_00_00_000 : 1_000_000)).toFixed(1)} ${
                currency === "INR" ? "Cr" : "M"
              }`
            }
            label={{
              value: "Amount",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.5rem",
            }}
            formatter={(value: number, name: string) => [
              formatCurrency(value, currency),
              name.charAt(0).toUpperCase() + name.slice(1),
            ]}
            labelFormatter={(label) => `Year ${label}`}
            labelStyle={{ color: "hsl(var(--foreground))" }}
          />
          <Legend />
          {showInvestment && (
            <Line
              type="monotone"
              dataKey="investment"
              stroke="#16a34a"
              strokeWidth={2}
              dot={false}
              name="Investment"
            />
          )}
          {showCorpus && (
            <Line
              type="monotone"
              dataKey="corpus"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
              name="Corpus"
            />
          )}
          {showWithdrawals && (
            <Line
              type="monotone"
              dataKey="withdrawals"
              stroke="#9333ea"
              strokeWidth={2}
              dot={false}
              name="Withdrawals"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

