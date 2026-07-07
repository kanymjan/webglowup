import { motion } from 'framer-motion'

export default function HeroMockup() {
  return (
    <div className="relative mx-auto w-full max-w-md" style={{ perspective: 1400 }}>
      <div className="absolute -inset-10 -z-10 rounded-full bg-violet-600/25 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 50, rotateY: -14, rotateX: 6 }}
        animate={{ opacity: 1, y: [0, -14, 0], rotateY: -14, rotateX: 6 }}
        transition={{
          opacity: { duration: 0.8, ease: 'easeOut' },
          y: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 },
        }}
        style={{ transformStyle: 'preserve-3d' }}
        className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-2xl shadow-violet-950/60 backdrop-blur-2xl"
      >
        <div className="mb-4 flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        </div>
        <div className="space-y-3">
          <div className="h-3 w-2/3 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400" />
          <div className="h-2 w-full rounded-full bg-white/15" />
          <div className="h-2 w-5/6 rounded-full bg-white/15" />
          <div className="mt-5 grid grid-cols-3 gap-2">
            <div className="h-16 rounded-lg border border-white/15 bg-gradient-to-br from-violet-500/15 to-white/0 backdrop-blur-sm" />
            <div className="h-16 rounded-lg border border-white/15 bg-gradient-to-br from-orange-400/10 to-white/0 backdrop-blur-sm" />
            <div className="h-16 rounded-lg border border-white/15 bg-gradient-to-br from-fuchsia-500/10 to-white/0 backdrop-blur-sm" />
          </div>
          <div className="mt-5 h-8 w-32 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
        </div>
      </motion.div>
    </div>
  )
}
