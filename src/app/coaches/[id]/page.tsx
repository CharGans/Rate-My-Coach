import { notFound } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import ReviewForm from '@/components/ReviewForm'
import ReviewsList from '@/components/ReviewsList'
import type { Coach, Review } from '@/lib/types'

async function getServerSupabase() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  )
}

export default async function CoachPage({ params }: { params: { id: string } }) {
  const sb = await getServerSupabase()

  const [{ data: coach }, { data: reviews }, { data: { user } }] = await Promise.all([
    sb.from('coaches').select('*').eq('id', params.id).single<Coach>(),
    sb.from('reviews').select('*, profiles(username)').eq('coach_id', params.id).order('created_at', { ascending: false }),
    sb.auth.getUser(),
  ])

  if (!coach) notFound()

  const alreadyReviewed = reviews?.some((r: Review) => r.user_id === user?.id)

  return (
    <main className="max-w-3xl mx-auto px-4 py-6 sm:py-10">
      {/* Coach header */}
      <div className="flex items-center gap-4 mb-6">
        {coach.avatar_url ? (
          <img src={coach.avatar_url} alt={coach.name} className="w-16 h-16 rounded-full object-cover shrink-0" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-2xl font-bold shrink-0">
            {coach.name[0]}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold">{coach.name}</h1>
          <p className="text-gray-400 capitalize">{coach.division}</p>
          <div className="flex items-center gap-1 text-orange-400 text-sm mt-1">
            <span>★ {coach.avg_rating?.toFixed(1) ?? '—'}</span>
            <span className="text-gray-500">({coach.review_count} reviews)</span>
          </div>
        </div>
      </div>

      {coach.bio && <p className="text-gray-300 mb-8">{coach.bio}</p>}

      {/* Review form */}
      {user && !alreadyReviewed && (
        <div className="mb-8">
          <ReviewForm coachId={coach.id} userId={user.id} />
        </div>
      )}
      {!user && (
        <p className="text-gray-500 text-sm mb-8">
          <a href="/auth" className="text-orange-400 hover:underline">Sign in</a> to leave a review.
        </p>
      )}
      {user && alreadyReviewed && (
        <p className="text-gray-500 text-sm mb-8">You've already reviewed this coach.</p>
      )}

      {/* Reviews list */}
      <h2 className="text-xl font-semibold mb-4">Reviews</h2>
      {!reviews?.length ? (
        <p className="text-gray-500">No reviews yet. Be the first!</p>
      ) : (
        <ReviewsList
          reviews={reviews as Review[]}
          currentUserId={user?.id ?? null}
          coachId={coach.id}
        />
      )}
    </main>
  )
}
