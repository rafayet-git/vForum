import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import AccountInfo from './pages/AccountInfo'
import './App.css'

function App() {

  return (
    <Router> 
      <div className="App">
        <div className="header">
          <Link to="/"><button className="headerBtn"> Home </button></Link>
          <Link to="/account"><button className="headerBtn"> Account </button></Link>
        </div>
        <Routes>
          <Route path="/account" element={<AccountInfo/>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
