import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ClientPersonas from './pages/ClientPersonas';
import BlogPlanner from './pages/BlogPlanner';
import BlogCalendar from './pages/BlogCalendar';
import Analytics from './pages/Analytics';
import './App.css';  // Make sure App.css is imported

function App() {
  return (
    <DataProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/personas" element={<ClientPersonas />} />
            <Route path="/blog-planner" element={<BlogPlanner />} />
            <Route path="/calendar" element={<BlogCalendar />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </Layout>
      </Router>
    </DataProvider>
  );
}

export default App;