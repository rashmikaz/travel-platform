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
    if (!window.confirm("Delete this listing?")) return;
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
      <div style={s.header}>
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
        <div style={s.loadingState}>Loading…</div>
      ) : listings.length === 0 ? (
        <div style={s.empty}>
          <img
            src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400&q=60"
            alt="empty"
            style={s.emptyImg}
          />
          <h3 style={s.emptyTitle}>No experiences yet</h3>
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
            <div key={l.id} style={s.row}>
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
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#1e2d4a"
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
              <div style={s.rowActions}>
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

const s = {
  page: { maxWidth: 1280, margin: "0 auto", padding: "52px 48px 80px" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 36,
  },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 32,
    fontWeight: 800,
    color: "#0f172a",
    marginBottom: 4,
  },
  sub: { fontFamily: "'Outfit', sans-serif", color: "#94a3b8", fontSize: 15 },
  newBtn: {
    background: "#1e2d4a",
    color: "white",
    padding: "11px 22px",
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 14,
    fontFamily: "'Outfit', sans-serif",
  },

  loadingState: {
    textAlign: "center",
    padding: "80px 0",
    color: "#94a3b8",
    fontFamily: "'Outfit', sans-serif",
  },

  empty: { textAlign: "center", padding: "80px 0" },
  emptyImg: {
    width: 200,
    height: 140,
    objectFit: "cover",
    borderRadius: 16,
    marginBottom: 20,
    opacity: 0.55,
  },
  emptyTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 22,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 8,
  },
  emptySub: {
    fontFamily: "'Outfit', sans-serif",
    color: "#94a3b8",
    fontSize: 15,
    marginBottom: 24,
  },
  emptyBtn: {
    background: "#1e2d4a",
    color: "white",
    padding: "12px 28px",
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 15,
    fontFamily: "'Outfit', sans-serif",
    display: "inline-block",
  },

  list: { display: "flex", flexDirection: "column", gap: 12 },
  row: {
    background: "white",
    borderRadius: 14,
    padding: "16px 20px",
    border: "1px solid #eef0f5",
    boxShadow: "0 2px 8px rgba(30,45,74,0.05)",
    display: "flex",
    alignItems: "center",
    gap: 18,
  },
  rowImg: {
    width: 80,
    height: 72,
    objectFit: "cover",
    borderRadius: 10,
    flexShrink: 0,
  },
  rowInfo: { flex: 1 },
  rowTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 16,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 6,
  },
  rowMeta: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: 13,
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    gap: 5,
  },
  rowPrice: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: 17,
    color: "#1e2d4a",
    flexShrink: 0,
  },
  rowActions: { display: "flex", gap: 8, flexShrink: 0 },
  viewBtn: {
    background: "#f8f9fc",
    color: "#475569",
    border: "1px solid #eef0f5",
    padding: "8px 14px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "'Outfit', sans-serif",
  },
  editBtn: {
    background: "#1e2d4a",
    color: "white",
    padding: "8px 14px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "'Outfit', sans-serif",
  },
  deleteBtn: {
    background: "white",
    color: "#ef4444",
    border: "1px solid #fecaca",
    padding: "8px 14px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Outfit', sans-serif",
  },
};
