import { supabase } from "./supabase";

/* ── Users ───────────────────────────────────────────── */

export interface DbUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "tutor" | "student";
  is_banned: boolean;
}

export async function getUsers(): Promise<DbUser[]> {
  const { data, error } = await supabase.from("users").select("*");
  if (error) throw error;
  return data ?? [];
}

export async function getUserByEmail(email: string): Promise<DbUser | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email.toLowerCase())
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

export async function createUser(user: Omit<DbUser, "is_banned">): Promise<DbUser> {
  const { data, error } = await supabase
    .from("users")
    .insert({ ...user, email: user.email.toLowerCase(), is_banned: false })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function setBanned(userId: string, banned: boolean): Promise<void> {
  const { error } = await supabase
    .from("users")
    .update({ is_banned: banned })
    .eq("id", userId);
  if (error) throw error;
}

export async function isBanned(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("users")
    .select("is_banned")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data?.is_banned ?? false;
}

export async function deleteUser(userId: string): Promise<void> {
  const { error } = await supabase.from("users").delete().eq("id", userId);
  if (error) throw error;
}

/* ── Tutor applications ──────────────────────────────── */

export interface DbApplication {
  id: string;
  name: string;
  email: string;
  password: string;
  cv_file_name?: string;
  cv_data_url?: string;
  status: "pending" | "approved" | "denied";
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  review_note?: string;
}

export async function getApplications(): Promise<DbApplication[]> {
  const { data, error } = await supabase
    .from("tutor_applications")
    .select("*")
    .order("submitted_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getApplicationByEmail(email: string): Promise<DbApplication | null> {
  const { data, error } = await supabase
    .from("tutor_applications")
    .select("*")
    .eq("email", email.toLowerCase())
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

export async function createApplication(app: Omit<DbApplication, "submitted_at" | "status">): Promise<void> {
  const { error } = await supabase.from("tutor_applications").insert({
    ...app,
    email: app.email.toLowerCase(),
    status: "pending",
    submitted_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function updateApplicationStatus(
  id: string,
  status: "approved" | "denied",
  reviewedBy?: string,
  reviewNote?: string
): Promise<void> {
  const update: Record<string, unknown> = {
    status,
    reviewed_at: new Date().toISOString(),
  };
  if (reviewedBy) update.reviewed_by = reviewedBy;
  if (reviewNote) update.review_note = reviewNote;
  const { error } = await supabase.from("tutor_applications").update(update).eq("id", id);
  if (error) throw error;
}

/* ── Tutor profiles ──────────────────────────────────── */

export interface DbTutorProfile {
  user_id: string;
  subjects: Array<{ name: string; proficiency: string; educationLevel: string }>;
}

export async function getTutorProfile(userId: string): Promise<DbTutorProfile | null> {
  const { data, error } = await supabase
    .from("tutor_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

export async function setTutorProfile(userId: string, profile: { subjects: DbTutorProfile["subjects"] }): Promise<void> {
  const { error } = await supabase
    .from("tutor_profiles")
    .upsert({ user_id: userId, subjects: profile.subjects, updated_at: new Date().toISOString() });
  if (error) throw error;
}

/* ── Tutor matches ───────────────────────────────────── */

export interface DbTutorMatch {
  id: string;
  tutor_id: string;
  student_id?: string;
  subject?: string;
  grade_level?: string;
  booked_slots: string[];
  matched_at: string;
  status: string;
  // Extra fields used by tutor dashboard (stored as part of the record)
  student_name?: string;
  avatar?: string;
  help_message?: string;
  session_count?: number;
  next_session?: string | null;
  proficiency?: string;
  unread_messages?: number;
  meet_active?: boolean;
  meet_url?: string;
  messages?: DbMessage[];
}

export async function getTutorMatches(tutorId: string): Promise<DbTutorMatch[]> {
  const { data, error } = await supabase
    .from("tutor_matches")
    .select("*")
    .eq("tutor_id", tutorId);
  if (error) throw error;
  return data ?? [];
}

export async function getAllMatches(): Promise<DbTutorMatch[]> {
  const { data, error } = await supabase.from("tutor_matches").select("*");
  if (error) throw error;
  return data ?? [];
}

export async function createMatch(match: DbTutorMatch): Promise<void> {
  const { error } = await supabase.from("tutor_matches").insert({
    id: match.id,
    tutor_id: match.tutor_id,
    student_id: match.student_id,
    subject: match.subject,
    grade_level: match.grade_level,
    booked_slots: match.booked_slots ?? [],
    matched_at: match.matched_at ?? new Date().toISOString(),
    status: match.status ?? "ACTIVE",
  });
  if (error) throw error;
}

export async function updateMatch(
  tutorId: string,
  matchId: string,
  updates: Partial<DbTutorMatch>
): Promise<void> {
  const { error } = await supabase
    .from("tutor_matches")
    .update(updates)
    .eq("id", matchId)
    .eq("tutor_id", tutorId);
  if (error) throw error;
}

export async function deleteMatch(tutorId: string, matchId: string): Promise<void> {
  const { error } = await supabase
    .from("tutor_matches")
    .delete()
    .eq("id", matchId)
    .eq("tutor_id", tutorId);
  if (error) throw error;
}

/* ── Tutor ratings ───────────────────────────────────── */

export interface DbTutorRating {
  id: string;
  tutor_id: string;
  rating: number;
  reviewer_name?: string;
  comment?: string;
  created_at?: string;
}

export async function getTutorRatings(tutorId: string): Promise<DbTutorRating[]> {
  const { data, error } = await supabase
    .from("tutor_ratings")
    .select("*")
    .eq("tutor_id", tutorId);
  if (error) throw error;
  return data ?? [];
}

export async function addRating(tutorId: string, rating: DbTutorRating): Promise<void> {
  const { error } = await supabase.from("tutor_ratings").upsert({
    id: rating.id,
    tutor_id: tutorId,
    rating: rating.rating,
    reviewer_name: rating.reviewer_name,
    comment: rating.comment,
    created_at: rating.created_at ?? new Date().toISOString(),
  });
  if (error) throw error;
}

/* ── Student requests ────────────────────────────────── */

export interface DbRequest {
  id: string;
  student_id?: string;
  student_name: string;
  subject: string;
  grade_level: string;
  help_message?: string;
  availability_slots: string[];
  status: "pending" | "accepted" | "cancelled";
  accepted_by_tutor_id?: string;
  target_tutor_id?: string;
  recurrence_weeks?: number;
  submitted_at: string;
  // Extra UI fields (stored in record)
  avatar?: string;
}

export async function getRequests(): Promise<DbRequest[]> {
  const { data, error } = await supabase
    .from("student_requests")
    .select("*")
    .order("submitted_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getRequestsByStudentId(studentId: string): Promise<DbRequest[]> {
  const { data, error } = await supabase
    .from("student_requests")
    .select("*")
    .eq("student_id", studentId)
    .order("submitted_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createRequest(req: Omit<DbRequest, "submitted_at" | "status">): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { avatar: _avatar, ...rest } = req;
  const { error } = await supabase.from("student_requests").insert({
    ...rest,
    status: "pending",
    submitted_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function updateRequestStatus(
  id: string,
  status: "pending" | "accepted" | "cancelled",
  tutorId?: string
): Promise<void> {
  const update: Record<string, unknown> = { status };
  if (tutorId !== undefined) update.accepted_by_tutor_id = tutorId;
  const { error } = await supabase.from("student_requests").update(update).eq("id", id);
  if (error) throw error;
}

export async function deleteRequest(id: string): Promise<void> {
  const { error } = await supabase.from("student_requests").delete().eq("id", id);
  if (error) throw error;
}

/* ── Reviews ─────────────────────────────────────────── */

export interface DbReview {
  id: string;
  tutor_id?: string;
  tutor_name?: string;
  reviewer_name?: string;
  student_name?: string;
  rating: number;
  text?: string;
  comment?: string;
  created_at?: string;
}

export async function getReviews(): Promise<DbReview[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createReview(review: DbReview): Promise<void> {
  const { error } = await supabase.from("reviews").upsert({
    ...review,
    created_at: review.created_at ?? new Date().toISOString(),
  });
  if (error) throw error;
}

export async function deleteReview(id: string): Promise<void> {
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw error;
}

/* ── Moderators ──────────────────────────────────────── */

export interface DbModerator {
  id: string;
  name: string;
  email: string;
  password: string;
  created_at?: string;
}

export async function getModerators(): Promise<DbModerator[]> {
  const { data, error } = await supabase.from("moderators").select("*");
  if (error) throw error;
  return data ?? [];
}

export async function getModeratorById(id: string): Promise<DbModerator | null> {
  const { data, error } = await supabase
    .from("moderators")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

export async function getModeratorByCredentials(email: string, password: string): Promise<DbModerator | null> {
  const { data, error } = await supabase
    .from("moderators")
    .select("*")
    .eq("email", email.toLowerCase())
    .eq("password", password)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

export async function createModerator(mod: DbModerator): Promise<void> {
  const { error } = await supabase.from("moderators").insert({
    ...mod,
    email: mod.email.toLowerCase(),
    created_at: mod.created_at ?? new Date().toISOString(),
  });
  if (error) throw error;
}

export async function deleteModerator(id: string): Promise<void> {
  const { error } = await supabase.from("moderators").delete().eq("id", id);
  if (error) throw error;
}

/* ── Messages (stored as JSONB in tutor_matches) ─────── */

export interface DbMessage {
  id: string;
  match_id: string;
  from_role: "tutor" | "student";
  body: string;
  sent_at: string;
}

export async function getMessages(matchId: string): Promise<DbMessage[]> {
  const { data, error } = await supabase
    .from("tutor_matches")
    .select("messages")
    .eq("id", matchId)
    .maybeSingle();
  if (error) throw error;
  const msgs = (data?.messages ?? []) as DbMessage[];
  return msgs.sort((a, b) => a.sent_at.localeCompare(b.sent_at));
}

export async function createMessage(message: Omit<DbMessage, "id">): Promise<void> {
  const { data, error: readErr } = await supabase
    .from("tutor_matches")
    .select("messages")
    .eq("id", message.match_id)
    .maybeSingle();
  if (readErr) throw readErr;
  const existing: DbMessage[] = (data?.messages ?? []) as DbMessage[];
  const newMsg: DbMessage = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    match_id: message.match_id,
    from_role: message.from_role,
    body: message.body,
    sent_at: message.sent_at ?? new Date().toISOString(),
  };
  const { error: writeErr } = await supabase
    .from("tutor_matches")
    .update({ messages: [...existing, newMsg] })
    .eq("id", message.match_id);
  if (writeErr) throw writeErr;
}

export async function setMeetActive(
  tutorId: string,
  matchId: string,
  active: boolean,
  meetUrl?: string
): Promise<void> {
  const update: Record<string, unknown> = { meet_active: active };
  if (meetUrl !== undefined) update.meet_url = meetUrl;
  const { error } = await supabase
    .from("tutor_matches")
    .update(update)
    .eq("id", matchId)
    .eq("tutor_id", tutorId);
  if (error) throw error;
}
