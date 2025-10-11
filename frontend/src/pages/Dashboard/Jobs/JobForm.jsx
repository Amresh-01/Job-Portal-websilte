import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../api";

const JobForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
  });

  useEffect(() => {
    if (isEditing) {
      API.get(`/jobs/${id}`).then((res) => setForm(res.data));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await API.put(`/jobs/${id}`, form);
      } else {
        await API.post("/jobs", form);
      }
      navigate("/recruiter/jobs");
    } catch (error) {
      alert("Error saving job");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        {isEditing ? "Edit Job" : "Post New Job"}
      </h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg bg-white p-6 rounded-lg shadow"
      >
        <input
          type="text"
          placeholder="Job Title"
          className="w-full p-2 border mb-3 rounded"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Company"
          className="w-full p-2 border mb-3 rounded"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          className="w-full p-2 border mb-3 rounded"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        <textarea
          placeholder="Description"
          className="w-full p-2 border mb-3 rounded h-32"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {isEditing ? "Update Job" : "Create Job"}
        </button>
      </form>
    </div>
  );
};

export default JobForm;
