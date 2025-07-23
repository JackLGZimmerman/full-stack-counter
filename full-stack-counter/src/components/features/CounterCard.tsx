import { useState, useRef, useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CounterAnalytics } from "../../context";

interface CounterCardProps {
  image_url: string;
  database: string;
  data: CounterAnalytics | null;
  loading: boolean;
  error: boolean;
}

const CounterCard = ({ image_url, database, data, loading, error }: CounterCardProps) => {
  const queryClient = useQueryClient();
  const [counter, setCounter] = useState(0);

  const pendingDelta = useRef(0);
  const timerId = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { mutateAsync } = useMutation({
    mutationFn: async (delta: number) => {
      await fetch(`/api/counter/${database}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: delta }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["counterAnalytics", database],
      });
      setCounter(0);
    },
  });

  const flush = useCallback(async () => {
    const delta = pendingDelta.current;
    if (delta === 0) return;

    pendingDelta.current = 0;
    await mutateAsync(delta);
  }, [mutateAsync]);

  const scheduleFlush = useCallback(() => {
    if (timerId.current) clearTimeout(timerId.current);
    timerId.current = setTimeout(flush, 500);
  }, [flush]);

  useEffect(() => {
    return () => {
      if (timerId.current) {
        clearTimeout(timerId.current);
        flush();
      }
    };
  }, [flush]);

  const handleIncrement = () => {
    setCounter((c) => c + 1);
    pendingDelta.current += 1;
    scheduleFlush();
  };

  const handleDecrement = () => {
    setCounter((c) => c - 1);
    pendingDelta.current -= 1;
    scheduleFlush();
  };

  const last24 = data?.last24HourCount ?? 0;
  const current = data?.currentHourCount ?? 0;
  const previous = data?.previousHourCount ?? 0;

  const getDisplayValue = (value: number | undefined): string => {
    const defaultValue = value ?? 0;
    return loading || error ? `${defaultValue}...` : defaultValue.toString();
  };

  const getPercentageDisplay = (): string => {
    if (loading || error) return "0...% from last hour";

    const percentChange = previous === 0 ? (current > 0 ? 100 : 0) : Math.round(((current - previous) / previous) * 100);

    return `${percentChange >= 0 ? "+" : ""}${percentChange}% from last hour`;
  };

  return (
    <div className="w-full bg-white rounded-xl flex flex-col border border-gray-200 p-6">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <div className="w-20 h-20 ml-4 inline-flex self-start rounded-full items-center justify-center">
            <img src={image_url} alt="Brand logo" className="w-full h-full object-contain aspect-square" />
          </div>
          <span className="text-sm">
            view of last <strong>24 hours</strong>
          </span>
        </div>

        <div className="flex gap-1">
          <span className="text-xs font-medium bg-slate-900 text-white px-3 py-2 rounded flex  self-center">UPDATE</span>
          <button
            onClick={handleIncrement}
            disabled={loading || error}
            className="border border-slate-900 p-2 rounded flex items-center self-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-slate-900 hover:text-white transition-colors duration-300"
          >
            <span className="icon-[material-symbols-light--keyboard-arrow-up]" />
          </button>
          <button
            onClick={handleDecrement}
            disabled={loading || error}
            className="border border-slate-900 p-2 rounded flex items-center self-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-slate-900 hover:text-white transition-colors duration-300"
          >
            <span className="icon-[material-symbols-light--keyboard-arrow-down]" />
          </button>
        </div>
      </div>
      <div className="flex flex-col space-y-2 items-end">
        <div className="flex items-end gap-2">
          <span className="font-bold text-4xl">{getDisplayValue(last24)}</span>
          <span className="font-bold">
            {counter >= 0 ? "+" : "-"}
            {Math.abs(counter)}
          </span>
        </div>
        <span className="text-sm font-medium">{getPercentageDisplay()}</span>
      </div>
    </div>
  );
};


export default CounterCard;
