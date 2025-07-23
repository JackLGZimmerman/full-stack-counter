import { useQuery } from "@tanstack/react-query";

export interface CounterAnalytics {
  last24HourCount: number;
  currentHourCount: number;
  previousHourCount: number;
}

export function useCounter(source: "mongo" | "redis") {
  return useQuery<CounterAnalytics>({
    queryKey: ["counterAnalytics", source],
    queryFn: async () => {
      const res = await fetch(`/api/counter/analytics/${source}`);
      if (!res.ok) throw new Error("Network error");
      return res.json();
    },
    staleTime: 30_000,
  });
}
