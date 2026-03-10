import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

export default function ListingCard({ listing }) {
  const {
    id,
    title,
    location,
    imageUrl,
    description,
    price,
    user,
    createdAt,
    likes,
  } = listing;

  return (
    <Link to={`/listing/${id}`} style={s.card}>
      <div style={s.imgWrap}>
        <img
          src={imageUrl}
          alt={title}
          style={s.img}
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600";
          }}
        />
        {price && <div style={s.priceBadge}>${price}</div>}
      </div>
      <div style={s.body}>
        <div style={s.topRow}>
          <span style={s.location}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1e2d4a"
              strokeWidth="2.5"
              style={{ flexShrink: 0 }}
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {location}
          </span>
          <span style={s.likes}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="#e53e3e"
              stroke="#e53e3e"
              strokeWidth="1.5"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {likes?.length || 0}
          </span>
        </div>
        <h3 style={s.title}>{title}</h3>
        <p style={s.desc}>
          {description.length > 80
            ? description.slice(0, 80) + "…"
            : description}
        </p>
        <div style={s.footer}>
          <div style={s.authorRow}>
            <div style={s.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
            <span style={s.authorName}>{user?.name}</span>
          </div>
          <span style={s.time}>
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>
    </Link>
  );
}

const s = {
  card: {
    background: "white",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
    display: "block",
    color: "inherit",
    transition: "transform 0.2s, box-shadow 0.2s",
    border: "1px solid #f1f5f9",
  },
  imgWrap: {
    position: "relative",
    height: 190,
    overflow: "hidden",
    background: "#f1f5f9",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s",
    display: "block",
  },
  priceBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    background: "#1e2d4a",
    color: "white",
    padding: "4px 12px",
    borderRadius: 6,
    fontWeight: 700,
    fontSize: 13,
  },
  body: { padding: "16px 18px 20px" },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  location: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontSize: 13,
    color: "#1e2d4a",
    fontWeight: 600,
  },
  likes: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontSize: 13,
    color: "#64748b",
    fontWeight: 500,
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 17,
    color: "#0f172a",
    marginBottom: 8,
    lineHeight: 1.35,
  },
  desc: { fontSize: 13, color: "#64748b", lineHeight: 1.6, marginBottom: 16 },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid #f1f5f9",
    paddingTop: 12,
  },
  authorRow: { display: "flex", alignItems: "center", gap: 8 },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "#1e2d4a",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 700,
  },
  authorName: { fontSize: 13, fontWeight: 600, color: "#0f172a" },
  time: { fontSize: 12, color: "#94a3b8" },
};
