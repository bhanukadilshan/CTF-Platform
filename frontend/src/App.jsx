import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useEffect, useState } from "react";

import "./App.css";

import logo from "./assets/cybervault_logo.png";

import {
  apiRequest,
  saveAuth,
  getStoredUser,
  logout,
  isLoggedIn,
} from "./services/api";


/* =====================================================
   NAVBAR
===================================================== */


function Navbar({ user, onLogout }) {
  const location = useLocation();

  const [theme, setTheme] = useState(
    () => localStorage.getItem("ctf-theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("ctf-theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((current) =>
      current === "dark" ? "light" : "dark"
    );
  }

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        <div className="brand-logo">
          <img src={logo} alt="CyberVault Logo" />
        </div>
        <div className="brand-name">
          <span className="terminal-symbol">&gt;</span>
          <span className="ctf-name">CYBER</span>
          <span className="platform-name">VAULT</span>
          <span className="cursor">_</span>
        </div>
      </Link>

      <div className="nav-links">
        <Link to="/" className={`nav-item ${location.pathname === "/" ? "active-nav" : ""}`}>
          <span className="nav-prefix">//</span> Home
        </Link>

        {user && (
          <>
            <Link to="/challenges" className={`nav-item ${location.pathname.startsWith("/challenges") ? "active-nav" : ""}`}>
              <span className="nav-prefix">//</span> Challenges
            </Link>
            <Link to="/leaderboard" className={`nav-item ${location.pathname === "/leaderboard" ? "active-nav" : ""}`}>
              <span className="nav-prefix">//</span> Leaderboard
            </Link>
            <Link to="/profile" className={`nav-item ${location.pathname === "/profile" ? "active-nav" : ""}`}>
              <span className="nav-prefix">//</span> Profile
            </Link>
            {user.role === "ADMIN" && (
              <Link to="/admin" className={`nav-item ${location.pathname.startsWith("/admin") ? "active-nav" : ""}`}>
                <span className="nav-prefix">//</span> ADMIN DASHBOARD
              </Link>
            )}
          </>
        )}

        {!user && (
          <>
            <Link to="/login" className="nav-item"><span className="nav-prefix">//</span> Login</Link>
            <Link to="/register" className="nav-item"><span className="nav-prefix">//</span> Register</Link>
          </>
        )}

        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? "☀" : "☾"}
        </button>

        {user && <button onClick={onLogout} className="logout-nav">LOGOUT</button>}
      </div>
    </nav>
  );
}


/* =====================================================
   PROTECTED ROUTE
===================================================== */

