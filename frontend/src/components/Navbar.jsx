import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.inner}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>✦</span> Wandr
        </Link>
        <div style={styles.actions}>
          {user ? (
            <>
              <Link to="/create" style={styles.btnPrimary}>+ New Experience</Link>
              <Link to="/my-listings" style={styles.link}>{user.name}</Link>
              <button onClick={handleLogout} style={styles.btnGhost}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Log in</Link>
              <Link to="/register" style={styles.btnPrimary}>Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    background: 'rgba(250,248,243,0.92)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid #ede5d0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 68,
  },
  logo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 26,
    fontWeight: 700,
    color: '#c4622d',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    letterSpacing: '-0.5px',
  },
  logoIcon: { fontSize: 18 },
  actions: { display: 'flex', alignItems: 'center', gap: 16 },
  link: { color: '#4a3f2f', fontWeight: 500, fontSize: 15 },
  btnPrimary: {
    background: '#c4622d',
    color: 'white',
    padding: '9px 20px',
    borderRadius: 50,
    fontWeight: 500,
    fontSize: 14,
    transition: 'background 0.2s',
  },
  btnGhost: {
    background: 'transparent',
    color: '#4a3f2f',
    fontWeight: 500,
    fontSize: 15,
    padding: '8px 0',
  },
}
