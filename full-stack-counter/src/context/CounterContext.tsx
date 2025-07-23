import { createContext, useContext } from "react";
import type { ReactNode } from 'react';
import { useCounter } from "../hooks/useCounter";

type CounterQuery = ReturnType<typeof useCounter>;

type CounterContextType = {
  mongo: CounterQuery;
  redis: CounterQuery;
};

const CounterContext = createContext<CounterContextType | undefined>(undefined);

export function CounterProvider({ children }: { children: ReactNode }) {
  const mongo = useCounter("mongo");
  const redis = useCounter("redis");
  return <CounterContext.Provider value={{ mongo, redis }}>{children}</CounterContext.Provider>;
}

export function useCounterContext(): CounterContextType {
  const ctx = useContext(CounterContext);
  if (!ctx) {
    throw new Error("useCounterContext must be used within CounterProvider");
  }
  return ctx;
}
