import React, { useState, useEffect } from "react";
// --- 1. FIREBASE CONFIGURATION ---
// Imports are no longer needed as the backend handles all Firebase logic.
// --- 2. STYLING OBJECT ---
// All CSS-in-JS styles are defined here for a single-file component.
const styles = {
  body: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    margin: 0,
    backgroundColor: "#ecf0f1",
    color: "#34495e",
    lineHeight: 1.6,
  },
  container: {
    maxWidth: "900px",
    margin: "20px auto",
    padding: "0 20px",
  },
  header: {
    backgroundColor: "#ffffff",
    padding: "20px 25px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px",
    marginBottom: "25px",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    textDecoration: "none",
    color: "inherit",
  },
  logoImg: {
    height: "50px",
    width: "auto",
    borderRadius: "8px",
  },
  logoText: {
    fontSize: "2.2em",
    fontWeight: 700,
    color: "#2980b9",
    margin: 0,
  },
  logoTextSpan: {
    color: "#27ae60",
  },
  toggleSwitch: {
    display: "flex",
    alignItems: "center",
    fontWeight: 500,
    color: "#34495e",
  },
  toggleLabel: {
    margin: "0 10px",
    cursor: "pointer",
    transition: "opacity 0.3s ease",
  },
  switch: {
    position: "relative",
    display: "inline-block",
    width: "60px",
    height: "34px",
  },
  switchInput: {
    opacity: 0,
    width: 0,
    height: 0,
  },
  slider: {
    position: "absolute",
    cursor: "pointer",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#2980b9",
    transition: ".4s",
    borderRadius: "34px",
  },
  sliderBefore: {
    position: "absolute",
    content: '""',
    height: "26px",
    width: "26px",
    left: "4px",
    bottom: "4px",
    backgroundColor: "white",
    transition: ".4s",
    borderRadius: "50%",
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
  },
  main: {
    padding: "25px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
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
  jobListingsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
  },
  jobCard: {
    border: "1px solid #ddd",
    borderLeft: "5px solid #2980b9",
    borderRadius: "8px",
    padding: "20px",
    backgroundColor: "#fcfcfc",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  jobCardTitle: {
    marginTop: 0,
    marginBottom: "15px",
    color: "#2980b9",
    fontSize: "1.3em",
    borderBottom: "none",
    paddingBottom: 0,
  },
  jobCardText: {
    margin: "6px 0",
    fontSize: "0.95em",
  },
  jobCardSalary: {
    fontWeight: 700,
    color: "#27ae60",
    fontSize: "1.1em",
    marginTop: "10px",
  },
  btn: {
    display: "inline-block",
    width: "100%",
    textAlign: "center",
    marginTop: "15px",
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    textDecoration: "none",
    fontSize: "1.05em",
    fontWeight: 500,
    transition: "background-color 0.3s, transform 0.1s ease",
  },
  applyBtn: {
    backgroundColor: "#27ae60",
    color: "#ffffff",
  },
  postJobBtn: {
    backgroundColor: "#2980b9",
    color: "#ffffff",
  },
  btnDisabled: {
    backgroundColor: "#bdc3c7",
    cursor: "not-allowed",
  },
  applicationStatus: {
    marginTop: "15px",
    padding: "8px",
    borderRadius: "6px",
    fontWeight: 500,
    textAlign: "center",
    fontSize: "0.95em",
    backgroundColor: "#f39c12",
    color: "#ffffff",
  },
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
  // Keyframes for spin animation must be injected globally
  globalStyle: `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `,
  // New styles for Auth Form
  authContainer: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "25px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  authForm: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  authTitle: {
    textAlign: "center",
    color: "#34495e",
    marginBottom: "10px",
  },
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
};

// --- 3. HELPER COMPONENTS ---

// Backend API URL (points to your new server)
const API_URL = "http://localhost:5001"; // Make sure this port matches your server.js

/**
 * Header Component
 * Displays the logo and the role toggle switch.
 */
