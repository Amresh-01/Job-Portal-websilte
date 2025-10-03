import Job from "../models/job.model.js";
import Application from "../models/application.model.js";

export const jobOwnerOnly = async(res, req , next){
  const jobId = req.params.jobId
  const job = await Job.findById(id);
  if(!job) return res.satus(404).json({
    msg: "Job is not found"
  })
}