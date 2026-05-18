"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

interface Review {
  id: string;
  name: string;
  role: "student" | "tutor";
  message: string;
  rating: number;
  createdAt: string;
}

const SEED_REVIEWS: Review[] = [
  {
    id: "s1", name: "Priya Mehta", role: "student",
    message: "My tutor helped me go from barely passing to an A in Mathematics. The patience and clarity was incredible — I finally understand quadratics!",
    rating: 5, createdAt: "2026-04-12",
  },
  {
    id: "s2", name: "James Okafor", role: "tutor",
    message: "Giving back through VolunTutor has been one of the most rewarding things I've done. The matching process is seamless and my students are genuinely motivated.",
    rating: 5, createdAt: "2026-04-18",
  },
  {
    id: "s3", name: "Sofia Chen", role: "student",
    message: "I was nervous at first but my tutor was so patient. We worked through Biology at exactly my pace and I felt completely heard.",
    rating: 4, createdAt: "2026-04-25",
  },
  {
    id: "s4", name: "Marcus Williams", role: "tutor",
    message: "A simple, beautiful platform. I've now tutored three students and each experience has been uniquely rewarding. Highly recommend volunteering.",
    rating: 5, createdAt: "2026-05-02",
  },
  {
    id: "s5", name: "Anika Sharma", role: "student",
    message: "Free tutoring that's actually great? I couldn't believe it. VolunTutor matched me with a Physics expert within days of submitting.",
    rating: 5, createdAt: "2026-05-08",
  },
  {
    id: "s6", name: "Leo Fernandez", role: "tutor",
    message: "The scheduling timetable is brilliant. My students can see exactly when I'm free and pick slots that work for both of us — zero friction.",
    rating: 4, createdAt: "2026-05-14",
  },
];

/* ── Star display (read-only) ────────────────────────── */
function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="14" height="14" viewBox="0 0 24 24"
          fill={s <= rating ? "#f59e0b" : "none"}
          stroke="#f59e0b" strokeWidth="1.5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
}

/* ── Star picker (interactive) ───────────────────────── */
function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = active >= star;
        return (
          <button key={star} type="button"
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(star)}
            style={{
              transform: filled ? "scale(1.15)" : "scale(1)",
              transition: "transform 0.12s ease",
            }}>
            <svg width="30" height="30" viewBox="0 0 24 24"
              fill={filled ? "#f59e0b" : "none"}
              stroke="#f59e0b" strokeWidth="1.5"
              style={{ transition: "fill 0.1s ease" }}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </button>
        );
      })}
      {value > 0 && (
        <span className="ml-2 self-center text-sm font-bold text-amber-600">
          {["", "Poor", "Fair", "Good", "Great", "Excellent"][value]}
        </span>
      )}
    </div>
  );
}

