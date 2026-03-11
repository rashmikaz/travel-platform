import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={s.footer}>
      <div style={s.inner}>
        <div style={s.top}>
          <div style={s.brand}>
            <p style={s.logo}>Wandr</p>
            <p style={s.desc}>
              Handpicked local experiences from passionate guides around the
              world.
            </p>
          </div>
          <div style={s.cols}>
            <div style={s.col}>
              <p style={s.colTitle}>Explore</p>
              <Link to="/" style={s.link}>
                Home
              </Link>
              <Link to="/#feed" style={s.link}>
                Experiences
              </Link>
              <Link to="/create" style={s.link}>
                Post Experience
              </Link>
            </div>
            <div style={s.col}>
              <p style={s.colTitle}>Account</p>
              <Link to="/login" style={s.link}>
                Sign In
              </Link>
              <Link to="/register" style={s.link}>
                Sign Up
              </Link>
              <Link to="/my-listings" style={s.link}>
                My Listings
              </Link>
            </div>
            <div style={s.col}>
              <p style={s.colTitle}>Company</p>
              <span style={s.link}>About</span>
              <span style={s.link}>Privacy</span>
              <span style={s.link}>Terms</span>
            </div>
          </div>
        </div>
        <div style={s.bottom}>
          <p style={s.copy}>
            © {new Date().getFullYear()} Wandr. All rights reserved.
          </p>
          <p style={s.copy}>Built with ♥ for travelers</p>
        </div>
      </div>
    </footer>
  );
}

const F = "'Raleway', sans-serif";
const s = {
  footer: { background: "#0f172a" },
  inner: { maxWidth: 1280, margin: "0 auto", padding: "56px 48px 32px" },
  top: { display: "flex", gap: 64, marginBottom: 48, flexWrap: "wrap" },
  brand: { flex: "0 0 260px", minWidth: 200 },
  logo: {
    fontFamily: F,
    fontSize: 18,
    fontWeight: 800,
    color: "white",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 14,
  },
  desc: {
    fontFamily: F,
    fontSize: 13,
    color: "rgba(255,255,255,0.45)",
    lineHeight: 1.7,
    fontWeight: 500,
  },
  cols: {
    flex: 1,
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 32,
  },
  col: { display: "flex", flexDirection: "column", gap: 12 },
  colTitle: {
    fontFamily: F,
    fontSize: 10,
    fontWeight: 800,
    color: "rgba(255,255,255,0.35)",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  link: {
    fontFamily: F,
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    fontWeight: 500,
    cursor: "pointer",
  },
  bottom: {
    borderTop: "1px solid rgba(255,255,255,0.08)",
    paddingTop: 24,
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },
  copy: {
    fontFamily: F,
    fontSize: 12,
    color: "rgba(255,255,255,0.3)",
    fontWeight: 500,
  },
};
