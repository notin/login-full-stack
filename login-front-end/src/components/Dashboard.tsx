import React, { useState, useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import { userAtom, pageViewAtom } from "../atoms/auth";
import { logoutAtom } from "../atoms/authActions";
import { protectedService } from "../services/api";
import "./Dashboard.css";

export const Dashboard: React.FC = () => {
  const [user] = useAtom(userAtom);
  const [, logout] = useAtom(logoutAtom);
  const setPageView = useSetAtom(pageViewAtom);
  const [profileData, setProfileData] = useState<any>(null);
  const [protectedData, setProtectedData] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    skills: "",
    profile_image_url: "",
  });

  const handleLogout = () => {
    logout();
    setPageView("login");
  };

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
      
      // Initialize form data
      if (profile?.user) {
        setFormData({
          name: profile.user.name || "",
          bio: profile.user.bio || "",
          skills: Array.isArray(profile.user.skills) ? profile.user.skills.join(", ") : "",
          profile_image_url: profile.user.profile_image_url || "",
        });
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch protected data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateUrl = (url: string): boolean => {
    if (!url) return true; // URL is optional
    try {
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
      new URL(url.startsWith("http") ? url : `http://${url}`);
      return urlPattern.test(url);
    } catch {
      return false;
    }
  };

  const handleSaveProfile = async () => {
    setError("");
    
    // Validate URL
    if (formData.profile_image_url && !validateUrl(formData.profile_image_url)) {
      setError("Invalid profile image URL format");
      return;
    }

    setLoading(true);
    try {
      const updateData: any = {};
      if (formData.name !== undefined) updateData.name = formData.name || null;
      if (formData.bio !== undefined) updateData.bio = formData.bio || null;
      if (formData.skills !== undefined) {
        updateData.skills = formData.skills.trim() 
          ? formData.skills.split(",").map((s: string) => s.trim()).filter((s: string) => s.length > 0)
          : null;
      }
      if (formData.profile_image_url !== undefined) {
        updateData.profile_image_url = formData.profile_image_url || null;
      }

      const response = await protectedService.updateProfile(updateData);
      setProfileData({ user: response.user });
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProtectedData();
  }, []);

  const profileUser = profileData?.user;
  const skillsArray = Array.isArray(profileUser?.skills) ? profileUser.skills : [];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome, {profileUser?.email || user?.email || "User"}!</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="card profile-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2>User Profile</h2>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="edit-btn">
                Edit Profile
              </button>
            )}
          </div>
          
          {loading && <p>Loading...</p>}
          {error && <div className="error-message">{error}</div>}
          
          {!isEditing && profileUser && (
            <div className="profile-view">
              {profileUser.profile_image_url && (
                <div className="profile-image-container">
                  <img 
                    src={profileUser.profile_image_url} 
                    alt="Profile" 
                    className="profile-image"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
              <p><strong>User ID:</strong> {profileUser.userId || profileUser.id}</p>
              <p><strong>Email:</strong> {profileUser.email}</p>
              {profileUser.name && <p><strong>Name:</strong> {profileUser.name}</p>}
              {profileUser.bio && <p><strong>Bio:</strong> {profileUser.bio}</p>}
              {skillsArray.length > 0 && (
                <div className="skills-container">
                  <strong>Skills:</strong>
                  <div className="skills-tags">
                    {skillsArray.map((skill: string, index: number) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {isEditing && (
            <div className="profile-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself"
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label htmlFor="skills">Skills/Tools (comma-separated)</label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="JavaScript, React, Node.js"
                />
              </div>

              <div className="form-group">
                <label htmlFor="profile_image_url">Profile Image URL</label>
                <input
                  type="url"
                  id="profile_image_url"
                  name="profile_image_url"
                  value={formData.profile_image_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="form-actions">
                <button onClick={handleSaveProfile} className="save-btn" disabled={loading}>
                  {loading ? "Saving..." : "Save Profile"}
                </button>
                <button onClick={() => {
                  setIsEditing(false);
                  // Reset form data
                  if (profileUser) {
                    setFormData({
                      name: profileUser.name || "",
                      bio: profileUser.bio || "",
                      skills: Array.isArray(profileUser.skills) ? profileUser.skills.join(", ") : "",
                      profile_image_url: profileUser.profile_image_url || "",
                    });
                  }
                }} className="cancel-btn">
                  Cancel
                </button>
              </div>
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

