import { CounterModel } from "../models/Counter";
import { CounterRepo } from "./counter.repo";

export const mongoCounterRepo: CounterRepo = {
  async get() {
    const result = await CounterModel.aggregate([{ $group: { _id: null, total: { $sum: "$count" } } }]);
    return result[0].total ?? 0;
  },
  async create(count: number) {
    await CounterModel.create({ count })
  },
  async update(val) {
    return (await CounterModel.findOneAndUpdate({}, { count: val }, { new: true, upsert: true }).lean())!.count;
  },
  async destroy() {
    await CounterModel.deleteMany({});
  },
  async analytics() {
    const now = Date.now();
    const oneHourAgo = new Date(now - 1 * 60 * 60 * 1000);
    const twoHoursAgo = new Date(now - 2 * 60 * 60 * 1000);
    const twentyFourAgo = new Date(now - 24 * 60 * 60 * 1000);

    const [current, previous, last24] = await Promise.all([
      CounterModel.aggregate([
        { $match: { createdAt: { $gt: oneHourAgo } } }, 
        { $group: { _id: null, total: { $sum: "$count" } } }
      ]),
      CounterModel.aggregate([
        { $match: { createdAt: { $gt: twoHoursAgo, $lt: oneHourAgo } } },
        { $group: { _id: null, total: { $sum: "$count" } } },
      ]),
      CounterModel.aggregate([{ $match: { createdAt: { $gt: twentyFourAgo } } }, { $group: { _id: null, total: { $sum: "$count" } } }]),
    ]);

    return {
      last24HourCount: last24[0]?.total ?? 0,
      currentHourCount: current[0]?.total ?? 0,
      previousHourCount: previous[0]?.total ?? 0,
    };
  },
};
