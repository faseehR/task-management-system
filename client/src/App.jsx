import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import CreateTask from "./components/CreateTask";
import EditTask from "./components/EditTask";
import TaskDetails from "./components/TaskDetails";
import "./index.css";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PublicOnlyRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/signup" element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/tasks/today" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/tasks/later" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/create-task" element={<ProtectedRoute><CreateTask /></ProtectedRoute>} />
          <Route path="/edit-task/:id" element={<ProtectedRoute><EditTask /></ProtectedRoute>} />
          <Route path="/task/:id" element={<ProtectedRoute><TaskDetails /></ProtectedRoute>} />
          <Route path="/" element={
            localStorage.getItem('token') ?
            <Navigate to="/dashboard" replace /> :
            <Navigate to="/login" replace />
          } />
          <Route path="*" element={
            localStorage.getItem('token') ?
            <Navigate to="/dashboard" replace /> :
            <Navigate to="/login" replace />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
