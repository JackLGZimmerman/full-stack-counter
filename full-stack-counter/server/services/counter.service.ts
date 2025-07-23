import { mongoCounterRepo } from "../repositories/mongo.counter.repo";
import { redisCounterRepo } from "../repositories/redis.counter.repo";
import type { CounterRepo } from "../repositories/counter.repo";

export type DataSource = "mongo" | "redis";

function selectRepo(source: DataSource): CounterRepo {
  return source === "mongo" ? mongoCounterRepo : redisCounterRepo;
}

export const CounterService = {
  get: (src: DataSource) => selectRepo(src).get(),
  create: (src: DataSource, n: number) => selectRepo(src).create(n),
  update: (src: DataSource, n: number) => selectRepo(src).update(n),
  destroy: (src: DataSource) => selectRepo(src).destroy(),
  analytics: (src: DataSource) => selectRepo(src).analytics(),
};
