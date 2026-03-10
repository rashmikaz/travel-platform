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

  useEffect(() => {
    const fetchListings = async () => {
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
    fetchListings();
  }, [query, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(search);
    setPage(1);
  };

  return (
    <div style={s.page}>
      <style>{css}</style>

      {/* HERO */}
      <section style={s.hero}>
        <div style={s.heroOverlay} />
        <div style={s.heroContent}>
          <p style={s.eyebrow}>Experiences from locals, for travelers</p>
          <h1 style={s.heroTitle}>
            Discover Your Next
            <br />
            Adventure
          </h1>
          <form onSubmit={handleSearch} style={s.searchBar}>
            <svg
              width="16"
              height="16"
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
            <h3 style={s.emptyTitle}>No results found</h3>
            <p style={s.emptySub}>
              Try searching something else or post the first experience.
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
  @keyframes shimmer {
    0% { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  .shimmer {
    background: linear-gradient(90deg, #f3f4f6 25%, #e9eaec 50%, #f3f4f6 75%);
    background-size: 800px 100%;
    animation: shimmer 1.4s ease-in-out infinite;
  }
  .listing-card:hover {
    transform: translateY(-3px) !important;
    box-shadow: 0 10px 28px rgba(0,0,0,0.1) !important;
  }
`;

const s = {
  page: { background: "#f9fafb", minHeight: "100vh" },

  hero: {
    position: "relative",
    height: 420,
    backgroundImage:
      "url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=85)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.55) 100%)",
  },
  heroContent: {
    position: "relative",
    zIndex: 1,
    textAlign: "center",
    padding: "0 24px",
    width: "100%",
    maxWidth: 580,
  },
  eyebrow: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 16,
  },
  heroTitle: {
    color: "white",
    fontSize: "clamp(30px, 5vw, 52px)",
    fontWeight: 800,
    lineHeight: 1.15,
    marginBottom: 28,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  searchBar: {
    display: "flex",
    alignItems: "center",
    background: "white",
    borderRadius: 10,
    padding: "6px 6px 6px 16px",
    gap: 10,
    boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
  },
  searchInput: {
    flex: 1,
    border: "none",
    background: "transparent",
    fontSize: 14,
    color: "#111827",
    padding: "8px 4px",
    outline: "none",
    letterSpacing: 0.5,
    fontFamily: "'Raleway', sans-serif",
  },
  searchBtn: {
    background: "#111827",
    color: "white",
    padding: "11px 22px",
    borderRadius: 7,
    fontWeight: 700,
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    fontFamily: "'Raleway', sans-serif",
    flexShrink: 0,
  },

  feed: { maxWidth: 1280, margin: "0 auto", padding: "44px 48px 80px" },
  feedTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  feedTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: "#111827",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  clearBtn: {
    fontSize: 12,
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
    gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
    gap: 20,
  },

  skel: {
    background: "white",
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid #f3f4f6",
  },
  skelImg: { height: 190 },
  skelBody: {
    padding: "14px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 9,
  },
  skelLine: { height: 13, borderRadius: 6 },

  empty: { textAlign: "center", padding: "80px 0" },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: "#111827",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  emptySub: { fontSize: 14, color: "#9ca3af", letterSpacing: 0.3 },

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
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    cursor: "pointer",
    fontFamily: "'Raleway', sans-serif",
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
    fontFamily: "'Raleway', sans-serif",
  },
  pageActive: {
    background: "#111827",
    color: "white",
    border: "1.5px solid #111827",
  },
};
