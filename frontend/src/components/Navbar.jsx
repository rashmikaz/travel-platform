import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={s.nav}>
      <style>{css}</style>
      <div style={s.inner}>
        <Link to="/" style={s.logo}>
          <div style={s.logoIcon}>
            <svg
              width="13"
              height="13"
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

        {/* Desktop links */}
        <div style={s.links} className="nav-desktop-links">
          {[
            ["/", "Home"],
            ["/#feed", "Experiences"],
          ].map(([path, label]) => (
            <Link
              key={label}
              to={path}
              style={{ ...s.link, ...(isActive(path) ? s.linkActive : {}) }}
            >
              {label}
              <span
                style={{
                  ...s.underline,
                  width: isActive(path) ? "100%" : "0%",
                }}
                className="nav-underline"
              />
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div style={s.actions} className="nav-desktop-actions">
          {user ? (
            <>
              <Link to="/my-listings" style={s.userPill}>
                <div style={s.avatar}>{user.name.charAt(0).toUpperCase()}</div>
                <span style={s.userName}>{user.name}</span>
              </Link>
              <Link to="/create" style={s.btnPrimary} className="nav-btn">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                New
              </Link>
              <button
                onClick={handleLogout}
                style={s.btnGhost}
                className="nav-ghost"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={s.btnGhost} className="nav-ghost">
                Log in
              </Link>
              <Link to="/register" style={s.btnPrimary} className="nav-btn">
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          style={s.hamburger}
          className="nav-hamburger"
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0f172a"
              strokeWidth="2.5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0f172a"
              strokeWidth="2.5"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={s.mobileMenu} className="nav-mobile-menu">
          <Link to="/" style={s.mobileLink} onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link
            to="/#feed"
            style={s.mobileLink}
            onClick={() => setMenuOpen(false)}
          >
            Experiences
          </Link>
          {user ? (
            <>
              <Link
                to="/my-listings"
                style={s.mobileLink}
                onClick={() => setMenuOpen(false)}
              >
                My Listings
              </Link>
              <Link
                to="/create"
                style={s.mobileLinkPrimary}
                onClick={() => setMenuOpen(false)}
              >
                + New Experience
              </Link>
              <button onClick={handleLogout} style={s.mobileLinkGhost}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={s.mobileLink}
                onClick={() => setMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                to="/register"
                style={s.mobileLinkPrimary}
                onClick={() => setMenuOpen(false)}
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

const css = `
  .nav-btn:hover { opacity: 0.85 !important; transform: translateY(-1px); }
  .nav-btn { transition: all 0.2s !important; }
  .nav-ghost:hover { background: #f3f4f6 !important; color: #0f172a !important; }
  .nav-ghost { transition: all 0.2s !important; }
  .nav-link:hover .nav-underline { width: 100% !important; }

  @media (max-width: 768px) {
    .nav-desktop-links { display: none !important; }
    .nav-desktop-actions { display: none !important; }
    .nav-hamburger { display: flex !important; }
  }
  @media (min-width: 769px) {
    .nav-hamburger { display: none !important; }
    .nav-mobile-menu { display: none !important; }
  }
`;

const F = "'Raleway', sans-serif";
const s = {
  nav: {
    background: "rgba(255,255,255,0.95)",
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
    padding: "0 48px",
    display: "flex",
    alignItems: "center",
    height: 64,
    gap: 36,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontFamily: F,
    fontSize: 17,
    fontWeight: 800,
    color: "#0f172a",
    letterSpacing: 2,
    textTransform: "uppercase",
    flexShrink: 0,
  },
  logoIcon: {
    width: 28,
    height: 28,
    borderRadius: 7,
    background: "#0f172a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  links: { display: "flex", gap: 4, flex: 1 },
  link: {
    fontFamily: F,
    fontSize: 11,
    fontWeight: 700,
    color: "#64748b",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    padding: "8px 12px",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "color 0.2s",
  },
  linkActive: { color: "#0f172a" },
  underline: {
    position: "absolute",
    bottom: 4,
    left: "12px",
    height: 2,
    background: "#0f172a",
    borderRadius: 2,
    transition: "width 0.25s ease",
  },
  actions: { display: "flex", alignItems: "center", gap: 8 },
  userPill: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#f8fafc",
    border: "1.5px solid #e5e7eb",
    borderRadius: 50,
    padding: "5px 14px 5px 5px",
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: "50%",
    background: "#0f172a",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: F,
    fontSize: 11,
    fontWeight: 800,
    flexShrink: 0,
  },
  userName: {
    fontFamily: F,
    fontSize: 12,
    fontWeight: 700,
    color: "#0f172a",
    letterSpacing: 0.3,
  },
  btnPrimary: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#0f172a",
    color: "white",
    padding: "9px 18px",
    borderRadius: 8,
    fontFamily: F,
    fontWeight: 700,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    boxShadow: "0 2px 12px rgba(15,23,42,0.15)",
  },
  btnGhost: {
    background: "transparent",
    color: "#64748b",
    padding: "8px 16px",
    borderRadius: 8,
    fontFamily: F,
    fontWeight: 700,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    border: "1.5px solid #e5e7eb",
    cursor: "pointer",
  },
  hamburger: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    display: "none",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto",
  },
  mobileMenu: {
    background: "white",
    borderTop: "1px solid #f3f4f6",
    padding: "12px 24px 20px",
    display: "flex",
    flexDirection: "column",
    gap: 4,
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  },
  mobileLink: {
    fontFamily: F,
    fontSize: 13,
    fontWeight: 700,
    color: "#374151",
    letterSpacing: 1,
    textTransform: "uppercase",
    padding: "12px 0",
    borderBottom: "1px solid #f9fafb",
  },
  mobileLinkPrimary: {
    fontFamily: F,
    fontSize: 12,
    fontWeight: 800,
    background: "#0f172a",
    color: "white",
    padding: "13px 20px",
    borderRadius: 9,
    textAlign: "center",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginTop: 8,
  },
  mobileLinkGhost: {
    fontFamily: F,
    fontSize: 12,
    fontWeight: 700,
    color: "#64748b",
    background: "white",
    border: "1.5px solid #e5e7eb",
    padding: "12px 20px",
    borderRadius: 9,
    cursor: "pointer",
    textAlign: "center",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginTop: 4,
  },
};
