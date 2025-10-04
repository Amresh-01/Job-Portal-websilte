import Job from "../models/job.model.js";
import Application from "../models/application.model.js";

export const jobOwnerOnly = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    if (!job)
      return res.satus(404).json({
        msg: "Job not found",
      });
    if (job.posted_by.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Forbidden" });
    req.job = job;
    next();
  } catch (error) {
    res.status(404).json({
      message: "Server error",
      err: err.message,
    });
  }
};

export const applicationOwnerOnly = async (req, res, next) => {
  try {
    const appId = req.params.id;
    const application = await Application.findById(appId);
    if (!application)
      return res.satus(404).json({
        msg: "Application not found",
      });
    if (application.applicant.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Forbidden" });
    req.application = application;
    next();
  } catch (error) {
    res.status(404).json({
      message: "Server error",
      err: err.message,
    });
  }
};
