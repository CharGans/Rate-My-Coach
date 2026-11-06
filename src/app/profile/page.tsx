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

  if (loading) return <main className="max-w-2xl mx-auto px-4 py-8"><p className="text-gray-500">Loading...</p></main>

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      {/* Profile header */}
      <div className="flex items-center gap-4 mb-8">
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} alt={profile.username} className="w-16 h-16 rounded-full object-cover shrink-0" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-2xl font-bold shrink-0">
            {profile?.username?.[0]?.toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold">{profile?.username}</h1>
          <p className="text-gray-400 text-sm">
            Member since {profile ? new Date(profile.created_at).toLocaleDateString() : ''}
          </p>
          <p className="text-gray-400 text-sm">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Reviews */}
      <h2 className="text-xl font-semibold mb-4">Your Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-gray-500">You haven't reviewed any coaches yet. <Link href="/" className="text-orange-400 hover:underline">Browse coaches</Link></p>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <Link
              key={review.id}
              href={`/coaches/${review.coaches.id}`}
              className="bg-gray-900 rounded-xl p-5 hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{review.coaches.name}</span>
                <span className="text-orange-400 text-sm">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
              </div>
              <p className="text-xs text-gray-400 capitalize mb-2">{review.coaches.division}</p>
              <p className="text-gray-300 text-sm">{review.body}</p>
              <p className="text-gray-600 text-xs mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
