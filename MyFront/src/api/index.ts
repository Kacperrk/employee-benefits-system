import axios from 'axios'

export const API = 'http://localhost:5000/api'

const client = axios.create({ baseURL: API })

client.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

client.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/'
    }
    return Promise.reject(err)
  }
)

export const authApi = {
  login: (login: string, password: string) =>
    client.post('/auth/login', { login, password }),
  register: (data: { login: string; password: string; firstName: string; lastName: string }) =>
    client.post('/auth/register', data),
}

export const usersApi = {
  getAll: () => client.get('/users'),
  getById: (id: number) => client.get(`/users/${id}`),
  setPoints: (id: number, points: number) =>
    client.put(`/users/${id}/points`, points, {
      headers: { 'Content-Type': 'application/json' },
    }),
  changeRole: (userId: number, requesterId: number, newRole: string) =>
    client.put(`/users/${userId}/role`, { requesterId, newRole }),
}

export const benefitsApi = {
  getAll: () => client.get('/benefits'),
  getById: (id: number) => client.get(`/benefits/${id}`),
  create: (name: string, costPoints: number) =>
    client.post('/benefits', { name, costPoints }),
  delete: (id: number) => client.delete(`/benefits/${id}`),
}

export const requestsApi = {
  getAll: () => client.get('/benefitrequests'),
  create: (userId: number, benefitId: number) =>
    client.post('/benefitrequests', { userId, benefitId }),
  changeStatus: (id: number, status: string) =>
    client.put(`/benefitrequests/${id}/status`, status, {
      headers: { 'Content-Type': 'application/json' },
    }),
}