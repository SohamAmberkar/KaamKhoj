import React, { useState, useEffect } from "react";

// --- 1. STYLES OBJECT ---
// All styles are in this file to prevent import errors
const styles = {
  // Main Layout
  body: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    margin: 0,
    padding: 0,
    backgroundColor: "#ffffff",
    color: "#34495e",
    lineHeight: 1.6,
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    width: "100%",
    backgroundColor: "#ffffff",
    padding: "15px 40px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px",
    boxSizing: "border-box", // Fix for full-width padding
  },
  main: {
    flex: 1, // Takes up remaining vertical space
    padding: "25px 40px",
    backgroundColor: "#ffffff",
    overflowY: "auto", // Main content area is scrollable
  },
  // Logo & Header
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  logoImg: { height: "50px", width: "auto", borderRadius: "8px" },
  logoText: {
    fontSize: "2.2em",
    fontWeight: 700,
    color: "#2980b9",
    margin: 0,
  },
  logoTextSpan: { color: "#27ae60" },
  toggleSwitch: {
    display: "flex",
    alignItems: "center",
    fontWeight: 500,
    color: "#34495e",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: "10px",
  },
  toggleLabel: { margin: "0 10px" },
  logoutButton: {
    backgroundColor: "#c0392b",
    color: "#ffffff",
    padding: "8px 15px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9em",
    fontWeight: 500,
  },
  // Headings
  h2: {
    color: "#34495e",
    borderBottom: "2px solid #ecf0f1",
    paddingBottom: "10px",
    marginTop: 0,
  },
  h3: {
    color: "#34495e",
    borderBottom: "2px solid #ecf0f1",
    paddingBottom: "10px",
    marginTop: "30px",
    fontSize: "1.5em",
  },
  // Job Grid
  jobListingsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
    paddingBottom: "10px",
  },
  // Job Card
  jobCard: {
    border: "1px solid #ddd",
    borderLeft: "5px solid #2980b9",
    borderRadius: "8px",
    padding: "20px",
    backgroundColor: "#fcfcfc",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  jobCardTitle: {
    marginTop: 0,
    marginBottom: "15px",
    color: "#2980b9",
    fontSize: "1.3em",
  },
  jobCardText: { margin: "6px 0", fontSize: "0.95em" },
  jobCardSalary: {
    fontWeight: 700,
    color: "#27ae60",
    fontSize: "1.1em",
    marginTop: "10px",
  },
  // Buttons
  btn: {
    display: "inline-block",
    width: "100%",
    textAlign: "center",
    marginTop: "15px",
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1.05em",
    fontWeight: 500,
  },
  applyBtn: { backgroundColor: "#27ae60", color: "#ffffff" },
  postJobBtn: { backgroundColor: "#2980b9", color: "#ffffff" },
  btnDisabled: { backgroundColor: "#bdc3c7", cursor: "not-allowed" },
  // Status Pill
  statusPill: {
    marginTop: "15px",
    padding: "8px",
    borderRadius: "6px",
    fontWeight: 500,
    textAlign: "center",
    fontSize: "0.95em",
    color: "#ffffff",
  },
  // Job Form
  jobPostForm: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "20px",
    padding: "25px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fdfdfd",
  },
  formInput: {
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "1em",
  },
  // Job Templates (NEW)
  templateContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "20px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fdfdfd",
  },
  templateButton: {
    backgroundColor: "#eaf2f8",
    color: "#2980b9",
    border: "1px solid #a9cce3",
    padding: "10px 15px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9em",
    fontWeight: "500",
  },
  templateButtonDisabled: {
    backgroundColor: "#eaf2f8",
    color: "#a9cce3",
    border: "1px solid #a9cce3",
    padding: "10px 15px",
    borderRadius: "6px",
    cursor: "not-allowed",
    fontSize: "0.9em",
    fontWeight: "500",
  },
  // Loading / Empty
  loadingContainer: {
    textAlign: "center",
    padding: "40px",
    color: "#7f8c8d",
  },
  loadingSpinner: {
    border: "4px solid #ecf0f1",
    borderTop: "4px solid #2980b9",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    animation: "spin 1s linear infinite",
    margin: "0 auto 15px auto",
  },
  emptyState: {
    textAlign: "center",
    padding: "40px",
    color: "#7f8c8d",
  },
  // Auth Forms
  authContainer: {
    maxWidth: "400px",
    margin: "auto",
    padding: "25px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  authForm: { display: "flex", flexDirection: "column", gap: "15px" },
  authTitle: { textAlign: "center", color: "#34495e", marginBottom: "10px" },
  authToggle: {
    textAlign: "center",
    marginTop: "15px",
    cursor: "pointer",
    color: "#2980b9",
    textDecoration: "underline",
  },
  authRadioGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    margin: "10px 0",
  },
  errorMessage: {
    color: "#c0392b",
    textAlign: "center",
    padding: "10px",
    backgroundColor: "#fbe9e7",
    borderRadius: "6px",
  },
  // Application Modal
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
    width: "90%",
    maxWidth: "500px",
    zIndex: 1001,
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #ecf0f1",
    paddingBottom: "10px",
  },
  modalTitle: { margin: 0, color: "#2980b9" },
  modalCloseBtn: {
    fontSize: "1.8em",
    border: "none",
    background: "none",
    cursor: "pointer",
    color: "#7f8c8d",
  },
  modalBody: {
    marginTop: "20px",
  },
  modalJobDetail: {
    fontSize: "1.1em",
    margin: "5px 0",
  },
  modalTextarea: {
    width: "100%",
    minHeight: "100px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "1em",
    marginTop: "15px",
    boxSizing: "border-box",
  },
  modalActions: {
    marginTop: "25px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },
  modalBtn: {
    padding: "10px 20px",
  },

  // Employer Dashboard
  employerJobSection: {
    marginBottom: "30px",
    border: "1px solid #ecf0f1",
    borderRadius: "8px",
  },
  employerJobHeader: {
    backgroundColor: "#fdfdfd",
    padding: "15px 20px",
    borderBottom: "1px solid #ecf0f1",
  },
  employerJobTitle: {
    margin: 0,
    fontSize: "1.4em",
  },
  applicantList: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  applicantCard: {
    border: "1px solid #ddd",
    borderRadius: "6px",
    padding: "15px",
  },
  applicantEmail: {
    fontWeight: "600",
    fontSize: "1.1em",
    margin: "0 0 10px 0",
  },
  applicantMessage: {
    fontStyle: "italic",
    color: "#555",
    backgroundColor: "#f9f9f9",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #eee",
  },
  applicantStatus: {
    marginTop: "10px",
    fontWeight: "500",
  },
  applicantActions: {
    marginTop: "15px",
    display: "flex",
    gap: "10px",
  },
  approveBtn: {
    backgroundColor: "#27ae60",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  rejectBtn: {
    backgroundColor: "#c0392b",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },

  // Analytics Dashboard (NEW)
  analyticsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },
  statCard: {
    backgroundColor: "#fdfdfd",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
  },
  statTitle: {
    fontSize: "1.1em",
    fontWeight: "600",
    color: "#34495e",
    margin: "0 0 10px 0",
  },
  statValue: {
    fontSize: "2.5em",
    fontWeight: "700",
    color: "#2980b9",
    margin: 0,
  },
  chartContainer: {
    backgroundColor: "#fdfdfd",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    marginTop: "20px",
    gridColumn: "1 / -1", // Make chart span full width
  },
  chartTitle: {
    fontSize: "1.3em",
    fontWeight: "600",
    color: "#34495e",
    margin: "0 0 20px 0",
  },
  barChart: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: "250px",
    borderLeft: "2px solid #ecf0f1",
    borderBottom: "2px solid #ecf0f1",
    padding: "10px",
  },
  barWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
  },
  bar: {
    width: "60%",
    backgroundColor: "#3498db",
    transition: "height 0.5s ease-out",
  },
  barLabel: {
    marginTop: "8px",
    fontSize: "0.9em",
    fontWeight: "500",
  },
  barValue: {
    marginBottom: "5px",
    fontSize: "1.1em",
    fontWeight: "600",
  },

  // Global Styles
  globalStyle: `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    html, body, #root {
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
      overflow: hidden;
    }
  `,
};

