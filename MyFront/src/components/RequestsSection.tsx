import type { BenefitRequest } from '../types'
import { requestsApi } from '../api'

type Props = {
  requests: BenefitRequest[]
  role: string
  userName: string
  onRefresh: () => void
  onMessage: (msg: string) => void
}

const STATUS_LABELS: Record<string | number, string> = {
  0: 'Oczekujący',
  1: 'Zaakceptowany',
  2: 'Odrzucony',
  pending:  'Oczekujący',
  approved: 'Zaakceptowany',
  rejected: 'Odrzucony',
}

const STATUS_CLASS: Record<string | number, string> = {
  0: 'pending',
  1: 'approved',
  2: 'rejected',
  pending:  'pending',
  approved: 'approved',
  rejected: 'rejected',
}

function isPending(status: string | number) {
  return status === 'pending' || status === 0
}

export default function RequestsSection({ requests, role, userName, onRefresh, onMessage }: Props) {
  const visible = requests.filter(r => role === 'administrator' || r.user === userName)

  async function changeStatus(id: number, status: string) {
    try {
      await requestsApi.changeStatus(id, status)
      onMessage(`✓ Status zmieniony na: ${STATUS_LABELS[status]}`)
      onRefresh()
    } catch (err: any) {
      onMessage(err.response?.data || 'Błąd zmiany statusu')
    }
  }

  return (
    <div className="section">
      <div className="section-header">
        <h2>Wnioski benefitowe</h2>
        <span className="badge">{visible.length}</span>
      </div>

      {visible.length === 0 ? (
        <div className="empty-state">
          <span>◎</span>
          <p>Brak wniosków do wyświetlenia</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Pracownik</th>
                <th>Benefit</th>
                <th>Status</th>
                <th>Data złożenia</th>
                {role === 'administrator' && <th>Akcja</th>}
              </tr>
            </thead>
            <tbody>
              {visible.map(r => (
                <tr key={r.id}>
                  <td className="td-user">{r.user}</td>
                  <td>{r.benefit}</td>
                  <td>
                    <span className={`status-pill ${STATUS_CLASS[r.status] ?? 'pending'}`}>
                      {STATUS_LABELS[r.status] ?? r.status}
                    </span>
                  </td>
                  <td className="td-date">{new Date(r.request_date).toLocaleDateString('pl-PL')}</td>
                  {role === 'administrator' && (
                    <td>
                      {isPending(r.status) ? (
                        <div className="action-btns">
                          <button className="btn-approve" onClick={() => changeStatus(r.id, 'approved')}>
                            ✓ Akceptuj
                          </button>
                          <button className="btn-reject" onClick={() => changeStatus(r.id, 'rejected')}>
                            ✗ Odrzuć
                          </button>
                        </div>
                      ) : (
                        <span className="resolved-label">Rozpatrzony</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}