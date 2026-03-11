import { useState, useEffect } from "react";
import { listingsAPI } from "../api";
import ListingCard from "../components/ListingCard";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [heroImg, setHeroImg] = useState(0);

  const heroImages = [
    "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=1800&q=90",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1800&q=90",
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1800&q=90",
  ];

  useEffect(() => {
    const t = setInterval(
      () => setHeroImg((i) => (i + 1) % heroImages.length),
      5000,
    );
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await listingsAPI.getAll({
          search: query,
          page,
          limit: 12,
        });
        setListings(res.data.listings);
        setTotalPages(res.data.pages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [query, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(search);
    setPage(1);
  };

  return (
    <div style={s.page}>
      <style>{css}</style>

      {/* HERO — split layout */}
      <section style={s.hero} className="hero-section">
        {/* LEFT */}
        <div style={s.heroLeft} className="hero-left">
          <p style={s.eyebrow}>· Travel · Explore · Experience ·</p>
          <h1 style={s.heroTitle}>
            Discover
            <br />
            Your Next
            <br />
            Adventure
          </h1>
          <p style={s.heroSub}>
            Handpicked local experiences from passionate guides around the
            world.
          </p>
          <form onSubmit={handleSearch} style={s.searchBar}>
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="2.5"
              style={{ flexShrink: 0 }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Where do you want to go?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={s.searchInput}
            />
            <button type="submit" style={s.searchBtn}>
              Search
            </button>
          </form>
          <div style={s.stats} className="hero-stats">
            {[
              ["2,400+", "Experiences"],
              ["120+", "Countries"],
              ["98%", "Satisfaction"],
            ].map(([n, l]) => (
              <div key={l} style={s.stat}>
                <span style={s.statNum}>{n}</span>
                <span style={s.statLabel}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — image */}
        <div style={s.heroRight} className="hero-right">
          {heroImages.map((img, i) => (
            <div
              key={i}
              style={{
                ...s.heroBg,
                backgroundImage: `url(${img})`,
                opacity: heroImg === i ? 1 : 0,
                transition: "opacity 1.4s ease-in-out",
              }}
            />
          ))}
          <div style={s.imgOverlay} />
          <div style={s.floatCard} className="float-anim">
            <img
              src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=200&q=80"
              alt="Bali"
              style={s.floatThumb}
            />
            <div>
              <p style={s.floatTitle}>Bali, Indonesia</p>
              <p style={s.floatSub}>Most popular · 4.9 ★</p>
            </div>
          </div>
          <div style={s.dots}>
            {heroImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroImg(i)}
                style={{ ...s.dot, ...(heroImg === i ? s.dotActive : {}) }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FEED */}
      <section style={s.feed}>
        <div style={s.feedTop}>
          {query ? (
            <>
              <h2 style={s.feedTitle}>"{query}"</h2>
              <button
                onClick={() => {
                  setQuery("");
                  setSearch("");
                  setPage(1);
                }}
                style={s.clearBtn}
              >
                Clear
              </button>
            </>
          ) : (
            <h2 style={s.feedTitle}>Latest Experiences</h2>
          )}
        </div>

        {loading ? (
          <div style={s.grid}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={s.skel}>
                <div style={s.skelImg} className="shimmer" />
                <div style={s.skelBody}>
                  <div
                    style={{ ...s.skelLine, width: "55%" }}
                    className="shimmer"
                  />
                  <div
                    style={{ ...s.skelLine, width: "80%", height: 11 }}
                    className="shimmer"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div style={s.empty}>
            <h3 style={s.emptyTitle}>No Results Found</h3>
            <p style={s.emptySub}>
              Try a different search or be the first to post.
            </p>
          </div>
        ) : (
          <>
            <div style={s.grid}>
              {listings.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
            {totalPages > 1 && (
              <div style={s.pagination}>
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 1}
                  style={{ ...s.pageBtn, opacity: page === 1 ? 0.35 : 1 }}
                >
                  ← Prev
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    style={{
                      ...s.pageNum,
                      ...(page === i + 1 ? s.pageActive : {}),
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page === totalPages}
                  style={{
                    ...s.pageBtn,
                    opacity: page === totalPages ? 0.35 : 1,
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

const css = `
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
  @keyframes floatUp { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  .float-anim { animation: floatUp 4s ease-in-out infinite; }
  .shimmer { background: linear-gradient(90deg,#f3f4f6 25%,#e9eaec 50%,#f3f4f6 75%); background-size:800px 100%; animation:shimmer 1.4s ease-in-out infinite; }
  .listing-card:hover { transform:translateY(-3px) !important; box-shadow:0 10px 28px rgba(0,0,0,0.1) !important; }

  @media (max-width: 900px) {
    .hero-section { grid-template-columns: 1fr !important; min-height: auto !important; }
    .hero-right { display: none !important; }
    .hero-left { padding: 48px 32px !important; }
    .hero-stats { gap: 20px !important; }
  }
  @media (max-width: 600px) {
    .hero-left { padding: 36px 20px !important; }
    .hero-stats { flex-wrap: wrap; gap: 16px !important; }
  }
`;

const F = "'Raleway', sans-serif";
const s = {
  page: { background: "#f9fafb", minHeight: "100vh" },
  hero: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    minHeight: 560,
    background: "white",
    borderBottom: "1px solid #f3f4f6",
  },
  heroLeft: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "64px 56px 64px 80px",
  },
  eyebrow: {
    fontFamily: F,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 3,
    color: "#9ca3af",
    textTransform: "uppercase",
    marginBottom: 20,
  },
  heroTitle: {
    fontFamily: F,
    fontSize: "clamp(32px, 4vw, 58px)",
    fontWeight: 800,
    color: "#0f172a",
    lineHeight: 1.05,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 20,
  },
  heroSub: {
    fontFamily: F,
    fontSize: 15,
    color: "#64748b",
    lineHeight: 1.7,
    marginBottom: 32,
    maxWidth: 360,
    fontWeight: 500,
  },
  searchBar: {
    display: "flex",
    alignItems: "center",
    background: "#f9fafb",
    border: "1.5px solid #e5e7eb",
    borderRadius: 10,
    padding: "6px 6px 6px 16px",
    gap: 10,
    maxWidth: 420,
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    marginBottom: 36,
  },
  searchInput: {
    flex: 1,
    border: "none",
    background: "transparent",
    fontSize: 14,
    color: "#0f172a",
    padding: "9px 4px",
    outline: "none",
    letterSpacing: 0.3,
    fontFamily: F,
  },
  searchBtn: {
    background: "#0f172a",
    color: "white",
    padding: "11px 20px",
    borderRadius: 7,
    fontWeight: 700,
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    fontFamily: F,
    flexShrink: 0,
    border: "none",
    cursor: "pointer",
  },
  stats: { display: "flex", gap: 28 },
  stat: { display: "flex", flexDirection: "column", gap: 3 },
  statNum: { fontFamily: F, fontSize: 20, fontWeight: 800, color: "#0f172a" },
  statLabel: {
    fontFamily: F,
    fontSize: 10,
    fontWeight: 700,
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  heroRight: { position: "relative", overflow: "hidden" },
  heroBg: {
    position: "absolute",
    inset: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  imgOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(135deg,rgba(0,0,0,0.1) 0%,rgba(0,0,0,0.35) 100%)",
  },
  floatCard: {
    position: "absolute",
    bottom: 36,
    left: 32,
    zIndex: 2,
    background: "rgba(255,255,255,0.16)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.28)",
    borderRadius: 14,
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    gap: 11,
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
  },
  floatThumb: {
    width: 40,
    height: 40,
    borderRadius: 9,
    objectFit: "cover",
    flexShrink: 0,
  },
  floatTitle: {
    fontFamily: F,
    color: "white",
    fontWeight: 700,
    fontSize: 13,
    marginBottom: 2,
  },
  floatSub: {
    fontFamily: F,
    color: "rgba(255,255,255,0.72)",
    fontSize: 11,
    fontWeight: 500,
  },
  dots: {
    position: "absolute",
    bottom: 20,
    right: 24,
    display: "flex",
    gap: 6,
    zIndex: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.4)",
    border: "none",
    cursor: "pointer",
    padding: 0,
    transition: "all 0.3s",
  },
  dotActive: { background: "white", width: 18, borderRadius: 3 },

  feed: { maxWidth: 1280, margin: "0 auto", padding: "48px 48px 80px" },
  feedTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  feedTitle: {
    fontFamily: F,
    fontSize: 15,
    fontWeight: 800,
    color: "#0f172a",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  clearBtn: {
    fontFamily: F,
    fontSize: 10,
    fontWeight: 700,
    color: "#6b7280",
    background: "#f3f4f6",
    border: "none",
    letterSpacing: 1,
    textTransform: "uppercase",
    padding: "7px 14px",
    borderRadius: 7,
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 20,
  },
  skel: {
    background: "white",
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid #f3f4f6",
  },
  skelImg: { height: 195 },
  skelBody: {
    padding: "14px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 9,
  },
  skelLine: { height: 13, borderRadius: 6 },
  empty: { textAlign: "center", padding: "80px 0" },
  emptyTitle: {
    fontFamily: F,
    fontSize: 18,
    fontWeight: 800,
    color: "#0f172a",
    marginBottom: 8,
    letterSpacing: 1,
  },
  emptySub: {
    fontFamily: F,
    fontSize: 14,
    color: "#9ca3af",
    letterSpacing: 0.3,
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 48,
  },
  pageBtn: {
    background: "white",
    color: "#374151",
    border: "1.5px solid #e5e7eb",
    padding: "8px 16px",
    borderRadius: 7,
    fontWeight: 700,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
    cursor: "pointer",
    fontFamily: F,
  },
  pageNum: {
    width: 34,
    height: 34,
    borderRadius: 7,
    border: "1.5px solid #e5e7eb",
    background: "white",
    color: "#6b7280",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
    fontFamily: F,
  },
  pageActive: {
    background: "#0f172a",
    color: "white",
    border: "1.5px solid #0f172a",
  },
};
