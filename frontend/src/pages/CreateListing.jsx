import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listingsAPI } from '../api'
import toast from 'react-hot-toast'

export default function CreateListing() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', location: '', imageUrl: '', description: '', price: '' })
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await listingsAPI.create(form)
      toast.success('Experience published!')
      navigate(`/listing/${res.data.id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create listing')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Share an Experience</h1>
        <p style={styles.sub}>Let travelers discover what makes your place special</p>
      </div>

      <div style={styles.layout}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Experience Title *</label>
            <input type="text" placeholder="e.g. Sunset Boat Tour in Bali"
              value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Location *</label>
            <input type="text" placeholder="e.g. Bali, Indonesia"
              value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Image URL *</label>
            <input type="url" placeholder="https://example.com/photo.jpg"
              value={form.imageUrl}
              onChange={e => { setForm({ ...form, imageUrl: e.target.value }); setPreview(e.target.value) }}
              required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Description *</label>
            <textarea placeholder="Describe the experience in detail…"
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              required rows={5} style={{ resize: 'vertical' }} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Price (optional)</label>
            <input type="number" placeholder="45" min="0" step="0.01"
              value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            <span style={styles.hint}>Leave empty if free</span>
          </div>
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Publishing…' : '✦ Publish Experience'}
          </button>
        </form>

        {/* Preview */}
        <div style={styles.preview}>
          <p style={styles.previewLabel}>Preview</p>
          <div style={styles.previewCard}>
            {preview ? (
              <img src={preview} alt="preview" style={styles.previewImg}
                onError={e => { e.target.style.display = 'none' }} />
            ) : (
              <div style={styles.previewPlaceholder}>🏔️<br />Image preview</div>
            )}
            <div style={{ padding: '16px 20px' }}>
              <p style={{ color: '#2d7d7d', fontSize: 13, fontWeight: 500 }}>📍 {form.location || 'Location'}</p>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, marginTop: 6 }}>{form.title || 'Experience Title'}</h3>
              <p style={{ color: '#6b5e4a', fontSize: 13, marginTop: 8, lineHeight: 1.5 }}>
                {form.description ? form.description.slice(0, 80) + '…' : 'Your description will appear here…'}
              </p>
              {form.price && <p style={{ color: '#c4622d', fontWeight: 700, marginTop: 12 }}>${form.price}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { padding: '48px 24px 80px' },
  header: { marginBottom: 40 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 36, color: '#1a1208', marginBottom: 8 },
  sub: { color: '#9e9080', fontSize: 16 },
  layout: { display: 'grid', gridTemplateColumns: '1fr 360px', gap: 48, alignItems: 'start' },
  form: { display: 'flex', flexDirection: 'column', gap: 24 },
  field: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { fontWeight: 500, fontSize: 14, color: '#4a3f2f' },
  hint: { fontSize: 12, color: '#9e9080' },
  btn: {
    background: '#c4622d', color: 'white', padding: '16px', borderRadius: 50,
    fontWeight: 700, fontSize: 16, cursor: 'pointer', transition: 'background 0.2s',
  },
  preview: {},
  previewLabel: { fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.5, color: '#9e9080', marginBottom: 12 },
  previewCard: { background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 24px rgba(26,18,8,0.10)' },
  previewImg: { width: '100%', height: 200, objectFit: 'cover' },
  previewPlaceholder: { height: 200, background: '#f0ebe0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9e9080', fontSize: 32, gap: 8 },
}
