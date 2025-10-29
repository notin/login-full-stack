import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { userAtom } from "../atoms/auth";
import { logoutAtom } from "../atoms/authActions";
import { protectedService } from "../services/api";
import "./Dashboard.css";

export const Dashboard: React.FC = () => {
  const [user] = useAtom(userAtom);
  const [, logout] = useAtom(logoutAtom);
  const [profileData, setProfileData] = useState<any>(null);
  const [protectedData, setProtectedData] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProtectedData = async () => {
    setLoading(true);
    setError("");
    try {
      const [profile, data] = await Promise.all([
        protectedService.getProfile(),
        protectedService.getData(),
      ]);
      setProfileData(profile);
      setProtectedData(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch protected data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProtectedData();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome, {user?.email}!</p>
        </div>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="card">
          <h2>User Profile</h2>
          {loading && <p>Loading...</p>}
          {error && <div className="error-message">{error}</div>}
          {profileData && (
            <div>
              <p><strong>User ID:</strong> {profileData.user?.userId}</p>
              <p><strong>Email:</strong> {profileData.user?.email}</p>
            </div>
          )}
        </div>

        <div className="card">
          <h2>Protected Data</h2>
          {loading && <p>Loading...</p>}
          {protectedData && (
            <div>
              <p><strong>Message:</strong> {protectedData.message}</p>
              <p><strong>User ID:</strong> {protectedData.data?.userId}</p>
              <p><strong>Email:</strong> {protectedData.data?.email}</p>
              <p><strong>Timestamp:</strong> {protectedData.data?.timestamp}</p>
            </div>
          )}
          <button onClick={fetchProtectedData} className="refresh-btn">
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
};

