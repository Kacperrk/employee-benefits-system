import { useEffect, useState } from 'react'
import axios from 'axios'

type User = {
  id: number
  name: string
}

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [name, setName] = useState('')

  const API_URL = 'http://localhost:5000/api/users'

  const fetchUsers = async () => {
    try {
      const res = await axios.get<User[]>(API_URL)
      setUsers(res.data)
    } catch (err) {
      console.error('Błąd podczas pobierania:', err)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const addUser = async () => {
    if (!name.trim()) return

    try {
      await axios.post(API_URL, { name })
      setName('')
      fetchUsers()
    } catch (err) {
      console.error('Błąd podczas dodawania:', err)
      alert('Nie udało się dodać użytkownika. Sprawdź konsolę (F12).')
    }
  }

  return (
    <div
      style={{
        padding: '40px',
        fontFamily: 'Arial, sans-serif',
        maxWidth: '400px',
        margin: '0 auto',
      }}
    >
      <h2>Lista Beneficjentów</h2>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Wpisz imię..."
          style={{ padding: '8px', flex: 1 }}
        />

        <button
          onClick={addUser}
          style={{
            padding: '8px 16px',
            cursor: 'pointer',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          Dodaj
        </button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {users.map((u) => (
          <li
            key={u.id}
            style={{
              padding: '10px',
              borderBottom: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>{u.name}</span>
            <small style={{ color: '#888' }}>ID: {u.id}</small>
          </li>
        ))}
      </ul>

      {users.length === 0 && (
        <p style={{ color: '#888' }}>Baza jest pusta. Dodaj kogoś!</p>
      )}
    </div>
  )
}

export default App
