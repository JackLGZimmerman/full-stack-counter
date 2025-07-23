import { Router } from "express";
import * as C from "../controllers/counter.controller";

const r = Router();

r.get("/:source", C.getCounter);
r.post("/:source", C.postCounter);
r.put("/:source", C.updateCounter);
r.delete("/:source", C.deleteCounter);
r.get("/analytics/:source", C.analyticsCounter);

export default r;
