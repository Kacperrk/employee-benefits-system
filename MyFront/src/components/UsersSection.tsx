import type { User } from '../types'
import { usersApi } from '../api'

type Props = {
  users: User[]
  adminId: number
  onRefresh: () => void
  onMessage: (msg: string) => void
}

export default function UsersSection({ users, adminId, onRefresh, onMessage }: Props) {

  async function changeRole(id: number, currentRole: string) {
    const newRole = currentRole === 'administrator' ? 'employee' : 'administrator'
    const label = newRole === 'administrator' ? 'Administrator' : 'Pracownik'
    if (!confirm(`Zmienić rolę na: ${label}?`)) return
    try {
      await usersApi.changeRole(id, adminId, newRole)
      onMessage(`✓ Rola zmieniona na ${label}`)
      onRefresh()
    } catch {
      onMessage('Brak uprawnień lub błąd zmiany roli')
    }
  }

  async function setPoints(id: number, currentPoints: number) {
    const raw = prompt(`Nowa liczba punktów (obecna: ${currentPoints}):`)
    if (!raw) return
    const pts = Number(raw)
    if (isNaN(pts) || pts < 0) {
      onMessage('Podaj prawidłową liczbę punktów (>= 0)')
      return
    }
    try {
      await usersApi.setPoints(id, pts)
      onMessage(`✓ Punkty zmienione na ${pts}`)
      onRefresh()
    } catch {
      onMessage('Nie udało się zmienić punktów')
    }
  }

  return (
    <div className="section">
      <div className="section-header">
        <h2>Zarządzanie użytkownikami</h2>
        <span className="badge">{users.length}</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Imię i nazwisko</th>
              <th>Login</th>
              <th>Rola</th>
              <th>Punkty</th>
              <th>Status</th>
              <th>Akcja</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td className="td-id">{u.id}</td>
                <td className="td-user">{u.first_name} {u.last_name}</td>
                <td className="td-login">{u.login ?? '—'}</td>
                <td>
                  <span className={`role-pill ${u.role}`}>
                    {u.role === 'administrator' ? 'Admin' : 'Pracownik'}
                  </span>
                </td>
                <td className="td-pts">{u.points} pkt</td>
                <td>
                  <span className={`status-pill ${u.active !== false ? 'approved' : 'rejected'}`}>
                    {u.active !== false ? 'Aktywny' : 'Nieaktywny'}
                  </span>
                </td>
                <td>
                  <div className="action-btns">
                    <button className="btn-edit" onClick={() => setPoints(u.id, u.points)}>
                      ✎ Punkty
                    </button>
                    <button className="btn-edit" onClick={() => changeRole(u.id, u.role)}>
                      ⚑ Rola
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}