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

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8S3U3joC33g-XSiuI8d6sLitA_FnXAs8",
  authDomain: "kaamkhoj-4c827.firebaseapp.com",
  projectId: "kaamkhoj-4c827",
  storageBucket: "kaamkhoj-4c827.firebasestorage.app",
  messagingSenderId: "469752313035",
  appId: "1:469752313035:web:09e22856cfc3d6f61d174e",
  measurementId: "G-Z13QXPN3VD",
};
const JWT_SECRET = "my-super-secret-key-for-kaamkhoj-123!@#";

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
  const firebaseApp = initializeApp(firebaseConfig);
  db = getFirestore(firebaseApp);
  console.log("Firebase DB Initialized Successfully.");
} catch (e) {
  console.error("Firebase Initialization Error: ", e);
  process.exit(1);
}

// --- 3. AUTHENTICATION MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null)
    return res.status(401).json({ message: "No token provided." });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ message: "Invalid or expired token." });
    req.user = user;
    next();
  });
};

const isEmployerOrAdmin = (req, res, next) => {
  if (req.user.role !== "employer" && req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Access forbidden: Requires employer or admin role." });
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
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
    console.log(`User registered: ${email} with ID: ${newUserDoc.id}`);
    res.status(201).json({
      message: "User registered successfully.",
      userId: newUserDoc.id,
    });
  } catch (error) {
    console.error("Register Error: ", error);
    res.status(500).json({ message: "Server error during registration." });
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

    // Ensure password exists before comparing
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
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: "1h" });
    console.log(`User logged in successfully: ${email}`); // DEBUG LOG
    res.json({ message: "Login successful.", token, user: userPayload });
  } catch (error) {
    console.error("Login Error: ", error);
    res.status(500).json({ message: "Server error during login." });
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
    res.status(500).json({ message: "Failed to fetch jobs." });
  }
});

app.post(
  "/api/jobs",
  [authenticateToken, isEmployerOrAdmin],
  async (req, res) => {
    const { title, employerName, location, salary, type } = req.body;
    const { userId } = req.user;
    if (!title || !employerName || !location || !salary || !type)
      return res.status(400).json({ message: "All job fields are required." });

    try {
      const newJob = {
        title,
        employer: employerName,
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
      res.status(500).json({ message: "Failed to post job." });
    }
  }
);

// --- 6. JOB TEMPLATES ROUTE ---
app.get("/api/job-templates", authenticateToken, async (req, res) => {
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
    res.status(500).json({ message: "Failed to submit application." });
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
    res.status(500).json({ message: "Failed to fetch applications." });
  }
});

app.get(
  "/api/applications/employer",
  [authenticateToken, isEmployerOrAdmin],
  async (req, res) => {
    const { userId } = req.user;
    try {
      const appRef = collection(db, APPLICATIONS_COLLECTION);
      const q = query(appRef, where("employerId", "==", userId));
      const snapshot = await getDocs(q);
      const applications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      res.json(applications);
    } catch (error) {
      console.error("Get Employer Applications Error: ", error);
      res.status(500).json({ message: "Failed to fetch applications." });
    }
  }
);

app.put(
  "/api/applications/:id/status",
  [authenticateToken, isEmployerOrAdmin],
  async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const { userId } = req.user;
    if (!status || !["Approved", "Rejected"].includes(status))
      return res
        .status(400)
        .json({ message: "Invalid status. Must be 'Approved' or 'Rejected'." });

    try {
      const appRef = doc(db, APPLICATIONS_COLLECTION, id);
      const appSnap = await getDoc(appRef);
      if (!appSnap.exists())
        return res.status(404).json({ message: "Application not found." });
      // Allow admin to approve/reject any application OR employer to approve/reject their own
      if (req.user.role !== "admin" && appSnap.data().employerId !== userId) {
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
      res.status(500).json({ message: "Failed to update application status." });
    }
  }
);

