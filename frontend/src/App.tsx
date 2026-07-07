import { Route, Routes } from 'react-router-dom'
import AuroraBackground from './components/AuroraBackground'
import CursorGlow from './components/CursorGlow'
import ScrollProgressBar from './components/ScrollProgressBar'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Admin from './pages/Admin'

function App() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <AuroraBackground />
      <CursorGlow />
      <ScrollProgressBar />
      <Header />
      <main className="relative z-10 flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
