import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// --- Helper Functions & Styles ---

// CSS for the dashboard
const styles = {
  dashboard: {
    padding: "24px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f7f6",
  },
  header: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: "24px",
  },
  kpiContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "32px",
  },
  kpiCard: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  kpiValue: {
    fontSize: "2.25rem",
    fontWeight: "bold",
    color: "#3498db",
    margin: "0 0 8px 0",
  },
  kpiLabel: {
    fontSize: "1rem",
    color: "#7f8c8d",
    margin: "0",
  },
  chartsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "24px",
  },
  chartBox: {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    height: "400px", // Fixed height for chart containers
  },
  chartTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: "20px",
    textAlign: "center",
  },
  loading: {
    fontSize: "1.5rem",
    textAlign: "center",
    marginTop: "50px",
  },
};

// Reusable component for the top stat cards
const StatCard = ({ value, label }) => (
  <div style={styles.kpiCard}>
    <p style={styles.kpiValue}>{value}</p>
    <p style={styles.kpiLabel}>{label}</p>
  </div>
);

// Colors for Pie charts
const PIE_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

// Helper to format object data for charts (e.g., {a: 1, b: 2} -> [{name: 'a', value: 1}, {name: 'b', value: 2}])
const formatObjectForChart = (obj) => {
  return Object.entries(obj)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value); // Sort descending
};

// Helper to format time-series data
const formatTimeSeriesForChart = (obj) => {
  return Object.entries(obj)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date
};

// --- Main Dashboard Component ---

function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // IMPORTANT: Get the token from your auth context or local storage
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5001/api/analytics", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAnalytics(data);
      } catch (e) {
        setError(e.message);
        console.error("Failed to fetch analytics:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div style={styles.loading}>Loading Analytics Dashboard...</div>;
  }

  if (error) {
    return (
      <div style={styles.loading}>
        Error fetching data: {error}. Are you logged in as an admin?
      </div>
    );
  }

  if (!analytics) {
    return <div style={styles.loading}>No analytics data found.</div>;
  }

  // --- Prepare Data for Charts ---
  const { totals, byRole, byJobType, byAppStatus, timeSeries, aggregations } =
    analytics;

  const signupsData = formatTimeSeriesForChart(timeSeries.userSignups);
  const jobsData = formatTimeSeriesForChart(timeSeries.jobPosts);
  const appsData = formatTimeSeriesForChart(timeSeries.applications);

  const roleData = formatObjectForChart(byRole);
  const jobTypeData = formatObjectForChart(byJobType);
  const appStatusData = formatObjectForChart(byAppStatus);

  const locationData = formatObjectForChart(aggregations.jobsByLocation).slice(
    0,
    10
  ); // Top 10
  const employerData = formatObjectForChart(aggregations.topEmployers).slice(
    0,
    5
  ); // Top 5
  const workerData = formatObjectForChart(aggregations.topWorkers).slice(0, 5); // Top 5

  return (
    <div style={styles.dashboard}>
      <h1 style={styles.header}>Admin Analytics Dashboard</h1>

      {/* --- 1. KPI Stat Cards --- */}
      <div style={styles.kpiContainer}>
        <StatCard value={totals.users} label="Total Users" />
        <StatCard value={totals.jobs} label="Total Jobs Posted" />
        <StatCard value={totals.applications} label="Total Applications" />
        <StatCard value={totals.avgAppsPerJob} label="Avg. Apps per Job" />
        <StatCard value={`${totals.approvalRate}%`} label="Approval Rate" />
      </div>

      {/* --- 2. Charts Container --- */}
      <div style={styles.chartsContainer}>
        {/* Chart: Platform Growth */}
        <div style={styles.chartBox}>
          <h3 style={styles.chartTitle}>Platform Growth Over Time</h3>
          <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            <LineChart
              data={signupsData}
              margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                name="User Signups"
                stroke="#8884d8"
              />
              <Line
                type="monotone"
                dataKey="count"
                name="Job Posts"
                data={jobsData}
                stroke="#82ca9d"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Chart: Application Velocity */}
        <div style={styles.chartBox}>
          <h3 style={styles.chartTitle}>Application Velocity</h3>
          <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            <LineChart
              data={appsData}
              margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                name="Applications"
                stroke="#ff7300"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Chart: Job Postings by Location (Top 10) */}
        <div style={styles.chartBox}>
          <h3 style={styles.chartTitle}>Jobs by Location (Top 10)</h3>
          <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            <BarChart
              data={locationData}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 60, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Job Posts" fill="#3498db" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart: Top 5 Employers */}
        <div style={styles.chartBox}>
          <h3 style={styles.chartTitle}>Top 5 Employers</h3>
          <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            <BarChart
              data={employerData}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 60, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Jobs Posted" fill="#9b59b6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart: Job Type Distribution */}
        <div style={styles.chartBox}>
          <h3 style={styles.chartTitle}>Job Type Distribution</h3>
          <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            <PieChart>
              <Pie
                data={jobTypeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                label
              >
                {jobTypeData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Chart: Application Status */}
        <div style={styles.chartBox}>
          <h3 style={styles.chartTitle}>Application Status</h3>
          <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            <PieChart>
              <Pie
                data={appStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                label
              >
                {appStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Chart: User Role Distribution */}
        <div style={styles.chartBox}>
          <h3 style={styles.chartTitle}>User Role Distribution</h3>
          <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            <PieChart>
              <Pie
                data={roleData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                label
              >
                {roleData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Chart: Top 5 Workers */}
        <div style={styles.chartBox}>
          <h3 style={styles.chartTitle}>Top 5 Most Active Workers</h3>
          <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            <BarChart
              data={workerData}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 60, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Applications Sent" fill="#e67e22" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
