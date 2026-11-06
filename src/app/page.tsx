'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Coach, Division } from '@/lib/types'

const DIVISIONS: { label: string; value: Division | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Bodybuilding', value: 'bodybuilding' },
  { label: 'Fitness', value: 'fitness' },
  { label: 'Other', value: 'other' },
]

export default function HomePage() {
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [division, setDivision] = useState<Division | 'all'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      let query = supabase
        .from('coaches')
        .select('*')
        .order('avg_rating', { ascending: false })

      if (division !== 'all') query = query.eq('division', division)

      const { data } = await query
      setCoaches(data ?? [])
      setLoading(false)
    }
    load()
  }, [division])

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Rate My Coach</h1>
      <p className="text-gray-400 mb-6">Find and review personal trainers & fitness coaches</p>

      <div className="flex gap-2 mb-8">
        {DIVISIONS.map((d) => (
          <button
            key={d.value}
            onClick={() => setDivision(d.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              division === d.value
                ? 'bg-orange-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading coaches...</p>
      ) : coaches.length === 0 ? (
        <p className="text-gray-500">No coaches found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {coaches.map((coach) => (
            <Link
              key={coach.id}
              href={`/coaches/${coach.id}`}
              className="bg-gray-900 rounded-xl p-5 hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                {coach.avatar_url ? (
                  <img src={coach.avatar_url} alt={coach.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold">
                    {coach.name[0]}
                  </div>
                )}
                <div>
                  <p className="font-semibold">{coach.name}</p>
                  <p className="text-xs text-gray-400 capitalize">{coach.division}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-orange-400 text-sm">
                <span>★ {coach.avg_rating?.toFixed(1) ?? '—'}</span>
                <span className="text-gray-500">({coach.review_count} reviews)</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
