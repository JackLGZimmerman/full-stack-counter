import { getRedis } from "../config/db";
import { CounterRepo } from "./counter.repo";

const KEY = "counter:value"; // single‐value total
const ZKEY = "counter:history"; // sorted‐set of events

export const redisCounterRepo: CounterRepo = {
  async get() {
    const client = getRedis();
    return Number((await client.get(KEY)) ?? 0);
  },

  async create(delta: number) {
    const client = getRedis();

    const now = Date.now();
    await client.zAdd(ZKEY, [
      {
        score: now,
        value: JSON.stringify({ ts: now, delta }),
      },
    ]);
  },

  async update(n: number) {
    const client = getRedis();
    await client.set(KEY, n);
    return Number(n);
  },

  async destroy() {
    const client = getRedis();
    await client.del(KEY);
    await client.del(ZKEY);
  },

  async analytics() {
    const client = getRedis();
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;
    const twoHoursAgo = now - 2 * 60 * 60 * 1000;
    const twentyFourAgo = now - 24 * 60 * 60 * 1000;

    // 1) Pull members (JSON strings) in each time window
    const [currMembers, prevMembers, last24Members] = await Promise.all([
      // node-redis >=4: zRange with BY SCORE
      client.zRange(ZKEY, oneHourAgo, now, { BY: "SCORE" }),
      client.zRange(ZKEY, twoHoursAgo, oneHourAgo, { BY: "SCORE" }),
      client.zRange(ZKEY, twentyFourAgo, now, { BY: "SCORE" }),
    ]);

    // 2) Helper to sum deltas from JSON members
    const sumDeltas = (members: string[]) =>
      members.reduce((sum, member) => {
        try {
          const { delta } = JSON.parse(member);
          return sum + (typeof delta === "number" ? delta : 0);
        } catch {
          return sum;
        }
      }, 0);

    return {
      currentHourCount: sumDeltas(currMembers),
      previousHourCount: sumDeltas(prevMembers),
      last24HourCount: sumDeltas(last24Members),
    };
  },
};
