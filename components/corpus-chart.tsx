"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";
import { type Currency, formatCurrency } from "@/lib/currency";

interface RetirementYear {
  year: number;
  startBalance: number;
  withdrawal: number;
  interestEarned: number;
  endBalance: number;
}

interface CorpusChartProps {
  data: RetirementYear[];
  currency: Currency;
}

export default function CorpusChart({ data, currency }: CorpusChartProps) {
  const chartData = data.map((item) => ({
    year: item.year,
    balance: item.endBalance,
    balancenInCr: item.endBalance / 1000000,
  }));

  return (
    <Card className="border border-border bg-card p-6">
      <h2 className="text-xl font-semibold text-foreground mb-4">
        Corpus Over Time
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="#16a34a"
                stopOpacity={0.3}
              />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="year" 
            stroke="hsl(var(--muted-foreground))"
            axisLine={{ stroke: "hsl(var(--muted-foreground))" }}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            axisLine={{ stroke: "hsl(var(--muted-foreground))" }}
            tickFormatter={(value) =>
              `${value / (currency === "INR" ? 1_00_00_000 : 1_000_000)} ${
                currency === "INR" ? "Cr" : "M"
              }`
            }
            tickCount={10}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.5rem",
            }}
            formatter={(value: number) => formatCurrency(value, currency)}
            labelStyle={{ color: "hsl(var(--foreground))" }}
          />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#16a34a"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorBalance)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
