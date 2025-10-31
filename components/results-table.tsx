import { Card } from "@/components/ui/card";
import { type Currency, formatCurrency } from "@/lib/currency";

interface RetirementYear {
  year: number;
  startBalance: number;
  withdrawal: number;
  interestEarned: number;
  endBalance: number;
}

interface ResultsTableProps {
  data: RetirementYear[];
  currency: Currency;
}

export default function ResultsTable({ data, currency }: ResultsTableProps) {
  const yearsOfRetirement = data.length;
  const finalBalance = data[data.length - 1]?.endBalance || 0;
  return (
    <Card className="border border-border bg-card p-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Years of Retirement
          </p>
          <p className="text-3xl font-bold text-foreground">
            {yearsOfRetirement}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Final Balance
          </p>
          <p
            className={`text-2xl font-bold ${
              finalBalance > 0 ? "text-green-600" : "text-destructive"
            }`}
          >
            {formatCurrency(finalBalance, currency)}
          </p>
        </div>
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-4">
        Year-by-Year Breakdown
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left font-semibold text-foreground">
                Year
              </th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">
                Start Balance
              </th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">
                Withdrawal
              </th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">
                Interest Earned
              </th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">
                End Balance
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={idx}
                className={`border-b border-border ${
                  idx % 2 === 0 ? "bg-background/50" : "bg-background"
                }`}
              >
                <td className="px-4 py-3 text-foreground font-medium">
                  {row.year}
                </td>
                <td className="px-4 py-3 text-right text-foreground">
                  {formatCurrency(row.startBalance, currency)}
                </td>
                <td className="px-4 py-3 text-right text-foreground">
                  {formatCurrency(row.withdrawal, currency)}
                </td>
                <td className="px-4 py-3 text-right text-green-600 font-medium">
                  {formatCurrency(row.interestEarned, currency)}
                </td>
                <td
                  className={`px-4 py-3 text-right font-medium ${
                    row.endBalance === 0
                      ? "text-destructive"
                      : "text-foreground"
                  }`}
                >
                  {formatCurrency(row.endBalance, currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        Table shows retirement account balance year-by-year until depletion
      </p>
    </Card>
  );
}
