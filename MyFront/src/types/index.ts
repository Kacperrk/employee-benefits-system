export type User = {
  id: number
  first_name: string
  last_name: string
  points: number
  role: string
  login?: string
  active?: boolean
}

export type Benefit = {
  id: number
  name: string
  cost_points: number
  active?: boolean
}

export type BenefitRequest = {
  id: number
  user: string
  benefit: string
  status: 'pending' | 'approved' | 'rejected'
  request_date: string
}

export type AuthState = {
  logged: boolean
  userId: number
  userName: string
  role: string
}