// --- 2. API CONFIG ---
const API_URL = "http://localhost:5001";

// --- 3. HELPER COMPONENTS ---

/**
 * Header Component
 */
const Header = ({ userRole, onLogout }) => (
  <header style={styles.header}>
    <div style={styles.logoContainer}>
      <img
        src="https://placehold.co/100x100/2980b9/ffffff?text=KK&font=sans-serif"
        alt="KaamKhoj Logo"
        style={styles.logoImg}
      />
      <h1 style={styles.logoText}>
        Kaam<span style={styles.logoTextSpan}>Khoj</span>
      </h1>
    </div>
    <div style={styles.toggleSwitch}>
      {userRole && (
        <span style={{ ...styles.toggleLabel, textTransform: "capitalize" }}>
          Hi, {userRole}
        </span>
      )}
      <button onClick={onLogout} style={styles.logoutButton}>
        Logout
      </button>
    </div>
  </header>
);

/**
 * JobCard Component
 * This is used for both available jobs and the worker's "My Applications" list.
 */
const JobCard = ({ job, onApplyClick, isApplied, applicationStatus }) => {
  let statusStyle = {};
  let statusText = applicationStatus;

  if (isApplied) {
    switch (applicationStatus) {
      case "Approved":
        statusStyle = { backgroundColor: "#27ae60" }; // Green
        break;
      case "Rejected":
        statusStyle = { backgroundColor: "#c0392b" }; // Red
        break;
      case "Under Review":
      default:
        statusStyle = { backgroundColor: "#f39c12" }; // Orange
        statusText = "Under Review";
        break;
    }
  }

  return (
    <div style={styles.jobCard}>
      <div>
        <h3 style={styles.jobCardTitle}>{job.title}</h3>
        <p style={styles.jobCardText}>Employer: {job.employer}</p>
        <p style={styles.jobCardText}>Location: {job.location}</p>
        <p style={styles.jobCardText}>Type: {job.type}</p>
        <p style={{ ...styles.jobCardText, ...styles.jobCardSalary }}>
          {job.salary}
        </p>
      </div>
      {!isApplied && (
        <button
          style={{ ...styles.btn, ...styles.applyBtn }}
          onClick={() => onApplyClick(job)}
        >
          Apply Now
        </button>
      )}
      {isApplied && (
        <div style={{ ...styles.statusPill, ...statusStyle }}>
          Status: {statusText}
        </div>
      )}
    </div>
  );
};

