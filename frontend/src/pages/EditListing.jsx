import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { listingsAPI } from '../api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function EditListing() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [form, setForm] = useState({ title: '', location: '', imageUrl: '', description: '', price: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    listingsAPI.getOne(id).then(res => {
      const { title, location, imageUrl, description, price } = res.data
      if (res.data.userId !== user?.id) { navigate('/'); return; }
      setForm({ title, location, imageUrl, description, price: price || '' })
    }).catch(() => navigate('/'))
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await listingsAPI.update(id, form)
      toast.success('Listing updated!')
      navigate(`/listing/${id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={styles.page}>
      <h1 style={styles.title}>Edit Experience</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}><label style={styles.label}>Title *</label>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
        <div style={styles.field}><label style={styles.label}>Location *</label>
          <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required /></div>
        <div style={styles.field}><label style={styles.label}>Image URL *</label>
          <input type="url" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} required /></div>
        <div style={styles.field}><label style={styles.label}>Description *</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required rows={5} style={{ resize: 'vertical' }} /></div>
        <div style={styles.field}><label style={styles.label}>Price</label>
          <input type="number" min="0" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button type="button" onClick={() => navigate(-1)} style={styles.cancelBtn}>Cancel</button>
          <button type="submit" disabled={loading} style={styles.btn}>{loading ? 'Saving…' : 'Save Changes'}</button>
        </div>
      </form>
    </div>
  )
}

const styles = {
  page: { padding: '48px 24px 80px', maxWidth: 640 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 32, marginBottom: 32, color: '#1a1208' },
  form: { display: 'flex', flexDirection: 'column', gap: 24 },
  field: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { fontWeight: 500, fontSize: 14, color: '#4a3f2f' },
  btn: { flex: 1, background: '#c4622d', color: 'white', padding: '14px', borderRadius: 50, fontWeight: 700, fontSize: 15, cursor: 'pointer' },
  cancelBtn: { flex: 1, background: 'white', color: '#4a3f2f', border: '1.5px solid #ede5d0', padding: '14px', borderRadius: 50, fontWeight: 600, fontSize: 15, cursor: 'pointer' },
}
