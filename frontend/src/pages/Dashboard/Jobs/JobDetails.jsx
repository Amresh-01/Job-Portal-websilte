import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../../api";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    API.get(`/jobs/${id}`).then((res) => setJob(res.data));
  }, [id]);

  if (!job) return <p className="p-8 text-center">Loading job details...</p>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
      <p className="text-gray-600 mb-2">{job.company}</p>
      <p className="text-sm text-gray-500 mb-4">{job.location}</p>
      <p>{job.description}</p>
    </div>
  );
};

export default JobDetails;
