'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Division } from '@/lib/types'

const DIVISIONS: Division[] = ['bodybuilding', 'fitness', 'other']

export default function NewCoachPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [division, setDivision] = useState<Division>('bodybuilding')
  const [bio, setBio] = useState('')
  const [avatar, setAvatar] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/auth')
      else setUserId(data.user.id)
    })
  }, [router])

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setAvatar(file)
    setPreview(file ? URL.createObjectURL(file) : null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!userId) return
    setError(null)
    setLoading(true)

    let avatar_url: string | null = null

    if (avatar) {
      const ext = avatar.name.split('.').pop()
      const path = `${userId}-${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, avatar, { upsert: true })

      if (uploadError) { setError(uploadError.message); setLoading(false); return }

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
      avatar_url = publicUrl
    }

    const { data, error: insertError } = await supabase
      .from('coaches')
      .insert({ name, division, bio: bio || null, avatar_url })
      .select('id')
      .single()

    if (insertError) { setError(insertError.message); setLoading(false); return }

    router.push(`/coaches/${data.id}`)
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add a Coach</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Avatar upload */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-800 overflow-hidden shrink-0 flex items-center justify-center text-gray-500">
            {preview
              ? <img src={preview} alt="preview" className="w-full h-full object-cover" />
              : <span className="text-2xl">+</span>
            }
          </div>
          <label className="cursor-pointer text-sm text-orange-400 hover:underline">
            Upload photo
            <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </label>
        </div>

        <input
          required
          placeholder="Coach name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-gray-800 rounded-lg px-4 py-3 text-base outline-none focus:ring-2 focus:ring-orange-500"
        />

        <select
          value={division}
          onChange={(e) => setDivision(e.target.value as Division)}
          className="bg-gray-800 rounded-lg px-4 py-3 text-base outline-none focus:ring-2 focus:ring-orange-500 capitalize"
        >
          {DIVISIONS.map((d) => (
            <option key={d} value={d} className="capitalize">{d.charAt(0).toUpperCase() + d.slice(1)}</option>
          ))}
        </select>

        <textarea
          rows={4}
          placeholder="Bio (optional)"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="bg-gray-800 rounded-lg px-4 py-3 text-base outline-none focus:ring-2 focus:ring-orange-500 resize-none"
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 rounded-lg py-3 font-semibold transition-colors"
        >
          {loading ? 'Saving...' : 'Add Coach'}
        </button>
      </form>
    </main>
  )
}
