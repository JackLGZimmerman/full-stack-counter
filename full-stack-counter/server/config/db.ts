import dotenv from "dotenv";
import mongoose from "mongoose";
import { createClient, RedisClientType } from "redis";

dotenv.config();

/* ──────────────────────────────────────────────────────────── */
/*  1. MongoDB                                                  */
/* ──────────────────────────────────────────────────────────── */
export async function connectMongo(): Promise<void> {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("Missing MONGO_URI in env");

  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

/* ──────────────────────────────────────────────────────────── */
/*  2. Redis                                                    */
/* ──────────────────────────────────────────────────────────── */
let redisClient: RedisClientType;

export async function connectRedis(): Promise<void> {
  // Expect a single URI, e.g.:
  //   REDIS_URI=redis://:password@host:6379
  // or
  //   REDIS_URI=rediss://:password@host:6379   (for TLS)
  const url = process.env.REDIS_URI;
  if (!url) throw new Error("Missing REDIS_URI in env");

  redisClient = createClient({ url });

  redisClient.on("error", (err) => console.error("Redis Client Error", err));
  await redisClient.connect();
  console.log("✅ Redis connected");
}

export function getRedis(): RedisClientType {
  if (!redisClient) {
    throw new Error("Redis client not initialized. Call connectRedis() first.");
  }
  return redisClient;
}

/* ──────────────────────────────────────────────────────────── */
/*  3. Graceful shutdown                                        */
/* ──────────────────────────────────────────────────────────── */
async function closeAll() {
  try {
    if (redisClient?.isOpen) await redisClient.quit();
    await mongoose.disconnect();
    console.log("👋 Closed DB connections");
  } catch (err) {
    console.error("Error during shutdown:", err);
  }
}

process.on("SIGTERM", async () => {
  await closeAll();
  process.exit(0);
});
process.on("SIGINT", async () => {
  await closeAll();
  process.exit(0);
});
