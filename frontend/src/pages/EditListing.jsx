import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { listingsAPI } from "../api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: "",
    location: "",
    imageUrl: "",
    description: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listingsAPI
      .getOne(id)
      .then((res) => {
        if (res.data.userId !== user?.id) {
          navigate("/");
          return;
        }
        const { title, location, imageUrl, description, price } = res.data;
        setForm({ title, location, imageUrl, description, price: price || "" });
      })
      .catch(() => navigate("/"));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await listingsAPI.update(id, form);
      toast.success("Updated!");
      navigate(`/listing/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <style>{css}</style>
      <h1 style={s.title}>Edit Experience</h1>
      <p style={s.sub}>Update your listing details</p>

      <form onSubmit={handleSubmit} style={s.form}>
        {[
          { key: "title", label: "Title", type: "text", req: true },
          { key: "location", label: "Location", type: "text", req: true },
          { key: "imageUrl", label: "Image URL", type: "url", req: true },
        ].map((f) => (
          <div key={f.key} style={s.field}>
            <label style={s.label}>{f.label}</label>
            <input
              type={f.type}
              value={form[f.key]}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              required={f.req}
            />
          </div>
        ))}
        <div style={s.field}>
          <label style={s.label}>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
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
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </div>
        <div style={s.btnRow}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={s.cancelBtn}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={s.btn}
            className="edit-btn"
          >
            {loading ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

const css = `
  .edit-btn:hover:not(:disabled) { opacity:0.88 !important; }
  @media (max-width: 600px) {
    .edit-page { padding: 32px 20px 60px !important; }
  }
`;
const F = "'Raleway', sans-serif";
const s = {
  page: { maxWidth: 600, margin: "0 auto", padding: "48px 48px 80px" },
  title: {
    fontFamily: F,
    fontSize: "clamp(22px, 3vw, 30px)",
    fontWeight: 800,
    color: "#0f172a",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  sub: {
    fontFamily: F,
    color: "#64748b",
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 32,
  },
  form: { display: "flex", flexDirection: "column", gap: 18 },
  field: { display: "flex", flexDirection: "column", gap: 7 },
  label: {
    fontFamily: F,
    fontWeight: 800,
    fontSize: 10,
    color: "#0f172a",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  btnRow: { display: "flex", gap: 10, marginTop: 4, flexWrap: "wrap" },
  btn: {
    flex: 1,
    background: "#0f172a",
    color: "white",
    padding: "13px",
    borderRadius: 9,
    fontWeight: 800,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    cursor: "pointer",
    border: "none",
    fontFamily: F,
    minWidth: 120,
  },
  cancelBtn: {
    flex: 1,
    background: "white",
    color: "#6b7280",
    border: "1.5px solid #e5e7eb",
    padding: "12px",
    borderRadius: 9,
    fontWeight: 700,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    cursor: "pointer",
    fontFamily: F,
    minWidth: 120,
  },
};
