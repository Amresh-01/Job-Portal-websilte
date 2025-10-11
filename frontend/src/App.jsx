import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import React from "react";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import JobList from "./pages/Dashboard/Jobs/JobList.jsx";
import JobForm from "./pages/Dashboard/Jobs/JobForm.jsx";
import ApplicationList from "./pages/Dashboard/Application/ApplicationList.jsx";
import ApplicationForm from "./pages/Dashboard/Application/ApplicationForm.jsx";
import ApplicationDetail from "./pages/Dashboard/Application/ApplicationDetail.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Jobs */}
          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <JobList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/post-job"
            element={
              <ProtectedRoute>
                <JobForm />
              </ProtectedRoute>
            }
          />

          {/* Applications CRUD */}
          <Route
            path="/applications"
            element={
              <ProtectedRoute>
                <ApplicationList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications/new"
            element={
              <ProtectedRoute>
                <ApplicationForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications/edit/:id"
            element={
              <ProtectedRoute>
                <ApplicationForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications/:id"
            element={
              <ProtectedRoute>
                <ApplicationDetail />
              </ProtectedRoute>
            }
          />

          {/* Default */}
          <Route path="*" element={<Navigate to="/jobs" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
