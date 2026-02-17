import { Routes, Route } from 'react-router-dom'
import PremiumTemplate from './template-premium'
import PortfolioPage from './pages/Portfolio'

function App() {
  return (
    <Routes>
      <Route path="/" element={<PremiumTemplate />} />
      <Route path="/portfolio" element={<PortfolioPage />} />
    </Routes>
  )
}

export default App