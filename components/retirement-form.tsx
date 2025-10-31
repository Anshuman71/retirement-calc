"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Currency, CURRENCIES, formatCurrency } from "@/lib/currency";

interface RetirementInputs {
  currentExpenses: number;
  currentInvestment: number;
  expensesIncrementPerYear: number;
  expectedRateOfReturn: number;
}

interface RetirementFormProps {
  inputs: RetirementInputs;
  onInputsChange: (inputs: RetirementInputs) => void;
  onCalculate: () => void;
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  error: string | null;
  onErrorClear: () => void;
}

export default function RetirementForm({
  inputs,
  onInputsChange,
  onCalculate,
  currency,
  onCurrencyChange,
  error,
  onErrorClear,
}: RetirementFormProps) {
  const handleChange = (field: keyof RetirementInputs, value: string) => {
    onErrorClear();
    onInputsChange({
      ...inputs,
      [field]: value === "" ? 0 : Number.parseFloat(value),
    });
  };

  return (
    <Card className="border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          Retirement Parameters
        </h2>
        <div className="w-40">
          <select
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value as Currency)}
            className="w-full px-3 py-2 bg-background border border-border text-foreground rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {Object.entries(CURRENCIES).map(([key, value]) => (
              <option key={key} value={key}>
                {value.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Current Expenses */}
        <div className="space-y-2">
          <Label
            className="text-sm font-medium text-foreground"
            htmlFor="expenses"
          >
            Annual Expenses
          </Label>
          <div className="flex items-center gap-2">
            <span className="text-foreground">
              {CURRENCIES[currency].symbol}
            </span>
            <Input
              id="expenses"
              type="number"
              value={inputs.currentExpenses === 0 ? "" : inputs.currentExpenses}
              onChange={(e) => handleChange("currentExpenses", e.target.value)}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              placeholder="50000"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Your annual spending in retirement (
            {formatCurrency(inputs.currentExpenses, currency)} {currency})
          </p>
        </div>

        {/* Current Investment */}
        <div className="space-y-2">
          <Label
            className="text-sm font-medium text-foreground"
            htmlFor="investment"
          >
            Current Investment
          </Label>
          <div className="flex items-center gap-2">
            <span className="text-foreground">
              {CURRENCIES[currency].symbol}
            </span>
            <Input
              id="investment"
              type="number"
              value={
                inputs.currentInvestment === 0 ? "" : inputs.currentInvestment
              }
              onChange={(e) =>
                handleChange("currentInvestment", e.target.value)
              }
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              placeholder="1000000"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Total retirement savings available (
            {formatCurrency(inputs.currentInvestment, currency)} {currency})
          </p>
        </div>

        {/* Expenses Increment */}
        <div className="space-y-2">
          <Label
            className="text-sm font-medium text-foreground"
            htmlFor="increment"
          >
            Annual Expense Increase
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="increment"
              type="number"
              value={
                inputs.expensesIncrementPerYear === 0
                  ? ""
                  : inputs.expensesIncrementPerYear
              }
              onChange={(e) =>
                handleChange("expensesIncrementPerYear", e.target.value)
              }
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              placeholder="2.5"
              step="0.1"
            />
            <span className="text-foreground">%</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Annual inflation rate for expenses
          </p>
        </div>

        {/* Expected Return */}
        <div className="space-y-2">
          <Label
            className="text-sm font-medium text-foreground"
            htmlFor="return"
          >
            Expected Rate of Return
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="return"
              type="number"
              value={
                inputs.expectedRateOfReturn === 0
                  ? ""
                  : inputs.expectedRateOfReturn
              }
              onChange={(e) =>
                handleChange("expectedRateOfReturn", e.target.value)
              }
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              placeholder="7"
              step="0.1"
            />
            <span className="text-foreground">%</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Annual investment return percentage
          </p>
        </div>
      </div>

      <Button
        onClick={onCalculate}
        className="w-full mt-8 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
      >
        Calculate Retirement
      </Button>
    </Card>
  );
}
