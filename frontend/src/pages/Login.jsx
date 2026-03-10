import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      login(res.data.user, res.data.token);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <style>{css}</style>

      {/* LEFT PANEL */}
      <div style={s.left}>
        <img
          src="https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=1200&q=90"
          alt="Travel"
          style={s.bgImg}
        />
        <div style={s.leftOverlay} />

        {/* Floating cards */}
        <div
          style={{ ...s.floatCard, top: "18%", left: "8%" }}
          className="float-card"
        >
          <img
            src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=200&q=80"
            style={s.floatImg}
            alt=""
          />
          <div>
            <p style={s.floatTitle}>Bali, Indonesia</p>
            <p style={s.floatSub}>4.9 ★ · 2,340 reviews</p>
          </div>
        </div>

        <div
          style={{ ...s.floatCard, bottom: "22%", right: "6%" }}
          className="float-card float-card-2"
        >
          <img
            src="https://images.unsplash.com/photo-1499678329028-101435549a4e?w=200&q=80"
            style={s.floatImg}
            alt=""
          />
          <div>
            <p style={s.floatTitle}>Santorini, Greece</p>
            <p style={s.floatSub}>4.8 ★ · 1,890 reviews</p>
          </div>
        </div>

        <div style={s.leftContent}>
          <Link to="/" style={s.logo}>
            Wandr
          </Link>
          <h2 style={s.leftHeading}>
            Explore the world,
            <br />
            one experience at a time.
          </h2>
          <div style={s.dots}>
            <span style={{ ...s.dot, background: "white" }} />
            <span style={s.dot} />
            <span style={s.dot} />
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={s.right}>
        <div style={s.formBox} className="form-slide-in">
          <div style={s.formTop}>
            <h1 style={s.title}>Welcome back</h1>
            <p style={s.sub}>Sign in to continue your journey</p>
          </div>

          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.field}>
              <label style={s.label}>Email address</label>
              <div
                style={{
                  ...s.inputWrap,
                  ...(focused === "email" ? s.inputWrapFocused : {}),
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={focused === "email" ? "#1e2d4a" : "#94a3b8"}
                  strokeWidth="2"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                  style={s.input}
                  required
                />
              </div>
            </div>

            <div style={s.field}>
              <label style={s.label}>Password</label>
              <div
                style={{
                  ...s.inputWrap,
                  ...(focused === "password" ? s.inputWrapFocused : {}),
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={focused === "password" ? "#1e2d4a" : "#94a3b8"}
                  strokeWidth="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                  style={s.input}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={s.btn}
              className="auth-btn"
            >
              <span style={{ opacity: loading ? 0 : 1 }}>Sign In</span>
              {loading && <span style={s.spinner} className="spinner" />}
            </button>
          </form>

          <div style={s.divider}>
            <span style={s.dividerLine} />
            <span style={s.dividerText}>or</span>
            <span style={s.dividerLine} />
          </div>

          <p style={s.switchText}>
            Don't have an account?{" "}
            <Link to="/register" style={s.switchLink}>
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const NAVY = "#1e2d4a";

const css = `
  @keyframes floatUp {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  @keyframes floatUp2 {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-14px); }
    100% { transform: translateY(0px); }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(32px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .float-card { animation: floatUp 4s ease-in-out infinite; }
  .float-card-2 { animation: floatUp2 5s ease-in-out infinite; }
  .form-slide-in { animation: slideIn 0.5s cubic-bezier(.22,1,.36,1) both; }
  .auth-btn:hover:not(:disabled) { background: #2c3e6b !important; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(30,45,74,0.3) !important; }
  .auth-btn { transition: all 0.2s ease !important; }
  .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; position: absolute; }
`;

const s = {
  page: { minHeight: "100vh", display: "flex", background: "#f8f9fc" },

  // LEFT
  left: {
    flex: 1.1,
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "flex-end",
  },
  bgImg: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  leftOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(135deg, rgba(30,45,74,0.75) 0%, rgba(30,45,74,0.4) 50%, rgba(0,0,0,0.6) 100%)",
  },
  leftContent: {
    position: "relative",
    zIndex: 2,
    padding: "0 48px 56px",
  },
  logo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 32,
    fontWeight: 900,
    color: "white",
    display: "block",
    marginBottom: 20,
  },
  leftHeading: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(26px, 3vw, 38px)",
    color: "white",
    lineHeight: 1.3,
    fontWeight: 400,
    marginBottom: 28,
  },
  dots: { display: "flex", gap: 8 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.35)",
  },

  floatCard: {
    position: "absolute",
    zIndex: 3,
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: 16,
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
  },
  floatImg: {
    width: 44,
    height: 44,
    borderRadius: 10,
    objectFit: "cover",
    flexShrink: 0,
  },
  floatTitle: {
    color: "white",
    fontWeight: 700,
    fontSize: 14,
    marginBottom: 3,
  },
  floatSub: { color: "rgba(255,255,255,0.7)", fontSize: 12 },

  // RIGHT
  right: {
    width: "100%",
    maxWidth: 500,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 48px",
    background: "white",
  },
  formBox: { width: "100%", maxWidth: 380 },
  formTop: { marginBottom: 36 },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 36,
    fontWeight: 900,
    color: NAVY,
    marginBottom: 8,
  },
  sub: { color: "#94a3b8", fontSize: 15 },

  form: { display: "flex", flexDirection: "column", gap: 20 },
  field: { display: "flex", flexDirection: "column", gap: 8 },
  label: {
    fontSize: 12,
    fontWeight: 700,
    color: NAVY,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },

  inputWrap: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    border: "1.5px solid #e2e8f0",
    borderRadius: 12,
    padding: "0 16px",
    background: "#f8fafc",
    transition: "all 0.2s",
  },
  inputWrapFocused: {
    border: `1.5px solid ${NAVY}`,
    background: "white",
    boxShadow: `0 0 0 3px rgba(30,45,74,0.08)`,
  },
  input: {
    flex: 1,
    border: "none",
    background: "transparent",
    padding: "14px 0",
    fontSize: 15,
    color: NAVY,
    outline: "none",
    width: "100%",
  },

  btn: {
    background: NAVY,
    color: "white",
    padding: "15px",
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 15,
    border: "none",
    cursor: "pointer",
    marginTop: 8,
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 16px rgba(30,45,74,0.2)",
  },

  divider: { display: "flex", alignItems: "center", gap: 12, margin: "28px 0" },
  dividerLine: { flex: 1, height: 1, background: "#f1f5f9" },
  dividerText: { color: "#cbd5e1", fontSize: 13, fontWeight: 500 },

  switchText: { textAlign: "center", color: "#94a3b8", fontSize: 14 },
  switchLink: { color: NAVY, fontWeight: 700 },
};
