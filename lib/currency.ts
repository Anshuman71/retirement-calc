export type Currency = "USD" | "EUR" | "INR"

export const CURRENCIES = {
  USD: { symbol: "$", locale: "en-US", label: "USD" },
  EUR: { symbol: "€", locale: "de-DE", label: "EUR" },
  INR: { symbol: "₹", locale: "en-IN", label: "INR" },
}

export function formatCurrency(value: number, currency: Currency): string {
  const config = CURRENCIES[currency]
  return `${config.symbol}${value.toLocaleString(config.locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function formatNumber(value: number, locale: string): string {
  return value.toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}
