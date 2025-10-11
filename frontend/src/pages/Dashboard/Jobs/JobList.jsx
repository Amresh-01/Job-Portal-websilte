import React, { useEffect, useState, useContext } from "react";
import API from "../../../api";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const JobList = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch jobs from backend
  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs");
      setJobs(res.data);
    } catch (error) {
      console.error("Error fetching jobs", error);
      alert("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  // Delete job (recruiter only)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await API.delete(`/jobs/${id}`);
      setJobs(jobs.filter((job) => job._id !== id));
    } catch (err) {
      alert("Failed to delete job");
    }
  };

  // Fetch jobs when user is loaded
  useEffect(() => {
    if (user) fetchJobs();
  }, [user]);

  if (!user) return <p className="p-8 text-center">Loading user data...</p>;
  if (loading) return <p className="p-8 text-center">Loading jobs...</p>;

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-semibold">Job Listings</h1>
        {user.role === "recruiter" && (
          <button
            onClick={() => navigate("/recruiter/jobs/new")}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-pink-600 hover:to-purple-600 transition"
          >
            + Post Job
          </button>
        )}
      </div>

      {/* Jobs Grid */}
      {jobs.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No jobs available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-bold mb-2">{job.title}</h2>
                <p className="text-gray-600 mb-1">{job.company}</p>
                <p className="text-sm text-gray-500">{job.location}</p>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => navigate(`/jobs/${job._id}`)}
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  View
                </button>

                {user.role === "recruiter" && (
                  <>
                    <button
                      onClick={() =>
                        navigate(`/recruiter/jobs/edit/${job._id}`)
                      }
                      className="text-green-600 underline hover:text-green-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="text-red-600 underline hover:text-red-800"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
