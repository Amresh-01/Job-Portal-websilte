import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../../../api.js";

export default function ApplicationDetail() {
  const { id } = useParams();
  const [app, setApp] = useState(null);

  useEffect(() => {
    axios.get(`/applications/${id}`).then((res) => setApp(res.data));
  }, [id]);

  if (!app) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Application Details</h2>
      <p>
        <strong>Job:</strong> {app.job?.title}
      </p>
      <p>
        <strong>Status:</strong> {app.status}
      </p>
      <p>
        <strong>Cover Letter:</strong>
      </p>
      <p className="border p-3 rounded bg-gray-50 mt-2">{app.coverLetter}</p>

      <div className="mt-4">
        <Link to="/applications" className="text-blue-600 underline">
          ← Back to Applications
        </Link>
      </div>
    </div>
  );
}
