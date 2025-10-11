import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../../api.js";

export default function ApplicationForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // for edit mode
  const [form, setForm] = useState({ jobId: "", coverLetter: "" });
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // fetch job list for dropdown
    axios.get("/jobs").then((res) => setJobs(res.data));

    // if editing, fetch application
    if (id) {
      axios.get(`/applications/${id}`).then((res) => {
        setForm({
          jobId: res.data.job?._id,
          coverLetter: res.data.coverLetter || "",
        });
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      await axios.put(`/applications/${id}`, form);
      alert("Application updated!");
    } else {
      await axios.post("/applications", form);
      alert("Application submitted!");
    }
    navigate("/applications");
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h2 className="text-xl font-bold mb-4">
        {id ? "Edit Application" : "Apply for a Job"}
      </h2>

      <label className="block mb-2 font-medium">Select Job:</label>
      <select
        value={form.jobId}
        onChange={(e) => setForm({ ...form, jobId: e.target.value })}
        className="border p-2 w-full mb-3"
      >
        <option value="">-- Choose a job --</option>
        {jobs.map((job) => (
          <option key={job._id} value={job._id}>
            {job.title}
          </option>
        ))}
      </select>

      <label className="block mb-2 font-medium">Cover Letter:</label>
      <textarea
        value={form.coverLetter}
        onChange={(e) => setForm({ ...form, coverLetter: e.target.value })}
        className="border p-2 w-full mb-3"
        rows="5"
      />

      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        {id ? "Update Application" : "Submit Application"}
      </button>
    </form>
  );
}
