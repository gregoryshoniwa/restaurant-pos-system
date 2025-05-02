"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Currency = "USD" | "ZiG"

interface CurrencyContextType {
  currency: Currency
  rate: number
  toggleCurrency: () => void
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("USD")
  const rate = 24 // ZiG to USD rate

  const toggleCurrency = () => {
    setCurrency(current => current === "USD" ? "ZiG" : "USD")
  }

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        rate,
        toggleCurrency,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}

export function formatPrice(price: number, currency: Currency, rate: number): string {
  const value = currency === "ZiG" ? price * rate : price
  return `${currency === "USD" ? "$ " : "ZiG "}${value.toFixed(2)}`
}
