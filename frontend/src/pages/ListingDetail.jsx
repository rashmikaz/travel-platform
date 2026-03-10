import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { listingsAPI } from '../api'
import { useAuth } from '../context/AuthContext'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

export default function ListingDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  useEffect(() => {
    listingsAPI.getOne(id)
      .then(res => {
        setListing(res.data)
        setLikeCount(res.data.likes?.length || 0)
        if (user) setLiked(res.data.likes?.some(l => l.userId === user.id))
      })
      .catch(() => toast.error('Listing not found'))
      .finally(() => setLoading(false))
  }, [id, user])

  const handleLike = async () => {
    if (!user) return toast.error('Login to like listings')
    try {
      const res = await listingsAPI.toggleLike(id)
      setLiked(res.data.liked)
      setLikeCount(c => res.data.liked ? c + 1 : c - 1)
    } catch { toast.error('Failed to update like') }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this listing?')) return
    try {
      await listingsAPI.delete(id)
      toast.success('Listing deleted')
      navigate('/')
    } catch { toast.error('Failed to delete') }
  }

  if (loading) return <div style={styles.loading}>Loading…</div>
  if (!listing) return <div style={styles.loading}>Not found</div>

  const isOwner = user?.id === listing.userId

  return (
    <div>
      <div style={{ ...styles.hero, backgroundImage: `url(${listing.imageUrl})` }}>
        <div style={styles.heroOverlay} />
        <div className="container" style={styles.heroContent}>
          <Link to="/" style={styles.backBtn}>← Back to Feed</Link>
          <div style={styles.heroMeta}>
            <span style={styles.location}>📍 {listing.location}</span>
            {listing.price && <span style={styles.price}>${listing.price}</span>}
          </div>
          <h1 style={styles.title}>{listing.title}</h1>
        </div>
      </div>

      <div className="container" style={styles.body}>
        <div style={styles.main}>
          <div style={styles.card}>
            <p style={styles.desc}>{listing.description}</p>
          </div>
        </div>

        <div style={styles.sidebar}>
          <div style={styles.sideCard}>
            <div style={styles.authorRow}>
              <div style={styles.avatar}>{listing.user?.name?.charAt(0).toUpperCase()}</div>
              <div>
                <p style={styles.authorLabel}>Experience by</p>
                <p style={styles.authorName}>{listing.user?.name}</p>
              </div>
            </div>
            <p style={styles.postedAt}>
              Posted {formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true })}
            </p>

            <button onClick={handleLike} style={{ ...styles.likeBtn, background: liked ? '#c4622d' : 'white', color: liked ? 'white' : '#c4622d' }}>
              {liked ? '♥' : '♡'} {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
            </button>

            {listing.price && (
              <div style={styles.priceBlock}>
                <span style={styles.priceLabel}>Price</span>
                <span style={styles.priceVal}>${listing.price} per person</span>
              </div>
            )}

            {isOwner && (
              <div style={styles.ownerActions}>
                <Link to={`/edit/${listing.id}`} style={styles.editBtn}>Edit Listing</Link>
                <button onClick={handleDelete} style={styles.deleteBtn}>Delete</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  loading: { textAlign: 'center', padding: '100px 0', fontSize: 18, color: '#9e9080' },
  hero: { height: '45vh', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', display: 'flex', alignItems: 'flex-end' },
  heroOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,18,8,0.9) 0%, rgba(26,18,8,0.2) 100%)' },
  heroContent: { position: 'relative', zIndex: 1, paddingBottom: 40 },
  backBtn: { color: 'rgba(255,255,255,0.8)', fontSize: 14, display: 'inline-block', marginBottom: 20 },
  heroMeta: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 },
  location: { color: '#e07a4a', fontWeight: 500, fontSize: 15 },
  price: { background: '#c4622d', color: 'white', padding: '4px 14px', borderRadius: 50, fontWeight: 700, fontSize: 14 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 48px)', color: 'white', lineHeight: 1.2 },
  body: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, padding: '48px 24px', alignItems: 'start' },
  main: {},
  card: { background: 'white', borderRadius: 16, padding: '32px', boxShadow: '0 2px 16px rgba(26,18,8,0.08)' },
  desc: { fontSize: 17, color: '#4a3f2f', lineHeight: 1.8 },
  sidebar: {},
  sideCard: { background: 'white', borderRadius: 16, padding: 28, boxShadow: '0 2px 16px rgba(26,18,8,0.08)', display: 'flex', flexDirection: 'column', gap: 20 },
  authorRow: { display: 'flex', alignItems: 'center', gap: 14 },
  avatar: { width: 48, height: 48, borderRadius: '50%', background: '#c4622d', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20 },
  authorLabel: { fontSize: 12, color: '#9e9080', marginBottom: 2 },
  authorName: { fontWeight: 600, color: '#1a1208', fontSize: 16 },
  postedAt: { fontSize: 13, color: '#9e9080' },
  likeBtn: { border: '2px solid #c4622d', padding: '10px 20px', borderRadius: 50, fontWeight: 600, fontSize: 15, cursor: 'pointer', transition: 'all 0.2s' },
  priceBlock: { background: '#f5f0e8', borderRadius: 12, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  priceLabel: { fontSize: 13, color: '#9e9080' },
  priceVal: { fontWeight: 700, fontSize: 18, color: '#c4622d' },
  ownerActions: { display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 8, borderTop: '1px solid #f0ebe0' },
  editBtn: { background: '#2d7d7d', color: 'white', padding: '10px', borderRadius: 10, textAlign: 'center', fontWeight: 600, fontSize: 14 },
  deleteBtn: { background: 'white', color: '#e53e3e', border: '1.5px solid #e53e3e', padding: '10px', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer' },
}