// --- 8. DATA SCIENCE / ANALYTICS ROUTE ---
app.get("/api/analytics", [authenticateToken, isAdmin], async (req, res) => {
  try {
    const usersSnapshot = await getDocs(collection(db, USERS_COLLECTION));
    const totalUsers = usersSnapshot.size;
    const userRoles = usersSnapshot.docs.reduce((acc, doc) => {
      const role = doc.data().role || "unknown";
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});

    const jobsSnapshot = await getDocs(collection(db, JOBS_COLLECTION));
    const totalJobs = jobsSnapshot.size;
    const jobTypes = jobsSnapshot.docs.reduce((acc, doc) => {
      const type = doc.data().type || "unknown";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const appSnapshot = await getDocs(collection(db, APPLICATIONS_COLLECTION));
    const totalApplications = appSnapshot.size;
    const appStatuses = appSnapshot.docs.reduce((acc, doc) => {
      const status = doc.data().status || "unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const analytics = {
      totals: {
        users: totalUsers,
        jobs: totalJobs,
        applications: totalApplications,
      },
      byRole: userRoles,
      byJobType: jobTypes,
      byAppStatus: appStatuses,
    };
    console.log(`Analytics report generated for admin ${req.user.email}`);
    res.json(analytics);
  } catch (error) {
    console.error("Analytics Error: ", error);
    res.status(500).json({ message: "Failed to generate analytics." });
  }
});

// --- 9. DATABASE SEEDING ROUTE (NEW) ---
app.get("/seed-database", async (req, res) => {
  console.log("Attempting to seed database...");
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const employerQuery = query(usersRef, where("role", "==", "employer"));
    const workerQuery = query(usersRef, where("role", "==", "worker"));

    const employerSnap = await getDocs(employerQuery);
    const workerSnap = await getDocs(workerQuery);

    if (employerSnap.empty || workerSnap.empty) {
      return res
        .status(400)
        .send(
          "Cannot seed: Register at least one employer and one worker first."
        );
    }

    const sampleEmployer = {
      id: employerSnap.docs[0].id,
      email: employerSnap.docs[0].data().email,
    };
    const sampleWorker = {
      id: workerSnap.docs[0].id,
      email: workerSnap.docs[0].data().email,
    };
    console.log(
      `Using employer ${sampleEmployer.email} and worker ${sampleWorker.email} for seeding.`
    );

    const sampleJobs = [
      {
        title: "Residential Plumber Needed",
        employer: sampleEmployer.email.split("@")[0],
        location: "Vengadamangalam",
        salary: "₹1500 / day",
        type: "Contract",
        employerId: sampleEmployer.id,
      },
      {
        title: "Experienced Electrician for Rewiring",
        employer: sampleEmployer.email.split("@")[0],
        location: "Chennai",
        salary: "₹1800 / day",
        type: "Contract",
        employerId: sampleEmployer.id,
      },
      {
        title: "Part-time Housekeeper (Mon-Wed-Fri)",
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
        title: "Driver for School Pickup/Dropoff",
        employer: sampleEmployer.email.split("@")[0],
        location: "Chennai",
        salary: "₹12000 / month",
        type: "Part-time",
        employerId: sampleEmployer.id,
      },
      {
        title: "Carpenter for Furniture Repair",
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
        title: "Office Assistant - Filing & Errands",
        employer: sampleEmployer.email.split("@")[0],
        location: "Chennai",
        salary: "₹15000 / month",
        type: "Full-time",
        employerId: sampleEmployer.id,
      },
      {
        title: "Gardener - Weekly Maintenance",
        employer: sampleEmployer.email.split("@")[0],
        location: "Local Area",
        salary: "₹500 / visit",
        type: "Part-time",
        employerId: sampleEmployer.id,
      },
      {
        title: "Security Guard - Night Shift",
        employer: sampleEmployer.email.split("@")[0],
        location: "Chennai",
        salary: "₹18000 / month",
        type: "Full-time",
        employerId: sampleEmployer.id,
      },
    ];

    const jobPromises = sampleJobs.map((job) =>
      addDoc(collection(db, JOBS_COLLECTION), {
        ...job,
        createdAt: serverTimestamp(),
      })
    );
    const jobRefs = await Promise.all(jobPromises);
    console.log(`Added ${jobRefs.length} sample jobs.`);

    const statuses = ["Under Review", "Approved", "Rejected"];
    const sampleApplications = [];
    for (let i = 0; i < 15; i++) {
      const jobIndex = i % jobRefs.length;
      const statusIndex = i % statuses.length;
      const jobRef = jobRefs[jobIndex];
      const jobData = sampleJobs[jobIndex];

      sampleApplications.push({
        jobId: jobRef.id,
        workerId: sampleWorker.id,
        employerId: sampleEmployer.id,
        workerEmail: sampleWorker.email,
        workerMessage: `Interested in the ${jobData.title} position. Available to start soon.`,
        status: statuses[statusIndex],
        appliedAt: serverTimestamp(),
        jobTitle: jobData.title,
        jobLocation: jobData.location,
      });
    }

    const appPromises = sampleApplications.map((app) =>
      addDoc(collection(db, APPLICATIONS_COLLECTION), app)
    );
    await Promise.all(appPromises);
    console.log(`Added ${sampleApplications.length} sample applications.`);

    res
      .status(200)
      .send("Database seeded successfully with sample jobs and applications.");
  } catch (error) {
    console.error("Database Seeding Error: ", error);
    res.status(500).send("Error seeding database.");
  }
});

// --- 10. START SERVER ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`KaamKhoj server running on port ${PORT}`);
});
