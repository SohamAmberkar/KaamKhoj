const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
  arrayUnion,
  setDoc,
} = require("firebase/firestore");

// --- 1. CONFIGURATION ---

// !!! IMPORTANT: REPLACE THIS PLACEHOLDER WITH YOUR ACTUAL FIREBASE CONFIG !!!
const firebaseConfig = {
  apiKey: "AIzaSyD8S3U3joC33g-XSiuI8d6sLitA_FnXAs8",
  authDomain: "kaamkhoj-4c827.firebaseapp.com",
  projectId: "kaamkhoj-4c827",
  storageBucket: "kaamkhoj-4c827.firebasestorage.app",
  messagingSenderId: "469752313035",
  appId: "1:469752313035:web:09e22856cfc3d6f61d174e",
  measurementId: "G-Z13QXPN3VD",
};
// !!! END OF IMPORTANT CONFIGURATION !!!

const JWT_SECRET = "my-super-secret-key-for-kaamkhoj-123!@#"; // Keep this secret

const appId = typeof __app_id !== "undefined" ? __app_id : "kaamkhoj-default";

// Collection Paths
const DB_PATH = `/artifacts/${appId}/public/data`;
const USERS_COLLECTION = `${DB_PATH}/users`;
const JOBS_COLLECTION = `${DB_PATH}/jobs`;
const APPLICATIONS_COLLECTION = `${DB_PATH}/applications`;

// --- 2. INITIALIZATION ---
const app = express();
app.use(cors());
app.use(express.json());

let db;
try {
  // Check if placeholder config is still being used
  if (firebaseConfig.projectId === "YOUR_PROJECT_ID") {
    console.warn(
      "\n*** WARNING: Using placeholder Firebase config. Update server.js with your actual project credentials! ***\n"
    );
  }
  const firebaseApp = initializeApp(firebaseConfig);
  db = getFirestore(firebaseApp);
  console.log("Firebase DB Initialized Successfully.");
} catch (e) {
  console.error("Firebase Initialization Error: ", e);
  console.error(
    "\n*** Ensure you have replaced the placeholder firebaseConfig in server.js with your actual Firebase project credentials. ***\n"
  );
  process.exit(1);
}

// --- 3. AUTHENTICATION MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null)
    return res.status(401).json({ message: "No token provided." });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT Verification Error:", err.message); // Log JWT errors
      return res.status(403).json({ message: "Invalid or expired token." });
    }
    req.user = user;
    next();
  });
};

const isEmployerOrAdmin = (req, res, next) => {
  if (
    !req.user ||
    (req.user.role !== "employer" && req.user.role !== "admin")
  ) {
    return res
      .status(403)
      .json({ message: "Access forbidden: Requires employer or admin role." });
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Access forbidden: Requires admin role." });
  }
  next();
};

// --- 4. AUTHENTICATION ROUTES ---
app.post("/auth/register", async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role)
    return res
      .status(400)
      .json({ message: "Email, password, and role are required." });
  if (!["worker", "employer", "admin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role specified." });
  }

  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty)
      return res
        .status(400)
        .json({ message: "User already exists with this email." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUserDoc = await addDoc(usersRef, {
      email,
      password: hashedPassword,
      role,
      createdAt: serverTimestamp(),
    });
    console.log(
      `User registered: ${email} with ID: ${newUserDoc.id} as ${role}`
    );
    res.status(201).json({
      message: "User registered successfully.",
      userId: newUserDoc.id,
    });
  } catch (error) {
    console.error("Register Error: ", error);
    res.status(500).json({
      message: "Server error during registration. Check Firestore permissions.",
    });
  }
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Email and password are required." });

  console.log(`Attempting login for: ${email}`); // DEBUG LOG

  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log(`Login failed: No user found for ${email}`); // DEBUG LOG
      return res.status(400).json({ message: "Invalid credentials." });
    }

    console.log(`User found for ${email}`); // DEBUG LOG
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    if (!userData.password) {
      console.log(
        `Login failed: User ${email} has no password set in the database.`
      ); // DEBUG LOG
      return res
        .status(500)
        .json({ message: "User record is incomplete. Cannot log in." });
    }

    console.log(`Comparing provided password with stored hash for ${email}`); // DEBUG LOG
    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      console.log(`Login failed: Password mismatch for ${email}`); // DEBUG LOG
      return res.status(400).json({ message: "Invalid credentials." });
    }

    console.log(`Password match successful for ${email}`); // DEBUG LOG
    const userPayload = {
      userId: userDoc.id,
      email: userData.email,
      role: userData.role,
    };
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: "1h" }); // Consider longer expiry?
    console.log(`User logged in successfully: ${email}`); // DEBUG LOG
    res.json({ message: "Login successful.", token, user: userPayload });
  } catch (error) {
    console.error("Login Error: ", error);
    // Check for specific Firestore errors
    if (error.code && error.code.includes("permission-denied")) {
      res.status(500).json({
        message:
          "Database permission error during login. Check Firestore rules.",
      });
    } else {
      res.status(500).json({ message: "Server error during login." });
    }
  }
});

