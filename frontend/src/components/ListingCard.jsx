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
    <Link to={`/listing/${id}`} style={s.card} className="listing-card">
      <style>{`.listing-card img { transition: transform 0.35s ease; } .listing-card:hover img { transform: scale(1.04); }`}</style>
      <div style={s.imgWrap}>
        <img
          src={imageUrl}
          alt={title}
          style={s.img}
          onError={(e) =>
            (e.target.src =
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600")
          }
        />
        {price && <span style={s.price}>${price}</span>}
      </div>
      <div style={s.body}>
        <p style={s.location}>
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9ca3af"
            strokeWidth="2.5"
            style={{ flexShrink: 0 }}
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {location}
        </p>
        <h3 style={s.title}>{title}</h3>
        <p style={s.desc}>
          {description.length > 80
            ? description.slice(0, 80) + "…"
            : description}
        </p>
        <div style={s.footer}>
          <div style={s.author}>
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
    borderRadius: 12,
    overflow: "hidden",
    display: "block",
    color: "inherit",
    border: "1px solid #f3f4f6",
    boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  imgWrap: {
    position: "relative",
    height: 195,
    overflow: "hidden",
    background: "#f3f4f6",
  },
  img: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  price: {
    position: "absolute",
    top: 10,
    right: 10,
    background: "#111827",
    color: "white",
    padding: "4px 10px",
    borderRadius: 5,
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 0.5,
  },
  body: { padding: "14px 16px 18px" },
  location: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontSize: 10,
    fontWeight: 700,
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: 800,
    color: "#111827",
    marginBottom: 6,
    lineHeight: 1.3,
    letterSpacing: 0.2,
  },
  desc: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 1.65,
    marginBottom: 14,
    letterSpacing: 0.2,
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTop: "1px solid #f9fafb",
  },
  author: { display: "flex", alignItems: "center", gap: 7 },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: "50%",
    background: "#111827",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 10,
    fontWeight: 800,
  },
  authorName: {
    fontSize: 12,
    fontWeight: 700,
    color: "#374151",
    letterSpacing: 0.3,
  },
  time: { fontSize: 11, color: "#9ca3af", letterSpacing: 0.2 },
};
