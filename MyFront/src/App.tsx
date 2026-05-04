import { useEffect, useState } from 'react'
import axios from 'axios'
import './index.css'

const API = 'http://127.0.0.1:5000/api'

type User = {
    id: number
    first_name: string
    last_name: string
    points: number
    role: string
}

type Benefit = {
    id: number
    name: string
    cost_points: number
}

type BenefitRequest = {
    id: number
    user: string
    benefit: string
    status: string
    request_date: string
}

function App() {
    const [logged, setLogged] = useState(false)
    const [userId, setUserId] = useState(0)
    const [userName, setUserName] = useState('')
    const [role, setRole] = useState('')
    const [login, setLogin] = useState('000')
    const [password, setPassword] = useState('1')

    const [users, setUsers] = useState<User[]>([])
    const [benefits, setBenefits] = useState<Benefit[]>([])
    const [requests, setRequests] = useState<BenefitRequest[]>([])
    const [message, setMessage] = useState('')

    const [benefitName, setBenefitName] = useState('')
    const [benefitCost, setBenefitCost] = useState(100)

    const currentUser = users.find((u) => u.id === userId)

    async function loadData() {
        try {
            const usersRes = await axios.get(`${API}/users`)
            const benefitsRes = await axios.get(`${API}/benefits`)
            const requestsRes = await axios.get(`${API}/benefitrequests`)

            setUsers(usersRes.data)
            setBenefits(benefitsRes.data)
            setRequests(requestsRes.data)
        } catch {
            setMessage('Błąd połączenia z serwerem')
        }
    }

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()

        try {
            const res = await axios.post(`${API}/auth/login`, {
                login,
                password,
            })

            setLogged(true)
            setUserId(res.data.userId ?? res.data.UserId)
            setUserName(res.data.user ?? res.data.User)
            setRole((res.data.role ?? res.data.Role).toLowerCase())
            setMessage('Zalogowano')
        } catch {
            setMessage('Błędny login lub hasło')
        }
    }

    useEffect(() => {
        if (logged) loadData()
    }, [logged])

    async function sendRequest(benefit: Benefit) {
        if (!currentUser) return

        if (currentUser.points < benefit.cost_points) {
            setMessage('Masz za mało punktów na ten benefit')
            return
        }

        try {
            await axios.post(`${API}/benefitrequests`, {
                userId,
                benefitId: benefit.id,
            })

            setMessage('Wniosek wysłany')
            loadData()
        } catch (err: any) {
            setMessage(err.response?.data || 'Nie udało się wysłać wniosku')
        }
    }

    async function changeStatus(id: number, status: string) {
        try {
            await axios.put(
                `${API}/benefitrequests/${id}/status`,
                status,
                { headers: { 'Content-Type': 'application/json' } }
            )

            setMessage('Status zmieniony')
            loadData()
        } catch (err: any) {
            setMessage(err.response?.data || 'Nie udało się zmienić statusu')
        }
    }

    async function addBenefit(e: React.FormEvent) {
        e.preventDefault()

        try {
            await axios.post(`${API}/benefits`, {
                name: benefitName,
                costPoints: benefitCost,
            })

            setBenefitName('')
            setBenefitCost(100)
            setMessage('Dodano benefit')
            loadData()
        } catch {
            setMessage('Nie udało się dodać benefitu')
        }
    }

    async function deleteBenefit(id: number) {
        try {
            await axios.delete(`${API}/benefits/${id}`)
            setMessage('Benefit dezaktywowany')
            loadData()
        } catch {
            setMessage('Nie udało się dezaktywować benefitu')
        }
    }

    async function setPoints(id: number) {
        const points = prompt('Podaj liczbę punktów:')

        if (!points) return

        try {
            await axios.put(`${API}/users/${id}/points`, Number(points), {
                headers: { 'Content-Type': 'application/json' },
            })

            setMessage('Punkty zmienione')
            loadData()
        } catch {
            setMessage('Nie udało się zmienić punktów')
        }
    }

    if (!logged) {
        return (
            <div className="login">
                <form onSubmit={handleLogin} className="login-box">
                    <h1>System benefitów</h1>
                    <p className="subtitle">Logowanie do aplikacji</p>

                    <input
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        placeholder="Login"
                    />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Hasło"
                    />

                    <button>Zaloguj</button>

                    {message && <p className="message">{message}</p>}

                    <small>Admin: 000 / 1, Pracownik: 001 / 1</small>
                </form>
            </div>
        )
    }

    return (
        <div className="app">
            <header>
                <div>
                    <h1>System benefitów</h1>
                    <p>
                        Zalogowano jako: <b>{userName}</b> ({role})
                    </p>
                    <p>
                        Punkty: <b>{currentUser?.points ?? 0}</b>
                    </p>
                </div>

                <button className="logout" onClick={() => setLogged(false)}>
                    Wyloguj
                </button>
            </header>

            {message && <div className="info">{message}</div>}

            <section>
                <h2>Benefity</h2>

                <div className="cards">
                    {benefits.map((benefit) => {
                        const canAfford =
                            role === 'administrator' ||
                            (currentUser?.points ?? 0) >= benefit.cost_points

                        return (
                            <div className="card" key={benefit.id}>
                                <h3>{benefit.name}</h3>
                                <p>{benefit.cost_points} pkt</p>

                                {role === 'employee' ? (
                                    <button
                                        disabled={!canAfford}
                                        onClick={() => sendRequest(benefit)}
                                    >
                                        {canAfford ? 'Złóż wniosek' : 'Za mało punktów'}
                                    </button>
                                ) : (
                                    <button className="danger" onClick={() => deleteBenefit(benefit.id)}>
                                        Dezaktywuj
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </div>
            </section>

            {role === 'administrator' && (
                <section>
                    <h2>Dodaj benefit</h2>

                    <form onSubmit={addBenefit} className="form-row">
                        <input
                            value={benefitName}
                            onChange={(e) => setBenefitName(e.target.value)}
                            placeholder="Nazwa benefitu"
                            required
                        />

                        <input
                            type="number"
                            min="1"
                            value={benefitCost}
                            onChange={(e) => setBenefitCost(Number(e.target.value))}
                            placeholder="Koszt"
                            required
                        />

                        <button>Dodaj</button>
                    </form>
                </section>
            )}

            <section>
                <h2>Wnioski</h2>

                <div className="table-wrap">
                    <table>
                        <thead>
                        <tr>
                            <th>Pracownik</th>
                            <th>Benefit</th>
                            <th>Status</th>
                            <th>Data</th>
                            {role === 'administrator' && <th>Akcja</th>}
                        </tr>
                        </thead>

                        <tbody>
                        {requests
                            .filter((r) => role === 'administrator' || r.user === userName)
                            .map((r) => (
                                <tr key={r.id}>
                                    <td>{r.user}</td>
                                    <td>{r.benefit}</td>
                                    <td>
                                        <span className={`status ${r.status}`}>{r.status}</span>
                                    </td>
                                    <td>{new Date(r.request_date).toLocaleDateString()}</td>

                                    {role === 'administrator' && (
                                        <td>
                                            {r.status === 'pending' ? (
                                                <div className="actions">
                                                    <button
                                                        className="ok"
                                                        onClick={() => changeStatus(r.id, 'approved')}
                                                    >
                                                        Akceptuj
                                                    </button>

                                                    <button
                                                        className="danger"
                                                        onClick={() => changeStatus(r.id, 'rejected')}
                                                    >
                                                        Odrzuć
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="done">Rozpatrzony</span>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {role === 'administrator' && (
                <section>
                    <h2>Użytkownicy</h2>

                    <div className="table-wrap">
                        <table>
                            <thead>
                            <tr>
                                <th>Imię i nazwisko</th>
                                <th>Rola</th>
                                <th>Punkty</th>
                                <th>Akcja</th>
                            </tr>
                            </thead>

                            <tbody>
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td>
                                        {u.first_name} {u.last_name}
                                    </td>
                                    <td>{u.role}</td>
                                    <td>{u.points}</td>
                                    <td>
                                        <button onClick={() => setPoints(u.id)}>
                                            Zmień punkty
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </div>
    )
}

export default App
