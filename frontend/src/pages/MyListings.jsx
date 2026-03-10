import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { listingsAPI } from '../api'
import { useAuth } from '../context/AuthContext'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

export default function MyListings() {
  const { user } = useAuth()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listingsAPI.getAll({ limit: 100 }).then(res => {
      setListings(res.data.listings.filter(l => l.userId === user?.id))
    }).finally(() => setLoading(false))
  }, [user])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing?')) return
    try {
      await listingsAPI.delete(id)
      setListings(l => l.filter(x => x.id !== id))
      toast.success('Deleted!')
    } catch { toast.error('Failed') }
  }

  return (
    <div className="container" style={{ padding: '48px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: '#1a1208' }}>My Experiences</h1>
        <Link to="/create" style={{ background: '#c4622d', color: 'white', padding: '10px 24px', borderRadius: 50, fontWeight: 600, fontSize: 14 }}>+ New</Link>
      </div>
      {loading ? <p style={{ color: '#9e9080' }}>Loading…</p> :
        listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: 48 }}>🌍</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginTop: 12 }}>No experiences yet</p>
            <Link to="/create" style={{ color: '#c4622d', fontWeight: 600, marginTop: 8, display: 'inline-block' }}>Create your first one →</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {listings.map(l => (
              <div key={l.id} style={{ background: 'white', borderRadius: 14, padding: '20px 24px', boxShadow: '0 2px 12px rgba(26,18,8,0.08)', display: 'flex', gap: 20, alignItems: 'center' }}>
                <img src={l.imageUrl} alt={l.title} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 10 }}
                  onError={e => e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200'} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, marginBottom: 4 }}>{l.title}</h3>
                  <p style={{ color: '#2d7d7d', fontSize: 13, fontWeight: 500 }}>📍 {l.location}</p>
                  <p style={{ color: '#9e9080', fontSize: 12, marginTop: 4 }}>{formatDistanceToNow(new Date(l.createdAt), { addSuffix: true })} · ♥ {l.likes?.length || 0}</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <Link to={`/listing/${l.id}`} style={{ background: '#f5f0e8', color: '#4a3f2f', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500 }}>View</Link>
                  <Link to={`/edit/${l.id}`} style={{ background: '#2d7d7d', color: 'white', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500 }}>Edit</Link>
                  <button onClick={() => handleDelete(l.id)} style={{ background: 'white', color: '#e53e3e', border: '1.5px solid #e53e3e', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  )
}
