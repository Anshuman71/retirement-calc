"use client";

import { useState } from "react";

import RetirementForm from "@/components/retirement-form";
import ResultsTable from "@/components/results-table";
import CorpusChart from "@/components/corpus-chart";
import type { Currency } from "@/lib/currency";

interface RetirementInputs {
  currentExpenses: number;
  currentInvestment: number;
  expensesIncrementPerYear: number;
  expectedRateOfReturn: number;
}

interface RetirementYear {
  year: number;
  startBalance: number;
  withdrawal: number;
  interestEarned: number;
  endBalance: number;
}

export default function Page() {
  const [currency, setCurrency] = useState<Currency>("INR");

  const [inputs, setInputs] = useState<RetirementInputs>({
    currentExpenses: 12_00_000,
    currentInvestment: 1_00_00_000,
    expensesIncrementPerYear: 6,
    expectedRateOfReturn: 10,
  });

  const [results, setResults] = useState<RetirementYear[]>([]);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    if (!inputs.currentExpenses || inputs.currentExpenses <= 0) {
      setError("Annual Expenses must be greater than 0");
      return;
    }
    if (!inputs.currentInvestment || inputs.currentInvestment <= 0) {
      setError("Current Investment must be greater than 0");
      return;
    }
    if (inputs.expensesIncrementPerYear < 0) {
      setError("Annual Expense Increase cannot be negative");
      return;
    }
    if (inputs.expectedRateOfReturn < 0) {
      setError("Expected Rate of Return cannot be negative");
      return;
    }

    setError(null);

    const yearData: RetirementYear[] = [];
    let currentBalance = inputs.currentInvestment;
    let currentExpenses = inputs.currentExpenses;
    let year = 1;

    while (currentBalance > 0) {
      const startBalance = currentBalance;
      const withdrawal = Math.min(currentExpenses, currentBalance);
      currentBalance -= withdrawal;

      const interestEarned =
        (currentBalance * inputs.expectedRateOfReturn) / 100;
      currentBalance += interestEarned;

      yearData.push({
        year,
        startBalance,
        withdrawal,
        interestEarned,
        endBalance: Math.max(0, currentBalance),
      });

      currentExpenses *= 1 + inputs.expensesIncrementPerYear / 100;
      year++;

      if (year > 100) break;
    }

    setResults(yearData);
    setHasCalculated(true);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Retirement Calculator
          </h1>
          <p className="text-muted-foreground text-lg">
            Estimate how long your retirement investments will last
          </p>
        </div>

        <RetirementForm
          inputs={inputs}
          onInputsChange={setInputs}
          onCalculate={handleCalculate}
          currency={currency}
          onCurrencyChange={setCurrency}
          error={error}
          onErrorClear={() => setError(null)}
        />

        {hasCalculated && (
          <div className="space-y-6 my-8">
            <CorpusChart data={results} currency={currency} />

            <ResultsTable data={results} currency={currency} />
          </div>
        )}
      </div>
    </main>
  );
}
