export default function AuroraBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#0a0b16]">
      <div className="absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full bg-violet-600/25 blur-[120px] animate-float-slow" />
      <div className="absolute top-1/3 -right-40 h-[32rem] w-[32rem] rounded-full bg-blue-600/20 blur-[120px] animate-float-slower" />
      <div className="absolute bottom-0 left-1/4 h-[28rem] w-[28rem] rounded-full bg-fuchsia-600/15 blur-[120px] animate-float-slow" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.08),transparent_60%)]" />
    </div>
  )
}
