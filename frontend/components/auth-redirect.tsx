"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export function AuthRedirect() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (user?.role === "student") router.replace("/find/dashboard");
    else if (user?.role === "tutor") router.replace("/become/dashboard");
  }, [user, isLoading, router]);

  return null;
}