const Header = ({ userRole, onLogout }) => (
  <header style={styles.header}>
    <div style={styles.logoContainer}>
      <img
        src="https://placehold.co/100x100/2980b9/ffffff?text=KK&font=sans-serif"
        alt="KaamKhoj Logo"
        style={styles.logoImg}
        onError={(e) => {
          e.target.src =
            "https://placehold.co/100x100/2980b9/ffffff?text=KK&font=sans-serif";
        }}
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
 * Renders a single job listing.
 */
const JobCard = ({ job, onApply, isApplied, userRole }) => (
  <div style={styles.jobCard}>
    <div>
      <h3 style={styles.jobCardTitle}>{job.title}</h3>
      <p style={styles.jobCardText}>
        <strong>Employer:</strong> {job.employer}
      </p>
      <p style={styles.jobCardText}>
        <strong>Location:</strong> {job.location}
      </p>
      <p style={styles.jobCardText}>
        <strong>Type:</strong> {job.type}
      </p>
      <p style={{ ...styles.jobCardText, ...styles.jobCardSalary }}>
        {job.salary}
      </p>
    </div>
    {userRole === "worker" && (
      <button
        style={{
          ...styles.btn,
          ...styles.applyBtn,
          ...(isApplied ? styles.btnDisabled : {}),
        }}
        onClick={() => onApply(job.id)}
        disabled={isApplied}
      >
        {isApplied ? "Applied" : "Apply Now"}
      </button>
    )}
    {job.status && (
      <div style={styles.applicationStatus}>Status: {job.status}</div>
    )}
  </div>
);

/**
 * JobForm Component
 * Renders the form for employers to post a new job.
 */
const JobForm = ({ onJobPost, token }) => {
  const [title, setTitle] = useState("");
  const [employer, setEmployer] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [type, setType] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPosting(true);
    setError(null);

    const newJob = {
      title,
      employer,
      location,
      salary,
      type,
    };

    // Call the new backend API
    try {
      const response = await fetch(`${API_URL}/api/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newJob),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to post job.");
      }

      // Let the parent component handle the success (which triggers a re-fetch)
      await onJobPost();

      // Reset form
      setTitle("");
      setType("");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <form style={styles.jobPostForm} onSubmit={handleSubmit}>
      {error && <p style={styles.errorMessage}>{error}</p>}
      <input
        type="text"
        style={styles.formInput}
        placeholder="Your Name / Company Name"
        value={employer}
        onChange={(e) => setEmployer(e.target.value)}
        required
      />
      <input
        type="text"
        style={styles.formInput}
        placeholder="Location (e.g., Chennai)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />
      <input
        type="text"
        style={styles.formInput}
        placeholder="Salary (e.g., ₹15,000 per month)"
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
        required
      />
      <select
        style={styles.formInput}
        value={type}
        onChange={(e) => setType(e.target.value)}
        required
      >
        <option value="">Select Job Type</option>
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
 * AuthPage Component
 * Renders Login and Register forms.
 */
const AuthPage = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("worker"); // Default role for registration
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

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed.");
      }

      if (isLogin) {
        // On login, we get a token and user data
        localStorage.setItem("kaamkhoj_token", data.token);
        localStorage.setItem("kaamkhoj_user", JSON.stringify(data.user));
        onAuthSuccess(data.token, data.user);
      } else {
        // On register, we switch to the login view
        alert("Registration successful! Please log in.");
        setIsLogin(true);
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      console.error(err);
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
              />
              I am a Worker
            </label>
            <label>
              <input
                type="radio"
                value="employer"
                checked={role === "employer"}
                onChange={(e) => setRole(e.target.value)}
              />
              I am an Employer
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

// --- 4. MAIN APP COMPONENT ---
export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Effect for checking stored token on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem("kaamkhoj_token");
    const storedUser = localStorage.getItem("kaamkhoj_user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsAuthReady(true);
  }, []);

  // Effect for loading jobs from the backend API
  const fetchJobs = async () => {
    if (!token) {
      setIsLoading(false);
      return; // Don't fetch if not logged in
    }

    console.log("Fetching jobs from backend...");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch jobs.");

      const jobsData = await response.json();

      const allJobs = [];
      const myApps = [];

      jobsData.forEach((job) => {
        if (user && job.applicants && job.applicants.includes(user.userId)) {
          myApps.push(job);
        } else {
          allJobs.push(job);
        }
      });

      setJobs(allJobs);
      setMyApplications(myApps);
    } catch (error) {
      console.error("Error fetching jobs: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Re-fetch jobs when the token changes (i.e., on login)
  useEffect(() => {
    fetchJobs();
  }, [token, user]); // Re-run when auth state changes

  // --- Event Handlers ---

  const handleAuthSuccess = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("kaamkhoj_token");
    localStorage.removeItem("kaamkhoj_user");
    setToken(null);
    setUser(null);
    setJobs([]);
    setMyApplications([]);
  };

  const handleApplyForJob = async (jobId) => {
    if (!user || !token) {
      console.error("Cannot apply: User not logged in.");
      return;
    }

    try {
      console.log(`Applying for job ${jobId} as user ${user.userId}`);

      const response = await fetch(`${API_URL}/api/jobs/${jobId}/apply`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to apply.");
      }

      console.log("Application successful.");
      // Re-fetch jobs to show the updated application status
      fetchJobs();
    } catch (error) {
      console.error("Error applying for job: ", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handlePostJob = async () => {
    // This function is just a trigger to re-fetch jobs
    // The JobForm component handles the actual POST
    console.log("Job posted, re-fetching job list...");
    fetchJobs();
  };

  // --- Render Logic ---

  // Filter jobs for the employer view
  const postedByMe =
    user && user.role === "employer"
      ? [...jobs, ...myApplications].filter(
          (job) => job.employerId === user.userId
        )
      : [];

  const renderLoading = () => (
    <div style={styles.loadingContainer}>
      <div style={styles.loadingSpinner}></div>
      <p>Loading...</p>
    </div>
  );

  if (!isAuthReady) {
    return (
      <div style={styles.body}>
        <div style={styles.container}>{renderLoading()}</div>
      </div>
    );
  }

  if (!token || !user) {
    return (
      <div style={styles.body}>
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  // User is logged in, show the main app
  return (
    <div style={styles.body}>
      {/* Inject global styles */}
      <style>{styles.globalStyle}</style>

      <div style={styles.container}>
        <Header userRole={user.role} onLogout={handleLogout} />

        <main style={styles.main}>
          {user.role === "employer" ? (
            // --- EMPLOYER VIEW ---
            <div>
              <h2 style={styles.h2}>Work Made Simple. Post a Job.</h2>
              <JobForm onJobPost={handlePostJob} token={token} />

              <h3 style={Options.h3}>Your Posted Jobs</h3>
              <div style={styles.jobListingsGrid}>
                {isLoading ? (
                  renderLoading()
                ) : postedByMe.length > 0 ? (
                  postedByMe.map((job) => (
                    <JobCard key={job.id} job={job} userRole={user.role} />
                  ))
                ) : (
                  <div style={styles.emptyState}>
                    <p>You have not posted any jobs yet.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // --- WORKER VIEW ---
            <div>
              <h2 style={styles.h2}>Jobs Near You, Opportunities For All.</h2>
              <div style={styles.jobListingsGrid}>
                {isLoading ? (
                  renderLoading()
                ) : jobs.length > 0 ? (
                  jobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onApply={handleApplyForJob}
                      isApplied={false}
                      userRole={user.role}
                    />
                  ))
                ) : (
                  <div style={styles.emptyState}>
                    <p>No available jobs right now. Check back soon!</p>
                  </div>
                )}
              </div>

              <h3 style={styles.h3}>My Applications</h3>
              <div style={styles.jobListingsGrid}>
                {isLoading ? (
                  <div style={styles.loadingContainer}>
                    <p>Loading applications...</p>
                  </div>
                ) : myApplications.length > 0 ? (
                  myApplications.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      isApplied={true}
                      userRole={user.role}
                    />
                  ))
                ) : (
                  <div style={styles.emptyState}>
                    <p>You haven't applied for any jobs yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
