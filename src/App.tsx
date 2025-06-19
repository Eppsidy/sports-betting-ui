import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home'; // we'll rename your betting UI to this

function App() {
  const isLoggedIn = !!localStorage.getItem('currentUser');

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