/**
 * JobForm (Employer)
 * Now accepts setIsInteracting to pause polling
 */
const JobForm = ({ onJobPost, token, userEmail, setIsInteracting }) => {
  const [title, setTitle] = useState("");
  // Employer name is pre-filled from user's email (or they can change it)
  const [employerName, setEmployerName] = useState(userEmail.split("@")[0]); // Default to email username
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [type, setType] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPosting(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, employerName, location, salary, type }),
      });
      if (!response.ok) throw new Error("Failed to post job");
      await onJobPost(); // This now just triggers a refresh in the parent
      // Clear form
      setTitle("");
      setLocation("");
      setSalary("");
      setType("");
      // Don't clear employerName, as it's likely the same
    } catch (err) {
      setError(err.message);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <form style={styles.jobPostForm} onSubmit={handleSubmit}>
      {error && <p style={styles.errorMessage}>{error}</p>}
      <input
        style={styles.formInput}
        placeholder="Job Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onFocus={() => setIsInteracting(true)} // <-- Pauses polling
        onBlur={() => setIsInteracting(false)} // <-- Resumes polling
        required
      />
      <input
        style={styles.formInput}
        placeholder="Your Name / Company Name"
        value={employerName}
        onChange={(e) => setEmployerName(e.target.value)}
        onFocus={() => setIsInteracting(true)} // <-- Pauses polling
        onBlur={() => setIsInteracting(false)} // <-- Resumes polling
        required
      />
      <input
        style={styles.formInput}
        placeholder="Salary"
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
        onFocus={() => setIsInteracting(true)} // <-- Pauses polling
        onBlur={() => setIsInteracting(false)} // <-- Resumes polling
        required
      />
      <input
        style={styles.formInput}
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        onFocus={() => setIsInteracting(true)} // <-- Pauses polling
        onBlur={() => setIsInteracting(false)} // <-- Resumes polling
        required
      />
      <select
        style={styles.formInput}
        value={type}
        onChange={(e) => setType(e.target.value)}
        onFocus={() => setIsInteracting(true)} // <-- Pauses polling
        onBlur={() => setIsInteracting(false)} // <-- Resumes polling
        required
      >
        <option value="">Select Type</option>
        <option value="Full-time">Full-time</option>
        <option value="Part-time">Part-time</option>
        <option value="Contract">Contract</option>
      </select>
      <button
        type="submit"
        style={{
          ...styles.btn,
          ...styles.postJobBtn,
          ...(isPosting ? styles.btnDisabled : {}),
        }}
        disabled={isPosting}
      >
        {isPosting ? "Posting..." : "Post Job"}
      </button>
    </form>
  );
};

