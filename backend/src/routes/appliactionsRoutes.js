import express from "express";
import { protect } from "../middlewares/auth";
import {
  createApplication,
  deleteApplication,
  getApplication,
  listUserApplications,
  updateApplication,
} from "../controllers/appliactionscontroller";

const router = express.Router();

router.use(protect);

router.get("/", listUserApplications);
router.post("/", createApplication);
router.get("/:id", getApplication);
router.put("/:id", updateApplication);
router.patch("/:id", updateApplication);
router.delete("/:id", deleteApplication);

export default router;