// --- 5. JOBS ROUTES ---
app.get("/api/jobs", authenticateToken, async (req, res) => {
  try {
    const jobsRef = collection(db, JOBS_COLLECTION);
    const snapshot = await getDocs(jobsRef);
    const jobsList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(jobsList);
  } catch (error) {
    console.error("Get Jobs Error: ", error);
    res
      .status(500)
      .json({ message: "Failed to fetch jobs. Check Firestore permissions." });
  }
});

app.post(
  "/api/jobs",
  [authenticateToken, isEmployerOrAdmin],
  async (req, res) => {
    // Renamed employerName to employer in destructuring to match JobForm state
    const { title, employerName: employer, location, salary, type } = req.body;
    const { userId } = req.user;
    if (!title || !employer || !location || !salary || !type)
      return res.status(400).json({ message: "All job fields are required." });

    try {
      // Use the destructured 'employer' variable here
      const newJob = {
        title,
        employer,
        location,
        salary,
        type,
        employerId: userId,
        createdAt: serverTimestamp(),
      };
      const jobsRef = collection(db, JOBS_COLLECTION);
      const docRef = await addDoc(jobsRef, newJob);
      console.log(`New job posted: ${title} by ${req.user.email}`);
      res
        .status(201)
        .json({ message: "Job posted successfully", id: docRef.id, ...newJob });
    } catch (error) {
      console.error("Post Job Error: ", error);
      res
        .status(500)
        .json({ message: "Failed to post job. Check Firestore permissions." });
    }
  }
);

// --- 6. JOB TEMPLATES ROUTE ---
app.get("/api/job-templates", authenticateToken, async (req, res) => {
  // In a real app, these might come from a database or config file
  const templates = [
    {
      title: "Plumber",
      location: "Chennai",
      salary: "₹1,500 / day",
      type: "Contract",
    },
    {
      title: "Electrician",
      location: "Chennai",
      salary: "₹1,800 / day",
      type: "Contract",
    },
    {
      title: "Housekeeper / Maid",
      location: "Vengadamangalam",
      salary: "₹12,000 / month",
      type: "Part-time",
    },
    {
      title: "Full-time Cook",
      location: "Chennai",
      salary: "₹16,000 / month",
      type: "Full-time",
    },
    {
      title: "Driver (Personal)",
      location: "Chennai",
      salary: "₹20,000 / month",
      type: "Full-time",
    },
    {
      title: "Carpenter",
      location: "Local Area",
      salary: "₹1,600 / day",
      type: "Contract",
    },
    {
      title: "Painter",
      location: "Local Area",
      salary: "₹1,400 / day",
      type: "Contract",
    },
    {
      title: "Office Assistant",
      location: "Chennai",
      salary: "₹15,000 / month",
      type: "Full-time",
    },
  ];
  res.json(templates);
});

