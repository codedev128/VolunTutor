import Link from "next/link";
import ShaderBackground from "@/components/ui/shader-background";
import { ReviewsSection } from "@/components/reviews-section";
import { AuthRedirect } from "@/components/auth-redirect";

export default function Home() {
  return (
    <>
      <AuthRedirect />
      {/* ── Hero ───────────────────────────────────── */}
      <div className="relative h-screen w-full overflow-hidden flex items-center justify-center px-6">
        <ShaderBackground />

        <div className="relative z-10 flex flex-col items-center text-center">
          <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
            Learning with{" "}
            <span className="italic text-amber-400">no limits.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-300">
            Take your first step with VolunTutor towards free, personalised online tutoring for visually impaired students.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/find/auth"
              className="rounded-full bg-amber-400 px-8 py-3 text-sm font-semibold text-gray-900 shadow-md transition hover:-translate-y-0.5 hover:bg-amber-300 active:translate-y-0"
            >
              Find a VolunTutor →
            </Link>
            <Link
              href="/become"
              className="rounded-full border border-white/25 px-8 py-3 text-sm font-semibold text-white transition hover:border-white/50 hover:bg-white/10"
            >
              Become a VolunTutor
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="mt-16 flex flex-col items-center gap-1.5 opacity-40">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-300">Reviews</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce text-gray-300">
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
