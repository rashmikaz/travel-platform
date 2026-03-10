import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [hovered, setHovered] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={s.nav}>
      <style>{css}</style>
      <div style={s.inner}>
        {/* Logo */}
        <Link to="/" style={s.logo}>
          <div style={s.logoIcon}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          Wandr
        </Link>

        {/* Nav links */}
        <div style={s.links}>
          {[
            ["/", "Home"],
            ["/#feed", "Experiences"],
          ].map(([path, label]) => (
            <Link
              key={label}
              to={path}
              style={{ ...s.link, ...(isActive(path) ? s.linkActive : {}) }}
              onMouseEnter={() => setHovered(label)}
              onMouseLeave={() => setHovered("")}
            >
              {label}
              <span
                style={{
                  ...s.linkUnderline,
                  width: hovered === label || isActive(path) ? "100%" : "0%",
                }}
              />
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div style={s.actions}>
          {user ? (
            <>
              <Link to="/my-listings" style={s.userPill}>
                <div style={s.userAvatar}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span style={s.userName}>{user.name}</span>
              </Link>
              <Link to="/create" style={s.btnPrimary} className="nav-btn">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                New Experience
              </Link>
              <button
                onClick={handleLogout}
                style={s.btnGhost}
                className="nav-ghost-btn"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={s.btnGhost} className="nav-ghost-btn">
                Log in
              </Link>
              <Link to="/register" style={s.btnPrimary} className="nav-btn">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const css = `
  .nav-btn:hover { background: #1e3a5f !important; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(15,23,42,0.25) !important; }
  .nav-btn { transition: all 0.2s ease !important; }
  .nav-ghost-btn:hover { background: #f3f4f6 !important; color: #0f172a !important; }
  .nav-ghost-btn { transition: all 0.2s ease !important; }
`;

const s = {
  nav: {
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(16px)",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 1px 20px rgba(0,0,0,0.06)",
  },
  inner: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "0 80px",
    display: "flex",
    alignItems: "center",
    height: 64,
    gap: 40,
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    fontFamily: "'Raleway', sans-serif",
    fontSize: 18,
    fontWeight: 800,
    color: "#0f172a",
    letterSpacing: 2,
    textTransform: "uppercase",
    flexShrink: 0,
  },
  logoIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    background: "#0f172a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  links: { display: "flex", gap: 4, flex: 1 },
  link: {
    fontFamily: "'Raleway', sans-serif",
    fontSize: 12,
    fontWeight: 700,
    color: "#64748b",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    padding: "8px 14px",
    borderRadius: 8,
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "color 0.2s",
  },
  linkActive: { color: "#0f172a" },
  linkUnderline: {
    position: "absolute",
    bottom: 4,
    left: "14px",
    height: 2,
    background: "#0f172a",
    borderRadius: 2,
    transition: "width 0.25s ease",
  },

  actions: { display: "flex", alignItems: "center", gap: 10 },

  userPill: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#f8fafc",
    border: "1.5px solid #e5e7eb",
    borderRadius: 50,
    padding: "5px 14px 5px 5px",
    transition: "border-color 0.2s",
  },
  userAvatar: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "#0f172a",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Raleway', sans-serif",
    fontSize: 12,
    fontWeight: 800,
    flexShrink: 0,
  },
  userName: {
    fontFamily: "'Raleway', sans-serif",
    fontSize: 12,
    fontWeight: 700,
    color: "#0f172a",
    letterSpacing: 0.3,
  },

  btnPrimary: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    background: "#0f172a",
    color: "white",
    padding: "10px 18px",
    borderRadius: 9,
    fontFamily: "'Raleway', sans-serif",
    fontWeight: 700,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    boxShadow: "0 2px 12px rgba(15,23,42,0.15)",
  },

  btnGhost: {
    background: "transparent",
    color: "#64748b",
    padding: "9px 16px",
    borderRadius: 9,
    fontFamily: "'Raleway', sans-serif",
    fontWeight: 700,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    border: "1.5px solid #e5e7eb",
    cursor: "pointer",
  },
};
