'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ReviewForm from './ReviewForm'
import type { Review } from '@/lib/types'

interface Props {
  reviews: Review[]
  currentUserId: string | null
  coachId: string
}

export default function ReviewsList({ reviews, currentUserId, coachId }: Props) {
  const router = useRouter()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(reviewId: string) {
    setDeletingId(reviewId)
    const { data: { user } } = await supabase.auth.getUser()
    console.log('current user:', user?.id)
    console.log('deleting review:', reviewId)
    const { error } = await supabase.from('reviews').delete().eq('id', reviewId)
    console.log('delete error:', error)
    if (!error) window.location.reload()
    setDeletingId(null)
  }

  return (
    <div className="flex flex-col gap-4">
      {reviews.map((review) => {
        const isOwn = review.user_id === currentUserId

        if (isOwn && editingId === review.id) {
          return (
            <ReviewForm
              key={review.id}
              coachId={coachId}
              userId={currentUserId!}
              existing={{ id: review.id, rating: review.rating, body: review.body }}
              onCancel={() => setEditingId(null)}
            />
          )
        }

        return (
          <div key={review.id} className="bg-cream border border-brown-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm text-brown">{review.profiles?.username ?? 'Anonymous'}</span>
              <span className="text-violet text-sm">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
            </div>
            <p className="text-brown-light text-sm">{review.body}</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-brown-light text-xs">{new Date(review.created_at).toLocaleDateString()}</p>
              {isOwn && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditingId(review.id)}
                    className="text-xs text-brown-light hover:text-brown transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    disabled={deletingId === review.id}
                    className="text-xs text-red-400 hover:text-red-600 disabled:opacity-50 transition-colors"
                  >
                    {deletingId === review.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
