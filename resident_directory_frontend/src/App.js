import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import ResidentListView from './pages/ResidentListView';
import ResidentDetail from './pages/ResidentDetail';
import NotFound from './pages/NotFound';

/**
 * PUBLIC_INTERFACE
 * App is the root component that sets up routing and the main layout shell.
 * Routes:
 * - "/" renders ResidentListView with a search bar and resident cards
 * - "/resident/:id" renders ResidentDetail for a selected resident
 */
function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Header />
        <main className="app-main" role="main">
          <Routes>
            <Route path="/" element={<ResidentListView />} />
            <Route path="/resident/:id" element={<ResidentDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