function ProtectedRoute({ children }) {

  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


/* =====================================================
   HOME
===================================================== */

function Home({ user, onLogout }) {

  const [dashboard, setDashboard] = useState({
    score: 0,
    solved: 0,
    rank: "-",
  });

  const [loadingDashboard, setLoadingDashboard] =
    useState(false);

  useEffect(() => {
    async function loadDashboard() {

      if (!user) {
        return;
      }

      setLoadingDashboard(true);

      try {
        const [leaderboard, submissions] =
          await Promise.all([
            apiRequest("/api/leaderboard"),
            apiRequest("/api/submissions/my"),
          ]);

        const currentPlayer =
          leaderboard.find(
            (player) => player.username === user.username
          );

        const solved =
          submissions.filter(
            (submission) => submission.correct
          ).length;

        setDashboard({
          score: currentPlayer?.score || 0,
          solved,
          rank: currentPlayer ? `#${currentPlayer.rank}` : "-",
        });

      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoadingDashboard(false);
      }
    }

    loadDashboard();
  }, [user]);

  function handleLogout() {
    onLogout();
  }

  return (
    <div className="page">

      <Navbar
        user={user}
        onLogout={handleLogout}
      />

      {/* ================= HOME HERO ================= */}
      <main className="hero" id="home">
        <div className="hero-grid"></div>

        <div className="hero-terminal-card">
          <p className="hero-tag">
            [ SYSTEM ONLINE ] &nbsp; // &nbsp; WELCOME TO THE ARENA
          </p>

          <h1>
            Cyber<span>Vault</span> Arena
          </h1>

          <p className="hero-text">
            Test your cybersecurity skills, exploit vulnerabilities,
            solve challenges, capture flags, earn points and climb
            the global leaderboard.
          </p>

          <div className="hero-buttons">
            <Link
              to={user ? "/challenges" : "/login"}
              className="btn primary-btn hero-main-btn"
            >
              <span>&gt;_</span>
              VIEW CHALLENGES
            </Link>

            {!user && (
              <Link
                to="/register"
                className="btn secondary-btn"
              >
                <span>+</span>
                REGISTER
              </Link>
            )}
          </div>

          <div className="hero-status">
            <span className="status-dot"></span>
            CYBERVAULT ONLINE
            <span className="status-line"></span>
            SECURE VAULT
          </div>
        </div>

        <a href="#platform-info" className="scroll-indicator">
          <span>SCROLL TO EXPLORE</span>
          <span className="scroll-arrow">↓</span>
        </a>
      </main>

      {/* ================= PLATFORM INFO ================= */}
      <section className="platform-info" id="platform-info">
        <div className="section-container">

          <div className="section-heading home-section-heading">
            <p className="section-terminal">
              root@ctf:~$ ./platform_info
            </p>
            <h2>
              Enter the <span>Cyber Arena</span>
            </h2>
            <p className="home-section-text">
              Discover real-world cybersecurity challenges, find hidden
              vulnerabilities and prove your skills by capturing the flag.
            </p>
          </div>

          <div className="home-feature-grid">
            <div className="home-feature-card">
              <div className="home-feature-icon">01</div>
              <h3>CHALLENGE</h3>
              <p>
                Choose from different cybersecurity challenges and
                test your technical knowledge.
              </p>
            </div>

            <div className="home-feature-card">
              <div className="home-feature-icon purple-feature">02</div>
              <h3>CAPTURE</h3>
              <p>
                Investigate the challenge, discover the hidden flag
                and submit it to the platform.
              </p>
            </div>

            <div className="home-feature-card">
              <div className="home-feature-icon">03</div>
              <h3>CLIMB</h3>
              <p>
                Earn points for solved challenges and compete for a
                higher position on the leaderboard.
              </p>
            </div>
          </div>

          <div className="home-challenge-banner">
            <div>
              <p className="terminal-small">
                &gt; player@ctf:~$ ./start_challenge
              </p>
              <h2>
                Ready to <span>capture your first flag?</span>
              </h2>
              <p>
                Your next challenge is waiting. Enter the arena and start solving.
              </p>
            </div>

            <Link
              to={user ? "/challenges" : "/login"}
              className="btn primary-btn"
            >
              VIEW CHALLENGES
            </Link>
          </div>

        </div>
      </section>

      {/* ================= PLAYER DASHBOARD ================= */}
      {user && (
        <section className="home-dashboard" id="dashboard">
          <div className="section-container">

            <div className="section-heading">
              <p className="section-terminal">
                root@ctf:~$ ./player_status
              </p>
              <h2>
                Player <span>Dashboard</span>
              </h2>
              <p className="home-section-text">
                Welcome back, <strong>{user.username}</strong>. Here is your current progress.
              </p>
            </div>

            <div className="stats-grid">

              <div className="stat-card">
                <div className="stat-icon cyan-icon">&gt;_</div>
                <div>
                  <p className="stat-label">SCORE</p>
                  <h3>
                    {loadingDashboard ? "..." : dashboard.score}
                  </h3>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon purple-icon">✓</div>
                <div>
                  <p className="stat-label">SOLVED</p>
                  <h3>
                    {loadingDashboard ? "..." : dashboard.solved}
                  </h3>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon cyan-icon">#</div>
                <div>
                  <p className="stat-label">RANK</p>
                  <h3>
                    {loadingDashboard ? "..." : dashboard.rank}
                  </h3>
                </div>
              </div>

            </div>

            <div className="challenge-cta">
              <div>
                <p className="terminal-small">
                  &gt; player@ctf:~$ ./challenges
                </p>
                <h2>Ready for your next challenge?</h2>
                <p>
                  Find vulnerabilities, capture flags, earn points and improve your rank.
                </p>
              </div>

              <Link
                to="/challenges"
                className="btn primary-btn"
              >
                VIEW CHALLENGES
              </Link>
            </div>

          </div>
        </section>
      )}

    </div>
  );
}


/* =====================================================
   LOGIN
===================================================== */

function Login({ onLogin }) {

  const navigate = useNavigate();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  async function handleLogin(event) {

    event.preventDefault();

    setError("");
    setLoading(true);


    try {

      const token = await apiRequest(
        "/api/auth/login",
        {
          method: "POST",

          body: JSON.stringify({
            username,
            password,
          }),
        }
      );


      localStorage.setItem(
        "token",
        token
      );


      const profile =
        await apiRequest(
          "/api/user/profile"
        );


      saveAuth(token, profile);

      onLogin(profile);


      if (profile.role === "ADMIN") {

        navigate("/admin");

      } else {

        navigate("/");

      }


    } catch (error) {

      setError(
        error.message ||
        "Invalid username or password"
      );

    } finally {

      setLoading(false);

    }

  }


  return (
    <div className="auth-page">

      <div className="auth-card">

        <Link
          to="/"
          className="auth-logo"
        >
          <img
            src={logo}
            alt="CTF Platform Logo"
          />
        </Link>


        <div className="auth-brand">

          <span className="terminal-symbol">
            &gt;
          </span>

          <span className="ctf-name">
            CYBER
          </span>

          <span className="platform-name">
            VAULT
          </span>

          <span className="cursor">
            _
          </span>

        </div>


        <div className="terminal-line">
          <span>root@ctf:~$</span>
          authenticate_user
        </div>


        <h1>
          Welcome Back
        </h1>


        <p className="auth-subtitle">
          Login to continue your CTF journey
        </p>


        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        <form onSubmit={handleLogin}>

          <label>
            Username
          </label>

          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(event) =>
              setUsername(event.target.value)
            }
            required
          />


          <label>
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
          />


          <button
            type="submit"
            className="btn primary-btn full-btn"
            disabled={loading}
          >
            <span>&gt;_</span>

            {loading
              ? "AUTHENTICATING..."
              : "LOGIN"}
          </button>

        </form>


        <p className="switch-text">
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>


        <Link
          to="/"
          className="back-link"
        >
          &lt; Back to Home
        </Link>

      </div>

    </div>
  );
}


/* =====================================================
   REGISTER
===================================================== */

function Register() {

  const navigate = useNavigate();

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  async function handleRegister(event) {

    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);


    try {

      await apiRequest(
        "/api/auth/register",
        {
          method: "POST",

          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      );


      setSuccess(
        "Account created successfully!"
      );


      setUsername("");
      setEmail("");
      setPassword("");


      setTimeout(() => {
        navigate("/login");
      }, 1200);


    } catch (error) {

      setError(
        error.message ||
        "Registration failed"
      );

    } finally {

      setLoading(false);

    }

  }


  return (
    <div className="auth-page">

      <div className="auth-card">

        <Link
          to="/"
          className="auth-logo"
        >
          <img
            src={logo}
            alt="CTF Platform Logo"
          />
        </Link>


        <div className="auth-brand">

          <span className="terminal-symbol">
            &gt;
          </span>

          <span className="ctf-name">
            CYBER
          </span>

          <span className="platform-name">
            VAULT
          </span>

          <span className="cursor">
            _
          </span>

        </div>


        <div className="terminal-line">
          <span>root@ctf:~$</span>
          create_new_user
        </div>


        <h1>
          Create Account
        </h1>


        <p className="auth-subtitle">
          Join the cybersecurity challenge arena
        </p>


        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        {success && (
          <div className="success-message">
            {success}
          </div>
        )}


        <form onSubmit={handleRegister}>

          <label>
            Username
          </label>

          <input
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(event) =>
              setUsername(event.target.value)
            }
            required
          />


          <label>
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />


          <label>
            Password
          </label>

          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
          />


          <button
            type="submit"
            className="btn secondary-btn full-btn"
            disabled={loading}
          >

            <span>+</span>

            {loading
              ? "CREATING..."
              : "CREATE ACCOUNT"}

          </button>

        </form>


        <p className="switch-text">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>


        <Link
          to="/"
          className="back-link"
        >
          &lt; Back to Home
        </Link>

      </div>

    </div>
  );
}


