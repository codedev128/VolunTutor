import Link from "next/link";
import { ReviewsSection } from "@/components/reviews-section";
import { AuthRedirect } from "@/components/auth-redirect";

export default function Home() {
  return (
    <>
      <AuthRedirect />
      {/* ── Hero ───────────────────────────────────── */}
      <div className="relative flex h-screen w-full items-center justify-center bg-white px-6">
        <div className="flex flex-col items-center text-center">
          <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            Learning with{" "}
            <span className="italic text-amber-500">no limits.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
            Take your first step with VolunTutor towards free, personalised online tutoring for visually impaired students.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/find/auth"
              className="rounded-full bg-gray-900 px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-gray-700 active:translate-y-0"
            >
              Find a VolunTutor →
            </Link>
            <Link
              href="/become"
              className="rounded-full border border-gray-900/20 px-8 py-3 text-sm font-semibold text-gray-800 transition hover:border-gray-900/40 hover:bg-gray-900/5"
            >
              Become a VolunTutor
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="mt-16 flex flex-col items-center gap-1.5 opacity-40">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">Reviews</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce text-gray-400">
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
          </div>
        </div>
      </div>

      {/* ── Reviews ─────────────────────────────────── */}
      <ReviewsSection />
    </>
  );
}
