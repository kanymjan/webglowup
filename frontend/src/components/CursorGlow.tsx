import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CursorGlow() {
  const x = useMotionValue(-400)
  const y = useMotionValue(-400)
  const springX = useSpring(x, { stiffness: 60, damping: 20, mass: 0.5 })
  const springY = useSpring(y, { stiffness: 60, damping: 20, mass: 0.5 })

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [x, y])

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 hidden h-[440px] w-[440px] rounded-full bg-violet-500/25 blur-[110px] mix-blend-screen sm:block"
      style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
    />
  )
}
