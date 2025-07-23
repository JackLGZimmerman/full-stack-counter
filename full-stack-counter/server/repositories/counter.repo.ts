export interface CounterRepo {
  get(): Promise<number>;
  create(n: number): Promise<void>;
  update(n: number): Promise<number>;
  destroy(): Promise<void>;
  analytics(): Promise<{
    last24HourCount: number;
    currentHourCount: number;
    previousHourCount: number;
  }>;
}
