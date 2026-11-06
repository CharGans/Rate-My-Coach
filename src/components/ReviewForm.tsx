'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ReviewForm({ coachId, userId }: { coachId: string; userId: string }) {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [body, setBody] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (rating === 0) { setError('Please select a star rating.'); return }
    setError(null)
    setLoading(true)

    const { error: insertError } = await supabase
      .from('reviews')
      .insert({ coach_id: coachId, user_id: userId, rating, body })

    if (insertError) {
      setError(insertError.code === '23505' ? 'You already reviewed this coach.' : insertError.message)
    } else {
      setBody('')
      setRating(0)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl p-5 flex flex-col gap-4">
      <h3 className="font-semibold text-lg">Leave a Review</h3>

      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className={`text-3xl p-1 transition-colors ${star <= (hovered || rating) ? 'text-orange-400' : 'text-gray-600'}`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        required
        rows={4}
        placeholder="Share your experience with this coach..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="bg-gray-800 rounded-lg px-4 py-3 text-base outline-none focus:ring-2 focus:ring-orange-500 resize-none"
      />

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 rounded-lg py-3 font-semibold transition-colors text-base"
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}
