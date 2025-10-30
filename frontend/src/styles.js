// --- 1. STYLES OBJECT ---
// All styles are in this separate file.
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
  // Status Pill (NEW)
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
  // Application Modal (NEW)
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

  // Employer Dashboard (NEW)
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

// This line is required for the import to work in App.jsx
export default styles;