/* =====================================================
   CHALLENGES
===================================================== */

function Challenges() {

  const [challenges, setChallenges] =
    useState([]);

  const [category, setCategory] =
    useState("ALL");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {

    async function loadChallenges() {

      try {

        const data =
          await apiRequest(
            "/api/challenges"
          );

        setChallenges(data);

      } catch (error) {

        setError(error.message);

      } finally {

        setLoading(false);

      }

    }

    loadChallenges();

  }, []);


  const categories = [
    "ALL",
    ...new Set(
      challenges.map(
        (challenge) =>
          challenge.category
      )
    ),
  ];


  const filteredChallenges =
    category === "ALL"
      ? challenges
      : challenges.filter(
          (challenge) =>
            challenge.category === category
        );


  return (
    <div className="dashboard-page">

      <Navbar
        user={getStoredUser()}
        onLogout={() => {
          logout();
          window.location.href = "/";
        }}
      />


      <main className="content-container">

        <div className="page-header">

          <p className="section-terminal">
            root@ctf:~$ ./challenges
          </p>

          <h1>
            CTF <span>Challenges</span>
          </h1>

          <p>
            Choose a challenge, solve it and capture the flag.
          </p>

        </div>


        <div className="filter-bar">

          {categories.map((item) => (

            <button
              key={item}
              className={
                category === item
                  ? "filter-btn active-filter"
                  : "filter-btn"
              }
              onClick={() =>
                setCategory(item)
              }
            >
              {item}
            </button>

          ))}

        </div>


        {loading && (
          <div className="loading-box">
            LOADING CHALLENGES...
          </div>
        )}


        {error && (
          <div className="error-message page-error">
            {error}
          </div>
        )}


        {!loading &&
          !error &&
          filteredChallenges.length === 0 && (
            <div className="empty-box">
              No challenges available.
            </div>
          )}


        <div className="challenge-grid">

          {filteredChallenges.map(
            (challenge) => (

              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
              />

            )
          )}

        </div>

      </main>

    </div>
  );
}


/* =====================================================
   CHALLENGE CARD
===================================================== */

function ChallengeCard({ challenge }) {

  return (
    <div className="challenge-card">

      <div className="challenge-number">
        #{String(challenge.id).padStart(2, "0")}
      </div>


      <h2>
        {challenge.title}
      </h2>


      <p className="challenge-description">
        {challenge.description}
      </p>


      <div className="challenge-meta">

        <span className="category-badge">
          {challenge.category}
        </span>

        <span
          className={`difficulty-badge ${String(
            challenge.difficulty
          ).toLowerCase()}`}
        >
          {challenge.difficulty}
        </span>

      </div>


      <div className="challenge-footer">

        <span className="points">
          {challenge.points} POINTS
        </span>


        <Link
          to={`/challenges/${challenge.id}`}
          className="view-btn"
        >
          VIEW
        </Link>

      </div>

    </div>
  );
}


/* =====================================================
   CHALLENGE DETAILS
===================================================== */

