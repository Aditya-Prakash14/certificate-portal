import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading, checkSession } = useAuthStore();

  useEffect(() => {
    // Check session on mount
    checkSession();
  }, [checkSession]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Redirect if not authenticated or not admin
  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}