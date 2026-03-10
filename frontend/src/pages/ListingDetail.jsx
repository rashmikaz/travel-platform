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
      .catch(() => toast.error("Listing not found"))
      .finally(() => setLoading(false));
  }, [id, user]);

  const handleLike = async () => {
    if (!user) return toast.error("Login to like listings");
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
      toast.error("Failed to delete");
    }
  };

  if (loading)
    return (
      <div style={s.loading}>
        <div style={s.loadingSpinner} className="spin" />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}} .spin{animation:spin 0.8s linear infinite}`}</style>
      </div>
    );
  if (!listing) return <div style={s.loading}>Listing not found</div>;

  const isOwner = user?.id === listing.userId;

  return (
    <div style={s.page}>
      <style>{css}</style>

      {/* HERO IMAGE */}
      <div style={{ ...s.hero, backgroundImage: `url(${listing.imageUrl})` }}>
        <div style={s.heroOverlay} />
        <div style={s.heroContent}>
          <Link to="/" style={s.backBtn}>
            <svg
              width="16"
              height="16"
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
          <div style={s.heroBadge}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {listing.location}
          </div>
          <h1 style={s.heroTitle}>{listing.title}</h1>
        </div>
      </div>

      {/* BODY */}
      <div style={s.body}>
        <div style={s.main}>
          <div style={s.card}>
            <h2 style={s.sectionLabel}>About this experience</h2>
            <p style={s.desc}>{listing.description}</p>
          </div>
        </div>

        <div style={s.sidebar}>
          {/* Host */}
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

          {/* Price */}
          {listing.price && (
            <div style={s.sideCard}>
              <p style={s.priceLabel}>Price per person</p>
              <p style={s.priceVal}>${listing.price}</p>
            </div>
          )}

          {/* Like */}
          <button
            onClick={handleLike}
            style={{
              ...s.likeBtn,
              background: liked ? "#1e2d4a" : "white",
              color: liked ? "white" : "#1e2d4a",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={liked ? "white" : "none"}
              stroke={liked ? "white" : "#1e2d4a"}
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {liked ? "Liked" : "Like"} · {likeCount}
          </button>

          {/* Owner actions */}
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
  @keyframes spin { to { transform: rotate(360deg); } }
  .spin { animation: spin 0.8s linear infinite; }
`;

const s = {
  page: { background: "#f8f9fc", minHeight: "100vh" },
  loading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    color: "#94a3b8",
    fontFamily: "'Outfit', sans-serif",
    fontSize: 16,
  },
  loadingSpinner: {
    width: 32,
    height: 32,
    border: "3px solid #eef0f5",
    borderTopColor: "#1e2d4a",
    borderRadius: "50%",
  },

  hero: {
    height: "46vh",
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
      "linear-gradient(to top, rgba(15,23,42,0.88) 0%, rgba(15,23,42,0.15) 60%, transparent 100%)",
  },
  heroContent: {
    position: "relative",
    zIndex: 1,
    padding: "0 48px 44px",
    width: "100%",
    maxWidth: 1280,
    margin: "0 auto",
  },
  backBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 20,
    fontFamily: "'Outfit', sans-serif",
  },
  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontFamily: "'Outfit', sans-serif",
  },
  heroTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "clamp(28px, 4vw, 48px)",
    fontWeight: 800,
    color: "white",
    lineHeight: 1.15,
  },

  body: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "40px 48px 80px",
    display: "grid",
    gridTemplateColumns: "1fr 320px",
    gap: 32,
    alignItems: "start",
  },

  card: {
    background: "white",
    borderRadius: 16,
    padding: "32px 36px",
    border: "1px solid #eef0f5",
    boxShadow: "0 2px 12px rgba(30,45,74,0.06)",
  },
  sectionLabel: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 18,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 16,
  },
  desc: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: 16,
    color: "#475569",
    lineHeight: 1.8,
  },

  sidebar: { display: "flex", flexDirection: "column", gap: 16 },
  sideCard: {
    background: "white",
    borderRadius: 16,
    padding: "24px",
    border: "1px solid #eef0f5",
    boxShadow: "0 2px 12px rgba(30,45,74,0.06)",
  },
  hostRow: { display: "flex", alignItems: "center", gap: 14, marginBottom: 12 },
  hostAvatar: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    background: "#1e2d4a",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Syne', sans-serif",
    fontSize: 18,
    fontWeight: 800,
  },
  hostedBy: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontFamily: "'Outfit', sans-serif",
    marginBottom: 3,
  },
  hostName: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 17,
    fontWeight: 700,
    color: "#0f172a",
  },
  postedAt: {
    fontSize: 13,
    color: "#94a3b8",
    fontFamily: "'Outfit', sans-serif",
  },

  priceLabel: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontFamily: "'Outfit', sans-serif",
    marginBottom: 6,
  },
  priceVal: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 32,
    fontWeight: 800,
    color: "#1e2d4a",
  },

  likeBtn: {
    width: "100%",
    padding: "14px",
    borderRadius: 12,
    border: "1.5px solid #1e2d4a",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    transition: "all 0.2s",
    fontFamily: "'Outfit', sans-serif",
  },

  ownerActions: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  editBtn: {
    background: "#1e2d4a",
    color: "white",
    padding: "13px",
    borderRadius: 10,
    textAlign: "center",
    fontWeight: 600,
    fontSize: 14,
    fontFamily: "'Outfit', sans-serif",
  },
  deleteBtn: {
    background: "white",
    color: "#ef4444",
    border: "1.5px solid #fecaca",
    padding: "12px",
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "'Outfit', sans-serif",
  },
};
