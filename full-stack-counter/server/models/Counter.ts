import { Schema, model } from "mongoose";

const CounterSchema = new Schema(
  {
    count: { type: Number, required: true },
  },
  { timestamps: true }
);

export const CounterModel = model("Counter", CounterSchema);
