import { Request, Response } from "express";
import { CounterService, DataSource } from "../services/counter.service";

const toSrc = (req: Request) => req.params.source as DataSource;

/* ────────────────  READ  ──────────────── */
export async function getCounter(req: Request, res: Response) {
  try {
    const count = await CounterService.get(toSrc(req));
    return res.json({ count });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Fetch failed" });
  }
}

/* ────────────────  CREATE  ──────────────── */
export async function postCounter(req: Request, res: Response) {
  try {
    const { count } = req.body as { count: number };
    const newValue = await CounterService.create(toSrc(req), count);
    return res.status(201).json({ count: newValue });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Create failed" });
  }
}

/* ────────────────  UPDATE  ──────────────── */
export async function updateCounter(req: Request, res: Response) {
  try {
    const { newValue } = req.body as { newValue: number };
    const count = await CounterService.update(toSrc(req), newValue);
    return res.json({ count });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Update failed" });
  }
}

/* ────────────────  DELETE  ──────────────── */
export async function deleteCounter(req: Request, res: Response) {
  try {
    await CounterService.destroy(toSrc(req));
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Delete failed" });
  }
}

/* ────────────────  ANALYTICS  ──────────────── */
export async function analyticsCounter(req: Request, res: Response) {
  try {
    const analytics = await CounterService.analytics(toSrc(req));
    return res.json(analytics);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Analytics failed" });
  }
}