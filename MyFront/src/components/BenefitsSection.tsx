import { useState } from 'react'
import type { Benefit, User } from '../types'
import { benefitsApi, requestsApi } from '../api'

type Props = {
  benefits: Benefit[]
  currentUser: User | undefined
  role: string
  onRefresh: () => void
  onMessage: (msg: string) => void
}

export default function BenefitsSection({ benefits, currentUser, role, onRefresh, onMessage }: Props) {
  const [name, setName] = useState('')
  const [cost, setCost] = useState(100)
  const [adding, setAdding] = useState(false)

  async function sendRequest(benefit: Benefit) {
    if (!currentUser) return
    if (currentUser.points < benefit.cost_points) {
      onMessage('Za mało punktów na ten benefit')
      return
    }
    try {
      await requestsApi.create(currentUser.id, benefit.id)
      onMessage('✓ Wniosek wysłany pomyślnie')
      onRefresh()
    } catch (err: any) {
      onMessage(err.response?.data || 'Nie udało się wysłać wniosku')
    }
  }

  async function deleteBenefit(id: number) {
    if (!confirm('Dezaktywować ten benefit?')) return
    try {
      await benefitsApi.delete(id)
      onMessage('Benefit dezaktywowany')
      onRefresh()
    } catch {
      onMessage('Nie udało się dezaktywować')
    }
  }

  async function addBenefit(e: React.FormEvent) {
    e.preventDefault()
    setAdding(true)
    try {
      await benefitsApi.create(name, cost)
      setName('')
      setCost(100)
      onMessage('✓ Benefit dodany')
      onRefresh()
    } catch {
      onMessage('Nie udało się dodać benefitu')
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="section">
      <div className="section-header">
        <h2>Dostępne benefity</h2>
        <span className="badge">{benefits.length}</span>
      </div>

      <div className="benefits-grid">
        {benefits.map(benefit => {
          const canAfford = role === 'administrator' || (currentUser?.points ?? 0) >= benefit.cost_points
          return (
            <div className={`benefit-card ${!canAfford ? 'unaffordable' : ''}`} key={benefit.id}>
              <div className="benefit-icon">◈</div>
              <h3>{benefit.name}</h3>
              <div className="benefit-cost">
                <span className="pts">{benefit.cost_points}</span>
                <span className="pts-label">pkt</span>
              </div>
              {role === 'employee' ? (
                <button
                  className={canAfford ? 'btn-action' : 'btn-disabled'}
                  disabled={!canAfford}
                  onClick={() => sendRequest(benefit)}
                >
                  {canAfford ? 'Złóż wniosek' : 'Za mało punktów'}
                </button>
              ) : (
                <button className="btn-danger" onClick={() => deleteBenefit(benefit.id)}>
                  Dezaktywuj
                </button>
              )}
            </div>
          )
        })}
      </div>

      {role === 'administrator' && (
        <div className="add-benefit-form">
          <h3>Dodaj nowy benefit</h3>
          <form onSubmit={addBenefit} className="inline-form">
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nazwa benefitu"
              required
            />
            <input
              type="number"
              min="1"
              value={cost}
              onChange={e => setCost(Number(e.target.value))}
              placeholder="Koszt (pkt)"
              required
            />
            <button type="submit" className="btn-primary" disabled={adding}>
              {adding ? '...' : '+ Dodaj'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
