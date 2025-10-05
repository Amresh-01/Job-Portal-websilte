import express from "express";
import Application from "../models/application.model.js";
import Job from "../models/job.model.js";

export const listUserApplications = async (req, res) => {
  const apps = await Application.find({ applicant: req.user._id }).populate(
    "job_listing"
  );
  res.json(apps);
};

export const createApplication = async (req, res) => {
  try {
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

    const newApp = new Application({
      job_listing,
      resume_link,
      cover_letter,
      applicant: req.user._id,
    });

    await newApp.save();

    const app = await Application.findById(newApp._id)
      .populate("job_listing", "title company_name location")
      .populate("applicant", "name email");
    res.status(201).json(app);
  } catch (error) {
    return res.status(500).json({
      msg: "Application not created..",
    });
  }
};

export const getApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id).populate(
      "job_listing",
      "username email"
    );
    console.log("Application is here ...", app);
    if (!app)
      return res.status(404).json({
        msg: "Application not found",
      });

    res.json(app);
  } catch (error) {
    console.error("Error is here in Fetching...", error);
    res.status(500).json({
      msg: "Error in Fetchin the Applications..",
    });
  }
};

export const updateApplication = async (req, res) => {
  try {
    const app = req.application;
    Object.assign(app, req.body);
    await app.save();
    res.json(app);
  } catch (error) {
    res.status(500).json({
      msg: "Error in updating Application...",
    });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted..." });
  } catch (error) {
    console.error("Error in deletin here...", error);
    res.status(500).json({
      msg: "Error in Deleting Application...",
    });
  }
};