function ChallengeDetails() {

  const { pathname } = useLocation();

  const challengeId =
    pathname.split("/").pop();


  const [challenge, setChallenge] =
    useState(null);

  const [flag, setFlag] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [correct, setCorrect] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);


  useEffect(() => {

    async function loadChallenge() {

      try {

        const data =
          await apiRequest(
            `/api/challenges/${challengeId}`
          );

        setChallenge(data);

      } catch (error) {

        setMessage(error.message);

      } finally {

        setLoading(false);

      }

    }

    loadChallenge();

  }, [challengeId]);


  async function handleSubmit(event) {

    event.preventDefault();

    setMessage("");
    setCorrect(null);
    setSubmitting(true);


    try {

      const response =
        await apiRequest(
          `/api/submissions/${challengeId}`,
          {
            method: "POST",

            body: JSON.stringify({
              flag,
            }),
          }
        );


      setMessage(
        `${response.message} ${
          response.correct
            ? `+${response.pointsAwarded} points`
            : ""
        }`
      );


      setCorrect(response.correct);


      if (response.correct) {
        setFlag("");
      }

    } catch (error) {

      setMessage(error.message);
      setCorrect(false);

    } finally {

      setSubmitting(false);

    }

  }


  async function handleDownloadFile() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8081/api/challenges/${challengeId}/file`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download challenge file");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = challenge.fileName || "challenge-file";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      setMessage(error.message || "File download failed");
      setCorrect(false);
    }
  }


  if (loading) {

    return (
      <div className="dashboard-page">

        <Navbar
          user={getStoredUser()}
          onLogout={() => {
            logout();
            window.location.href = "/";
          }}
        />

        <div className="loading-box">
          LOADING CHALLENGE...
        </div>

      </div>
    );

  }


  if (!challenge) {

    return (
      <div className="dashboard-page">

        <Navbar
          user={getStoredUser()}
          onLogout={() => {
            logout();
            window.location.href = "/";
          }}
        />

        <main className="content-container">

          <div className="error-message">
            {message || "Challenge not found"}
          </div>

        </main>

      </div>
    );

  }


  return (
    <div className="dashboard-page">

      <Navbar
        user={getStoredUser()}
        onLogout={() => {
          logout();
          window.location.href = "/";
        }}
      />


      <main className="content-container">

        <Link
          to="/challenges"
          className="back-link left-back"
        >
          &lt; Back to Challenges
        </Link>


        <div className="challenge-detail-card">

          <p className="section-terminal">
            root@ctf:~$ ./challenge_{challenge.id}
          </p>


          <h1>
            {challenge.title}
          </h1>


          <div className="detail-meta">

            <span className="category-badge">
              {challenge.category}
            </span>

            <span
              className={`difficulty-badge ${String(
                challenge.difficulty
              ).toLowerCase()}`}
            >
              {challenge.difficulty}
            </span>

            <span className="points">
              {challenge.points} POINTS
            </span>

          </div>


          <div className="detail-section">

            <h3>
              DESCRIPTION
            </h3>

            <p>
              {challenge.description}
            </p>

          </div>


          {challenge.hasFile && challenge.fileName && (
            <div className="detail-section challenge-attachment-section">
              <h3>ATTACHMENT</h3>
              <p className="hint-text">
                Download the file provided for this challenge.
              </p>
              <button
                type="button"
                className="btn secondary-btn"
                onClick={handleDownloadFile}
              >
                ↓ DOWNLOAD {challenge.fileName}
              </button>
            </div>
          )}


          <div className="flag-section">

            <h3>
              SUBMIT FLAG
            </h3>

            <p className="hint-text">
              Enter the flag you discovered while solving
              this challenge.
            </p>


            <form
              onSubmit={handleSubmit}
              className="flag-form"
            >

              <input
                type="text"
                placeholder="CTF{your_flag_here}"
                value={flag}
                onChange={(event) =>
                  setFlag(event.target.value)
                }
                required
              />


              <button
                type="submit"
                className="btn primary-btn submit-flag-btn"
                disabled={submitting}
              >
                {submitting
                  ? "CHECKING..."
                  : "SUBMIT FLAG"}
              </button>

            </form>


            {message && (
              <div
                className={
                  correct
                    ? "success-message"
                    : "error-message"
                }
              >
                {message}
              </div>
            )}

          </div>

        </div>

      </main>

    </div>
  );
}


/* =====================================================
   LEADERBOARD
===================================================== */

function Leaderboard() {

  const [players, setPlayers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    async function loadLeaderboard() {

      try {

        const data =
          await apiRequest(
            "/api/leaderboard"
          );

        setPlayers(data);

      } catch (error) {

        console.error(
          error
        );

      } finally {

        setLoading(false);

      }

    }

    loadLeaderboard();

  }, []);


  return (
    <div className="dashboard-page">

      <Navbar
        user={getStoredUser()}
        onLogout={() => {
          logout();
          window.location.href = "/";
        }}
      />


      <main className="content-container">

        <div className="page-header">

          <p className="section-terminal">
            root@ctf:~$ ./leaderboard
          </p>

          <h1>
            Global <span>Leaderboard</span>
          </h1>

          <p>
            Compete with other players and climb the rankings.
          </p>

        </div>


        {loading ? (

          <div className="loading-box">
            LOADING LEADERBOARD...
          </div>

        ) : (

          <div className="leaderboard-card">

            <div className="leaderboard-header">
              <span>RANK</span>
              <span>PLAYER</span>
              <span>SCORE</span>
            </div>


            {players.map((player) => (

              <div
                key={player.rank}
                className={`leaderboard-row ${
                  player.username ===
                  getStoredUser()?.username
                    ? "current-player"
                    : ""
                }`}
              >

                <span className="rank-number">
                  #{player.rank}
                </span>

                <span className="player-name">
                  {player.username}
                </span>

                <span className="player-score">
                  {player.score}
                </span>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}


/* =====================================================
   PROFILE
===================================================== */

function Profile() {

  const user = getStoredUser();

  return (
    <div className="dashboard-page">

      <Navbar
        user={user}
        onLogout={() => {
          logout();
          window.location.href = "/";
        }}
      />


      <main className="content-container">

        <div className="page-header">

          <p className="section-terminal">
            root@ctf:~$ ./profile
          </p>

          <h1>
            Player <span>Profile</span>
          </h1>

        </div>


        <div className="profile-card">

          <div className="profile-avatar">
            {user?.username
              ?.charAt(0)
              .toUpperCase()}
          </div>


          <div className="profile-info">

            <div className="profile-item">
              <span>USERNAME</span>
              <strong>
                {user?.username}
              </strong>
            </div>


            <div className="profile-item">
              <span>EMAIL</span>
              <strong>
                {user?.email}
              </strong>
            </div>


            <div className="profile-item">
              <span>ROLE</span>
              <strong>
                {user?.role}
              </strong>
            </div>

          </div>

        </div>


        <Link
          to="/submissions"
          className="btn secondary-btn profile-history-btn"
        >
          VIEW SUBMISSION HISTORY
        </Link>

      </main>

    </div>
  );
}


/* =====================================================
   SUBMISSION HISTORY
===================================================== */

function SubmissionHistory() {

  const [submissions, setSubmissions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    async function loadSubmissions() {

      try {

        const data =
          await apiRequest(
            "/api/submissions/my"
          );

        setSubmissions(data);

      } catch (error) {

        console.error(
          error
        );

      } finally {

        setLoading(false);

      }

    }

    loadSubmissions();

  }, []);


  return (
    <div className="dashboard-page">

      <Navbar
        user={getStoredUser()}
        onLogout={() => {
          logout();
          window.location.href = "/";
        }}
      />


      <main className="content-container">

        <div className="page-header">

          <p className="section-terminal">
            root@ctf:~$ ./submissions
          </p>

          <h1>
            Submission <span>History</span>
          </h1>

        </div>


        {loading ? (

          <div className="loading-box">
            LOADING SUBMISSIONS...
          </div>

        ) : submissions.length === 0 ? (

          <div className="empty-box">
            No submissions yet.
          </div>

        ) : (

          <div className="submission-card">

            {submissions
              .slice()
              .reverse()
              .map((submission) => (

                <div
                  key={submission.id}
                  className="submission-row"
                >

                  <div>

                    <strong>
                      {submission.challenge?.title ||
                        `Challenge #${submission.challenge?.id}`}
                    </strong>

                    <small>
                      {submission.submittedAt
                        ? new Date(
                            submission.submittedAt
                          ).toLocaleString()
                        : ""}
                    </small>

                  </div>


                  <span
                    className={
                      submission.correct
                        ? "submission-correct"
                        : "submission-wrong"
                    }
                  >
                    {submission.correct
                      ? `✓ SOLVED +${submission.pointsAwarded}`
                      : "✗ FAILED"}
                  </span>

                </div>

              ))}

          </div>

        )}

      </main>

    </div>
  );
}


