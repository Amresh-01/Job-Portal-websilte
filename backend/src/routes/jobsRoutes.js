import express from "express";
import { protect } from "../middlewares/auth";
import {
  createjob,
  deleteJob,
  getjob,
  listjobs,
  updateJob,
} from "../controllers/jobscontroller";

const router = express.Router();

router.use(protect);

router.get("/", listjobs);
router.post("/", createjob);
router.get("/:id", getjob);
router.put("/:id", updateJob);
router.patch("/:id", updateJob);
router.delete("/:id", deleteJob);

export default router;
