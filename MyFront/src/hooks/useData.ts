import { useState, useCallback } from 'react'
import { usersApi, benefitsApi, requestsApi } from '../api'
import type { User, Benefit, BenefitRequest } from '../types'

export function useData() {
  const [users, setUsers] = useState<User[]>([])
  const [benefits, setBenefits] = useState<Benefit[]>([])
  const [requests, setRequests] = useState<BenefitRequest[]>([])
  const [loading, setLoading] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [u, b, r] = await Promise.all([
        usersApi.getAll(),
        benefitsApi.getAll(),
        requestsApi.getAll(),
      ])
      setUsers(u.data)
      setBenefits(b.data)
      setRequests(r.data)
    } finally {
      setLoading(false)
    }
  }, [])

  return { users, benefits, requests, loading, loadData }
}