// --- 7. APPLICATIONS ROUTES ---
app.post("/api/applications", authenticateToken, async (req, res) => {
  const { jobId, workerMessage } = req.body;
  const { userId, email, role } = req.user;
  if (role !== "worker")
    return res.status(403).json({ message: "Only workers can apply." });
  if (!jobId) return res.status(400).json({ message: "Job ID is required." });

  try {
    const jobRef = doc(db, JOBS_COLLECTION, jobId);
    const jobSnap = await getDoc(jobRef);
    if (!jobSnap.exists())
      return res.status(404).json({ message: "Job not found." });
    const jobData = jobSnap.data();

    const appRef = collection(db, APPLICATIONS_COLLECTION);
    const q = query(
      appRef,
      where("jobId", "==", jobId),
      where("workerId", "==", userId)
    );
    const appSnap = await getDocs(q);
    if (!appSnap.empty)
      return res
        .status(400)
        .json({ message: "You have already applied for this job." });

    const newApplication = {
      jobId,
      workerId: userId,
      employerId: jobData.employerId,
      workerEmail: email,
      workerMessage: workerMessage || "",
      status: "Under Review",
      appliedAt: serverTimestamp(),
      jobTitle: jobData.title,
      jobLocation: jobData.location,
    };
    const docRef = await addDoc(appRef, newApplication);
    console.log(`New application for job ${jobId} by ${email}`);
    res.status(201).json({
      message: "Application submitted successfully",
      id: docRef.id,
      ...newApplication,
    });
  } catch (error) {
    console.error("Apply Job Error: ", error);
    res.status(500).json({
      message: "Failed to submit application. Check Firestore permissions.",
    });
  }
});

app.get("/api/applications/worker", authenticateToken, async (req, res) => {
  const { userId, role } = req.user;
  if (role !== "worker")
    return res.status(403).json({ message: "Access denied." });

  try {
    const appRef = collection(db, APPLICATIONS_COLLECTION);
    const q = query(appRef, where("workerId", "==", userId));
    const snapshot = await getDocs(q);
    const applications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(applications);
  } catch (error) {
    console.error("Get Worker Applications Error: ", error);
    res.status(500).json({
      message: "Failed to fetch applications. Check Firestore permissions.",
    });
  }
});

app.get(
  "/api/applications/employer",
  [authenticateToken, isEmployerOrAdmin],
  async (req, res) => {
    const { userId, role } = req.user;
    let q;
    const appRef = collection(db, APPLICATIONS_COLLECTION);

    // If admin, fetch ALL applications. If employer, fetch only theirs.
    if (role === "admin") {
      console.log("Admin fetching all applications.");
      // Fetch all applications for admin role
      q = query(appRef); // No employerId filter for admin
    } else {
      console.log(`Employer ${req.user.email} fetching their applications.`);
      q = query(appRef, where("employerId", "==", userId));
    }

    try {
      const snapshot = await getDocs(q);
      const applications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      res.json(applications);
    } catch (error) {
      console.error("Get Employer/Admin Applications Error: ", error);
      res.status(500).json({
        message: "Failed to fetch applications. Check Firestore permissions.",
      });
    }
  }
);

app.put(
  "/api/applications/:id/status",
  [authenticateToken, isEmployerOrAdmin],
  async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const { userId, role } = req.user;
    if (!status || !["Approved", "Rejected"].includes(status))
      return res
        .status(400)
        .json({ message: "Invalid status. Must be 'Approved' or 'Rejected'." });

    try {
      const appRef = doc(db, APPLICATIONS_COLLECTION, id);
      const appSnap = await getDoc(appRef);
      if (!appSnap.exists())
        return res.status(404).json({ message: "Application not found." });

      // Security check: Allow admin OR the specific employer who owns the job
      if (role !== "admin" && appSnap.data().employerId !== userId) {
        console.log(
          `Permission denied: User ${
            req.user.email
          } (role: ${role}) tried to update application ${id} owned by employer ${
            appSnap.data().employerId
          }`
        );
        return res.status(403).json({
          message: "You are not authorized to update this application.",
        });
      }

      await updateDoc(appRef, { status });
      console.log(
        `Application ${id} status updated to ${status} by ${req.user.email}`
      );
      res.json({ message: "Application status updated successfully." });
    } catch (error) {
      console.error("Update Status Error: ", error);
      res.status(500).json({
        message:
          "Failed to update application status. Check Firestore permissions.",
      });
    }
  }
);

