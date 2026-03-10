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
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <h1 style={s.title}>Edit Experience</h1>
      <p style={s.sub}>Update the details of your listing</p>

      <form onSubmit={handleSubmit} style={s.form}>
        {[
          { key: "title", label: "Title", type: "text", required: true },
          { key: "location", label: "Location", type: "text", required: true },
          { key: "imageUrl", label: "Image URL", type: "url", required: true },
        ].map((f) => (
          <div key={f.key} style={s.field}>
            <label style={s.label}>{f.label}</label>
            <input
              type={f.type}
              value={form[f.key]}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              required={f.required}
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
          <label style={s.label}>Price (optional)</label>
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
          <button type="submit" disabled={loading} style={s.btn}>
            {loading ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

const s = {
  page: { maxWidth: 640, margin: "0 auto", padding: "52px 48px 80px" },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 32,
    fontWeight: 800,
    color: "#0f172a",
    marginBottom: 8,
  },
  sub: {
    fontFamily: "'Outfit', sans-serif",
    color: "#64748b",
    fontSize: 15,
    marginBottom: 36,
  },
  form: { display: "flex", flexDirection: "column", gap: 22 },
  field: { display: "flex", flexDirection: "column", gap: 8 },
  label: {
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 600,
    fontSize: 14,
    color: "#0f172a",
  },
  btnRow: { display: "flex", gap: 12, marginTop: 4 },
  btn: {
    flex: 1,
    background: "#1e2d4a",
    color: "white",
    padding: "14px",
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    border: "none",
    fontFamily: "'Outfit', sans-serif",
  },
  cancelBtn: {
    flex: 1,
    background: "white",
    color: "#64748b",
    border: "1.5px solid #eef0f5",
    padding: "14px",
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer",
    fontFamily: "'Outfit', sans-serif",
  },
};
