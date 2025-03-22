import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { AdminDashboard } from './pages/AdminDashboard';
import { CertificateSearch } from './pages/CertificateSearch';
import { Login } from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';

function App() {
  const { checkSession } = useAuthStore();

  // Check for existing session when app loads
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/search" element={<CertificateSearch />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

// Simple 404 page
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page not found</p>
      <a 
        href="/"
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
      >
        Go back home
      </a>
    </div>
  );
}

export default App;