// --- 8. DATA SCIENCE / ANALYTICS ROUTE ---
app.get("/api/analytics", [authenticateToken, isAdmin], async (req, res) => {
  try {
    console.log("Fetching data for analytics report...");

    // Helper to format dates consistently
    const formatDate = (timestamp) => {
      if (!timestamp || typeof timestamp.toDate !== "function")
        return "Unknown Date";
      return timestamp.toDate().toISOString().split("T")[0]; // 'YYYY-MM-DD'
    };

    // 1. Get all users
    const usersSnapshot = await getDocs(collection(db, USERS_COLLECTION));
    const totalUsers = usersSnapshot.size;
    const userRoles = {};
    const userSignupsOverTime = {};
    usersSnapshot.docs.forEach((doc) => {
      const role = doc.data().role || "unknown";
      userRoles[role] = (userRoles[role] || 0) + 1;
      const date = formatDate(doc.data().createdAt);
      userSignupsOverTime[date] = (userSignupsOverTime[date] || 0) + 1;
    });
    console.log(`Found ${totalUsers} users. Roles:`, userRoles);

    // 2. Get all jobs
    const jobsSnapshot = await getDocs(collection(db, JOBS_COLLECTION));
    const totalJobs = jobsSnapshot.size;
    const jobTypes = {};
    const jobsByLocation = {};
    const topEmployers = {};
    const jobPostsOverTime = {};
    jobsSnapshot.docs.forEach((doc) => {
      const type = doc.data().type || "unknown";
      jobTypes[type] = (jobTypes[type] || 0) + 1;

      const location = doc.data().location || "Unknown Location";
      jobsByLocation[location] = (jobsByLocation[location] || 0) + 1;

      const employer = doc.data().employer || "Unknown Employer";
      topEmployers[employer] = (topEmployers[employer] || 0) + 1;

      const date = formatDate(doc.data().createdAt);
      jobPostsOverTime[date] = (jobPostsOverTime[date] || 0) + 1;
    });
    console.log(`Found ${totalJobs} jobs. Types:`, jobTypes);

    // 3. Get all applications
    const appSnapshot = await getDocs(collection(db, APPLICATIONS_COLLECTION));
    const totalApplications = appSnapshot.size;
    const appStatuses = {};
    const topWorkers = {};
    const applicationsOverTime = {};
    appSnapshot.docs.forEach((doc) => {
      const status = doc.data().status || "unknown";
      appStatuses[status] = (appStatuses[status] || 0) + 1;

      const workerEmail = doc.data().workerEmail || "Unknown Worker";
      topWorkers[workerEmail] = (topWorkers[workerEmail] || 0) + 1;

      const date = formatDate(doc.data().appliedAt);
      applicationsOverTime[date] = (applicationsOverTime[date] || 0) + 1;
    });
    console.log(
      `Found ${totalApplications} applications. Statuses:`,
      appStatuses
    );

    // 4. KPIs
    const totalApproved = appStatuses["Approved"] || 0;
    const approvalRate =
      totalApplications > 0 ? (totalApproved / totalApplications) * 100 : 0;
    const avgAppsPerJob = totalJobs > 0 ? totalApplications / totalJobs : 0;

    // 5. Compile analytics object
    const analytics = {
      totals: {
        users: totalUsers,
        jobs: totalJobs,
        applications: totalApplications,
        approvalRate: approvalRate.toFixed(2),
        avgAppsPerJob: avgAppsPerJob.toFixed(2),
      },
      byRole: userRoles,
      byJobType: jobTypes,
      byAppStatus: appStatuses,
      timeSeries: {
        userSignups: userSignupsOverTime,
        jobPosts: jobPostsOverTime,
        applications: applicationsOverTime,
      },
      aggregations: {
        jobsByLocation,
        topEmployers,
        topWorkers,
      },
    };
    console.log(`Analytics report generated for admin ${req.user.email}`);
    res.json(analytics);
  } catch (error) {
    console.error("Analytics Error: ", error);
    res.status(500).json({
      message: "Failed to generate analytics. Check Firestore permissions.",
    });
  }
});

