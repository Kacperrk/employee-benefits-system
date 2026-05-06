import { useState } from 'react'
import { authApi } from '../api'

type Props = {
  onLogin: (userId: number, userName: string, role: string) => void
}

export default function LoginPage({ onLogin }: Props) {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [login, setLogin] = useState('000')
  const [password, setPassword] = useState('1')
  const [regData, setRegData] = useState({ login: '', password: '', firstName: '', lastName: '', role: 'employee' })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const res = await authApi.login(login, password)
      const d = res.data
      onLogin(d.userId ?? d.UserId, d.user ?? d.User, (d.role ?? d.Role).toLowerCase())
    } catch {
      setMessage('Nieprawidłowy login lub hasło')
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      await authApi.register(regData)
      setMessage('Konto utworzone! Możesz się zalogować.')
      setTab('login')
    } catch {
      setMessage('Błąd rejestracji. Sprawdź dane.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="logo-icon">◈</span>
          <h1>BenefitOS</h1>
        </div>
        <p className="auth-tagline">System zarządzania benefitami pracowniczymi</p>

        <div className="auth-tabs">
          <button className={`tab-btn ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>
            Logowanie
          </button>
          <button className={`tab-btn ${tab === 'register' ? 'active' : ''}`} onClick={() => setTab('register')}>
            Rejestracja
          </button>
        </div>

        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="field">
              <label>Login</label>
              <input value={login} onChange={e => setLogin(e.target.value)} placeholder="np. 000" />
            </div>
            <div className="field">
              <label>Hasło</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••" />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Logowanie...' : 'Zaloguj się →'}
            </button>
            <p className="hint">Demo: Admin <code>000 / 1</code> · Pracownik <code>001 / 1</code></p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="auth-form">
            <div className="field-row">
              <div className="field">
                <label>Imię</label>
                <input value={regData.firstName} onChange={e => setRegData({ ...regData, firstName: e.target.value })} placeholder="Jan" required />
              </div>
              <div className="field">
                <label>Nazwisko</label>
                <input value={regData.lastName} onChange={e => setRegData({ ...regData, lastName: e.target.value })} placeholder="Kowalski" required />
              </div>
            </div>
            <div className="field">
              <label>Login</label>
              <input value={regData.login} onChange={e => setRegData({ ...regData, login: e.target.value })} placeholder="unikalny login" required />
            </div>
            <div className="field">
              <label>Hasło</label>
              <input type="password" value={regData.password} onChange={e => setRegData({ ...regData, password: e.target.value })} placeholder="••••••" required />
            </div>
           
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Tworzenie konta...' : 'Zarejestruj się →'}
            </button>
          </form>
        )}

        {message && <div className={`auth-msg ${message.includes('Błąd') || message.includes('Nie') ? 'error' : 'success'}`}>{message}</div>}
      </div>
    </div>
  )
}
