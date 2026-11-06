'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="border-b border-gray-800 px-4 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-orange-400">Rate My Coach</Link>
        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <button onClick={signOut} className="text-gray-400 hover:text-white transition-colors py-1 px-2">
              Sign Out
            </button>
          ) : (
            <Link href="/auth" className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-full font-medium transition-colors">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
