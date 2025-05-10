import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import FeedbackPage from './pages/Feedback'; // Assuming your FeedbackPage component is in src/pages/Feedback.tsx
import ClientAdminPage from './pages/ClientAdmin'; // Import the new ClientAdminPage

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home (Feedback)</Link>
            </li>
            <li>
              <Link to="/admin">Client Admin</Link>
            </li>
          </ul>
        </nav>

        <hr />

        <Routes>
          <Route path="/" element={<FeedbackPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/admin" element={<ClientAdminPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

