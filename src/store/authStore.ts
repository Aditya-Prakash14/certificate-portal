import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAdmin: false,
      loading: false,
      error: null,
      setUser: (user) => set({ 
        user, 
        isAdmin: !!user && isAdminEmail(user.email) 
      }),
      signIn: async (email, password) => {
        set({ loading: true, error: null });
        try {
          if (!email || !password) {
            throw new Error('Email and password are required');
          }
          
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (error) {
            if (error.message === 'Invalid login credentials') {
              throw new Error('Invalid email or password. Please check your credentials and try again.');
            } else if (error.message.includes('rate limit')) {
              throw new Error('Too many login attempts. Please try again later.');
            }
            throw error;
          }
          
          const isAdmin = isAdminEmail(data.user?.email);
          
          if (!isAdmin) {
            // Sign out if not an admin
            await supabase.auth.signOut();
            throw new Error('Access denied. You need administrator privileges to access this area.');
          }
          
          set({ 
            user: data.user,
            isAdmin,
            error: null
          });
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        } finally {
          set({ loading: false });
        }
      },
      signOut: async () => {
        set({ loading: true });
        try {
          await supabase.auth.signOut();
          set({ user: null, isAdmin: false, error: null });
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },
      clearError: () => set({ error: null }),
      checkSession: async () => {
        set({ loading: true });
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              set({ 
                user,
                isAdmin: isAdminEmail(user.email),
                error: null
              });
            } else {
              set({ user: null, isAdmin: false });
            }
          } else {
            set({ user: null, isAdmin: false });
          }
        } catch (error: any) {
          set({ error: error.message, user: null, isAdmin: false });
        } finally {
          set({ loading: false });
        }
      }
    }),
    {
      name: 'auth-storage', // unique name for localStorage
      partialize: (state) => ({ user: state.user, isAdmin: state.isAdmin }),
    }
  )
);

// Helper function to check if email has admin privileges
function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  // You can customize this logic based on your admin criteria
  return email.endsWith('@admin.com');
}