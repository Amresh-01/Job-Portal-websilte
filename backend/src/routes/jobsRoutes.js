import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  createjob,
  deleteJob,
  getjob,
  listjobs,
  updateJob,
} from "../controllers/jobscontroller.js";
import { jobOwnerOnly } from "../middlewares/ownership.js";

const router = express.Router();

router.use(protect);

router.get("/", listjobs);
router.post("/", createjob);
router.get("/:id", getjob);
router.put("/:id", jobOwnerOnly, updateJob);
router.patch("/:id", jobOwnerOnly, updateJob);
router.delete("/:id", jobOwnerOnly, deleteJob);

export default router;
