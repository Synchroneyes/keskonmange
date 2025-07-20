import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PageAccueil from './pages/PageAccueil'
import PageSalle from './pages/PageSalle'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PageAccueil />} />
        <Route path="/salles/:id" element={<PageSalle />} />
      </Routes>
    </Router>
  )
}

export default App
