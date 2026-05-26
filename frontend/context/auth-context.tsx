"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import * as db from "@/lib/db";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: "tutor" | "student";
}

export type TutorUser = AppUser;

interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
  signUp: (name: string, email: string, password: string, role?: "tutor" | "student") => Promise<{ ok: boolean; error?: string; user?: AppUser }>;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string; user?: AppUser }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("vt_session");
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    }
    setIsLoading(false);
  }, []);

  async function signUp(name: string, email: string, password: string, role: "tutor" | "student" = "tutor"): Promise<{ ok: boolean; error?: string; user?: AppUser }> {
    try {
      const existing = await db.getUserByEmail(email);
      if (existing) {
        return { ok: false, error: "An account with this email already exists." };
      }
      const newUser = await db.createUser({ id: Date.now().toString(), name, email, password, role });
      const session: AppUser = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
      localStorage.setItem("vt_session", JSON.stringify(session));
      setUser(session);
      return { ok: true, user: session };
    } catch {
      return { ok: false, error: "Failed to create account. Please try again." };
    }
  }

  async function signIn(email: string, password: string): Promise<{ ok: boolean; error?: string; user?: AppUser }> {
    try {
      const found = await db.getUserByEmail(email);
      if (!found || found.password !== password) {
        return { ok: false, error: "Incorrect email or password." };
      }
      if (found.is_banned) {
        return { ok: false, error: "Your account has been suspended. Please contact support." };
      }
      const session: AppUser = { id: found.id, name: found.name, email: found.email, role: found.role };
      localStorage.setItem("vt_session", JSON.stringify(session));
      setUser(session);
      return { ok: true, user: session };
    } catch {
      return { ok: false, error: "Something went wrong. Please try again." };
    }
  }

  function signOut() {
    localStorage.removeItem("vt_session");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
