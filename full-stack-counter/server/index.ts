import express from "express";
import { connectMongo, connectRedis } from "./config/db";
import counterRoutes from "./routes/counter.routes";

async function bootstrap() {
  await Promise.all([connectMongo(), connectRedis()]);

  const app = express();
  app.use(express.json());
  app.use("/api/counter", counterRoutes);

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`🚀 Listening on ${port}`));
}

bootstrap().catch((e) => {
  console.error(e);
  process.exit(1);
});
