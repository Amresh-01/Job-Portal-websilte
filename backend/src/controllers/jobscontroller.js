import Job from "../models/job.model.js";

export const listjobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("posted_by", "username email"); // Mongoose me agar tumne posted_by field reference ke roop me banaya hai (ref: "User"), to DB me wo sirf user ka ID store hota hai.
    res.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs..", error);
    return res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

export const createjob = async (req, res) => {
  try {
    const { title, description, company, location } = req.body;
    if (!title || !description || !company || !location) {
      return res.status(400).json({
        message: "Missing fields",
      });
    }

    const job = new Job({
      title,
      description,
      company,
      location,
      posted_by: req.user._id,
    });
    await job.save(); // Database mai new save ho jaega.
    return res.status(201).json(job);
  } catch (error) {
    console.error("Error in creating job", error);
    return res.status(500).json({
      msg: "job not created..",
    });
  }
};

export const getjob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "posted_by",
      "username email"
    );
    if (!job)
      return res.status(404).json({
        msg: " Job not found",
      });
    return res.status(201).json(job);
  } catch (error) {
    console.error("Error in fetching Single Job", error);
    return res.status(500).json({ msg: "Error fetching job" });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = req.job;
    if (!job)
      return res.status(404).json({
        message: "Job not found",
      });

    const allowedUpdates = ["title", "description", "location"];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        job[field] = req.body[field];
      }
    });

    await job.save();

    return res.json(job);
  } catch (error) {
    console.error("Error updating job:", error);
    return res.status(500).json({ msg: "Error updating job" });
  }
};

export const deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ msg: "job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    return res.status(500).json({ msg: "Error deleting job" });
  }
};
