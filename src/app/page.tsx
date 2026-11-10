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
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      let query = supabase
        .from('coaches')
        .select('*')
        .order('avg_rating', { ascending: false })

      if (division !== 'all') query = query.eq('division', division)
      if (search.trim()) query = query.ilike('name', `%${search.trim()}%`)

      const { data } = await query
      setCoaches(data ?? [])
      setLoading(false)
    }
    load()
  }, [division, search])

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2 text-brown">Rate My Coach</h1>
      <p className="text-brown-light mb-6">Find and review personal trainers & fitness coaches</p>

      <input
        type="search"
        placeholder="Search coaches..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-cream border border-brown-border rounded-lg px-4 py-3 text-base outline-none focus:ring-2 focus:ring-lilac mb-4 text-brown placeholder:text-brown-light"
      />

      <div className="flex flex-wrap gap-2 mb-8">
        {DIVISIONS.map((d) => (
          <button
            key={d.value}
            onClick={() => setDivision(d.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              division === d.value
                ? 'bg-violet text-cream'
                : 'bg-cream border border-brown-border text-brown-light hover:bg-lilac-light'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-brown-light">Loading coaches...</p>
      ) : coaches.length === 0 ? (
        <p className="text-brown-light">No coaches found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {coaches.map((coach) => (
            <Link
              key={coach.id}
              href={`/coaches/${coach.id}`}
              className="bg-cream border border-brown-border rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-2">
                {coach.avatar_url ? (
                  <img src={coach.avatar_url} alt={coach.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-violet text-cream flex items-center justify-center font-bold">>
                    {coach.name[0]}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-brown">{coach.name}</p>
                  <p className="text-xs text-brown-light capitalize">{coach.division}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-violet text-sm">
                <span>★ {coach.avg_rating?.toFixed(1) ?? '—'}</span>
                <span className="text-brown-light">({coach.review_count} reviews)</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
