import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { listingsAPI } from "../api";
import { useAuth } from "../context/AuthContext";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";

export default function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    listingsAPI
      .getOne(id)
      .then((res) => {
        setListing(res.data);
        setLikeCount(res.data.likes?.length || 0);
        if (user) setLiked(res.data.likes?.some((l) => l.userId === user.id));
      })
      .catch(() => toast.error("Not found"))
      .finally(() => setLoading(false));
  }, [id, user]);

  const handleLike = async () => {
    if (!user) return toast.error("Login to like");
    try {
      const res = await listingsAPI.toggleLike(id);
      setLiked(res.data.liked);
      setLikeCount((c) => (res.data.liked ? c + 1 : c - 1));
    } catch {
      toast.error("Failed");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this listing?")) return;
    try {
      await listingsAPI.delete(id);
      toast.success("Deleted");
      navigate("/");
    } catch {
      toast.error("Failed");
    }
  };

  if (loading)
    return (
      <div style={s.loading}>
        <div style={s.spinner} className="spin" />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}} .spin{animation:spin 0.8s linear infinite}`}</style>
      </div>
    );
  if (!listing) return <div style={s.loading}>Not found</div>;

  const isOwner = user?.id === listing.userId;

  return (
    <div style={s.page}>
      <style>{css}</style>
      <div style={{ ...s.hero, backgroundImage: `url(${listing.imageUrl})` }}>
        <div style={s.heroOverlay} />
        <div style={s.heroContent}>
          <Link to="/" style={s.backBtn}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
            >
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
            Back
          </Link>
          <p style={s.heroLocation}>
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="2.5"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {listing.location}
          </p>
          <h1 style={s.heroTitle}>{listing.title}</h1>
        </div>
      </div>

      <div style={s.body} className="detail-body">
        <div style={s.main}>
          <div style={s.card}>
            <h2 style={s.sectionTitle}>About this experience</h2>
            <p style={s.desc}>{listing.description}</p>
          </div>
        </div>

        <div style={s.sidebar} className="detail-sidebar">
          <div style={s.sideCard}>
            <div style={s.hostRow}>
              <div style={s.hostAvatar}>
                {listing.user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p style={s.hostedBy}>Hosted by</p>
                <p style={s.hostName}>{listing.user?.name}</p>
              </div>
            </div>
            <p style={s.postedAt}>
              Posted{" "}
              {formatDistanceToNow(new Date(listing.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>

          {listing.price && (
            <div style={s.sideCard}>
              <p style={s.priceLabel}>Price per person</p>
              <p style={s.priceVal}>${listing.price}</p>
            </div>
          )}

          <button
            onClick={handleLike}
            style={{
              ...s.likeBtn,
              background: liked ? "#0f172a" : "white",
              color: liked ? "white" : "#0f172a",
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill={liked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {liked ? "Liked" : "Like"} · {likeCount}
          </button>

          {isOwner && (
            <div style={s.ownerActions}>
              <Link to={`/edit/${listing.id}`} style={s.editBtn}>
                Edit Experience
              </Link>
              <button onClick={handleDelete} style={s.deleteBtn}>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const css = `
  @media (max-width: 768px) {
    .detail-body { grid-template-columns: 1fr !important; padding: 24px 20px 60px !important; }
    .detail-sidebar { position: static !important; }
  }
`;
const F = "'Raleway', sans-serif";
const s = {
  page: { background: "#f9fafb", minHeight: "100vh" },
  loading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    color: "#94a3b8",
    fontFamily: F,
  },
  spinner: {
    width: 28,
    height: 28,
    border: "3px solid #f3f4f6",
    borderTopColor: "#0f172a",
    borderRadius: "50%",
  },
  hero: {
    height: "44vh",
    minHeight: 280,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    display: "flex",
    alignItems: "flex-end",
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%)",
  },
  heroContent: {
    position: "relative",
    zIndex: 1,
    padding: "0 48px 36px",
    width: "100%",
    maxWidth: 1280,
    margin: "0 auto",
  },
  backBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    color: "rgba(255,255,255,0.75)",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 16,
    fontFamily: F,
  },
  heroLocation: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    color: "rgba(255,255,255,0.7)",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
    fontFamily: F,
  },
  heroTitle: {
    fontFamily: F,
    fontSize: "clamp(22px, 4vw, 42px)",
    fontWeight: 800,
    color: "white",
    lineHeight: 1.15,
    letterSpacing: 0.5,
  },
  body: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "36px 48px 80px",
    display: "grid",
    gridTemplateColumns: "1fr 300px",
    gap: 28,
    alignItems: "start",
  },
  main: {},
  card: {
    background: "white",
    borderRadius: 14,
    padding: "28px 32px",
    border: "1px solid #f3f4f6",
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
  },
  sectionTitle: {
    fontFamily: F,
    fontSize: 16,
    fontWeight: 800,
    color: "#0f172a",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 14,
  },
  desc: {
    fontFamily: F,
    fontSize: 15,
    color: "#475569",
    lineHeight: 1.8,
    fontWeight: 500,
  },
  sidebar: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
    position: "sticky",
    top: 88,
  },
  sideCard: {
    background: "white",
    borderRadius: 14,
    padding: "20px",
    border: "1px solid #f3f4f6",
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
  },
  hostRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 10 },
  hostAvatar: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    background: "#0f172a",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: F,
    fontSize: 16,
    fontWeight: 800,
  },
  hostedBy: {
    fontFamily: F,
    fontSize: 10,
    color: "#9ca3af",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 3,
  },
  hostName: { fontFamily: F, fontSize: 15, fontWeight: 800, color: "#0f172a" },
  postedAt: { fontFamily: F, fontSize: 12, color: "#9ca3af", fontWeight: 500 },
  priceLabel: {
    fontFamily: F,
    fontSize: 10,
    color: "#9ca3af",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  priceVal: { fontFamily: F, fontSize: 28, fontWeight: 800, color: "#0f172a" },
  likeBtn: {
    width: "100%",
    padding: "13px",
    borderRadius: 10,
    border: "1.5px solid #0f172a",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "all 0.2s",
    fontFamily: F,
    letterSpacing: 0.5,
  },
  ownerActions: { display: "flex", flexDirection: "column", gap: 8 },
  editBtn: {
    background: "#0f172a",
    color: "white",
    padding: "12px",
    borderRadius: 9,
    textAlign: "center",
    fontWeight: 700,
    fontSize: 12,
    fontFamily: F,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  deleteBtn: {
    background: "white",
    color: "#ef4444",
    border: "1.5px solid #fecaca",
    padding: "11px",
    borderRadius: 9,
    fontWeight: 700,
    fontSize: 12,
    cursor: "pointer",
    fontFamily: F,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
};
