import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../../api.js";

export default function ApplicationList() {
  const [apps, setApps] = useState([]);

  const fetchApps = async () => {
    const { data } = await axios.get("/applications");
    setApps(data);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this application?")) return;
    await axios.delete(`/applications/${id}`);
    fetchApps();
  };

  useEffect(() => {
    fetchApps();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">My Applications</h2>

      <Link
        to="/applications/new"
        className="bg-green-600 text-white px-3 py-2 rounded mb-4 inline-block"
      >
        + Apply for a Job
      </Link>

      {apps.length === 0 && <p>No applications yet.</p>}

      {apps.map((app) => (
        <div key={app._id} className="border p-4 rounded mb-3">
          <p>
            <strong>Job:</strong> {app.job?.title}
          </p>
          <p>
            <strong>Status:</strong> {app.status}
          </p>

          <div className="mt-2 flex gap-3">
            <Link
              to={`/applications/${app._id}`}
              className="text-blue-600 underline"
            >
              View
            </Link>
            <Link
              to={`/applications/edit/${app._id}`}
              className="text-yellow-600 underline"
            >
              Edit
            </Link>
            <button
              onClick={() => handleDelete(app._id)}
              className="text-red-600 underline"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
