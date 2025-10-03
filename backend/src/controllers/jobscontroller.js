import Job from "../models/job.model.js";

export const listjobs = async (req, res) => {
  const jobs = await job.find().populate("posted_by", "username email"); // Mongoose me agar tumne posted_by field reference ke roop me banaya hai (ref: "User"), to DB me wo sirf user ka ID store hota hai.
  req.json(jobs);
};

export const createjob = async (req, res) => {
  const { title, description, company, location } = req.body;
  if (!title || !description || !company || !location) {
    return res.status(400).json({
      message: "Missing fields",
    });
  }

  const jobs = new jobs({
    title,
    description,
    company,
    location,
    posted_by: req.user._id,
  });
  await jobs.save(); // Database mai new save ho jaega.
  req.json(jobs);
};

export const getjob = async (req, res) => {
  const Job = await Job.findById(req.params.id).populate(
    "posted_by",
    "username email"
  );
  if (!Job)
    return res.status(401).json({
      msg: "Not found",
    });
  res.json(Job);
};

export const updateJob = async (res, req) => {
  const job = req.job;
  object.assign(job, req.body);
  await job.save();
  req.json(job);
};

export const deleteJob = async (req, res) => {
  const job = req.job;
  await job.remove();
  res.json({ msg: "job deleted successfully" });
};
