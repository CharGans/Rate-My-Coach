'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface ProfileReview {
  id: string
  rating: number
  body: string
  created_at: string
  coaches: { id: string; name: string; division: string }
}

interface Profile {
  username: string
  avatar_url: string | null
  created_at: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [reviews, setReviews] = useState<ProfileReview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }

      const [{ data: profileData }, { data: reviewData }] = await Promise.all([
        supabase.from('profiles').select('username, avatar_url, created_at').eq('id', user.id).single(),
        supabase.from('reviews').select('id, rating, body, created_at, coaches(id, name, division)').eq('user_id', user.id).order('created_at', { ascending: false }),
      ])

      setProfile(profileData)
      setReviews(reviewData ?? [])
      setLoading(false)
    }
    load()
  }, [router])

  if (loading) return <main className="max-w-2xl mx-auto px-4 py-8"><p className="text-brown-light">Loading...</p></main>

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} alt={profile.username} className="w-16 h-16 rounded-full object-cover shrink-0" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-violet text-cream flex items-center justify-center text-2xl font-bold shrink-0">
            {profile?.username?.[0]?.toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-brown">{profile?.username}</h1>
          <p className="text-brown-light text-sm">
            Member since {profile ? new Date(profile.created_at).toLocaleDateString() : ''}
          </p>
          <p className="text-brown-light text-sm">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4 text-brown">Your Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-brown-light">You haven't reviewed any coaches yet. <Link href="/search" className="text-violet hover:underline">Browse coaches</Link></p>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <Link
              key={review.id}
              href={`/coaches/${review.coaches.id}`}
              className="bg-cream border border-brown-border rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-brown">{review.coaches.name}</span>
                <span className="text-violet text-sm">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
              </div>
              <p className="text-xs text-brown-light capitalize mb-2">{review.coaches.division}</p>
              <p className="text-brown-light text-sm">{review.body}</p>
              <p className="text-brown-light text-xs mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
