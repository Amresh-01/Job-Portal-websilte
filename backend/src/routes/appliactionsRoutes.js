import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  createApplication,
  deleteApplication,
  getApplication,
  listUserApplications,
  updateApplication,
} from "../controllers/appliactionscontroller.js";
import { applicationOwnerOnly } from "../middlewares/ownership.js";

const router = express.Router();

router.use(protect);

router.get("/", listUserApplications);
router.post("/", createApplication);
router.get("/:id", applicationOwnerOnly, getApplication);
router.put("/:id", applicationOwnerOnly, updateApplication);
router.patch("/:id", applicationOwnerOnly, updateApplication);
router.delete("/:id", applicationOwnerOnly, deleteApplication);

export default router;
