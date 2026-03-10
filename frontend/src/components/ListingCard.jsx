import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'

export default function ListingCard({ listing }) {
  const { id, title, location, imageUrl, description, price, user, createdAt, likes } = listing

  return (
    <Link to={`/listing/${id}`} style={styles.card}>
      <div style={styles.imgWrap}>
        <img
          src={imageUrl}
          alt={title}
          style={styles.img}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600' }}
        />
        {price && <div style={styles.price}>${price}</div>}
        <div style={styles.likeBadge}>♥ {likes?.length || 0}</div>
      </div>
      <div style={styles.body}>
        <div style={styles.location}>
          <span style={styles.pin}>📍</span> {location}
        </div>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.desc}>{description.length > 90 ? description.slice(0, 90) + '…' : description}</p>
        <div style={styles.footer}>
          <span style={styles.author}>By {user?.name}</span>
          <span style={styles.time}>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
        </div>
      </div>
    </Link>
  )
}

const styles = {
  card: {
    background: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 2px 16px rgba(26,18,8,0.08)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'block',
    cursor: 'pointer',
    textDecoration: 'none',
    color: 'inherit',
    ':hover': { transform: 'translateY(-4px)' },
  },
  imgWrap: { position: 'relative', height: 200, overflow: 'hidden', background: '#f0ebe0' },
  img: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' },
  price: {
    position: 'absolute', top: 12, right: 12,
    background: '#c4622d', color: 'white',
    padding: '4px 12px', borderRadius: 50,
    fontWeight: 700, fontSize: 14,
  },
  likeBadge: {
    position: 'absolute', bottom: 12, right: 12,
    background: 'rgba(255,255,255,0.9)',
    padding: '3px 10px', borderRadius: 50,
    fontSize: 13, fontWeight: 500, color: '#c4622d',
  },
  body: { padding: '16px 20px 20px' },
  location: { fontSize: 13, color: '#2d7d7d', fontWeight: 500, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 },
  pin: { fontSize: 12 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 19, marginBottom: 8, lineHeight: 1.3, color: '#1a1208' },
  desc: { fontSize: 14, color: '#6b5e4a', lineHeight: 1.6, marginBottom: 14 },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 },
  author: { fontWeight: 500, color: '#4a3f2f' },
  time: { color: '#9e9080' },
}
