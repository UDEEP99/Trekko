"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { User, Mail, Phone, Activity, Settings, FileText, ChevronLeft, Calendar, Clock, MapPin, Waves, Anchor, Compass } from "lucide-react";
import Link from "next/link";
import { getUserProfile, upsertUserProfile, getSavedTrips, CloudantUserProfile, CloudantTrip } from "@/lib/cloudant";
import Header from "../components/Header";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<CloudantUserProfile | null>(null);
  const [savedTrips, setSavedTrips] = useState<CloudantTrip[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", phone: "", status: "Active" });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      const email = session.user.email;
      
      Promise.all([
        getUserProfile(email),
        getSavedTrips(email)
      ]).then(([userProfile, trips]) => {
        if (userProfile) {
          setProfile(userProfile);
          setEditForm({
            name: userProfile.name || session?.user?.name || email,
            phone: userProfile.phone || "",
            status: userProfile.status || "Active"
          });
        } else {
            setEditForm({
                name: session?.user?.name || email,
                phone: "",
                status: "Active"
            });
        }
        
        // Use Cloudant trips if available, otherwise fall back to localStorage
        if (trips && trips.length > 0) {
          setSavedTrips(trips.sort((a, b) => b.savedAt - a.savedAt));
        } else {
          // Fallback: load from localStorage
          try {
            const stored = localStorage.getItem("trekko-saved-plans");
            if (stored) {
              const localTrips = JSON.parse(stored);
              const mapped: CloudantTrip[] = localTrips.map((t: { destination: string; days: number; budget: string; vibe: string; itinerary: unknown[]; savedAt: number; id?: string }) => ({
                _id: t.id || `${t.savedAt}`,
                userId: email,
                destination: t.destination,
                days: t.days,
                budget: t.budget,
                vibe: t.vibe,
                itinerary: t.itinerary,
                savedAt: t.savedAt,
              }));
              setSavedTrips(mapped.sort((a, b) => b.savedAt - a.savedAt));
            }
          } catch { /* ignore */ }
        }
        setIsLoading(false);
      });
    } else if (status === "unauthenticated") {
        setIsLoading(false);
    }
  }, [session, status]);

  const handleSave = async () => {
    if (!session?.user?.email) return;
    setIsSaving(true);
    const success = await upsertUserProfile(session.user.email, editForm);
    if (success) {
      setProfile(prev => prev ? { ...prev, ...editForm } : null);
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  if (status === "loading" || isLoading) {
      return (
          <div className="min-h-screen landing-bg flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-[#00BCD4] border-t-transparent rounded-full animate-spin" />
          </div>
      );
  }

  const displayName = profile?.name || session?.user?.name || session?.user?.email || "User";
  const displayEmail = session?.user?.email || "No Email";
  const displayPhone = profile?.phone || "—";
  const displayStatus = profile?.status || "Active";

  return (
      <div className="min-h-screen landing-bg text-ink dark:text-white transition-colors duration-200 overflow-x-hidden">
          {/* Beach background decorations */}
          <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
              <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full blur-[100px] opacity-15"
                  style={{ background: "radial-gradient(circle, rgba(0,188,212,0.3) 0%, transparent 70%)", animation: "tropicalFloat 14s ease-in-out infinite" }} />
              <div className="absolute top-1/2 -left-32 w-[400px] h-[400px] rounded-full blur-[80px] opacity-10"
                  style={{ background: "radial-gradient(circle, rgba(255,179,71,0.25) 0%, transparent 70%)", animation: "tropicalFloat 18s ease-in-out infinite 4s" }} />
              <div className="absolute bottom-0 left-0 right-0 h-[80px] opacity-25">
                  <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-full">
                      <path d="M0,80 C360,120 720,40 1080,80 C1260,100 1380,60 1440,80 L1440,120 L0,120 Z"
                          fill="rgba(0,188,212,0.12)" style={{ animation: "oceanWave1 8s ease-in-out infinite" }} />
                      <path d="M0,90 C360,60 720,100 1080,90 C1260,70 1380,95 1440,90 L1440,120 L0,120 Z"
                          fill="rgba(0,188,212,0.08)" style={{ animation: "oceanWave2 6s ease-in-out infinite" }} />
                  </svg>
              </div>
              {/* Floating bubbles */}
              {[...Array(5)].map((_, i) => (
                  <div key={i} className="bubble" style={{
                      left: `${15 + i * 18}%`, width: `${3 + (i % 3) * 2}px`, height: `${3 + (i % 3) * 2}px`,
                      animationDuration: `${7 + i * 3}s`, animationDelay: `${i * 2}s`,
                  }} />
              ))}
          </div>

          <div className="dashboard-nav !rounded-b-3xl !mx-0" style={{ position: 'sticky', borderBottom: 'none' }}>
             <div className="max-w-7xl mx-auto flex items-center justify-between w-full px-6 h-full">
                <Link href="/" className="flex items-center gap-1 cursor-pointer">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF9F43] to-[#FF6B6B] flex items-center justify-center shadow-lg" style={{ animation: "float 4s ease-in-out infinite" }}>
                    <Compass className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold tracking-widest italic text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Trekko</span>
                </Link>
                <Header />
             </div>
          </div>
          <main className="pt-10 pb-20 px-4 md:px-8 max-w-6xl mx-auto" style={{ animation: "fadeUp 0.6s ease-out" }}>
              {/* Back to Dashboard */}
              <div className="mb-6">
                  <Link href="/dashboard" className="inline-flex items-center gap-2 text-ink/60 dark:text-white/60 hover:text-sky-500 dark:hover:text-[#00BCD4] transition-colors text-sm font-medium">
                      <ChevronLeft className="w-4 h-4" />
                      Back to Dashboard
                  </Link>
              </div>

              {/* Banner Area with 3D effect */}
              <div className="relative w-full h-32 md:h-40 rounded-t-[32px] overflow-visible mb-16 sm:mb-8 shadow-2xl border-x-0 border-t-0"
                  style={{
                      background: "linear-gradient(135deg, rgba(0,188,212,0.3) 0%, rgba(0,96,100,0.5) 50%, rgba(0,77,86,0.6) 100%)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255,255,255,0.15)",
                  }}>
                  {/* Animated wave overlay inside banner */}
                  <div className="absolute bottom-0 left-0 right-0 h-[40px] opacity-40 overflow-hidden rounded-b-none">
                      <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="w-full h-full">
                          <path d="M0,20 C360,35 720,5 1080,20 C1260,30 1380,10 1440,20 L1440,40 L0,40 Z" fill="rgba(0,188,212,0.2)"
                              style={{ animation: "oceanWave1 6s ease-in-out infinite" }} />
                      </svg>
                  </div>

                  {/* Avatar & Header Info */}
                  <div className="absolute -bottom-10 left-6 md:left-10 flex items-end gap-5 z-10">
                      <div className="w-[100px] h-[100px] rounded-full bg-black/20 ring-4 ring-[#00BCD4]/30 flex items-center justify-center text-4xl font-bold text-white shadow-2xl overflow-hidden relative group backdrop-blur-md"
                          style={{ boxShadow: "0 0 30px rgba(0,188,212,0.25), 0 8px 32px rgba(0,0,0,0.3)" }}>
                          {session?.user?.image ? (
                              <Image src={session.user.image} alt="Avatar" width={100} height={100} className="w-full h-full object-cover" />
                          ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#00BCD4] to-[#006064] text-white">
                                  {displayName.charAt(0).toUpperCase()}
                              </div>
                          )}
                          <div className="absolute bottom-1 right-2 w-3.5 h-3.5 bg-[#69F0AE] rounded-full border-2 border-white/20" style={{ boxShadow: "0 0 8px rgba(105,240,174,0.5)" }} />
                      </div>
                      <div className="mb-1 hidden sm:block">
                          <h1 className="text-2xl font-bold text-white tracking-wide drop-shadow-md" style={{ fontFamily: "'Playfair Display', serif" }}>{displayName}</h1>
                          <p className="text-sm text-white/90 font-medium drop-shadow-md">{displayEmail}</p>
                      </div>
                  </div>

                  {/* Mobile Profile Name */}
                  <div className="absolute top-[140px] left-6 sm:hidden">
                      <h1 className="text-xl font-bold text-ink dark:text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{displayName}</h1>
                      <p className="text-sm text-ink/70 dark:text-white/70">{displayEmail}</p>
                  </div>

                  {/* Edit Profile Button */}
                  <div className="absolute top-[140px] right-4 sm:top-auto sm:-bottom-12 sm:right-6">
                      {isEditing ? (
                          <div className="flex items-center gap-3">
                              <button onClick={() => setIsEditing(false)} className="px-5 py-2 bg-black/5 dark:bg-black/20 hover:bg-black/10 dark:hover:bg-black/40 text-ink dark:text-white text-sm font-medium rounded-xl transition-colors border border-black/10 dark:border-white/20 shadow-sm backdrop-blur-md">
                                  Cancel
                              </button>
                              <button onClick={handleSave} disabled={isSaving} className="px-5 py-2 bg-gradient-to-r from-[#00BCD4] to-[#006064] hover:from-[#00ACC1] hover:to-[#004D56] text-white text-sm font-semibold rounded-xl transition-all flex items-center gap-2 shadow-lg"
                                  style={{ boxShadow: "0 4px 20px rgba(0,188,212,0.3)" }}>
                                  {isSaving ? "Saving..." : "Save Changes"}
                              </button>
                          </div>
                      ) : (
                          <button onClick={() => setIsEditing(true)} className="px-5 py-2 glass-panel hover:bg-black/5 dark:hover:bg-white/10 text-ink dark:text-white text-sm font-medium rounded-xl transition-all flex items-center gap-2 shadow-sm backdrop-blur-md hover:border-[#00BCD4]/40"
                              style={{ border: "1px solid rgba(255,255,255,0.15)" }}>
                              <Settings className="w-4 h-4 text-[#00BCD4]" />
                              Edit Profile
                          </button>
                      )}
                  </div>
              </div>

              {/* Spacer on mobile */}
              <div className="h-16 sm:h-8" />

              {/* Grid Layout with 3D perspective */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 perspective-container">
                  {/* Left Column: Profile Details */}
                  <div className="glass-panel rounded-[24px] p-6 sm:p-8 h-fit shadow-2xl card-3d-subtle glow-border" style={{ border: "1px solid rgba(255,255,255,0.12)" }}>
                      <h2 className="text-xl font-bold text-ink dark:text-white mb-8 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                          <Anchor className="w-5 h-5 text-[#00BCD4]" /> Profile Details
                      </h2>

                      <div className="space-y-6">
                          {/* Full Name */}
                          <div>
                              <div className="flex items-center gap-2 text-[11px] font-bold text-[#00BCD4]/70 uppercase tracking-widest mb-2">
                                  <User className="w-3.5 h-3.5" /> FULL NAME
                              </div>
                              {isEditing ? (
                                  <input 
                                      type="text" 
                                      value={editForm.name} 
                                      onChange={(e) => setEditForm(prev => ({...prev, name: e.target.value}))}
                                      className="w-full bg-white/50 dark:bg-black/20 border border-[#00BCD4]/30 rounded-lg px-4 py-2.5 text-ink dark:text-white focus:outline-none focus:border-[#00BCD4] focus:shadow-[0_0_0_3px_rgba(0,188,212,0.15)] transition-all"
                                  />
                              ) : (
                                  <p className="text-[15px] font-medium text-ink dark:text-white">{displayName}</p>
                              )}
                          </div>
                          
                          <div className="h-px bg-gradient-to-r from-transparent via-[#00BCD4]/20 to-transparent w-full" />

                          {/* Email */}
                          <div>
                              <div className="flex items-center gap-2 text-[11px] font-bold text-[#00BCD4]/70 uppercase tracking-widest mb-2">
                                  <Mail className="w-3.5 h-3.5" /> EMAIL
                              </div>
                              <p className="text-[15px] font-medium text-ink dark:text-white">{displayEmail}</p>
                              {isEditing && <p className="text-[11px] text-[#00BCD4] mt-1.5">* Linked to your IBM App ID account.</p>}
                          </div>

                          <div className="h-px bg-gradient-to-r from-transparent via-[#00BCD4]/20 to-transparent w-full" />

                          {/* Phone */}
                          <div>
                              <div className="flex items-center gap-2 text-[11px] font-bold text-[#00BCD4]/70 uppercase tracking-widest mb-2">
                                  <Phone className="w-3.5 h-3.5" /> PHONE
                              </div>
                              {isEditing ? (
                                  <input 
                                      type="tel" 
                                      value={editForm.phone} 
                                      onChange={(e) => setEditForm(prev => ({...prev, phone: e.target.value}))}
                                      placeholder="+1 (555) 000-0000"
                                      className="w-full bg-white/50 dark:bg-black/20 border border-[#00BCD4]/30 rounded-lg px-4 py-2.5 text-ink dark:text-white focus:outline-none focus:border-[#00BCD4] focus:shadow-[0_0_0_3px_rgba(0,188,212,0.15)] transition-all placeholder:text-ink/30 dark:placeholder:text-white/30"
                                  />
                              ) : (
                                  <p className="text-[15px] font-medium text-ink dark:text-white">{displayPhone}</p>
                              )}
                          </div>

                          <div className="h-px bg-gradient-to-r from-transparent via-[#00BCD4]/20 to-transparent w-full" />

                          {/* Status */}
                          <div>
                              <div className="flex items-center gap-2 text-[11px] font-bold text-[#00BCD4]/70 uppercase tracking-widest mb-2">
                                  <Activity className="w-3.5 h-3.5" /> STATUS
                              </div>
                              {isEditing ? (
                                  <select 
                                      value={editForm.status} 
                                      onChange={(e) => setEditForm(prev => ({...prev, status: e.target.value}))}
                                      className="w-full bg-white/50 dark:bg-black/20 border border-[#00BCD4]/30 rounded-lg px-4 py-2.5 text-ink dark:text-white focus:outline-none focus:border-[#00BCD4] transition-all appearance-none"
                                  >
                                      <option value="Active">Active</option>
                                      <option value="Away">Away</option>
                                      <option value="Do Not Disturb">Do Not Disturb</option>
                                      <option value="Offline">Offline</option>
                                  </select>
                              ) : (
                                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border"
                                      style={{
                                          background: "rgba(0,188,212,0.1)",
                                          color: "#00BCD4",
                                          borderColor: "rgba(0,188,212,0.25)",
                                          boxShadow: displayStatus === 'Active' ? "0 0 12px rgba(0,188,212,0.15)" : "none",
                                      }}>
                                      <div className={`w-1.5 h-1.5 rounded-full ${displayStatus === 'Active' ? 'bg-[#69F0AE]' : 'bg-white/40'}`}
                                          style={displayStatus === 'Active' ? { boxShadow: "0 0 6px rgba(105,240,174,0.5)" } : {}} />
                                      {displayStatus}
                                  </div>
                              )}
                          </div>

                          <div className="h-px bg-gradient-to-r from-transparent via-[#00BCD4]/20 to-transparent w-full" />

                          {/* Last Login */}
                          <div>
                              <div className="flex items-center gap-2 text-[11px] font-bold text-[#00BCD4]/70 uppercase tracking-widest mb-2">
                                  <Clock className="w-3.5 h-3.5" /> LAST LOGIN
                              </div>
                              <p className="text-[15px] font-medium text-ink dark:text-white">
                                  {profile?.lastSeen ? new Date(profile.lastSeen).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' }) : "Just now"}
                              </p>
                          </div>

                          <div className="h-px bg-gradient-to-r from-transparent via-[#00BCD4]/20 to-transparent w-full" />

                          {/* Member Since */}
                          <div>
                              <div className="flex items-center gap-2 text-[11px] font-bold text-[#00BCD4]/70 uppercase tracking-widest mb-2">
                                  <Calendar className="w-3.5 h-3.5" /> MEMBER SINCE
                              </div>
                              <p className="text-[15px] font-medium text-ink dark:text-white">
                                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </p>
                          </div>
                      </div>
                  </div>

                  {/* Right Column: Saved Itineraries */}
                  <div className="glass-panel rounded-[24px] p-6 sm:p-8 shadow-2xl h-fit card-3d-subtle glow-border" style={{ border: "1px solid rgba(255,255,255,0.12)" }}>
                      <div className="mb-8">
                          <h2 className="text-xl font-bold text-ink dark:text-white mb-2 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                              <Waves className="w-5 h-5 text-[#00BCD4]" /> Saved Itineraries
                          </h2>
                          <p className="text-sm text-ink/70 dark:text-white/70">Recent curated trips and travel plans</p>
                      </div>

                      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                          {savedTrips.length === 0 ? (
                              <div className="text-center py-10 rounded-2xl border border-dashed border-[#00BCD4]/30"
                                  style={{ background: "rgba(0,188,212,0.05)" }}>
                                  <MapPin className="w-10 h-10 text-[#00BCD4]/40 mx-auto mb-3" style={{ animation: "float 3s ease-in-out infinite" }} />
                                  <p className="text-ink/80 dark:text-white/80 font-medium mb-1">No trips saved yet</p>
                                  <p className="text-sm text-ink/50 dark:text-white/50 mb-6">Start planning your next adventure!</p>
                                  <Link href="/dashboard" className="px-5 py-2.5 bg-gradient-to-r from-[#00BCD4] to-[#006064] text-white hover:from-[#00ACC1] hover:to-[#004D56] rounded-xl font-medium transition-all"
                                      style={{ boxShadow: "0 4px 15px rgba(0,188,212,0.3)" }}>
                                      Plan a Trip
                                  </Link>
                              </div>
                          ) : (
                              savedTrips.map((trip, idx) => (
                                  <div key={trip._id} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 rounded-xl border transition-all group shadow-sm hover:shadow-lg bg-black/5 dark:bg-[#003640]/40"
                                      style={{
                                          borderColor: "rgba(255,255,255,0.08)",
                                          transition: "all 0.3s ease",
                                      }}
                                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(0,188,212,0.4)"; e.currentTarget.style.transform = "translateY(-2px) rotateX(1deg)"; e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,188,212,0.15)"; }}
                                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                                      <div className="flex gap-4 items-center">
                                          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-white group-hover:scale-110 transition-transform"
                                              style={{ background: "linear-gradient(135deg, #00BCD4, #006064)", boxShadow: "0 4px 12px rgba(0,188,212,0.25)" }}>
                                              <FileText className="w-5 h-5" />
                                          </div>
                                          <div>
                                              <h3 className="text-ink dark:text-white font-bold text-[15px] mb-0.5">{trip.destination}</h3>
                                              <div className="flex items-center gap-3 text-xs text-ink/60 dark:text-white/60">
                                                  <span>{trip.days} Days • {trip.vibe}</span>
                                                  <span className="hidden sm:inline">•</span>
                                                  <span className="hidden sm:inline">{new Date(trip.savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                              </div>
                                          </div>
                                      </div>
                                      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                                          <div className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide ${idx === 0 ? 'text-[#69F0AE]' : 'text-white/50'}`}
                                              style={{
                                                  background: idx === 0 ? "rgba(105,240,174,0.1)" : "rgba(255,255,255,0.05)",
                                                  border: idx === 0 ? "1px solid rgba(105,240,174,0.2)" : "1px solid rgba(255,255,255,0.08)",
                                              }}>
                                              {idx === 0 ? 'Active' : 'Completed'}
                                          </div>
                                          <Link href={`/dashboard?load=${trip.savedAt}`} className="text-ink/40 dark:text-white/40 hover:text-sky-500 dark:hover:text-[#00BCD4] transition-colors p-2 hidden sm:block">
                                              <ChevronLeft className="w-4 h-4 rotate-180" />
                                          </Link>
                                      </div>
                                  </div>
                              ))
                          )}
                      </div>
                  </div>
              </div>
          </main>

          {/* Custom scrollbar CSS */}
          <style dangerouslySetInnerHTML={{__html: `
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(0,188,212,0.2);
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(0,188,212,0.35);
            }
          `}} />
      </div>
  );
}