// --- 9. DATABASE SEEDING ROUTE (NEW) ---
// IMPORTANT: Run this ONLY ONCE after registering at least one worker and employer
app.get("/seed-database", async (req, res) => {
  console.log("Attempting to seed database...");
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const employerQuery = query(usersRef, where("role", "==", "employer"));
    const workerQuery = query(usersRef, where("role", "==", "worker"));

    const employerSnap = await getDocs(employerQuery);
    const workerSnap = await getDocs(workerQuery);

    if (employerSnap.empty || workerSnap.empty) {
      console.error(
        "Seeding failed: Could not find both an employer and a worker user in the database."
      );
      return res
        .status(400)
        .send(
          "Cannot seed: Register at least one employer and one worker first."
        );
    }

    // Use the *first* found employer/worker for seeding
    const sampleEmployer = {
      id: employerSnap.docs[0].id,
      email: employerSnap.docs[0].data().email,
    };
    const sampleWorker = {
      id: workerSnap.docs[0].id,
      email: workerSnap.docs[0].data().email,
    };
    console.log(
      `Using employer ${sampleEmployer.email} (ID: ${sampleEmployer.id}) and worker ${sampleWorker.email} (ID: ${sampleWorker.id}) for seeding.`
    );

    // More sample jobs
    const sampleJobs = [
      {
        title: "Residential Plumber",
        employer: sampleEmployer.email.split("@")[0],
        location: "Vengadamangalam",
        salary: "₹1500 / day",
        type: "Contract",
        employerId: sampleEmployer.id,
      },
      {
        title: "Electrician for Rewiring",
        employer: sampleEmployer.email.split("@")[0],
        location: "Chennai",
        salary: "₹1800 / day",
        type: "Contract",
        employerId: sampleEmployer.id,
      },
      {
        title: "Part-time Housekeeper",
        employer: sampleEmployer.email.split("@")[0],
        location: "Vengadamangalam",
        salary: "₹8000 / month",
        type: "Part-time",
        employerId: sampleEmployer.id,
      },
      {
        title: "Full-time Cook for Family",
        employer: sampleEmployer.email.split("@")[0],
        location: "Chennai",
        salary: "₹17000 / month",
        type: "Full-time",
        employerId: sampleEmployer.id,
      },
      {
        title: "Driver (School Pickup)",
        employer: sampleEmployer.email.split("@")[0],
        location: "Chennai",
        salary: "₹12000 / month",
        type: "Part-time",
        employerId: sampleEmployer.id,
      },
      {
        title: "Carpenter (Furniture)",
        employer: sampleEmployer.email.split("@")[0],
        location: "Local Area",
        salary: "₹1600 / day",
        type: "Contract",
        employerId: sampleEmployer.id,
      },
      {
        title: "Interior Painter (3 Rooms)",
        employer: sampleEmployer.email.split("@")[0],
        location: "Vengadamangalam",
        salary: "₹1400 / day",
        type: "Contract",
        employerId: sampleEmployer.id,
      },
      {
        title: "Office Assistant",
        employer: sampleEmployer.email.split("@")[0],
        location: "Chennai",
        salary: "₹15000 / month",
        type: "Full-time",
        employerId: sampleEmployer.id,
      },
      {
        title: "Gardener - Weekly",
        employer: sampleEmployer.email.split("@")[0],
        location: "Local Area",
        salary: "₹500 / visit",
        type: "Part-time",
        employerId: sampleEmployer.id,
      },
      {
        title: "Security Guard (Night)",
        employer: sampleEmployer.email.split("@")[0],
        location: "Chennai",
        salary: "₹18000 / month",
        type: "Full-time",
        employerId: sampleEmployer.id,
      },
      {
        title: "AC Technician",
        employer: sampleEmployer.email.split("@")[0],
        location: "Chennai",
        salary: "₹1700 / visit",
        type: "Contract",
        employerId: sampleEmployer.id,
      },
      {
        title: "Full-time Nanny",
        employer: sampleEmployer.email.split("@")[0],
        location: "Vengadamangalam",
        salary: "₹14000 / month",
        type: "Full-time",
        employerId: sampleEmployer.id,
      },
      {
        title: "Restaurant Waiter",
        employer: sampleEmployer.email.split("@")[0],
        location: "Chennai",
        salary: "₹11000 / month",
        type: "Full-time",
        employerId: sampleEmployer.id,
      },
      {
        title: "Delivery Executive",
        employer: sampleEmployer.email.split("@")[0],
        location: "Local Area",
        salary: "₹15000 / month",
        type: "Full-time",
        employerId: sampleEmployer.id,
      },
      {
        title: "Helper for Construction Site",
        employer: sampleEmployer.email.split("@")[0],
        location: "Vengadamangalam",
        salary: "₹700 / day",
        type: "Contract",
        employerId: sampleEmployer.id,
      },
      // Add 15 more
      {
        title: "Tailor (Boutique)",
        employer: sampleEmployer.email.split("@")[0],
        location: "Chennai",
        salary: "₹16000 / month",
        type: "Full-time",
        employerId: sampleEmployer.id,
      },
      {
        title: "Welder",
        employer: sampleEmployer.email.split("@")[0],
        location: "Local Area",
        salary: "₹1300 / day",
        type: "Contract",
        employerId: sampleEmployer.id,
      },
      {
        title: "Gym Trainer",
        employer: sampleEmployer.email.split("@")[0],
        location: "Chennai",
        salary: "₹18000 / month",
        type: "Part-time",
        employerId: sampleEmployer.id,
      },
      {
        title: "Pet Groomer",
        employer: sampleEmployer.email.split("@")[0],
        location: "Vengadamangalam",
        salary: "₹1000 / pet",
        type: "Part-time",
        employerId: sampleEmployer.id,
      },
      {
        title: "Mechanic (2-Wheeler)",
        employer: sampleEmployer.email.split("@")[0],
        location: "Local Area",
        salary: "₹15000 / month",
        type: "Full-time",
        employerId: sampleEmployer.id,
      },
      {
        title: "Dishwasher (Restaurant)",
        employer: sampleEmployer.email.split("@")[0],
        location: "Chennai",
        salary: "₹9000 / month",
        type: "Full-time",
        employerId: sampleEmployer.id,
      },
      {
        title: "Warehouse Packer",
        employer: sampleEmployer.email.split("@")[0],
        location: "Chennai",
        salary: "₹13000 / month",
        type: "Full-time",
        employerId: sampleEmployer.id,
      },
      {
        title: "Elderly Caretaker",
        employer: sampleEmployer.email.split("@")[0],
        location: "Vengadamangalam",
        salary: "₹16000 / month",
        type: "Full-time",
        employerId: sampleEmployer.id,
      },
      {
        title: "Tutor (Math & Science)",
        employer: sampleEmployer.email.split("@")[0],
        location: "Local Area",
        salary: "₹500 / hour",
        type: "Part-time",
        employerId: sampleEmployer.id,
      },
      {
        title: "Event Helper",
        employer: sampleEmployer.email.split("@")[0],
        location: "Chennai",
        salary: "₹1000 / day",
        type: "Contract",
        employerId: sampleEmployer.id,
      },
      {
        title: "Salesperson (Retail)",
        employer: sampleEmployer.email.split("@")[0],
        location: "Chennai",
        salary: "₹12000 / month",
        type: "Full-time",
        employerId: sampleEmployer.id,
      },
      {
        title: "Yoga Instructor",
        employer: sampleEmployer.email.split("@")[0],
        location: "Vengadamangalam",
        salary: "₹8000 / month",
        type: "Part-time",
        employerId: sampleEmployer.id,
      },
      {
        title: "Mason / Bricklayer",
        employer: sampleEmployer.email.split("@")[0],
        location: "Local Area",
        salary: "₹1400 / day",
        type: "Contract",
        employerId: sampleEmployer.id,
      },
      {
        title: "Data Entry Operator",
        employer: sampleEmployer.email.split("@")[0],
        location: "Chennai",
        salary: "₹13000 / month",
        type: "Full-time",
        employerId: sampleEmployer.id,
      },
      {
        title: "Beauty Therapist",
        employer: sampleEmployer.email.split("@")[0],
        location: "Chennai",
        salary: "₹17000 / month",
        type: "Full-time",
        employerId: sampleEmployer.id,
      },
    ];

    const jobsRef = collection(db, JOBS_COLLECTION);
    const jobPromises = sampleJobs.map((job) =>
      addDoc(jobsRef, { ...job, createdAt: serverTimestamp() })
    );
    const jobRefs = await Promise.all(jobPromises); // Get references to newly created jobs
    console.log(`Added ${jobRefs.length} sample jobs.`);

    const statuses = [
      "Under Review",
      "Approved",
      "Rejected",
      "Under Review",
      "Under Review",
      "Approved",
    ]; // Skew towards "Under Review"
    const sampleApplications = [];
    const appsRef = collection(db, APPLICATIONS_COLLECTION);

    // Create 50+ applications
    for (let i = 0; i < 55; i++) {
      const jobIndex = i % jobRefs.length; // Cycle through the created jobs
      const statusIndex = i % statuses.length; // Cycle through statuses
      const jobRef = jobRefs[jobIndex];
      const jobData = sampleJobs[jobIndex]; // Get original job data

      // Check if this worker already applied to this specific job in this loop
      const alreadyAppliedQuery = query(
        appsRef,
        where("jobId", "==", jobRef.id),
        where("workerId", "==", sampleWorker.id)
      );
      // We also check our local list to avoid duplicates in this batch
      const alreadyInSeedList = sampleApplications.some(
        (app) => app.jobId === jobRef.id && app.workerId === sampleWorker.id
      );

      // Only add if not already applied in DB and not already in this seed batch
      if (!alreadyInSeedList) {
        // Note: This only checks current batch. Re-running will still create duplicates.
        sampleApplications.push({
          jobId: jobRef.id, // Use the actual ID of the created job
          workerId: sampleWorker.id,
          employerId: sampleEmployer.id,
          workerEmail: sampleWorker.email,
          workerMessage: `Seeded application #${i + 1}: Interested in the ${
            jobData.title
          } position.`,
          status: statuses[statusIndex],
          appliedAt: serverTimestamp(), // Use server timestamp
          jobTitle: jobData.title, // Denormalize
          jobLocation: jobData.location, // Denormalize
        });
      }
    }

    // Check applications for uniqueness *before* adding
    const uniqueApplications = [];
    for (const app of sampleApplications) {
      const q = query(
        appsRef,
        where("jobId", "==", app.jobId),
        where("workerId", "==", app.workerId)
      );
      const snap = await getDocs(q);
      if (snap.empty) {
        uniqueApplications.push(app);
      } else {
        console.log(
          `Skipping duplicate seed application for job ${app.jobId} by worker ${app.workerId}`
        );
      }
    }

    // Add only the unique applications generated
    const appPromises = uniqueApplications.map((app) => addDoc(appsRef, app));
    await Promise.all(appPromises);
    console.log(`Added ${uniqueApplications.length} sample applications.`);

    res
      .status(200)
      .send(
        `Database seeded successfully with ${jobRefs.length} jobs and ${uniqueApplications.length} applications.`
      );
  } catch (error) {
    console.error("Database Seeding Error: ", error);
    res
      .status(500)
      .send(
        `Error seeding database. Make sure Firestore rules allow writes. Details: ${error.message}`
      );
  }
});

// --- 10. START
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`KaamKhoj server running on port ${PORT}`);
});