/* =====================================================
   ADMIN DASHBOARD
===================================================== */

function AdminDashboard() {

  const user = getStoredUser();

  const [activeTab, setActiveTab] =
    useState("dashboard");

  const [users, setUsers] =
    useState([]);

  const [challenges, setChallenges] =
    useState([]);

  const [submissions, setSubmissions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [showChallengeForm, setShowChallengeForm] =
    useState(false);

  const [editingChallenge, setEditingChallenge] =
    useState(null);

  const [challengeForm, setChallengeForm] =
    useState({
      title: "",
      description: "",
      category: "File and hidden-data inspection",
      difficulty: "EASY",
      points: 100,
      flag: "",
    });

  const [challengeFile, setChallengeFile] =
    useState(null);

  const [savingChallenge, setSavingChallenge] =
    useState(false);


  /* =====================================================
     LOAD ADMIN DATA
  ===================================================== */

  async function loadAdminData() {

    setLoading(true);
    setError("");

    try {

      const [
        usersData,
        challengesData,
        submissionsData,
      ] = await Promise.all([
        apiRequest("/api/admin/users"),
        apiRequest("/api/admin/challenges"),
        apiRequest("/api/admin/submissions"),
      ]);

      setUsers(usersData || []);
      setChallenges(challengesData || []);
      setSubmissions(submissionsData || []);

    } catch (error) {

      console.error(error);

      setError(
        error.message ||
        "Failed to load admin data"
      );

    } finally {

      setLoading(false);

    }
  }


  useEffect(() => {

    if (user?.role === "ADMIN") {
      loadAdminData();
    }

  }, []);


  /* =====================================================
     ADMIN CHECK
  ===================================================== */

  if (user?.role !== "ADMIN") {

    return (
      <Navigate
        to="/"
        replace
      />
    );

  }


  /* =====================================================
     DELETE USER
  ===================================================== */

  async function handleDeleteUser(id) {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this user?"
      );

    if (!confirmed) {
      return;
    }

    try {

      await apiRequest(
        `/api/admin/users/${id}`,
        {
          method: "DELETE",
        }
      );

      setMessage(
        "User deleted successfully."
      );

      setUsers((currentUsers) =>
        currentUsers.filter(
          (item) => item.id !== id
        )
      );

    } catch (error) {

      setError(
        error.message ||
        "Failed to delete user"
      );

    }

  }


  /* =====================================================
     CHALLENGE FORM
  ===================================================== */

  function handleChallengeInput(event) {

    const {
      name,
      value,
    } = event.target;

    setChallengeForm((current) => ({
      ...current,
      [name]:
        name === "points"
          ? Number(value)
          : value,
    }));

  }


  function openAddChallenge() {

    setEditingChallenge(null);
    setChallengeFile(null);

    setChallengeForm({
      title: "",
      description: "",
      category: "File and hidden-data inspection",
      difficulty: "EASY",
      points: 100,
      flag: "",
    });

    setShowChallengeForm(true);

    setMessage("");
    setError("");

  }


  function openEditChallenge(challenge) {

    setEditingChallenge(challenge);
    setChallengeFile(null);

    setChallengeForm({
      title: challenge.title || "",
      description: challenge.description || "",
      category: challenge.category || "File and hidden-data inspection",
      difficulty: challenge.difficulty || "EASY",
      points: challenge.points || 100,
      flag: challenge.flag || "",
    });

    setShowChallengeForm(true);

    setMessage("");
    setError("");

  }


  function closeChallengeForm() {

    setShowChallengeForm(false);
    setEditingChallenge(null);
    setChallengeFile(null);

  }


  /* =====================================================
     ADD / UPDATE CHALLENGE
  ===================================================== */

  async function handleChallengeSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    setSavingChallenge(true);

    try {
      const method = editingChallenge ? "PUT" : "POST";
      const url = editingChallenge
        ? `/api/admin/challenges/${editingChallenge.id}`
        : "/api/admin/challenges";

      const savedChallenge = await apiRequest(url, {
        method,
        body: JSON.stringify({
          title: challengeForm.title,
          description: challengeForm.description,
          category: challengeForm.category,
          difficulty: challengeForm.difficulty,
          points: Number(challengeForm.points),
          flag: challengeForm.flag,
        }),
      });

      const challengeId = editingChallenge
        ? editingChallenge.id
        : savedChallenge.id;

      if (challengeFile) {
        const formData = new FormData();
        formData.append("file", challengeFile);

        const token = localStorage.getItem("token");
        const uploadResponse = await fetch(
          `http://localhost:8081/api/admin/challenges/${challengeId}/file`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!uploadResponse.ok) {
          const uploadError = await uploadResponse.text();
          throw new Error(uploadError || "Challenge saved, but file upload failed");
        }
      }

      setMessage(
        editingChallenge
          ? "Challenge updated successfully."
          : "Challenge created successfully."
      );

      closeChallengeForm();
      await loadAdminData();
      setActiveTab("challenges");

    } catch (error) {
      console.error(error);
      setError(error.message || "Failed to save challenge");
    } finally {
      setSavingChallenge(false);
    }
  }


  /* =====================================================
     DELETE CHALLENGE
  ===================================================== */

  async function handleDeleteChallenge(id) {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this challenge?"
      );

    if (!confirmed) {
      return;
    }

    try {

      await apiRequest(
        `/api/admin/challenges/${id}`,
        {
          method: "DELETE",
        }
      );

      setMessage(
        "Challenge deleted successfully."
      );

      setChallenges((currentChallenges) =>
        currentChallenges.filter(
          (item) => item.id !== id
        )
      );

    } catch (error) {

      setError(
        error.message ||
        "Failed to delete challenge"
      );

    }

  }


  /* =====================================================
     DASHBOARD COUNTS
  ===================================================== */

  const totalUsers =
    users.length;

  const totalChallenges =
    challenges.length;

  const totalSubmissions =
    submissions.length;

  const solvedSubmissions =
    submissions.filter(
      (item) => item.correct
    ).length;


  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="dashboard-page">

      <Navbar
        user={user}
        onLogout={() => {
          logout();
          window.location.href = "/";
        }}
      />


      <main className="admin-console">

        {/* =================================================
           ADMIN HEADER
        ================================================= */}

        <div className="admin-console-header">

          <div>

            <p className="section-terminal">
              root@ctf:~$ ./admin_console
            </p>

            <h1>
              Admin <span>Control Panel</span>
            </h1>

            <p>
              Manage users, challenges and platform submissions.
            </p>

          </div>

          <div className="admin-status">

            <span className="admin-status-dot"></span>

            ADMIN ACCESS

          </div>

        </div>


        {/* =================================================
           MESSAGES
        ================================================= */}

        {error && (
          <div className="error-message admin-message">
            {error}
          </div>
        )}

        {message && (
          <div className="success-message admin-message">
            {message}
          </div>
        )}


        {/* =================================================
           ADMIN LAYOUT
        ================================================= */}

        <div className="admin-layout">


          {/* =================================================
             SIDEBAR
          ================================================= */}

          <aside className="admin-sidebar">

            <p className="admin-menu-title">
              CONTROL MENU
            </p>


            <button
              className={
                activeTab === "dashboard"
                  ? "admin-menu-btn active-admin-menu"
                  : "admin-menu-btn"
              }
              onClick={() =>
                setActiveTab("dashboard")
              }
            >
              <span>01</span>
              Dashboard
            </button>


            <button
              className={
                activeTab === "users"
                  ? "admin-menu-btn active-admin-menu"
                  : "admin-menu-btn"
              }
              onClick={() =>
                setActiveTab("users")
              }
            >
              <span>02</span>
              Users
            </button>


            <button
              className={
                activeTab === "challenges"
                  ? "admin-menu-btn active-admin-menu"
                  : "admin-menu-btn"
              }
              onClick={() =>
                setActiveTab("challenges")
              }
            >
              <span>03</span>
              Challenges
            </button>


            <button
              className={
                activeTab === "submissions"
                  ? "admin-menu-btn active-admin-menu"
                  : "admin-menu-btn"
              }
              onClick={() =>
                setActiveTab("submissions")
              }
            >
              <span>04</span>
              Submissions
            </button>


            <div className="admin-sidebar-line"></div>


            <Link
              to="/"
              className="admin-back-home"
            >
              &lt; Back to Platform
            </Link>

          </aside>


          {/* =================================================
             CONTENT
          ================================================= */}

          <section className="admin-main-content">


            {loading ? (

              <div className="loading-box">
                LOADING ADMIN CONSOLE...
              </div>

            ) : (

              <>


                {/* =================================================
                   DASHBOARD TAB
                ================================================= */}

                {activeTab === "dashboard" && (

                  <div className="admin-tab-content">

                    <div className="admin-tab-header">

                      <div>

                        <p className="terminal-small">
                          &gt; admin@ctf:~$ ./overview
                        </p>

                        <h2>
                          System <span>Overview</span>
                        </h2>

                      </div>

                    </div>


                    <div className="admin-stats-grid">

                      <div className="admin-stat-card">

                        <div className="admin-stat-icon cyan-icon">
                          U
                        </div>

                        <div>

                          <p>
                            TOTAL USERS
                          </p>

                          <h3>
                            {totalUsers}
                          </h3>

                        </div>

                      </div>


                      <div className="admin-stat-card">

                        <div className="admin-stat-icon purple-icon">
                          C
                        </div>

                        <div>

                          <p>
                            CHALLENGES
                          </p>

                          <h3>
                            {totalChallenges}
                          </h3>

                        </div>

                      </div>


                      <div className="admin-stat-card">

                        <div className="admin-stat-icon cyan-icon">
                          S
                        </div>

                        <div>

                          <p>
                            SUBMISSIONS
                          </p>

                          <h3>
                            {totalSubmissions}
                          </h3>

                        </div>

                      </div>


                      <div className="admin-stat-card">

                        <div className="admin-stat-icon purple-icon">
                          ✓
                        </div>

                        <div>

                          <p>
                            SOLVED FLAGS
                          </p>

                          <h3>
                            {solvedSubmissions}
                          </h3>

                        </div>

                      </div>

                    </div>


                    <div className="admin-overview-grid">

                      <div className="admin-info-card">

                        <p className="terminal-small">
                          &gt; system.status
                        </p>

                        <h3>
                          Platform Status
                        </h3>

                        <div className="system-status-row">

                          <span>
                            API SERVER
                          </span>

                          <strong>
                            ONLINE
                          </strong>

                        </div>


                        <div className="system-status-row">

                          <span>
                            DATABASE
                          </span>

                          <strong>
                            CONNECTED
                          </strong>

                        </div>


                        <div className="system-status-row">

                          <span>
                            AUTHENTICATION
                          </span>

                          <strong>
                            JWT ACTIVE
                          </strong>

                        </div>

                      </div>


                      <div className="admin-info-card">

                        <p className="terminal-small">
                          &gt; quick.actions
                        </p>

                        <h3>
                          Quick Actions
                        </h3>


                        <button
                          className="admin-action-btn"
                          onClick={openAddChallenge}
                        >
                          + CREATE CHALLENGE
                        </button>


                        <button
                          className="admin-action-btn secondary-admin-action"
                          onClick={() =>
                            setActiveTab("users")
                          }
                        >
                          &gt; MANAGE USERS
                        </button>


                        <button
                          className="admin-action-btn secondary-admin-action"
                          onClick={() =>
                            setActiveTab("submissions")
                          }
                        >
                          &gt; VIEW SUBMISSIONS
                        </button>

                      </div>

                    </div>

                  </div>

                )}


                {/* =================================================
                   USERS TAB
                ================================================= */}

                {activeTab === "users" && (

                  <div className="admin-tab-content">

                    <div className="admin-tab-header">

                      <div>

                        <p className="terminal-small">
                          &gt; admin@ctf:~$ ./users
                        </p>

                        <h2>
                          User <span>Management</span>
                        </h2>

                        <p>
                          Manage registered platform users.
                        </p>

                      </div>

                    </div>


                    <div className="admin-data-card">

                      <div className="admin-data-header">

                        <span>
                          {users.length} USERS
                        </span>

                      </div>


                      <div className="admin-user-table">

                        <div className="admin-user-head">
                          <span>ID</span>
                          <span>USERNAME</span>
                          <span>EMAIL</span>
                          <span>ROLE</span>
                          <span>SCORE</span>
                          <span>STATUS</span>
                          <span>ACTIONS</span>
                        </div>


                        {users.map((item) => (

                          <div
                            className="admin-user-row"
                            key={item.id}
                          >

                            <span>
                              #{item.id}
                            </span>

                            <strong>
                              {item.username}
                            </strong>

                            <span className="admin-email">
                              {item.email}
                            </span>

                            <span
                              className={
                                item.role === "ADMIN"
                                  ? "admin-role"
                                  : "user-role"
                              }
                            >
                              {item.role}
                            </span>

                            <span className="admin-score">
                              {item.score}
                            </span>

                            <span
                              className={
                                item.active === false
                                  ? "user-status suspended"
                                  : "user-status active"
                              }
                            >
                              {item.active === false
                                ? "SUSPENDED"
                                : "ACTIVE"}
                            </span>

                            <div className="user-action-buttons">

                              {item.role !== "ADMIN" ? (
                                <>
                                  <button
                                    className={
                                      item.active === false
                                        ? "activate-btn"
                                        : "suspend-btn"
                                    }
                                    onClick={() =>
                                      handleToggleUserStatus(item)
                                    }
                                  >
                                    {item.active === false
                                      ? "ACTIVATE"
                                      : "SUSPEND"}
                                  </button>

                                  <button
                                    className="delete-btn"
                                    onClick={() =>
                                      handleDeleteUser(
                                        item.id
                                      )
                                    }
                                  >
                                    DELETE
                                  </button>
                                </>
                              ) : (
                                <span className="protected-admin">
                                  PROTECTED
                                </span>
                              )}

                            </div>

                          </div>

                        ))}

                      </div>

                    </div>

                  </div>

                )}


                {/* =================================================
                   CHALLENGES TAB
                ================================================= */}

                {activeTab === "challenges" && (

                  <div className="admin-tab-content">

                    <div className="admin-tab-header">

                      <div>

                        <p className="terminal-small">
                          &gt; admin@ctf:~$ ./challenges
                        </p>

                        <h2>
                          Challenge <span>Management</span>
                        </h2>

                        <p>
                          Create and manage cybersecurity challenges.
                        </p>

                      </div>


                      <button
                        className="btn primary-btn"
                        onClick={openAddChallenge}
                      >
                        + ADD CHALLENGE
                      </button>

                    </div>


                    <div className="admin-challenge-list">

                      {challenges.map((challenge) => (

                        <div
                          className="admin-challenge-card"
                          key={challenge.id}
                        >

                          <div className="admin-challenge-top">

                            <span className="challenge-number">
                              #{String(
                                challenge.id
                              ).padStart(2, "0")}
                            </span>

                            <span className="category-badge">
                              {challenge.category}
                            </span>

                            <span
                              className={`difficulty-badge ${String(
                                challenge.difficulty
                              ).toLowerCase()}`}
                            >
                              {challenge.difficulty}
                            </span>

                          </div>


                          <h3>
                            {challenge.title}
                          </h3>


                          <p>
                            {challenge.description}
                          </p>


                          {challenge.fileName && (
                            <p className="admin-challenge-file">
                              ATTACHMENT: {challenge.fileName}
                            </p>
                          )}


                          <div className="admin-challenge-bottom">

                            <strong>
                              {challenge.points} POINTS
                            </strong>


                            <div>

                              <button
                                className="edit-btn"
                                onClick={() =>
                                  openEditChallenge(
                                    challenge
                                  )
                                }
                              >
                                EDIT
                              </button>


                              <button
                                className="delete-btn"
                                onClick={() =>
                                  handleDeleteChallenge(
                                    challenge.id
                                  )
                                }
                              >
                                DELETE
                              </button>

                            </div>

                          </div>

                        </div>

                      ))}

                    </div>

                  </div>

                )}


                {/* =================================================
                   SUBMISSIONS TAB
                ================================================= */}

                {activeTab === "submissions" && (

                  <div className="admin-tab-content">

                    <div className="admin-tab-header">

                      <div>

                        <p className="terminal-small">
                          &gt; admin@ctf:~$ ./submissions
                        </p>

                        <h2>
                          Submission <span>Management</span>
                        </h2>

                        <p>
                          Monitor all player flag submissions.
                        </p>

                      </div>

                    </div>


                    <div className="admin-data-card">

                      <div className="admin-data-header">

                        <span>
                          {submissions.length} SUBMISSIONS
                        </span>

                      </div>


                      <div className="admin-submission-list">

                        {submissions.length === 0 ? (

                          <div className="empty-box">
                            No submissions available.
                          </div>

                        ) : (

                          submissions
                            .slice()
                            .reverse()
                            .map((submission) => (

                              <div
                                className="admin-submission-row"
                                key={submission.id}
                              >

                                <div>

                                  <strong>
                                    {submission.username ||
                                      submission.user?.username ||
                                      "Unknown User"}
                                  </strong>

                                  <span>
                                    {submission.challenge?.title ||
                                      `Challenge #${
                                        submission.challenge?.id ||
                                        submission.challengeId ||
                                        "?"
                                      }`}
                                  </span>

                                </div>


                                <div className="submission-time">

                                  {submission.submittedAt
                                    ? new Date(
                                        submission.submittedAt
                                      ).toLocaleString()
                                    : "N/A"}

                                </div>


                                <span
                                  className={
                                    submission.correct
                                      ? "submission-correct"
                                      : "submission-wrong"
                                  }
                                >
                                  {submission.correct
                                    ? "✓ CORRECT"
                                    : "✗ FAILED"}
                                </span>


                                <span className="admin-points">

                                  {submission.correct
                                    ? `+${submission.pointsAwarded}`
                                    : "0"}

                                </span>

                              </div>

                            ))

                        )}

                      </div>

                    </div>

                  </div>

                )}

              </>

            )}

          </section>

        </div>

      </main>


      {/* =====================================================
         CHALLENGE MODAL
      ===================================================== */}

      {showChallengeForm && (

        <div className="admin-modal-overlay">

          <div className="admin-modal">

            <div className="admin-modal-header">

              <div>

                <p className="terminal-small">
                  &gt; admin@ctf:~$ ./challenge_editor
                </p>

                <h2>
                  {editingChallenge
                    ? "Edit Challenge"
                    : "Create Challenge"}
                </h2>

              </div>


              <button
                className="modal-close-btn"
                onClick={closeChallengeForm}
              >
                ×
              </button>

            </div>


            <form
              onSubmit={handleChallengeSubmit}
              className="admin-challenge-form"
            >

              <label>
                Challenge Title
              </label>

              <input
                type="text"
                name="title"
                value={challengeForm.title}
                onChange={handleChallengeInput}
                placeholder="e.g. SQL Injection Basics"
                required
              />


              <label>
                Description
              </label>

              <textarea
                name="description"
                value={challengeForm.description}
                onChange={handleChallengeInput}
                placeholder="Describe the challenge..."
                rows="5"
                required
              />


              <div className="admin-form-grid">

                <div>

                  <label>
                    Category
                  </label>

                  <select
                    name="category"
                    value={challengeForm.category}
                    onChange={handleChallengeInput}
                  >
                    <option value="File and hidden-data inspection">
                      File and hidden-data inspection
                    </option>

                    <option value="Encoding / classical crypto">
                      Encoding / classical crypto
                    </option>

                    <option value="Web input validation">
                      Web input validation
                    </option>

                    <option value="Forensic investigation">
                      Forensic investigation
                    </option>

                    <option value="Network analysis">
                      Network analysis
                    </option>

                    <option value="Linux security">
                      Linux security
                    </option>
                  </select>

                </div>


                <div>

                  <label>
                    Difficulty
                  </label>

                  <select
                    name="difficulty"
                    value={challengeForm.difficulty}
                    onChange={handleChallengeInput}
                  >
                    <option value="EASY">
                      EASY
                    </option>

                    <option value="MEDIUM">
                      MEDIUM
                    </option>

                    <option value="HARD">
                      HARD
                    </option>
                  </select>

                </div>

              </div>


              <div className="admin-form-grid">

                <div>

                  <label>
                    Points
                  </label>

                  <input
                    type="number"
                    name="points"
                    min="1"
                    value={challengeForm.points}
                    onChange={handleChallengeInput}
                    required
                  />

                </div>


                <div>

                  <label>
                    Flag
                  </label>

                  <input
                    type="text"
                    name="flag"
                    value={challengeForm.flag}
                    onChange={handleChallengeInput}
                    placeholder="CTF{your_flag}"
                    required
                  />

                </div>

              </div>


              <label>
                Attachment (Optional)
              </label>

              {editingChallenge?.fileName && (
                <p className="hint-text">
                  Current file: {editingChallenge.fileName}. Choose a new file only if you want to replace it.
                </p>
              )}

              <input
                type="file"
                onChange={(event) =>
                  setChallengeFile(event.target.files?.[0] || null)
                }
              />

              {challengeFile && (
                <p className="hint-text">
                  Selected: {challengeFile.name}
                </p>
              )}


              <div className="admin-form-actions">

                <button
                  type="button"
                  className="btn secondary-btn"
                  onClick={closeChallengeForm}
                >
                  CANCEL
                </button>


                <button
                  type="submit"
                  className="btn primary-btn"
                  disabled={savingChallenge}
                >
                  {savingChallenge
                    ? "SAVING..."
                    : editingChallenge
                      ? "UPDATE CHALLENGE"
                      : "CREATE CHALLENGE"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}


/* =====================================================
   APP
===================================================== */

function App() {

  const [user, setUser] =
    useState(getStoredUser());


  function handleLogin(userData) {
    setUser(userData);
  }


  function handleLogout() {

    logout();

    setUser(null);

  }


  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={
            <Home
              user={user}
              onLogout={handleLogout}
            />
          }
        />


        <Route
          path="/login"
          element={
            user
              ? <Navigate to="/" replace />
              : <Login onLogin={handleLogin} />
          }
        />


        <Route
          path="/register"
          element={
            user
              ? <Navigate to="/" replace />
              : <Register />
          }
        />


        <Route
          path="/challenges"
          element={
            <ProtectedRoute>
              <Challenges />
            </ProtectedRoute>
          }
        />


        <Route
          path="/challenges/:id"
          element={
            <ProtectedRoute>
              <ChallengeDetails />
            </ProtectedRoute>
          }
        />


        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />


        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />


        <Route
          path="/submissions"
          element={
            <ProtectedRoute>
              <SubmissionHistory />
            </ProtectedRoute>
          }
        />


        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />


        <Route
          path="*"
          element={
            <Navigate to="/" replace />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}


export default App;

