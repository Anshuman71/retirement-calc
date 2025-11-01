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

interface SIPResultsTableProps {
  data: SIPYear[];
  currency: Currency;
  requiredCorpus: number;
  monthlySIP: number;
  yearsToRetirement: number;
  retirementDuration: number;
}

export default function SIPResultsTable({
  data,
  currency,
  requiredCorpus,
  monthlySIP,
  yearsToRetirement,
  retirementDuration,
}: SIPResultsTableProps) {
  const finalBalance = data[data.length - 1]?.endCorpus || 0;

  return (
    <Card className="border border-border bg-card p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">
        SIP Results
      </h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Required Corpus
          </p>
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(requiredCorpus, currency)}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Monthly SIP Needed
          </p>
          <p className="text-2xl font-bold text-primary">
            {formatCurrency(monthlySIP, currency)}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Years to Retirement
          </p>
          <p className="text-2xl font-bold text-foreground">
            {yearsToRetirement}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Retirement Duration
          </p>
          <p className="text-2xl font-bold text-foreground">
            {retirementDuration}
          </p>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-4">
        Year-by-Year Breakdown
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left font-semibold text-foreground">
                Year
              </th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">
                Age
              </th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">
                Phase
              </th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">
                Investment/Withdrawal
              </th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">
                Interest Earned
              </th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">
                End Corpus
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={idx}
                className={`border-b border-border ${
                  row.phase === "accumulation"
                    ? "bg-green-50/10"
                    : "bg-purple-50/10"
                } ${idx % 2 === 0 ? "opacity-100" : "opacity-80"}`}
              >
                <td className="px-4 py-3 text-foreground font-medium">
                  {row.year}
                </td>
                <td className="px-4 py-3 text-foreground">{row.age}</td>
                <td className="px-4 py-3 text-foreground capitalize">
                  {row.phase === "accumulation" ? (
                    <span className="text-green-600 font-medium">
                      Accumulation
                    </span>
                  ) : (
                    <span className="text-purple-600 font-medium">
                      Withdrawal
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-foreground">
                  {row.phase === "accumulation" ? (
                    <span className="text-green-600">
                      {formatCurrency(row.monthlyInvestment * 12, currency)}
                    </span>
                  ) : (
                    <span className="text-purple-600">
                      -{formatCurrency(row.withdrawal, currency)}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-blue-600 font-medium">
                  {formatCurrency(row.interestEarned, currency)}
                </td>
                <td
                  className={`px-4 py-3 text-right font-medium ${
                    row.endCorpus === 0 ? "text-destructive" : "text-foreground"
                  }`}
                >
                  {formatCurrency(row.endCorpus, currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        Table shows both accumulation (saving) and withdrawal (retirement)
        phases until age 90 or corpus depletion
      </p>
    </Card>
  );
}

