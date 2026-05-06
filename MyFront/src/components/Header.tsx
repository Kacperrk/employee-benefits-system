type Props = {
  userName: string
  role: string
  points: number
  activeTab: string
  onTabChange: (tab: string) => void
  onLogout: () => void
}

const TABS_EMPLOYEE = [
  { id: 'benefits', label: 'Benefity' },
  { id: 'requests', label: 'Moje wnioski' },
]

const TABS_ADMIN = [
  { id: 'benefits', label: 'Benefity' },
  { id: 'requests', label: 'Wnioski' },
  { id: 'users', label: 'Użytkownicy' },
]

export default function Header({ userName, role, points, activeTab, onTabChange, onLogout }: Props) {
  const tabs = role === 'administrator' ? TABS_ADMIN : TABS_EMPLOYEE

  return (
    <header className="app-header">
      <div className="header-brand">
        <span className="logo-icon">◈</span>
        <span className="brand-name">BenefitOS</span>
      </div>

      <nav className="header-nav">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`nav-btn ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => onTabChange(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className="header-user">
        <div className="user-info">
          <span className="user-avatar">{userName.charAt(0).toUpperCase()}</span>
          <div className="user-details">
            <span className="user-name">{userName}</span>
            <span className="user-role">{role === 'administrator' ? 'Administrator' : 'Pracownik'}</span>
          </div>
        </div>
        {role === 'employee' && (
          <div className="points-chip">
            <span className="pts-number">{points}</span>
            <span className="pts-text">pkt</span>
          </div>
        )}
        <button className="btn-logout" onClick={onLogout}>
          Wyloguj
        </button>
      </div>
    </header>
  )
}