/* ── Review card ─────────────────────────────────────── */
function ReviewCard({ review, index }: { review: Review; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const initials = review.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const avatarColors = [
    "bg-amber-100 text-amber-700",
    "bg-teal-100 text-teal-700",
    "bg-blue-100 text-blue-700",
    "bg-violet-100 text-violet-700",
    "bg-rose-100 text-rose-700",
    "bg-emerald-100 text-emerald-700",
  ];
  const colorCls = avatarColors[index % avatarColors.length];

  return (
    <div
      ref={cardRef}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 0.5s ease ${index * 70}ms, transform 0.5s ease ${index * 70}ms`,
      }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-amber-100 bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-shadow"
    >
      {/* Decorative quote mark */}
      <span
        className="pointer-events-none absolute -top-3 -left-1 select-none font-serif text-[80px] leading-none text-amber-100"
        aria-hidden="true"
      >"</span>

      {/* Stars */}
      <div className="relative mb-3">
        <StarDisplay rating={review.rating} />
      </div>

      {/* Message */}
      <p className="relative flex-1 text-sm leading-relaxed text-gray-600 italic mb-5">
        &ldquo;{review.message}&rdquo;
      </p>

      {/* Author row */}
      <div className="flex items-center gap-3">
        <div className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${colorCls}`}>
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-gray-900 leading-tight">{review.name}</p>
          <p className="text-[10px] text-gray-400">
            {new Date(review.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>
        <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
          review.role === "tutor"
            ? "bg-teal-50 border-teal-200 text-teal-700"
            : "bg-amber-50 border-amber-200 text-amber-700"
        }`}>
          {review.role === "tutor" ? "Tutor" : "Student"}
        </span>
      </div>
    </div>
  );
}

/* ── Write a review form ─────────────────────────────── */
function WriteReviewForm({
  onSubmit,
  user,
}: {
  onSubmit: (r: Review) => void;
  user: { name: string; role: "tutor" | "student" } | null;
}) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleButtonClick() {
    if (!user) return; // guard — button is only shown to signed-in users
    setOpen(true);
  }

  function handleSubmit() {
    setError("");
    if (!user) return;
    if (rating === 0) { setError("Please select a star rating."); return; }
    if (message.trim().length < 15) { setError("Please write at least 15 characters in your review."); return; }

    const review: Review = {
      id: Date.now().toString(),
      name: user.name,
      role: user.role,
      rating,
      message: message.trim(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    onSubmit(review);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setOpen(false);
      setRating(0);
      setMessage("");
    }, 2000);
  }

  /* Not logged in — prompt to sign in */
  if (!user) {
    return (
      <div className="mb-10 flex flex-col items-center gap-4">
        <div className="inline-flex flex-col items-center gap-4 rounded-2xl border border-amber-200 bg-white px-8 py-6 shadow-sm text-center max-w-sm w-full">
          <div className="flex size-11 items-center justify-center rounded-full bg-amber-100">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Sign in to write a review</p>
            <p className="mt-1 text-xs text-gray-500">You need a VolunTutor account to share your experience.</p>
          </div>
          <div className="flex w-full gap-2">
            <Link href="/find"
              className="flex-1 rounded-xl border border-amber-300 bg-amber-50 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition text-center">
              Student sign in
            </Link>
            <Link href="/become"
              className="flex-1 rounded-xl border border-gray-200 bg-gray-50 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition text-center">
              Tutor sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-10 flex flex-col items-center gap-4">
      {!open ? (
        <button
          onClick={handleButtonClick}
          className="group inline-flex items-center gap-2.5 rounded-full bg-gray-900 px-7 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-gray-700 active:translate-y-0"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Write a Review
        </button>
      ) : (
        <div
          className="w-full max-w-xl rounded-2xl bg-white shadow-lg border border-amber-200 overflow-hidden"
          style={{ animation: "slideDown 0.25s ease" }}
        >
          {/* Amber accent strip */}
          <div className="h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-300" />

          <div className="p-7 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900">Share your experience</h3>
                {/* Posting as chip */}
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-xs text-gray-400">Posting as</span>
                  <span className="font-semibold text-xs text-gray-700">{user.name}</span>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                    user.role === "tutor"
                      ? "bg-teal-50 border-teal-200 text-teal-700"
                      : "bg-amber-50 border-amber-200 text-amber-700"
                  }`}>
                    {user.role === "tutor" ? "Tutor" : "Student"}
                  </span>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="flex size-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Star rating */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-amber-600">Rating</label>
              <StarPicker value={rating} onChange={setRating} />
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-amber-600">Your review</label>
              <textarea
                rows={4}
                placeholder="Tell us about your experience with VolunTutor…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={400}
                className="w-full resize-none rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              />
              <p className={`text-right text-xs ${400 - message.length < 50 ? "text-amber-600" : "text-gray-400"}`}>
                {400 - message.length} remaining
              </p>
            </div>

            {error && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
            )}

            {submitted ? (
              <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 py-3 text-sm font-semibold text-emerald-700">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Thank you! Your review has been posted.
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full rounded-xl bg-amber-500 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-400 active:bg-amber-600"
              >
                Post Review →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main component ──────────────────────────────────── */
export function ReviewsSection() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    try {
      const stored: Review[] = JSON.parse(localStorage.getItem("vt_reviews") || "[]");
      setReviews([...stored, ...SEED_REVIEWS]);
    } catch {
      setReviews(SEED_REVIEWS);
    }
  }, []);

  function handleNewReview(review: Review) {
    setReviews((prev) => [review, ...prev]);
    try {
      const stored: Review[] = JSON.parse(localStorage.getItem("vt_reviews") || "[]");
      localStorage.setItem("vt_reviews", JSON.stringify([review, ...stored]));
    } catch { /* ignore */ }
  }

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <section className="relative bg-amber-50 px-6 py-20">
        {/* Top fade from white hero */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white to-transparent" />

        <div className="mx-auto max-w-6xl">

          {/* Section header */}
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-amber-500">
              Community Voices
            </p>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              What people are{" "}
              <span className="italic text-amber-500">saying.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-gray-500">
              Real stories from real people — students who found their tutor, tutors who found their purpose.
            </p>

            <p className="mt-4 text-sm text-gray-400">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
          </div>

          {/* Write a review */}
          <WriteReviewForm onSubmit={handleNewReview} user={user} />

          {/* Reviews grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, i) => (
              <ReviewCard key={review.id} review={review} index={i} />
            ))}
          </div>

          {reviews.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-10">No reviews yet — be the first!</p>
          )}
        </div>

        {/* Bottom fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-amber-100/60 to-transparent" />
      </section>
    </>
  );
}
