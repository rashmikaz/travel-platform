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
        <div style={s.actions}>
          {user ? (
            <>
              <Link to="/my-listings" style={s.link}>
                {user.name}
              </Link>
              <Link to="/create" style={s.btnDark}>
                + New
              </Link>
              <button onClick={handleLogout} style={s.btnOutline}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={s.link}>
                Log in
              </Link>
              <Link to="/register" style={s.btnDark}>
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
    borderBottom: "1px solid #f3f4f6",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  inner: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "0 48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 62,
  },
  logo: {
    fontSize: 20,
    fontWeight: 800,
    color: "#111827",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  actions: { display: "flex", alignItems: "center", gap: 14 },
  link: {
    color: "#6b7280",
    fontWeight: 600,
    fontSize: 13,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  btnDark: {
    background: "#111827",
    color: "white",
    padding: "9px 20px",
    borderRadius: 7,
    fontWeight: 700,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    fontFamily: "'Raleway', sans-serif",
  },
  btnOutline: {
    background: "white",
    color: "#374151",
    border: "1.5px solid #e5e7eb",
    padding: "8px 18px",
    borderRadius: 7,
    fontWeight: 700,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    cursor: "pointer",
    fontFamily: "'Raleway', sans-serif",
  },
};
