export default function Footer() {
  return (
    <footer className="border-t border-brown-border bg-lilac mt-16 px-4 py-8">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-brown-light text-sm">
          Questions? Reach us at{' '}
          <a href="mailto:hello@vetta.com" className="text-violet hover:underline">hello@vetta.com</a>
        </p>
        <div className="flex items-center gap-3">
          <a
            href="https://www.tiktok.com/@vetta"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-cream border border-brown-border text-brown-light hover:text-brown px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            TikTok
          </a>
          <a
            href="https://www.instagram.com/vetta"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-cream border border-brown-border text-brown-light hover:text-brown px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            Instagram
          </a>
          <a
            href="https://www.melissamiller.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-violet hover:bg-violet-hover text-cream px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            Coach Melissa
          </a>
        </div>
      </div>
    </footer>
  )
}
