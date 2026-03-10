import { useState, useEffect } from 'react'
import { listingsAPI } from '../api'
import ListingCard from '../components/ListingCard'

export default function Home() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const res = await listingsAPI.getAll({ search: query, page, limit: 12 })
        setListings(res.data.listings)
        setTotalPages(res.data.pages)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [query, page])

  const handleSearch = (e) => {
    e.preventDefault()
    setQuery(search)
    setPage(1)
  }

  return (
    <div>
      {/* Hero */}
      <div style={styles.hero}>
        <div className="container" style={styles.heroInner}>
          <p style={styles.heroTag}>✦ Discover the World</p>
          <h1 style={styles.heroTitle}>Find Unforgettable<br /><em>Local Experiences</em></h1>
          <p style={styles.heroSub}>Handpicked adventures from locals who know their places best.</p>
          <form onSubmit={handleSearch} style={styles.searchForm}>
            <input
              type="text"
              placeholder="Search by title, location, or keyword…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={styles.searchInput}
            />
            <button type="submit" style={styles.searchBtn}>Search</button>
          </form>
        </div>
      </div>

      {/* Feed */}
      <div className="container" style={{ paddingTop: 48, paddingBottom: 64 }}>
        {query && (
          <div style={styles.searchInfo}>
            Results for "<strong>{query}</strong>"
            <button onClick={() => { setQuery(''); setSearch(''); setPage(1); }} style={styles.clearBtn}>✕ Clear</button>
          </div>
        )}

        {loading ? (
          <div style={styles.loading}>
            {[...Array(6)].map((_, i) => <div key={i} style={styles.skeleton} />)}
          </div>
        ) : listings.length === 0 ? (
          <div style={styles.empty}>
            <p style={{ fontSize: 48 }}>🌍</p>
            <p style={{ fontSize: 20, fontFamily: "'Playfair Display', serif", marginTop: 12 }}>No experiences found</p>
            <p style={{ color: '#9e9080', marginTop: 6 }}>Try a different search or be the first to post one!</p>
          </div>
        ) : (
          <>
            <div style={styles.grid}>
              {listings.map(l => <ListingCard key={l.id} listing={l} />)}
            </div>
            {totalPages > 1 && (
              <div style={styles.pagination}>
                <button onClick={() => setPage(p => p - 1)} disabled={page === 1} style={styles.pageBtn}>← Prev</button>
                <span style={styles.pageInfo}>Page {page} of {totalPages}</span>
                <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages} style={styles.pageBtn}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #1a1208 0%, #3d2b10 50%, #c4622d 100%)',
    padding: '72px 0 64px',
    position: 'relative',
    overflow: 'hidden',
  },
  heroInner: { position: 'relative', zIndex: 1 },
  heroTag: { color: '#e07a4a', fontWeight: 500, fontSize: 14, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 },
  heroTitle: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(36px, 5vw, 60px)', color: 'white', lineHeight: 1.15, marginBottom: 16 },
  heroSub: { color: 'rgba(255,255,255,0.7)', fontSize: 18, marginBottom: 36, maxWidth: 500 },
  searchForm: { display: 'flex', gap: 12, maxWidth: 560 },
  searchInput: {
    flex: 1, padding: '14px 20px', borderRadius: 50, border: 'none',
    fontSize: 15, background: 'white', color: '#1a1208',
  },
  searchBtn: {
    background: '#c4622d', color: 'white', padding: '14px 28px',
    borderRadius: 50, fontWeight: 600, fontSize: 15, whiteSpace: 'nowrap',
    transition: 'background 0.2s',
  },
  searchInfo: { marginBottom: 24, fontSize: 16, color: '#4a3f2f', display: 'flex', alignItems: 'center', gap: 12 },
  clearBtn: { background: 'none', color: '#c4622d', fontWeight: 600, cursor: 'pointer', fontSize: 14 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 28 },
  loading: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 28 },
  skeleton: { height: 320, borderRadius: 16, background: 'linear-gradient(90deg, #f0ebe0 25%, #e8e0cc 50%, #f0ebe0 75%)', backgroundSize: '200% 100%' },
  empty: { textAlign: 'center', padding: '80px 0', color: '#4a3f2f' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, marginTop: 48 },
  pageBtn: { background: '#c4622d', color: 'white', padding: '10px 24px', borderRadius: 50, fontWeight: 500, fontSize: 15, disabled: { opacity: 0.4 } },
  pageInfo: { color: '#4a3f2f', fontWeight: 500 },
}
