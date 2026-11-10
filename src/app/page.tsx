import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-brown mb-3">Welcome to Vetta</h1>
        <p className="text-brown-light text-lg">Find coaches you can trust. Leave reviews that protect others.</p>
      </div>

      {/* About bubble */}
      <div className="bg-lilac-light border border-brown-border rounded-2xl p-8 mb-10">
        <h2 className="text-2xl font-bold text-brown mb-4">Why Vetta Exists</h2>
        <p className="text-brown leading-relaxed mb-4">
          Vetta was created by <span className="font-semibold">Melissa Miller</span> after her first experience with a fitness coach nearly cost her her health. Her coach put her on a protocol that was dangerous — and when she started talking to other women in the sport, she realized she wasn't alone. Many had gone through the same thing, some with even more serious consequences.
        </p>
        <p className="text-brown leading-relaxed mb-4">
          There was no place to warn others. No way to know before signing with a coach whether they were safe, qualified, or even ethical. Women were finding out the hard way.
        </p>
        <p className="text-brown leading-relaxed">
          Vetta exists to change that. It's a space where athletes can share honest experiences, find coaches who have been vetted by real people, and make informed decisions before trusting someone with their body and their health.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/search"
          className="bg-violet hover:bg-violet-hover text-cream px-8 py-4 rounded-full font-semibold text-center transition-colors"
        >
          Find a Coach
        </Link>
        <Link
          href="/coaches/new"
          className="bg-cream border border-brown-border hover:bg-lilac-light text-brown px-8 py-4 rounded-full font-semibold text-center transition-colors"
        >
          Add a Coach
        </Link>
      </div>
    </main>
  )
}
