export type Division = 'bodybuilding' | 'fitness' | 'other'

export interface Coach {
  id: string
  name: string
  division: Division
  bio: string | null
  avatar_url: string | null
  avg_rating: number
  review_count: number
  created_at: string
}

export interface Review {
  id: string
  coach_id: string
  user_id: string
  rating: number        // 1–5
  body: string
  created_at: string
  profiles?: { username: string }
}