/**
 * JobTemplate (Employer - NEW)
 * Shows a list of templates for quick posting
 */
const JobTemplate = ({ onJobPost, token, userEmail, setIsInteracting }) => {
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(null); // Track which template is posting

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(`${API_URL}/api/job-templates`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch templates");
        const data = await response.json();
        setTemplates(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTemplates();
  }, [token]);

  const handleTemplatePost = async (template) => {
    setIsPosting(template.title); // Set loading state for this button
    setIsInteracting(true); // Pause polling
    try {
      const response = await fetch(`${API_URL}/api/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: template.title,
          employerName: userEmail.split("@")[0], // Use default name
          location: template.location,
          salary: template.salary,
          type: template.type,
        }),
      });
      if (!response.ok) throw new Error("Failed to post job from template");
      await onJobPost(); // Refresh data
    } catch (err) {
      console.error(err);
      alert("Error posting from template: " + err.message);
    } finally {
      setIsPosting(null); // Clear loading state
      setIsInteracting(false); // Resume polling
    }
  };

  if (isLoading) return <p>Loading templates...</p>;

  return (
    <div style={styles.templateContainer}>
      {templates.map((template, index) => (
        <button
          key={index}
          style={
            isPosting === template.title
              ? styles.templateButtonDisabled
              : styles.templateButton
          }
          onClick={() => handleTemplatePost(template)}
          disabled={isPosting === template.title}
        >
          {isPosting === template.title
            ? "Posting..."
            : `Post: ${template.title}`}
        </button>
      ))}
    </div>
  );
};

/**
 * AuthPage (Login/Register)
 */
const AuthPage = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("worker");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const url = isLogin ? `${API_URL}/auth/login` : `${API_URL}/auth/register`;
    const payload = isLogin ? { email, password } : { email, password, role };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Auth failed");
      if (isLogin) {
        localStorage.setItem("kaamkhoj_token", data.token);
        localStorage.setItem("kaamkhoj_user", JSON.stringify(data.user));
        onAuthSuccess(data.token, data.user);
      } else {
        alert("Registration successful! Please log in.");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.authContainer}>
      <h2 style={styles.authTitle}>{isLogin ? "Login" : "Register"}</h2>
      {error && <p style={styles.errorMessage}>{error}</p>}
      <form style={styles.authForm} onSubmit={handleSubmit}>
        <input
          type="email"
          style={styles.formInput}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          style={styles.formInput}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {!isLogin && (
          <div style={styles.authRadioGroup}>
            <label>
              <input
                type="radio"
                value="worker"
                checked={role === "worker"}
                onChange={(e) => setRole(e.target.value)}
              />{" "}
              Worker
            </label>
            <label>
              <input
                type="radio"
                value="employer"
                checked={role === "employer"}
                onChange={(e) => setRole(e.target.value)}
              />{" "}
              Employer
            </label>
            <label>
              <input
                type="radio"
                value="admin"
                checked={role === "admin"}
                onChange={(e) => setRole(e.target.value)}
              />{" "}
              Admin
            </label>
          </div>
        )}
        <button
          type="submit"
          style={{
            ...styles.btn,
            ...styles.postJobBtn,
            ...(isLoading ? styles.btnDisabled : {}),
          }}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : isLogin ? "Login" : "Register"}
        </button>
      </form>
      <p style={styles.authToggle} onClick={() => setIsLogin(!isLogin)}>
        {isLogin
          ? "Don't have an account? Register"
          : "Already have an account? Login"}
      </p>
    </div>
  );
};

/**
 * ApplicationModal (Worker)
 */
const ApplicationModal = ({
  job,
  token,
  onClose,
  onApplicationSubmitted,
  setIsInteracting,
}) => {
  const [workerMessage, setWorkerMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId: job.id, workerMessage }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to submit application");
      }

      onApplicationSubmitted(); // Tell parent to refresh data
      onClose(); // Close modal
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Apply for Job</h2>
          <button style={styles.modalCloseBtn} onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={styles.modalBody}>
            <p style={styles.modalJobDetail}>
              <strong>Job:</strong> {job.title}
            </p>
            <p style={styles.modalJobDetail}>
              <strong>Location:</strong> {job.location}
            </p>
            <p style={styles.modalJobDetail}>
              <strong>Employer:</strong> {job.employer}
            </p>
            <textarea
              style={styles.modalTextarea}
              placeholder="Add a message for the employer (optional)..."
              value={workerMessage}
              onChange={(e) => setWorkerMessage(e.target.value)}
              onFocus={() => setIsInteracting(true)} // <-- Pauses polling
              onBlur={() => setIsInteracting(false)} // <-- Resumes polling
            />
            {error && <p style={styles.errorMessage}>{error}</p>}
          </div>
          <div style={styles.modalActions}>
            <button
              type="button"
              style={{
                ...styles.btn,
                ...styles.btnDisabled,
                ...styles.modalBtn,
              }}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                ...styles.btn,
                ...styles.applyBtn,
                ...styles.modalBtn,
                ...(isSubmitting ? styles.btnDisabled : {}),
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * ApplicantCard (Employer)
 */
const ApplicantCard = ({ application, token, onStatusUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateStatus = async (status) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/api/applications/${application.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );
      if (!response.ok) throw new Error("Failed to update status");
      onStatusUpdate(); // Tell parent to refresh
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.applicantCard}>
      <p style={styles.applicantEmail}>{application.workerEmail}</p>
      {application.workerMessage && (
        <p style={styles.applicantMessage}>{application.workerMessage}</p>
      )}
      <p style={styles.applicantStatus}>Status: {application.status}</p>

      {application.status === "Under Review" && (
        <div style={styles.applicantActions}>
          <button
            style={styles.approveBtn}
            onClick={() => handleUpdateStatus("Approved")}
            disabled={isLoading}
          >
            Approve
          </button>
          <button
            style={styles.rejectBtn}
            onClick={() => handleUpdateStatus("Rejected")}
            disabled={isLoading}
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * EmployerDashboard
 */
const EmployerDashboard = ({ jobs, applications, token, refreshData }) => {
  return (
    <div>
      {jobs.length === 0 && (
        <p style={styles.emptyState}>You haven’t posted any jobs yet.</p>
      )}
      {jobs.map((job) => {
        // Find applications for this specific job
        const jobApplications = applications.filter(
          (app) => app.jobId === job.id
        );

        return (
          <div key={job.id} style={styles.employerJobSection}>
            <div style={styles.employerJobHeader}>
              <h3 style={styles.employerJobTitle}>{job.title}</h3>
              <p style={styles.jobCardText}>
                {job.location} | {job.salary}
              </p>
            </div>
            <div style={styles.applicantList}>
              {jobApplications.length === 0 ? (
                <p>No applications for this job yet.</p>
              ) : (
                jobApplications.map((app) => (
                  <ApplicantCard
                    key={app.id}
                    application={app}
                    token={token}
                    onStatusUpdate={refreshData}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * AnalyticsDashboard (Admin - NEW)
 */
const AnalyticsDashboard = ({ token }) => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`${API_URL}/api/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch analytics");
        const data = await response.json();
        setAnalytics(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, [token]);

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (!analytics) {
    return <p style={styles.emptyState}>Could not load analytics data.</p>;
  }

  const { totals, byRole, byJobType, byAppStatus } = analytics;

  // Helper for Bar Chart
  const BarChart = ({ title, data }) => {
    const entries = Object.entries(data);
    const maxValue = Math.max(...entries.map(([, value]) => value));

    return (
      <div style={styles.chartContainer}>
        <h3 style={styles.chartTitle}>{title}</h3>
        <div style={styles.barChart}>
          {entries.map(([label, value]) => (
            <div key={label} style={styles.barWrapper}>
              <div style={styles.barValue}>{value}</div>
              <div
                style={{
                  ...styles.bar,
                  height: `${(value / (maxValue || 1)) * 100}%`,
                  backgroundColor:
                    label === "worker"
                      ? "#2980b9"
                      : label === "employer"
                      ? "#27ae60"
                      : label === "admin"
                      ? "#f39c12"
                      : "#3498db",
                }}
              ></div>
              <div style={styles.barLabel}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const StatCard = ({ title, value }) => (
    <div style={styles.statCard}>
      <h4 style={styles.statTitle}>{title}</h4>
      <p style={styles.statValue}>{value}</p>
    </div>
  );

  return (
    <>
      <div style={styles.analyticsContainer}>
        <StatCard title="Total Users" value={totals.users} />
        <StatCard title="Total Jobs Posted" value={totals.jobs} />
        <StatCard title="Total Applications" value={totals.applications} />
      </div>
      <BarChart title="User Roles" data={byRole} />
      <BarChart title="Job Types" data={byJobType} />
      <BarChart title="Application Status" data={byAppStatus} />
    </>
  );
};

// --- 4. MAIN APP COMPONENT ---
export default function App() {
  // Auth State
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Data State
  const [jobs, setJobs] = useState([]); // All jobs
  const [applications, setApplications] = useState([]); // Only *my* applications

  // UI State
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null); // For the modal
  const [isInteracting, setIsInteracting] = useState(false); // <-- NEW: State to pause polling

  // --- 1. Auth Effect (On Load) ---
  useEffect(() => {
    const storedToken = localStorage.getItem("kaamkhoj_token");
    const storedUser = localStorage.getItem("kaamkhoj_user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsAuthReady(true);
  }, []);

  // --- 2. Data Fetching Effect ---
  // This runs when user logs in (token/user changes)
  const fetchData = async () => {
    if (!token || !user) {
      setIsLoading(false);
      return;
    }

    // Don't show loading spinner for background polling
    // setIsLoading(true); // <-- This causes the main refresh

    try {
      // 1. Fetch all jobs
      const jobsResponse = await fetch(`${API_URL}/api/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!jobsResponse.ok) throw new Error("Failed to fetch jobs");
      const jobsData = await jobsResponse.json();

      // 2. Fetch applications (endpoint depends on role)
      // Admins will fetch employer applications for this dashboard
      const appRoute =
        user.role === "worker"
          ? "/api/applications/worker"
          : "/api/applications/employer";
      const appResponse = await fetch(`${API_URL}${appRoute}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!appResponse.ok) throw new Error("Failed to fetch applications");
      const appData = await appResponse.json();

      // Set state for both
      setJobs(jobsData);
      setApplications(appData);
    } catch (err) {
      console.error(err);
    } finally {
      // Only set loading to false on the *first* load
      if (isLoading) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    // Fetch data immediately when the user logs in
    if (token && user) {
      // Don't show loading spinner for admin, as analytics has its own
      if (user.role !== "admin") {
        setIsLoading(true); // Show loading spinner on initial login
      }
      fetchData();
    }
  }, [token, user]); // Runs once on login

  // --- 3. Polling Effect for Real-time Updates ---
  // This new effect will re-fetch data every 10 seconds
  useEffect(() => {
    // Don't poll if the user isn't logged in
    if (!token || !user) return;

    // Admin dashboard doesn't need to poll
    if (user.role === "admin") return;

    // Set up an interval to call fetchData every 10 seconds
    const intervalId = setInterval(() => {
      // Only poll if the user is NOT typing in a form
      if (!isInteracting) {
        console.log("Polling for new data...");
        fetchData();
      } else {
        console.log("User is typing, skipping poll.");
      }
    }, 10000); // 10000ms = 10 seconds

    // Clear the interval when the component unmounts or the user logs out
    // This is crucial to prevent memory leaks
    return () => clearInterval(intervalId);
  }, [token, user, isInteracting]); // <-- Re-check interval if isInteracting changes

  // --- 4. Event Handlers ---
  const handleAuthSuccess = (t, u) => {
    setToken(t);
    setUser(u);
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    setJobs([]);
    setApplications([]);
  };

  const handleApplyClick = (job) => {
    setSelectedJob(job); // Open the modal
  };

  const handleCloseModal = () => {
    setSelectedJob(null); // Close the modal
  };

  // Called by Modal or JobForm on success to refresh all data
  const handleRefreshData = () => {
    fetchData();
  };

  // --- 5. RENDER LOGIC ---

  // Show main loading spinner before auth is checked
  if (!isAuthReady) {
    return (
      <div style={styles.body}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
        </div>
      </div>
    );
  }

  // If auth not ready, or no token, show Login page
  if (!token || !user) {
    return (
      <div style={{ ...styles.body, ...styles.container }}>
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  // --- User is Logged In: Render Main App ---

  // -- Calculate data for WORKER view --
  const myApplicationJobIds = applications.map((app) => app.jobId);
  const availableJobs = jobs.filter(
    (job) => !myApplicationJobIds.includes(job.id)
  );

  // -- Calculate data for EMPLOYER view --
  const myPostedJobs =
    user.role === "employer" || user.role === "admin"
      ? jobs.filter((job) => job.employerId === user.userId)
      : [];

  return (
    <div style={styles.body}>
      <style>{styles.globalStyle}</style>
      <Header userRole={user.role} onLogout={handleLogout} />

      <main style={styles.main}>
        {isLoading && user.role !== "admin" ? ( // Admin has its own loader
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <p>Loading data...</p>
          </div>
        ) : (
          <>
            {/* ====================== */}
            {/* ===== ADMIN VIEW ===== */}
            {/* ====================== */}
            {user.role === "admin" && (
              <>
                <h2 style={styles.h2}>Admin Analytics Dashboard</h2>
                <AnalyticsDashboard token={token} />
              </>
            )}

            {/* ======================= */}
            {/* ===== WORKER VIEW ===== */}
            {/* ======================= */}
            {user.role === "worker" && (
              <>
                <h2 style={styles.h2}>Available Jobs</h2>
                <div style={styles.jobListingsGrid}>
                  {availableJobs.length > 0 ? (
                    availableJobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        onApplyClick={handleApplyClick}
                        isApplied={false}
                      />
                    ))
                  ) : (
                    <p style={styles.emptyState}>
                      No jobs available right now.
                    </p>
                  )}
                </div>

                <h3 style={styles.h3}>My Applications</h3>
                <div style={styles.jobListingsGrid}>
                  {applications.length > 0 ? (
                    applications.map((app) => (
                      <JobCard
                        key={app.id}
                        // We pass job-like data to the card
                        job={{
                          title: app.jobTitle,
                          location: app.jobLocation,
                          // Find employer name from the original jobs list
                          employer:
                            jobs.find((j) => j.id === app.jobId)?.employer ||
                            "N/A",
                          salary:
                            jobs.find((j) => j.id === app.jobId)?.salary ||
                            "N/A",
                          type:
                            jobs.find((j) => j.id === app.jobId)?.type || "N/A",
                        }}
                        isApplied={true}
                        applicationStatus={app.status}
                      />
                    ))
                  ) : (
                    <p style={styles.emptyState}>No applications yet.</p>
                  )}
                </div>
              </>
            )}

            {/* ========================= */}
            {/* ===== EMPLOYER VIEW ===== */}
            {/* ========================= */}
            {user.role === "employer" && (
              <>
                <h2 style={styles.h2}>Post a New Job</h2>
                <JobForm
                  onJobPost={handleRefreshData}
                  token={token}
                  userEmail={user.email}
                  setIsInteracting={setIsInteracting} // <-- Pass setter
                />

                <h3 style={styles.h3}>Quick Post from Template</h3>
                <JobTemplate
                  onJobPost={handleRefreshData}
                  token={token}
                  userEmail={user.email}
                  setIsInteracting={setIsInteracting}
                />

                <h3 style={styles.h3}>My Posted Jobs & Applicants</h3>
                <EmployerDashboard
                  jobs={myPostedJobs}
                  applications={applications}
                  token={token}
                  refreshData={handleRefreshData}
                />
              </>
            )}
          </>
        )}
      </main>

      {/* --- Render the Modal if a job is selected --- */}
      {selectedJob && (
        <ApplicationModal
          job={selectedJob}
          token={token}
          onClose={handleCloseModal}
          onApplicationSubmitted={handleRefreshData}
          setIsInteracting={setIsInteracting} // <-- Pass setter
        />
      )}
    </div>
  );
}
