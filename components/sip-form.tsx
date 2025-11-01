"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Currency, CURRENCIES, formatCurrency } from "@/lib/currency";

export interface SIPInputs {
  currentAge: number;
  retirementAge: number;
  annualExpense: number;
  expectedInflation: number;
  expectedReturnDuringInvestment: number;
  expectedReturnAfterRetirement: number;
}

interface SIPFormProps {
  inputs: SIPInputs;
  onInputsChange: (inputs: SIPInputs) => void;
  onCalculate: () => void;
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  error: string | null;
  onErrorClear: () => void;
}

export default function SIPForm({
  inputs,
  onInputsChange,
  onCalculate,
  currency,
  onCurrencyChange,
  error,
  onErrorClear,
}: SIPFormProps) {
  const handleChange = (field: keyof SIPInputs, value: string) => {
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
          SIP Parameters
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
        {/* Current Age */}
        <div className="space-y-2">
          <Label
            className="text-sm font-medium text-foreground"
            htmlFor="currentAge"
          >
            Current Age
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="currentAge"
              type="number"
              value={inputs.currentAge === 0 ? "" : inputs.currentAge}
              onChange={(e) => handleChange("currentAge", e.target.value)}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              placeholder="30"
            />
            <span className="text-foreground">years</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Your current age
          </p>
        </div>

        {/* Retirement Age */}
        <div className="space-y-2">
          <Label
            className="text-sm font-medium text-foreground"
            htmlFor="retirementAge"
          >
            Retirement Age
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="retirementAge"
              type="number"
              value={inputs.retirementAge === 0 ? "" : inputs.retirementAge}
              onChange={(e) => handleChange("retirementAge", e.target.value)}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              placeholder="60"
            />
            <span className="text-foreground">years</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Age when you plan to retire
          </p>
        </div>

        {/* Annual Expense */}
        <div className="space-y-2">
          <Label
            className="text-sm font-medium text-foreground"
            htmlFor="annualExpense"
          >
            Annual Expense (at retirement)
          </Label>
          <div className="flex items-center gap-2">
            <span className="text-foreground">
              {CURRENCIES[currency].symbol}
            </span>
            <Input
              id="annualExpense"
              type="number"
              value={inputs.annualExpense === 0 ? "" : inputs.annualExpense}
              onChange={(e) => handleChange("annualExpense", e.target.value)}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              placeholder="1200000"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Expected annual expenses at retirement (
            {formatCurrency(inputs.annualExpense, currency)} {currency})
          </p>
        </div>

        {/* Expected Inflation */}
        <div className="space-y-2">
          <Label
            className="text-sm font-medium text-foreground"
            htmlFor="expectedInflation"
          >
            Expected Inflation
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="expectedInflation"
              type="number"
              value={
                inputs.expectedInflation === 0 ? "" : inputs.expectedInflation
              }
              onChange={(e) =>
                handleChange("expectedInflation", e.target.value)
              }
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              placeholder="6"
              step="0.1"
            />
            <span className="text-foreground">%</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Annual inflation rate for expenses
          </p>
        </div>

        {/* Expected Return During Investment */}
        <div className="space-y-2">
          <Label
            className="text-sm font-medium text-foreground"
            htmlFor="returnDuringInvestment"
          >
            Return During Investment
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="returnDuringInvestment"
              type="number"
              value={
                inputs.expectedReturnDuringInvestment === 0
                  ? ""
                  : inputs.expectedReturnDuringInvestment
              }
              onChange={(e) =>
                handleChange("expectedReturnDuringInvestment", e.target.value)
              }
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              placeholder="12"
              step="0.1"
            />
            <span className="text-foreground">%</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Expected annual return during accumulation phase
          </p>
        </div>

        {/* Expected Return After Retirement */}
        <div className="space-y-2">
          <Label
            className="text-sm font-medium text-foreground"
            htmlFor="returnAfterRetirement"
          >
            Return After Retirement (Post-tax)
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="returnAfterRetirement"
              type="number"
              value={
                inputs.expectedReturnAfterRetirement === 0
                  ? ""
                  : inputs.expectedReturnAfterRetirement
              }
              onChange={(e) =>
                handleChange("expectedReturnAfterRetirement", e.target.value)
              }
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              placeholder="8"
              step="0.1"
            />
            <span className="text-foreground">%</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Expected annual return post-retirement (after tax)
          </p>
        </div>
      </div>

      <Button
        onClick={onCalculate}
        className="w-full mt-8 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
      >
        Calculate SIP
      </Button>
    </Card>
  );
}

