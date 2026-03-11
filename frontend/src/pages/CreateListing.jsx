import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { listingsAPI } from "../api";
import toast from "react-hot-toast";

export default function CreateListing() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    location: "",
    imageUrl: "",
    description: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await listingsAPI.create(form);
      toast.success("Published!");
      navigate(`/listing/${res.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <style>{css}</style>
      <div style={s.header}>
        <h1 style={s.title}>Share an Experience</h1>
        <p style={s.sub}>
          Let travelers discover what makes your destination special
        </p>
      </div>

      <div style={s.layout} className="create-layout">
        <form onSubmit={handleSubmit} style={s.form}>
          {[
            {
              key: "title",
              label: "Experience Title",
              placeholder: "e.g. Sunset Boat Tour in Bali",
              type: "text",
              req: true,
            },
            {
              key: "location",
              label: "Location",
              placeholder: "e.g. Bali, Indonesia",
              type: "text",
              req: true,
            },
            {
              key: "imageUrl",
              label: "Image URL",
              placeholder: "https://...",
              type: "url",
              req: true,
            },
          ].map((f) => (
            <div key={f.key} style={s.field}>
              <label style={s.label}>
                {f.label} {f.req && <span style={{ color: "#ef4444" }}>*</span>}
              </label>
              <input
                type={f.type}
                placeholder={f.placeholder}
                value={form[f.key]}
                onChange={(e) => {
                  setForm({ ...form, [f.key]: e.target.value });
                  if (f.key === "imageUrl") setPreview(e.target.value);
                }}
                required={f.req}
              />
            </div>
          ))}
          <div style={s.field}>
            <label style={s.label}>
              Description <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <textarea
              placeholder="Describe the experience..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
              rows={5}
              style={{ resize: "vertical" }}
            />
          </div>
          <div style={s.field}>
            <label style={s.label}>
              Price{" "}
              <span
                style={{
                  color: "#94a3b8",
                  fontWeight: 500,
                  textTransform: "none",
                  letterSpacing: 0,
                }}
              >
                (optional)
              </span>
            </label>
            <div style={s.priceRow}>
              <span style={s.prePre}>$</span>
              <input
                type="number"
                placeholder="45"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            style={s.btn}
            className="create-btn"
          >
            {loading ? "Publishing…" : "Publish Experience"}
          </button>
        </form>

        <div style={s.previewPanel} className="create-preview">
          <p style={s.previewLabel}>Live Preview</p>
          <div style={s.previewCard}>
            <div style={s.previewImgWrap}>
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  style={s.previewImg}
                  onError={(e) => (e.target.style.display = "none")}
                />
              ) : (
                <div style={s.previewPlaceholder}>
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#d1d5db"
                    strokeWidth="1.5"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              )}
            </div>
            <div style={s.previewBody}>
              <p style={s.previewLoc}>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9ca3af"
                  strokeWidth="2.5"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {form.location || "Location"}
              </p>
              <h3 style={s.previewTitle}>{form.title || "Experience Title"}</h3>
              <p style={s.previewDesc}>
                {form.description
                  ? form.description.slice(0, 80) + "…"
                  : "Your description…"}
              </p>
              {form.price && <p style={s.previewPrice}>${form.price}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const css = `
  .create-btn:hover:not(:disabled) { opacity:0.88 !important; transform:translateY(-1px) !important; }
  .create-btn { transition: all 0.2s !important; }
  @media (max-width: 900px) {
    .create-layout { grid-template-columns: 1fr !important; }
    .create-preview { position: static !important; }
  }
  @media (max-width: 600px) {
    .create-layout { padding: 0 !important; }
  }
`;
const F = "'Raleway', sans-serif";
const s = {
  page: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "48px 48px 80px",
    minHeight: "100vh",
  },
  header: { marginBottom: 36 },
  title: {
    fontFamily: F,
    fontSize: "clamp(24px, 3vw, 32px)",
    fontWeight: 800,
    color: "#0f172a",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  sub: { fontFamily: F, color: "#64748b", fontSize: 14, fontWeight: 500 },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 320px",
    gap: 40,
    alignItems: "start",
  },
  form: { display: "flex", flexDirection: "column", gap: 20 },
  field: { display: "flex", flexDirection: "column", gap: 7 },
  label: {
    fontFamily: F,
    fontWeight: 800,
    fontSize: 10,
    color: "#0f172a",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  priceRow: { display: "flex" },
  prePre: {
    background: "#f3f4f6",
    border: "1.5px solid #e5e7eb",
    borderRight: "none",
    padding: "0 14px",
    borderRadius: "10px 0 0 10px",
    color: "#6b7280",
    fontFamily: F,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    fontSize: 14,
  },
  btn: {
    background: "#0f172a",
    color: "white",
    padding: "14px",
    borderRadius: 10,
    fontFamily: F,
    fontWeight: 800,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    cursor: "pointer",
    border: "none",
    boxShadow: "0 4px 16px rgba(15,23,42,0.2)",
    marginTop: 4,
  },
  previewPanel: { position: "sticky", top: 88 },
  previewLabel: {
    fontFamily: F,
    fontSize: 10,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 2,
    color: "#9ca3af",
    marginBottom: 10,
  },
  previewCard: {
    background: "white",
    borderRadius: 14,
    overflow: "hidden",
    border: "1px solid #f3f4f6",
    boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
  },
  previewImgWrap: { height: 190, overflow: "hidden", background: "#f9fafb" },
  previewImg: { width: "100%", height: "100%", objectFit: "cover" },
  previewPlaceholder: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  previewBody: { padding: "14px 16px 18px" },
  previewLoc: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontSize: 10,
    fontWeight: 700,
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 7,
    fontFamily: F,
  },
  previewTitle: {
    fontFamily: F,
    fontSize: 15,
    fontWeight: 800,
    color: "#0f172a",
    marginBottom: 6,
  },
  previewDesc: {
    fontFamily: F,
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 1.6,
    marginBottom: 10,
  },
  previewPrice: {
    fontFamily: F,
    fontSize: 18,
    fontWeight: 800,
    color: "#0f172a",
  },
};
