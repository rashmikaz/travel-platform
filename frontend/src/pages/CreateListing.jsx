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
      toast.success("Experience published!");
      navigate(`/listing/${res.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>Share an Experience</h1>
        <p style={s.sub}>
          Let travelers discover what makes your destination special
        </p>
      </div>

      <div style={s.layout}>
        <form onSubmit={handleSubmit} style={s.form}>
          {[
            {
              key: "title",
              label: "Experience Title",
              placeholder: "e.g. Sunset Boat Tour in Bali",
              type: "text",
              required: true,
            },
            {
              key: "location",
              label: "Location",
              placeholder: "e.g. Bali, Indonesia",
              type: "text",
              required: true,
            },
            {
              key: "imageUrl",
              label: "Image URL",
              placeholder: "https://example.com/photo.jpg",
              type: "url",
              required: true,
            },
          ].map((f) => (
            <div key={f.key} style={s.field}>
              <label style={s.label}>
                {f.label} {f.required && <span style={s.req}>*</span>}
              </label>
              <input
                type={f.type}
                placeholder={f.placeholder}
                value={form[f.key]}
                onChange={(e) => {
                  setForm({ ...form, [f.key]: e.target.value });
                  if (f.key === "imageUrl") setPreview(e.target.value);
                }}
                required={f.required}
              />
            </div>
          ))}

          <div style={s.field}>
            <label style={s.label}>
              Description <span style={s.req}>*</span>
            </label>
            <textarea
              placeholder="Describe the experience in detail — what to expect, what's included, what to bring..."
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
              Price <span style={s.optional}>(optional)</span>
            </label>
            <div style={s.priceWrap}>
              <span style={s.pricePre}>$</span>
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
            <p style={s.hint}>Leave empty if free</p>
          </div>

          <button type="submit" disabled={loading} style={s.btn}>
            {loading ? "Publishing…" : "Publish Experience"}
          </button>
        </form>

        {/* Preview */}
        <div style={s.previewPanel}>
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
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span
                    style={{
                      color: "#94a3b8",
                      fontSize: 13,
                      fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    Image preview
                  </span>
                </div>
              )}
            </div>
            <div style={s.previewBody}>
              <p style={s.previewLocation}>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1e2d4a"
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

const s = {
  page: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "52px 48px 80px",
    background: "#f8f9fc",
    minHeight: "100vh",
  },
  header: { marginBottom: 40 },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 34,
    fontWeight: 800,
    color: "#0f172a",
    marginBottom: 8,
  },
  sub: { fontFamily: "'Outfit', sans-serif", color: "#64748b", fontSize: 16 },

  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 340px",
    gap: 48,
    alignItems: "start",
  },
  form: { display: "flex", flexDirection: "column", gap: 24 },
  field: { display: "flex", flexDirection: "column", gap: 8 },
  label: {
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 600,
    fontSize: 14,
    color: "#0f172a",
  },
  req: { color: "#ef4444" },
  optional: { color: "#94a3b8", fontWeight: 400 },
  priceWrap: { display: "flex" },
  pricePre: {
    background: "#eef0f5",
    border: "1.5px solid #eef0f5",
    borderRight: "none",
    padding: "12px 16px",
    borderRadius: "10px 0 0 10px",
    color: "#64748b",
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 600,
    fontSize: 15,
    display: "flex",
    alignItems: "center",
  },
  hint: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 4,
  },
  btn: {
    background: "#1e2d4a",
    color: "white",
    padding: "15px",
    borderRadius: 12,
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
    border: "none",
    boxShadow: "0 4px 16px rgba(30,45,74,0.2)",
    marginTop: 4,
  },

  previewPanel: { position: "sticky", top: 88 },
  previewLabel: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    color: "#94a3b8",
    marginBottom: 12,
  },
  previewCard: {
    background: "white",
    borderRadius: 16,
    overflow: "hidden",
    border: "1px solid #eef0f5",
    boxShadow: "0 4px 20px rgba(30,45,74,0.08)",
  },
  previewImgWrap: { height: 200, overflow: "hidden", background: "#f8f9fc" },
  previewImg: { width: "100%", height: "100%", objectFit: "cover" },
  previewPlaceholder: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  previewBody: { padding: "16px 18px 20px" },
  previewLocation: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontSize: 11,
    fontWeight: 700,
    color: "#1e2d4a",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: "'Outfit', sans-serif",
    marginBottom: 8,
  },
  previewTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 17,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 8,
  },
  previewDesc: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: 13,
    color: "#64748b",
    lineHeight: 1.6,
    marginBottom: 12,
  },
  previewPrice: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 18,
    fontWeight: 800,
    color: "#1e2d4a",
  },
};
