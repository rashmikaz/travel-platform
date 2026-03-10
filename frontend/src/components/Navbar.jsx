import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav style={s.nav}>
      <div style={s.inner}>
        <Link to="/" style={s.logo}>
          Wandr
        </Link>
        <div style={s.links}>
          <Link to="/" style={s.link}>
            Home
          </Link>
          <Link to="/#feed" style={s.link}>
            Experiences
          </Link>
        </div>
        <div style={s.actions}>
          {user ? (
            <>
              <Link to="/my-listings" style={s.link}>
                {user.name}
              </Link>
              <Link to="/create" style={s.btnPrimary}>
                + New
              </Link>
              <button onClick={handleLogout} style={s.btnGhost}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={s.link}>
                Log in
              </Link>
              <Link to="/register" style={s.btnPrimary}>
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const s = {
  nav: {
    background: "white",
    borderBottom: "1px solid #eef0f5",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 1px 8px rgba(30,45,74,0.06)",
  },
  inner: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "0 48px",
    display: "flex",
    alignItems: "center",
    height: 66,
    gap: 40,
  },
  logo: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 22,
    fontWeight: 800,
    color: "#1e2d4a",
    letterSpacing: "-0.3px",
    marginRight: 8,
  },
  links: { display: "flex", gap: 28, flex: 1 },
  link: {
    color: "#64748b",
    fontWeight: 500,
    fontSize: 15,
    fontFamily: "'Outfit', sans-serif",
  },
  actions: { display: "flex", alignItems: "center", gap: 12 },
  btnPrimary: {
    background: "#1e2d4a",
    color: "white",
    padding: "9px 20px",
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 14,
    fontFamily: "'Outfit', sans-serif",
  },
  btnGhost: {
    background: "transparent",
    color: "#64748b",
    border: "1.5px solid #eef0f5",
    padding: "8px 16px",
    borderRadius: 8,
    fontWeight: 500,
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "'Outfit', sans-serif",
  },
};
