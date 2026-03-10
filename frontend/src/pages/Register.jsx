import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authAPI.register(form)
      login(res.data.user, res.data.token)
      toast.success('Account created! Welcome!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Join Wandr</h1>
          <p style={styles.sub}>Share your experiences with the world</p>
        </div>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input type="text" placeholder="Your name" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input type="email" placeholder="you@example.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input type="password" placeholder="At least 6 characters" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
          </div>
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
        <p style={styles.switch}>
          Already have an account? <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' },
  card: { background: 'white', borderRadius: 20, padding: '48px 40px', width: '100%', maxWidth: 440, boxShadow: '0 8px 40px rgba(26,18,8,0.12)' },
  header: { marginBottom: 32, textAlign: 'center' },
  title: { fontSize: 32, fontFamily: "'Playfair Display', serif", color: '#1a1208', marginBottom: 8 },
  sub: { color: '#9e9080', fontSize: 15 },
  form: { display: 'flex', flexDirection: 'column', gap: 20 },
  field: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { fontSize: 14, fontWeight: 500, color: '#4a3f2f' },
  btn: {
    background: '#c4622d', color: 'white', padding: '14px', borderRadius: 50,
    fontWeight: 600, fontSize: 16, marginTop: 8, cursor: 'pointer',
  },
  switch: { textAlign: 'center', marginTop: 24, color: '#6b5e4a', fontSize: 14 },
  link: { color: '#c4622d', fontWeight: 600 },
}
