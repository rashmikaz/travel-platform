import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { listingsAPI } from "../api";
import { useAuth } from "../context/AuthContext";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";

export default function MyListings() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listingsAPI
      .getAll({ limit: 100 })
      .then((res) => {
        setListings(res.data.listings.filter((l) => l.userId === user?.id));
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete?")) return;
    try {
      await listingsAPI.delete(id);
      setListings((l) => l.filter((x) => x.id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div style={s.page}>
      <style>{css}</style>
      <div style={s.header} className="my-header">
        <div>
          <h1 style={s.title}>My Experiences</h1>
          <p style={s.sub}>
            {listings.length} experience{listings.length !== 1 ? "s" : ""}{" "}
            published
          </p>
        </div>
        <Link to="/create" style={s.newBtn}>
          + New Experience
        </Link>
      </div>

      {loading ? (
        <div style={s.empty}>
          <p style={s.emptySub}>Loading…</p>
        </div>
      ) : listings.length === 0 ? (
        <div style={s.empty}>
          <h3 style={s.emptyTitle}>No Experiences Yet</h3>
          <p style={s.emptySub}>
            Share your first local experience with the world.
          </p>
          <Link to="/create" style={s.emptyBtn}>
            Create Experience
          </Link>
        </div>
      ) : (
        <div style={s.list}>
          {listings.map((l) => (
            <div key={l.id} style={s.row} className="my-row">
              <img
                src={l.imageUrl}
                alt={l.title}
                style={s.rowImg}
                onError={(e) =>
                  (e.target.src =
                    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200")
                }
              />
              <div style={s.rowInfo}>
                <h3 style={s.rowTitle}>{l.title}</h3>
                <p style={s.rowMeta}>
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
                  {l.location} ·{" "}
                  {formatDistanceToNow(new Date(l.createdAt), {
                    addSuffix: true,
                  })}{" "}
                  · ♥ {l.likes?.length || 0}
                </p>
              </div>
              {l.price && <span style={s.rowPrice}>${l.price}</span>}
              <div style={s.rowActions} className="my-actions">
                <Link to={`/listing/${l.id}`} style={s.viewBtn}>
                  View
                </Link>
                <Link to={`/edit/${l.id}`} style={s.editBtn}>
                  Edit
                </Link>
                <button onClick={() => handleDelete(l.id)} style={s.deleteBtn}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const css = `
  @media (max-width: 768px) {
    .my-header { flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; }
    .my-row { flex-wrap: wrap !important; gap: 12px !important; }
    .my-actions { width: 100% !important; justify-content: flex-start !important; }
  }
  @media (max-width: 600px) {
    .my-page { padding: 32px 20px 60px !important; }
  }
`;
const F = "'Raleway', sans-serif";
const s = {
  page: { maxWidth: 1280, margin: "0 auto", padding: "48px 48px 80px" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 32,
  },
  title: {
    fontFamily: F,
    fontSize: "clamp(22px, 3vw, 30px)",
    fontWeight: 800,
    color: "#0f172a",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  sub: { fontFamily: F, color: "#94a3b8", fontSize: 13, fontWeight: 500 },
  newBtn: {
    background: "#0f172a",
    color: "white",
    padding: "10px 20px",
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    fontFamily: F,
    flexShrink: 0,
  },
  empty: { textAlign: "center", padding: "80px 0" },
  emptyTitle: {
    fontFamily: F,
    fontSize: 18,
    fontWeight: 800,
    color: "#0f172a",
    letterSpacing: 1,
    marginBottom: 8,
  },
  emptySub: { fontFamily: F, color: "#94a3b8", fontSize: 14, marginBottom: 24 },
  emptyBtn: {
    background: "#0f172a",
    color: "white",
    padding: "11px 24px",
    borderRadius: 9,
    fontWeight: 700,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    fontFamily: F,
    display: "inline-block",
  },
  list: { display: "flex", flexDirection: "column", gap: 10 },
  row: {
    background: "white",
    borderRadius: 12,
    padding: "14px 18px",
    border: "1px solid #f3f4f6",
    boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  rowImg: {
    width: 72,
    height: 64,
    objectFit: "cover",
    borderRadius: 8,
    flexShrink: 0,
  },
  rowInfo: { flex: 1, minWidth: 0 },
  rowTitle: {
    fontFamily: F,
    fontSize: 14,
    fontWeight: 800,
    color: "#0f172a",
    marginBottom: 5,
    letterSpacing: 0.2,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  rowMeta: {
    fontFamily: F,
    fontSize: 12,
    color: "#9ca3af",
    display: "flex",
    alignItems: "center",
    gap: 4,
    flexWrap: "wrap",
  },
  rowPrice: {
    fontFamily: F,
    fontWeight: 800,
    fontSize: 15,
    color: "#0f172a",
    flexShrink: 0,
  },
  rowActions: { display: "flex", gap: 6, flexShrink: 0 },
  viewBtn: {
    background: "#f9fafb",
    color: "#374151",
    border: "1px solid #e5e7eb",
    padding: "7px 12px",
    borderRadius: 7,
    fontSize: 11,
    fontWeight: 700,
    fontFamily: F,
    letterSpacing: 0.5,
  },
  editBtn: {
    background: "#0f172a",
    color: "white",
    padding: "7px 12px",
    borderRadius: 7,
    fontSize: 11,
    fontWeight: 700,
    fontFamily: F,
    letterSpacing: 0.5,
  },
  deleteBtn: {
    background: "white",
    color: "#ef4444",
    border: "1px solid #fecaca",
    padding: "7px 12px",
    borderRadius: 7,
    fontSize: 11,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: F,
    letterSpacing: 0.5,
  },
};
