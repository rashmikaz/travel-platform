import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={s.footer}>
      <style>{css}</style>
      <div style={s.inner}>
        <div style={s.top}>
          <div style={s.brand}>
            <div style={s.logoRow}>
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
              <span style={s.logo}>Wandr</span>
            </div>
            <p style={s.brandDesc}>
              Handpicked local experiences from passionate guides around the
              world.
            </p>
          </div>

          <div style={s.linksGrid} className="footer-links-grid">
            <div style={s.linkCol}>
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
            <div style={s.linkCol}>
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
            <div style={s.linkCol}>
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

const css = `
  @media (max-width: 768px) {
    .footer-links-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 24px !important; }
  }
  @media (max-width: 480px) {
    .footer-links-grid { grid-template-columns: 1fr 1fr !important; }
  }
`;

const F = "'Raleway', sans-serif";
const s = {
  footer: { background: "#0f172a", marginTop: "auto" },
  inner: { maxWidth: 1280, margin: "0 auto", padding: "56px 48px 32px" },
  top: { display: "flex", gap: 64, marginBottom: 48, flexWrap: "wrap" },
  brand: { flex: "0 0 260px", minWidth: 200 },
  logoRow: { display: "flex", alignItems: "center", gap: 9, marginBottom: 16 },
  logoIcon: {
    width: 28,
    height: 28,
    borderRadius: 7,
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  logo: {
    fontFamily: F,
    fontSize: 17,
    fontWeight: 800,
    color: "white",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  brandDesc: {
    fontFamily: F,
    fontSize: 13,
    color: "rgba(255,255,255,0.45)",
    lineHeight: 1.7,
    fontWeight: 500,
  },
  linksGrid: {
    flex: 1,
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 32,
  },
  linkCol: { display: "flex", flexDirection: "column", gap: 12 },
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
    transition: "color 0.2s",
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
