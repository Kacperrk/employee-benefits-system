import { useState, useEffect } from 'react'
import type { AuthState } from './types'
import LoginPage from './pages/LoginPage'
import Header from './components/Header'
import BenefitsSection from './components/BenefitsSection'
import RequestsSection from './components/RequestsSection'
import UsersSection from './components/UsersSection'
import { useData } from './hooks/useData'
import './index.css'

export default function App() {
  const [auth, setAuth] = useState<AuthState>({ logged: false, userId: 0, userName: '', role: '' })
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('benefits')
  const { users, benefits, requests, loadData } = useData()

  const currentUser = users.find(u => u.id === auth.userId)

  useEffect(() => {
    if (auth.logged) loadData()
  }, [auth.logged])

  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(''), 4000)
      return () => clearTimeout(t)
    }
  }, [message])

  function handleLogin(userId: number, userName: string, role: string) {
    setAuth({ logged: true, userId, userName, role })
    setActiveTab('benefits')
  }

  function handleLogout() {
    setAuth({ logged: false, userId: 0, userName: '', role: '' })
    setMessage('')
  }

  if (!auth.logged) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <div className="app-layout">
      <Header
        userName={auth.userName}
        role={auth.role}
        points={currentUser?.points ?? 0}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />

      <main className="app-main">
        {message && (
          <div className={`toast ${message.startsWith('✓') ? 'toast-success' : 'toast-error'}`}>
            {message}
          </div>
        )}

        {activeTab === 'benefits' && (
          <BenefitsSection
            benefits={benefits}
            currentUser={currentUser}
            role={auth.role}
            onRefresh={loadData}
            onMessage={setMessage}
          />
        )}
        {activeTab === 'requests' && (
          <RequestsSection
            requests={requests}
            role={auth.role}
            userName={auth.userName}
            onRefresh={loadData}
            onMessage={setMessage}
          />
        )}
        {activeTab === 'users' && auth.role === 'administrator' && (
          <UsersSection
            users={users}
            onRefresh={loadData}
            onMessage={setMessage}
          />
        )}
      </main>
    </div>
  )
}
