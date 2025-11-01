"use client";

import { useState } from "react";

import RetirementForm from "@/components/retirement-form";
import ResultsTable from "@/components/results-table";
import CorpusChart from "@/components/corpus-chart";
import SIPForm, { type SIPInputs } from "@/components/sip-form";
import SIPResultsTable, { type SIPYear } from "@/components/sip-results-table";
import SIPChart from "@/components/sip-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  // Corpus Calculator State
  const [inputs, setInputs] = useState<RetirementInputs>({
    currentExpenses: 12_00_000,
    currentInvestment: 1_00_00_000,
    expensesIncrementPerYear: 6,
    expectedRateOfReturn: 10,
  });

  const [results, setResults] = useState<RetirementYear[]>([]);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // SIP Calculator State
  const [sipInputs, setSipInputs] = useState<SIPInputs>({
    currentAge: 30,
    retirementAge: 60,
    annualExpense: 12_00_000,
    expectedInflation: 6,
    expectedReturnDuringInvestment: 12,
    expectedReturnAfterRetirement: 8,
  });

  const [sipResults, setSipResults] = useState<SIPYear[]>([]);
  const [sipHasCalculated, setSipHasCalculated] = useState(false);
  const [sipError, setSipError] = useState<string | null>(null);
  const [requiredCorpus, setRequiredCorpus] = useState(0);
  const [monthlySIP, setMonthlySIP] = useState(0);

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

  const handleSIPCalculate = () => {
    // Validation
    if (!sipInputs.currentAge || sipInputs.currentAge <= 0) {
      setSipError("Current Age must be greater than 0");
      return;
    }
    if (
      !sipInputs.retirementAge ||
      sipInputs.retirementAge <= sipInputs.currentAge
    ) {
      setSipError("Retirement Age must be greater than Current Age");
      return;
    }
    if (sipInputs.retirementAge >= 90) {
      setSipError("Retirement Age must be less than 90");
      return;
    }
    if (!sipInputs.annualExpense || sipInputs.annualExpense <= 0) {
      setSipError("Annual Expense must be greater than 0");
      return;
    }
    if (sipInputs.expectedInflation < 0) {
      setSipError("Expected Inflation cannot be negative");
      return;
    }
    if (sipInputs.expectedReturnDuringInvestment < 0) {
      setSipError("Expected Return During Investment cannot be negative");
      return;
    }
    if (sipInputs.expectedReturnAfterRetirement < 0) {
      setSipError("Expected Return After Retirement cannot be negative");
      return;
    }

    setSipError(null);

    // Step 1: Calculate required corpus at retirement
    // We need to find the corpus that will last until age 90 with the given withdrawal and returns
    const yearsInRetirement = 90 - sipInputs.retirementAge;
    const targetAge = 90;

    // Calculate the corpus needed at retirement using present value of annuity formula
    // considering inflation-adjusted withdrawals
    let calculatedCorpus = 0;
    let testExpense = sipInputs.annualExpense;
    const postRetirementRate = sipInputs.expectedReturnAfterRetirement / 100;
    const inflationRate = sipInputs.expectedInflation / 100;

    // Calculate using year-by-year simulation to be accurate
    for (let year = 0; year < yearsInRetirement; year++) {
      const discountFactor = Math.pow(1 + postRetirementRate, year + 1);
      calculatedCorpus += testExpense / discountFactor;
      testExpense *= 1 + inflationRate;
    }

    setRequiredCorpus(calculatedCorpus);

    // Step 2: Calculate monthly SIP needed
    const yearsToRetirement = sipInputs.retirementAge - sipInputs.currentAge;
    const monthsToRetirement = yearsToRetirement * 12;
    const monthlyRate = sipInputs.expectedReturnDuringInvestment / 100 / 12;

    // Using Future Value of SIP formula: FV = P × [(1 + r)^n - 1] / r × (1 + r)
    // Solving for P: P = FV × r / [(1 + r)^n - 1] / (1 + r)
    let calculatedMonthlySIP = 0;
    if (monthlyRate === 0) {
      calculatedMonthlySIP = calculatedCorpus / monthsToRetirement;
    } else {
      const numerator = calculatedCorpus * monthlyRate;
      const denominator =
        (Math.pow(1 + monthlyRate, monthsToRetirement) - 1) * (1 + monthlyRate);
      calculatedMonthlySIP = numerator / denominator;
    }

    setMonthlySIP(calculatedMonthlySIP);

    // Step 3: Generate year-by-year data
    const yearData: SIPYear[] = [];
    let currentCorpus = 0;
    let currentYear = 1;
    let currentAge = sipInputs.currentAge;

    // Accumulation Phase
    for (let year = 0; year < yearsToRetirement; year++) {
      const yearlyInvestment = calculatedMonthlySIP * 12;
      const startCorpus = currentCorpus;

      // Add monthly investments throughout the year
      for (let month = 0; month < 12; month++) {
        currentCorpus += calculatedMonthlySIP;
        currentCorpus *= 1 + monthlyRate;
      }

      const interestEarned = currentCorpus - startCorpus - yearlyInvestment;

      yearData.push({
        year: currentYear,
        age: currentAge,
        monthlyInvestment: calculatedMonthlySIP,
        withdrawal: 0,
        interestEarned,
        endCorpus: currentCorpus,
        phase: "accumulation",
      });

      currentYear++;
      currentAge++;
    }

    // Withdrawal Phase
    let currentExpense = sipInputs.annualExpense;
    while (currentCorpus > 0 && currentAge < targetAge) {
      const withdrawal = Math.min(currentExpense, currentCorpus);
      currentCorpus -= withdrawal;

      const interestEarned =
        (currentCorpus * sipInputs.expectedReturnAfterRetirement) / 100;
      currentCorpus += interestEarned;

      yearData.push({
        year: currentYear,
        age: currentAge,
        monthlyInvestment: 0,
        withdrawal,
        interestEarned,
        endCorpus: Math.max(0, currentCorpus),
        phase: "withdrawal",
      });

      currentExpense *= 1 + inflationRate;
      currentYear++;
      currentAge++;

      if (currentYear > 100) break;
    }

    setSipResults(yearData);
    setSipHasCalculated(true);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Retirement Calculator
          </h1>
          <p className="text-muted-foreground text-lg">
            Plan your financial future with our comprehensive calculators
          </p>
        </div>

        <Tabs defaultValue="corpus" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="corpus">Corpus Calculator</TabsTrigger>
            <TabsTrigger value="sip">SIP Calculator</TabsTrigger>
          </TabsList>

          <TabsContent value="corpus">
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
          </TabsContent>

          <TabsContent value="sip">
            <SIPForm
              inputs={sipInputs}
              onInputsChange={setSipInputs}
              onCalculate={handleSIPCalculate}
              currency={currency}
              onCurrencyChange={setCurrency}
              error={sipError}
              onErrorClear={() => setSipError(null)}
            />

            {sipHasCalculated && (
              <div className="space-y-6 my-8">
                <SIPChart data={sipResults} currency={currency} />

                <SIPResultsTable
                  data={sipResults}
                  currency={currency}
                  requiredCorpus={requiredCorpus}
                  monthlySIP={monthlySIP}
                  yearsToRetirement={
                    sipInputs.retirementAge - sipInputs.currentAge
                  }
                  retirementDuration={90 - sipInputs.retirementAge}
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
