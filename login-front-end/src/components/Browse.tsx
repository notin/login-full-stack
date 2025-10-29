import React, { useState, useEffect } from "react";
import { protectedService } from "../services/api";
import "./Browse.css";

interface UserResult {
  id: string;
  userId?: string;
  email: string;
  name?: string;
  bio?: string;
  skills?: string[];
  profile_image_url?: string;
}

type SearchFilter = "name" | "email" | "id" | "skills";

export const Browse: React.FC = () => {
  const [searchFilter, setSearchFilter] = useState<SearchFilter>("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<UserResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setUsers([]);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const results = await protectedService.searchUsers(searchFilter, searchQuery);
      setUsers(results.users || []);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Failed to search users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const debounceTimer = setTimeout(() => {
        handleSearch();
      }, 500);
      return () => clearTimeout(debounceTimer);
    } else {
      setUsers([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, searchFilter]);

  return (
    <div className="browse-container">
      <div className="browse-header">
        <h1>Browse Users</h1>
        <p>Search for users by name, email, ID, or skills</p>
      </div>

      <div className="search-section">
        <div className="search-controls">
          <select
            className="search-dropdown"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value as SearchFilter)}
          >
            <option value="name">Search by Name</option>
            <option value="email">Search by Email</option>
            <option value="id">Search by ID</option>
            <option value="skills">Search by Skills</option>
          </select>
          <input
            type="text"
            className="search-input"
            placeholder={
              searchFilter === "name"
                ? "Enter name..."
                : searchFilter === "email"
                ? "Enter email..."
                : searchFilter === "id"
                ? "Enter user ID..."
                : "Enter skill (e.g., JavaScript, React)..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="results-section">
        {loading && <div className="loading">Searching...</div>}
        {!loading && searchQuery && users.length === 0 && !error && (
          <div className="no-results">No users found matching your search.</div>
        )}
        {!loading && searchQuery.trim().length < 2 && (
          <div className="search-hint">Enter at least 2 characters to search</div>
        )}

        {users.length > 0 && (
          <div className="users-grid">
            {users.map((user) => (
              <div key={user.id || user.userId} className="user-card">
                {user.profile_image_url && (
                  <div className="user-avatar">
                    <img
                      src={user.profile_image_url}
                      alt={user.name || "User"}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
                {!user.profile_image_url && (
                  <div className="user-avatar-placeholder">
                    {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                  </div>
                )}
                <div className="user-info">
                  <h3>{user.name || "No name"}</h3>
                  <p className="user-email">{user.email}</p>
                  <p className="user-id">ID: {user.userId || user.id}</p>
                  {user.bio && <p className="user-bio">{user.bio}</p>}
                  {user.skills && user.skills.length > 0 && (
                    <div className="user-skills">
                      {user.skills.map((skill: string, index: number) => (
                        <span key={index} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

