import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

const ApplicantDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // This GET request corresponds to your `listUserApplications` controller
        const response = await api.get("/api/applications");
        setApplications(response.data);
      } catch (err) {
        setError("Failed to fetch your applications.");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleWithdraw = async (appId) => {
    if (window.confirm("Are you sure you want to withdraw this application?")) {
      try {
        await api.delete(`/api/applications/${appId}`);
        setApplications(applications.filter((app) => app._id !== appId));
      } catch (err) {
        alert("Failed to withdraw application.");
      }
    }
  };

  if (loading) return <p>Loading your applications...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">My Applications</h2>
      {applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <h3 className="text-xl font-semibold text-blue-600">
                  {app.job_listing?.title || "Job Title Not Found"}
                </h3>
                <p className="text-gray-600">
                  {app.job_listing?.company || "Company Not Found"}
                </p>
                <p className="mt-2">
                  Status:{" "}
                  <span className="font-semibold px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                    {app.status}
                  </span>
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Link
                  to={`/jobs/${app.job_listing?._id}`}
                  className="text-blue-500 hover:underline"
                >
                  View Job
                </Link>
                <button
                  onClick={() => handleWithdraw(app._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                >
                  Withdraw
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>You have not applied to any jobs yet.</p>
      )}
    </div>
  );
};

export default ApplicantDashboard;
