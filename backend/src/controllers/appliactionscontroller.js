import Application from "../models/application.model.js";
import Job from "../models/job.model.js";

export const listUserApplications = async (req, res) => {
  const apps = await Application.find({ applicant: req.user._id }).populate(
    "job_listing"
  );
  res.json(apps);
};

export const createApplication = async (req, res) => {
  const { job_listing, resume_link, cover_letter } = req.body;

  if (!job_listing)
    return res.status(400).json({ message: "job_listing is required" });

  const job = await Job.findById(job_listing);
  if (!job) return res.status(404).json({ message: "Job not found" });

  const exists = await Application.findOne({
    job_listing,
    applicant: req.user._id,
  });
  if (exists) return res.status(409).json({ message: "Already applied" });

  const app = new Application({
    job_listing,
    resume_link,
    cover_letter,
    applicant: req.user._id,
  });

  await app.save();
  res.status(201).json(app);
};

export const getApplication = async (req, res) => {
  const app = req.application;
  res.json(app);
};

export const updateApplication = async (req, res) => {
  const app = req.application;
  Object.assign(app, req.body);
  await app.save();
  res.json(app);
};

export const deleteApplication = async (req, res) => {
  await req.application.remove();
  res.json({ message: "Deleted" });
};
