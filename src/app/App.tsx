import { useState, useRef, useEffect, useCallback } from "react";
import {
  Home, LayoutList, Bot, BarChart2, Settings,
  Eye, EyeOff, Bell, Plus, ChevronRight, Search,
  Filter, Camera, Upload, Send, TrendingUp, TrendingDown,
  User, Download, FileJson, FileText, Moon, Sun,
  Globe, BellRing, Shield, HelpCircle, Info, LogOut,
  Scan, Check, X, ChevronLeft, Edit2, Trash2,
  Sparkles, PiggyBank, AlertTriangle, RefreshCw,
  Image as ImageIcon, CheckCircle2, SkipForward
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Tooltip,
} from "recharts";

// ── Colors ───────────────────────────────────────────────
const C = {
  teal: "#0F9D7C", navy: "#0B1F33", bg: "#F7FAF9",
  white: "#FFFFFF", coral: "#FF6B5E", mint: "#5FD9B4",
  gray: "#6B7B82", divider: "#E8EEEC", tealLight: "#E8F8F4",
};

// ── Chart data per filter ────────────────────────────────
const chartData: Record<string, Array<{ name: string; income: number; outcome: number }>> = {
  "1 Hari": [
    { name: "08:00", income: 50000, outcome: 25000 },
    { name: "10:00", income: 0, outcome: 85000 },
    { name: "12:00", income: 0, outcome: 45000 },
    { name: "14:00", income: 250000, outcome: 0 },
    { name: "16:00", income: 0, outcome: 35000 },
    { name: "18:00", income: 0, outcome: 95000 },
    { name: "20:00", income: 0, outcome: 55000 },
  ],
  "1 Minggu": [
    { name: "Sen", income: 250000, outcome: 110000 },
    { name: "Sel", income: 0, outcome: 125000 },
    { name: "Rab", income: 0, outcome: 85000 },
    { name: "Kam", income: 42500, outcome: 200000 },
    { name: "Jum", income: 0, outcome: 95000 },
    { name: "Sab", income: 0, outcome: 175000 },
    { name: "Min", income: 100000, outcome: 50000 },
  ],
  "1 Bulan": [
    { name: "M1", income: 800000, outcome: 550000 },
    { name: "M2", income: 250000, outcome: 320000 },
    { name: "M3", income: 150000, outcome: 280000 },
    { name: "M4", income: 100000, outcome: 150000 },
  ],
  "1 Tahun": [
    { name: "Jan", income: 1200000, outcome: 850000 },
    { name: "Feb", income: 1500000, outcome: 1100000 },
    { name: "Mar", income: 1300000, outcome: 970000 },
    { name: "Apr", income: 1800000, outcome: 1300000 },
    { name: "Mei", income: 1600000, outcome: 1450000 },
    { name: "Jun", income: 1400000, outcome: 990000 },
    { name: "Jul", income: 1700000, outcome: 1200000 },
    { name: "Agu", income: 1900000, outcome: 1350000 },
    { name: "Sep", income: 1500000, outcome: 1100000 },
    { name: "Okt", income: 1600000, outcome: 1050000 },
    { name: "Nov", income: 1400000, outcome: 980000 },
    { name: "Des", income: 2100000, outcome: 1700000 },
  ],
  "Semua": [
    { name: "2022", income: 14000000, outcome: 10500000 },
    { name: "2023", income: 17500000, outcome: 13200000 },
    { name: "2024", income: 19800000, outcome: 14100000 },
  ],
};

const dailyData = [
  { day: "Sen", amount: 85000 }, { day: "Sel", amount: 125000 },
  { day: "Rab", amount: 70000 }, { day: "Kam", amount: 200000 },
  { day: "Jum", amount: 95000 }, { day: "Sab", amount: 175000 },
  { day: "Min", amount: 50000 },
];

const categoryExpense = [
  { name: "Makan & Minum", value: 35, color: C.teal },
  { name: "Hiburan", value: 20, color: C.coral },
  { name: "Transportasi", value: 15, color: C.mint },
  { name: "Kuliah", value: 18, color: "#F59E0B" },
  { name: "Lainnya", value: 12, color: "#A78BFA" },
];

const categoryIncome = [
  { name: "Gaji", value: 50, color: C.teal },
  { name: "Uang Saku", value: 30, color: C.mint },
  { name: "Beasiswa", value: 15, color: "#F59E0B" },
  { name: "Lainnya", value: 5, color: C.coral },
];

type TxItem = { id: number; date: string; amount: number; category: string; desc: string; icon: string };

const initialIncome: TxItem[] = [
  { id: 1, date: "1 Mar 2024", amount: 42500, category: "Gaji", desc: "Gaji pertama bulan ini", icon: "💼" },
  { id: 2, date: "2 Mar 2024", amount: 43500, category: "Uang Saku", desc: "Uang saku bulanan", icon: "💰" },
  { id: 3, date: "3 Mar 2024", amount: 30000, category: "Beasiswa", desc: "Beasiswa semester", icon: "🎓" },
  { id: 4, date: "5 Mar 2024", amount: 70000, category: "Gaji", desc: "Gaji kedua bulan ini", icon: "💼" },
  { id: 5, date: "6 Mar 2024", amount: 45000, category: "Uang Saku", desc: "Extra cash dari ortu", icon: "💰" },
];

const initialExpense: TxItem[] = [
  { id: 1, date: "1 Mar 2024", amount: 85000, category: "Makan & Minum", desc: "Groceries mingguan", icon: "🍜" },
  { id: 2, date: "2 Mar 2024", amount: 125000, category: "Hiburan", desc: "Nonton bareng teman", icon: "🎬" },
  { id: 3, date: "3 Mar 2024", amount: 80000, category: "Transportasi", desc: "Naik bus", icon: "🚌" },
  { id: 4, date: "4 Mar 2024", amount: 250000, category: "Rumah Tangga", desc: "Kebutuhan rumah", icon: "🏠" },
  { id: 5, date: "5 Mar 2024", amount: 50000, category: "Kesehatan", desc: "Dokter umum", icon: "💊" },
  { id: 6, date: "6 Mar 2024", amount: 100000, category: "Kuliah", desc: "Buku textbook", icon: "📚" },
];

const recentActivity = [
  { id: 1, name: "Makan Siang", amount: -85000, icon: "🍜", type: "expense", time: "10:30" },
  { id: 2, name: "Gaji Paruh Waktu", amount: 250000, icon: "💼", type: "income", time: "09:00" },
  { id: 3, name: "Transportasi", amount: -25000, icon: "🚌", type: "expense", time: "08:15" },
];

const ocrResultItems = [
  { id: 1, name: "Nasi Goreng Ayam", amount: 25000, category: "Makan & Minum" },
  { id: 2, name: "Es Teh Manis", amount: 8000, category: "Makan & Minum" },
  { id: 3, name: "Kerupuk", amount: 5000, category: "Makan & Minum" },
];

const formatRp = (n: number) => "Rp " + Math.abs(n).toLocaleString("id-ID");

// ── Types ────────────────────────────────────────────────
type Screen = "splash" | "onboarding" | "login" | "register" | "face-setup" | "app";
type Tab = "home" | "manage" | "chat" | "analytics" | "settings";
type OcrStep = "method" | "camera" | "loading" | "review" | "fail";
type ToastItem = { id: number; msg: string; type: "success" | "error" };

// ── Toast ─────────────────────────────────────────────────
function ToastContainer({ toasts }: { toasts: ToastItem[] }) {
  return (
    <div className="absolute bottom-24 left-4 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-white text-sm font-medium"
          style={{ background: t.type === "success" ? C.navy : C.coral, fontFamily: "Inter, sans-serif", animation: "slideUpFade 0.3s ease-out", boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>
          {t.type === "success" ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ── Confirm Dialog ────────────────────────────────────────
function ConfirmDialog({ title, desc, confirmLabel = "Ya, Lanjutkan", cancelLabel = "Batalkan", danger = true, onConfirm, onCancel }: {
  title: string; desc: string; confirmLabel?: string; cancelLabel?: string; danger?: boolean; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-[70]"
      style={{ background: "rgba(11,31,51,0.55)" }} onClick={onCancel}>
      <div className="mx-6 rounded-3xl p-6 w-full" style={{ background: C.white, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}
        onClick={(e) => e.stopPropagation()}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: danger ? "#FFF0EF" : C.tealLight }}>
          {danger ? <AlertTriangle size={22} color={C.coral} /> : <Check size={22} color={C.teal} />}
        </div>
        <h3 className="text-base font-bold text-center mb-2" style={{ color: C.navy, fontFamily: "Plus Jakarta Sans, sans-serif" }}>{title}</h3>
        <p className="text-sm text-center mb-6" style={{ color: C.gray, fontFamily: "Inter, sans-serif" }}>{desc}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-full text-sm font-semibold"
            style={{ border: `1.5px solid ${C.divider}`, color: C.gray, fontFamily: "Inter, sans-serif", background: "transparent" }}>
            {cancelLabel}
          </button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-full text-sm font-semibold text-white"
            style={{ background: danger ? C.coral : C.teal, fontFamily: "Inter, sans-serif" }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Coach Mark ────────────────────────────────────────────
// Spotlight positions inside the 390×844 phone frame
const coachSteps = [
  {
    title: "Tambah Transaksi", step: "Step 1 dari 4",
    desc: "Tap tombol + ini untuk mencatat pemasukan atau pengeluaran baru dengan cepat.",
    // FAB: right-5 (20px), bottom-24 (96px), w-14 h-14
    spot: { x: 310, y: 680, w: 60, h: 60, r: 30 },
    tipBottom: 170, tipAlign: "right" as const,
  },
  {
    title: "Kelola Transaksi", step: "Step 2 dari 4",
    desc: "Lihat semua transaksimu. Geser kartu ke kiri untuk edit atau hapus.",
    // Manage tab: 2nd of 5, each ~78px wide → 78–156, center 117
    spot: { x: 77, y: 764, w: 78, h: 72, r: 12 },
    tipBottom: 148, tipAlign: "left" as const,
  },
  {
    title: "FinanSmart AI", step: "Step 3 dari 4",
    desc: "Tanya AI untuk prediksi pengeluaran, analisis keuangan, dan tips hemat personal.",
    // AI Chat tab: 3rd of 5, center 195 → 156–234
    spot: { x: 155, y: 764, w: 78, h: 72, r: 12 },
    tipBottom: 148, tipAlign: "center" as const,
  },
  {
    title: "Analitik Keuangan", step: "Step 4 dari 4",
    desc: "Pantau grafik pemasukan vs pengeluaran berdasarkan filter periode waktu.",
    // Analytics tab: 4th of 5 → 234–312
    spot: { x: 233, y: 764, w: 78, h: 72, r: 12 },
    tipBottom: 148, tipAlign: "center" as const,
  },
];

function CoachMark({ step, onNext, onPrev, onSkip }: {
  step: number; onNext: () => void; onPrev: () => void; onSkip: () => void;
}) {
  const s = coachSteps[step];
  const total = coachSteps.length;

  return (
    <div className="absolute inset-0 z-[90]" style={{ pointerEvents: "all" }}>
      {/* Full dark overlay */}
      <div className="absolute inset-0" style={{ background: "rgba(11,31,51,0.82)" }} />

      {/* Spotlight cutout via box-shadow */}
      <div className="absolute transition-all duration-400"
        style={{
          left: s.spot.x, top: s.spot.y, width: s.spot.w, height: s.spot.h,
          borderRadius: s.spot.r,
          boxShadow: `0 0 0 9999px rgba(11,31,51,0.82)`,
          border: `2px solid ${C.mint}`,
          zIndex: 1,
        }} />

      {/* Tooltip card */}
      <div className="absolute mx-4 transition-all duration-300"
        style={{
          bottom: s.tipBottom,
          left: s.tipAlign === "right" ? "auto" : 16,
          right: s.tipAlign === "right" ? 16 : "auto",
          width: s.tipAlign === "center" ? "calc(100% - 32px)" : s.tipAlign === "right" ? 220 : 220,
          background: C.white,
          borderRadius: 20,
          padding: 20,
          boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
          zIndex: 2,
        }}>
        {/* Step + skip */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold" style={{ color: C.teal, fontFamily: "Inter, sans-serif" }}>{s.step}</span>
          <button onClick={onSkip} className="flex items-center gap-1 text-xs font-medium"
            style={{ color: C.gray, fontFamily: "Inter, sans-serif" }}>
            <SkipForward size={12} /> Lewati semua
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1 mb-4">
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className="h-1.5 rounded-full flex-1 transition-all duration-300"
              style={{ background: i <= step ? C.teal : C.divider }} />
          ))}
        </div>

        <h3 className="text-base font-bold mb-1.5" style={{ color: C.navy, fontFamily: "Plus Jakarta Sans, sans-serif" }}>
          {s.title}
        </h3>
        <p className="text-sm mb-5" style={{ color: C.gray, fontFamily: "Inter, sans-serif", lineHeight: 1.55 }}>
          {s.desc}
        </p>

        <div className="flex gap-2">
          {step > 0 && (
            <button onClick={onPrev} className="px-4 py-2.5 rounded-full text-sm font-medium"
              style={{ border: `1.5px solid ${C.divider}`, color: C.gray, background: "transparent", fontFamily: "Inter, sans-serif" }}>
              ← Kembali
            </button>
          )}
          <button onClick={onNext} className="flex-1 py-2.5 rounded-full text-sm font-semibold text-white"
            style={{ background: C.teal, fontFamily: "Inter, sans-serif" }}>
            {step === total - 1 ? "Selesai! 🎉" : "Lanjut →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Reusable Card ─────────────────────────────────────────
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl p-4 ${className}`} style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
      {children}
    </div>
  );
}

function PillButton({ children, active = false, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="px-3 py-1.5 rounded-full text-xs font-medium transition-all flex-shrink-0"
      style={{ background: active ? C.teal : C.tealLight, color: active ? C.white : C.teal, fontFamily: "Inter, sans-serif" }}>
      {children}
    </button>
  );
}

// ── Swipeable Transaction Item ────────────────────────────
function SwipeableItem({ item, type, swipedId, setSwipedId, onEdit, onDelete }: {
  item: TxItem; type: "income" | "expense";
  swipedId: number | null; setSwipedId: (id: number | null) => void;
  onEdit: (item: TxItem) => void; onDelete: (item: TxItem) => void;
}) {
  const touchStartX = useRef(0);
  const swiped = swipedId === item.id;

  return (
    <div className="relative overflow-hidden" style={{ borderBottom: `1px solid ${C.divider}` }}>
      <div className="absolute right-0 top-0 bottom-0 flex items-center gap-2 px-3" style={{ background: C.bg }}>
        <button onClick={() => { setSwipedId(null); onEdit(item); }}
          className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: C.tealLight }}>
          <Edit2 size={15} color={C.teal} />
        </button>
        <button onClick={() => { setSwipedId(null); onDelete(item); }}
          className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "#FFF0EF" }}>
          <Trash2 size={15} color={C.coral} />
        </button>
      </div>
      <div className="flex items-center gap-3 py-3 transition-transform duration-200"
        style={{ transform: swiped ? "translateX(-88px)" : "translateX(0)", background: C.white }}
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          const diff = touchStartX.current - e.changedTouches[0].clientX;
          if (diff > 50) setSwipedId(item.id);
          else if (diff < -20) setSwipedId(null);
        }}
        onClick={() => swiped && setSwipedId(null)}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: type === "income" ? C.tealLight : "#FFF0EF" }}>
          {item.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: C.navy, fontFamily: "Inter, sans-serif" }}>{item.category}</p>
          <p className="text-xs truncate" style={{ color: C.gray, fontFamily: "Inter, sans-serif" }}>{item.desc}</p>
        </div>
        <div className="text-right flex-shrink-0 flex items-center gap-1.5">
          <div>
            <p className="text-sm font-bold" style={{ color: type === "income" ? C.teal : C.coral, fontFamily: "Inter, sans-serif" }}>
              {type === "income" ? "+" : "-"}{formatRp(item.amount)}
            </p>
            <p className="text-xs" style={{ color: C.gray, fontFamily: "Inter, sans-serif" }}>{item.date}</p>
          </div>
          <span className="text-xs" style={{ color: C.gray }}>‹</span>
        </div>
      </div>
    </div>
  );
}

// ── SPLASH ────────────────────────────────────────────────
function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="flex flex-col items-center justify-center h-full"
      style={{ background: `linear-gradient(160deg, ${C.teal} 0%, ${C.navy} 100%)` }}>
      <div className="mb-6 p-5 rounded-3xl" style={{ background: "rgba(255,255,255,0.15)" }}>
        <PiggyBank size={56} color="white" strokeWidth={1.5} />
      </div>
      <h1 className="text-4xl font-bold" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
        <span style={{ color: C.mint }}>F</span><span className="text-white">inan</span>
        <span style={{ color: C.mint }}>S</span><span className="text-white">mart</span>
      </h1>
      <p className="text-sm mt-2 text-white/60" style={{ fontFamily: "Inter, sans-serif" }}>
        Make Smarter Financial Decisions
      </p>
      <div className="mt-12 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-2 h-2 rounded-full"
            style={{ background: "rgba(255,255,255,0.4)", animation: `pulse 1.2s infinite ${i * 0.2}s` }} />
        ))}
      </div>
    </div>
  );
}

// ── ONBOARDING ────────────────────────────────────────────
const slides = [
  { emoji: "📷", title: "Catat Otomatis", desc: "Scan struk belanja kamu, biarkan AI membaca dan mencatat transaksi secara otomatis.", color: C.teal },
  { emoji: "🤖", title: "Prediksi AI", desc: "Dapatkan prediksi pengeluaran dan tips hemat personal dari FinanSmart AI.", color: "#7C5CBF" },
  { emoji: "🔒", title: "Aman & Privat", desc: "Login dengan Face Recognition — wajahmu adalah kunci, data kamu terlindungi.", color: C.navy },
];

function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const [slide, setSlide] = useState(0);
  const s = slides[slide];
  return (
    <div className="flex flex-col h-full" style={{ background: C.bg }}>
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="w-36 h-36 rounded-3xl flex items-center justify-center text-6xl mb-8" style={{ background: s.color + "18" }}>
          {s.emoji}
        </div>
        <h2 className="text-2xl font-bold mb-4" style={{ color: C.navy, fontFamily: "Plus Jakarta Sans, sans-serif" }}>{s.title}</h2>
        <p className="text-sm leading-relaxed" style={{ color: C.gray, fontFamily: "Inter, sans-serif" }}>{s.desc}</p>
      </div>
      <div className="px-6 pb-10">
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, i) => (
            <div key={i} onClick={() => setSlide(i)} className="rounded-full transition-all cursor-pointer"
              style={{ width: i === slide ? 24 : 8, height: 8, background: i === slide ? C.teal : C.divider }} />
          ))}
        </div>
        {slide < 2 ? (
          <div className="flex gap-3">
            <button onClick={onDone} className="flex-1 py-3.5 rounded-full text-sm font-medium"
              style={{ border: `1.5px solid ${C.teal}`, color: C.teal, background: "transparent", fontFamily: "Inter, sans-serif" }}>
              Lewati
            </button>
            <button onClick={() => setSlide((p) => p + 1)} className="flex-1 py-3.5 rounded-full text-sm font-semibold text-white"
              style={{ background: C.teal, fontFamily: "Inter, sans-serif" }}>
              Lanjut →
            </button>
          </div>
        ) : (
          <button onClick={onDone} className="w-full py-4 rounded-full text-base font-semibold text-white"
            style={{ background: C.teal, fontFamily: "Inter, sans-serif" }}>
            Mulai Sekarang ✨
          </button>
        )}
      </div>
    </div>
  );
}

// ── LOGIN ─────────────────────────────────────────────────
function LoginScreen({ onLogin, onRegister }: { onLogin: () => void; onRegister: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [faceMode, setFaceMode] = useState(false);
  const [faceState, setFaceState] = useState<"idle" | "scanning" | "success" | "fail">("idle");

  const validate = () => {
    const e: typeof errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Format email tidak valid (contoh: budi@gmail.com)";
    if (!password) e.password = "Password wajib diisi";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFaceScan = () => {
    setFaceMode(true);
    setFaceState("scanning");
    setTimeout(() => { setFaceState("success"); setTimeout(onLogin, 900); }, 2800);
  };

  if (faceMode) {
    return (
      <div className="flex flex-col items-center justify-between h-full py-16 px-8 relative" style={{ background: "#0a1520" }}>
        <button onClick={() => { setFaceMode(false); setFaceState("idle"); }} className="absolute top-12 left-6">
          <ChevronLeft size={28} color="rgba(255,255,255,0.7)" />
        </button>
        <div className="text-center">
          <p className="text-white text-xl font-bold" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            {faceState === "success" ? "Wajah Dikenali! 🎉" : faceState === "fail" ? "Gagal Mengenali" : "Scan Wajah"}
          </p>
          <p className="text-white/50 text-sm mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
            {faceState === "scanning" ? "Mendeteksi wajah... pastikan pencahayaan cukup"
              : faceState === "success" ? "Selamat datang, Budi!"
              : faceState === "fail" ? "Wajah tidak dikenali. Coba lagi atau gunakan password."
              : "Arahkan wajah ke dalam lingkaran"}
          </p>
        </div>
        <div className="relative">
          {faceState === "scanning" && (
            <div className="absolute inset-0 rounded-full border-2 border-dashed"
              style={{ borderColor: C.teal, animation: "spin 3s linear infinite" }} />
          )}
          <div className="w-56 h-56 rounded-full border-4 flex items-center justify-center transition-all duration-500"
            style={{ borderColor: faceState === "success" ? C.mint : faceState === "fail" ? C.coral : C.teal, background: "rgba(15,157,124,0.08)" }}>
            {faceState === "success" ? <Check size={72} color={C.mint} strokeWidth={2} />
              : faceState === "fail" ? <X size={72} color={C.coral} strokeWidth={2} />
              : <User size={72} color="rgba(255,255,255,0.2)" strokeWidth={1} />}
          </div>
          {faceState === "scanning" && (
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-40">
              <div className="h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                <div className="h-full rounded-full" style={{ background: C.teal, animation: "progress 2.8s linear forwards" }} />
              </div>
            </div>
          )}
        </div>
        <div className="w-full space-y-3">
          {faceState === "fail" && (
            <>
              <button onClick={() => { setFaceState("scanning"); setTimeout(() => { setFaceState("success"); setTimeout(onLogin, 900); }, 2500); }}
                className="w-full py-4 rounded-full text-base font-semibold text-white flex items-center justify-center gap-2"
                style={{ background: C.teal, fontFamily: "Inter, sans-serif" }}>
                <RefreshCw size={18} /> Coba Lagi
              </button>
              <button onClick={() => setFaceMode(false)}
                className="w-full py-3 rounded-full text-sm font-medium"
                style={{ border: "1.5px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)", background: "transparent", fontFamily: "Inter, sans-serif" }}>
                Masuk dengan Password
              </button>
            </>
          )}
          {(faceState === "idle" || faceState === "scanning") && (
            <p className="text-center text-xs" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "Inter, sans-serif" }}>
              Pastikan pencahayaan cukup · Lepas kacamata jika perlu
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" style={{ background: C.bg }}>
      <div className="px-6 pt-14 pb-10 text-center"
        style={{ background: `linear-gradient(160deg, ${C.teal} 0%, ${C.navy} 100%)` }}>
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
          <span style={{ color: C.mint }}>F</span>inan<span style={{ color: C.mint }}>S</span>mart
        </h1>
        <p className="text-white/60 text-sm mt-1" style={{ fontFamily: "Inter, sans-serif" }}>Selamat datang kembali 👋</p>
      </div>
      <div className="flex-1 px-6 pt-8 pb-6 overflow-y-auto">
        <div className="mb-4">
          <label className="text-xs font-semibold mb-1.5 block" style={{ color: C.gray, fontFamily: "Inter, sans-serif" }}>Email</label>
          <input type="email" placeholder="kamu@email.com" value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ background: C.white, border: `1.5px solid ${errors.email ? C.coral : C.divider}`, color: C.navy, fontFamily: "Inter, sans-serif" }} />
          {errors.email && <p className="text-xs mt-1 font-medium" style={{ color: C.coral, fontFamily: "Inter, sans-serif" }}>{errors.email}</p>}
        </div>
        <div className="mb-4">
          <label className="text-xs font-semibold mb-1.5 block" style={{ color: C.gray, fontFamily: "Inter, sans-serif" }}>Password</label>
          <input type="password" placeholder="••••••••" value={password}
            onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ background: C.white, border: `1.5px solid ${errors.password ? C.coral : C.divider}`, color: C.navy, fontFamily: "Inter, sans-serif" }} />
          {errors.password && <p className="text-xs mt-1 font-medium" style={{ color: C.coral, fontFamily: "Inter, sans-serif" }}>{errors.password}</p>}
        </div>
        <button onClick={() => validate() && onLogin()} className="w-full py-4 rounded-full text-base font-semibold text-white mb-3 mt-2"
          style={{ background: C.teal, fontFamily: "Inter, sans-serif" }}>
          Masuk
        </button>
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px" style={{ background: C.divider }} />
          <span className="text-xs" style={{ color: C.gray, fontFamily: "Inter, sans-serif" }}>atau</span>
          <div className="flex-1 h-px" style={{ background: C.divider }} />
        </div>
        <button onClick={handleFaceScan}
          className="w-full py-4 rounded-full text-base font-semibold flex items-center justify-center gap-2 mb-6"
          style={{ border: `1.5px solid ${C.teal}`, color: C.teal, background: "transparent", fontFamily: "Inter, sans-serif" }}>
          <Scan size={18} /> Masuk dengan Wajah
        </button>
        <p className="text-center text-sm" style={{ color: C.gray, fontFamily: "Inter, sans-serif" }}>
          Belum punya akun?{" "}
          <button onClick={onRegister} style={{ color: C.teal, fontWeight: 700 }}>Daftar</button>
        </p>
      </div>
    </div>
  );
}

// ── REGISTER ──────────────────────────────────────────────
function RegisterScreen({ onDone, onBack }: { onDone: () => void; onBack: () => void }) {
  return (
    <div className="flex flex-col h-full" style={{ background: C.bg }}>
      <div className="flex items-center px-5 pt-12 pb-4">
        <button onClick={onBack} style={{ color: C.navy }}><ChevronLeft size={26} /></button>
        <h2 className="text-lg font-bold ml-3" style={{ color: C.navy, fontFamily: "Plus Jakarta Sans, sans-serif" }}>Buat Akun Baru</h2>
      </div>
      <div className="flex-1 px-6 pt-2 overflow-y-auto">
        {[["Nama Lengkap", "text", "Budi Santoso"], ["Email", "email", "budi@email.com"], ["Password", "password", ""], ["Konfirmasi Password", "password", ""]].map(([label, type, ph]) => (
          <div key={label} className="mb-4">
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: C.gray, fontFamily: "Inter, sans-serif" }}>{label}</label>
            <input type={type} placeholder={ph || "••••••••"}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: C.white, border: `1.5px solid ${C.divider}`, color: C.navy, fontFamily: "Inter, sans-serif" }} />
          </div>
        ))}
        <button onClick={onDone} className="w-full py-4 rounded-full text-base font-semibold text-white mt-4"
          style={{ background: C.teal, fontFamily: "Inter, sans-serif" }}>
          Daftar & Setup Face Recognition
        </button>
      </div>
    </div>
  );
}

// ── FACE SETUP ────────────────────────────────────────────
function FaceSetupScreen({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState<"idle" | "scanning" | "done">("idle");
  const dark = step !== "idle";
  return (
    <div className="flex flex-col h-full items-center justify-between py-14 px-6"
      style={{ background: dark ? "#0a1520" : C.bg, transition: "background 0.5s" }}>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2" style={{ color: dark ? C.white : C.navy, fontFamily: "Plus Jakarta Sans, sans-serif" }}>
          {step === "done" ? "Wajah Terdaftar! 🎉" : "Setup Face Recognition"}
        </h2>
        <p className="text-sm" style={{ color: dark ? "rgba(255,255,255,0.5)" : C.gray, fontFamily: "Inter, sans-serif" }}>
          {step === "idle" ? "Posisikan wajah di dalam lingkaran.\nPastikan pencahayaan cukup, lepas kacamata jika perlu."
            : step === "scanning" ? "Mendeteksi wajah..." : "Wajah berhasil didaftarkan!"}
        </p>
      </div>
      <div className="relative flex items-center justify-center">
        {step === "scanning" && (
          <div className="absolute w-64 h-64 rounded-full border-2 border-dashed"
            style={{ borderColor: C.teal, animation: "spin 3s linear infinite" }} />
        )}
        <div className="w-56 h-56 rounded-full border-4 flex items-center justify-center transition-all duration-500"
          style={{ borderColor: step === "done" ? C.mint : C.teal, background: "rgba(15,157,124,0.08)" }}>
          {step === "done" ? <Check size={72} color={C.mint} strokeWidth={2.5} />
            : <User size={72} color={dark ? "rgba(255,255,255,0.2)" : C.gray} strokeWidth={1} />}
        </div>
      </div>
      <div className="w-full">
        {step === "idle" && (
          <button onClick={() => { setStep("scanning"); setTimeout(() => setStep("done"), 3000); }}
            className="w-full py-4 rounded-full text-base font-semibold text-white"
            style={{ background: C.teal, fontFamily: "Inter, sans-serif" }}>
            Mulai Deteksi Wajah
          </button>
        )}
        {step === "scanning" && (
          <div className="flex justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-2.5 h-2.5 rounded-full"
                style={{ background: C.mint, animation: `bounce 0.9s infinite ${i * 0.15}s` }} />
            ))}
          </div>
        )}
        {step === "done" && (
          <button onClick={onDone} className="w-full py-4 rounded-full text-base font-semibold text-white"
            style={{ background: C.teal, fontFamily: "Inter, sans-serif" }}>
            Lanjut ke App 🚀
          </button>
        )}
      </div>
    </div>
  );
}

// ── BOTTOM NAV ────────────────────────────────────────────
const navItems: { id: Tab; label: string; Icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }> }[] = [
  { id: "home", label: "Home", Icon: Home },
  { id: "manage", label: "Kelola", Icon: LayoutList },
  { id: "chat", label: "AI Chat", Icon: Bot },
  { id: "analytics", label: "Analitik", Icon: BarChart2 },
  { id: "settings", label: "Setelan", Icon: Settings },
];

function BottomNav({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <div className="flex items-center justify-around px-1 py-2"
      style={{ background: C.white, borderTop: `1px solid ${C.divider}` }}>
      {navItems.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button key={id} onClick={() => onChange(id)} className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl"
            style={{ minWidth: 58 }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: isActive ? C.tealLight : "transparent" }}>
              <Icon size={20} color={isActive ? C.teal : C.gray} strokeWidth={isActive ? 2.5 : 1.8} />
            </div>
            <span className="text-[10px] font-medium" style={{ color: isActive ? C.teal : C.gray, fontFamily: "Inter, sans-serif" }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ── TRANSACTION SHEET (with H5/H9 validation) ─────────────
function TransactionSheet({ onClose, onSave, prefill, showToast }: {
  onClose: () => void; onSave: () => void; prefill?: TxItem | null; showToast: (msg: string) => void;
}) {
  const [type, setType] = useState<"income" | "expense">(prefill ? "income" : "expense");
  const [category, setCategory] = useState(prefill?.category ?? "");
  const [amount, setAmount] = useState(prefill ? String(prefill.amount) : "");
  const [note, setNote] = useState(prefill?.desc ?? "");
  const [errs, setErrs] = useState<{ amount?: boolean; category?: boolean }>({});

  const incCats = [
    { l: "Gaji", e: "💼", color: C.teal },
    { l: "Uang Saku", e: "💰", color: "#F59E0B" },
    { l: "Beasiswa", e: "🎓", color: "#7C5CBF" },
    { l: "Lainnya", e: "📦", color: C.gray },
  ];
  const expCats = [
    { l: "Makan & Minum", e: "🍜", color: C.teal },
    { l: "Hiburan", e: "🎬", color: C.coral },
    { l: "Transportasi", e: "🚌", color: C.mint },
    { l: "Rumah Tangga", e: "🏠", color: "#F59E0B" },
    { l: "Kesehatan", e: "💊", color: "#7C5CBF" },
    { l: "Kuliah", e: "📚", color: "#3B82F6" },
    { l: "Lainnya", e: "📦", color: C.gray },
  ];
  const cats = type === "income" ? incCats : expCats;

  const handleSave = () => {
    const e: typeof errs = {};
    if (!amount || Number(amount) <= 0) e.amount = true;
    if (!category) e.category = true;
    if (Object.keys(e).length > 0) { setErrs(e); return; }
    onSave();
    showToast("Transaksi berhasil disimpan! 🎉");
    onClose();
  };

  return (
    <div className="absolute inset-0 flex flex-col justify-end z-40"
      style={{ background: "rgba(11,31,51,0.5)" }} onClick={onClose}>
      <div className="rounded-t-3xl px-5 pt-4 pb-8 max-h-[85%] overflow-y-auto"
        style={{ background: C.white }} onClick={(e) => e.stopPropagation()}>
        <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: C.divider }} />
        <div className="flex items-center justify-between mb-4">
          <p className="text-base font-bold" style={{ color: C.navy, fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            {prefill ? "Edit Transaksi" : "Tambah Transaksi"}
          </p>
          <button onClick={onClose}><X size={20} color={C.gray} /></button>
        </div>

        <div className="flex rounded-xl p-1 mb-4" style={{ background: C.bg }}>
          {(["income", "expense"] as const).map((t) => (
            <button key={t} onClick={() => { setType(t); setCategory(""); setErrs({}); }}
              className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{ background: type === t ? (t === "income" ? C.teal : C.coral) : "transparent", color: type === t ? C.white : C.gray, fontFamily: "Inter, sans-serif" }}>
              {t === "income" ? "📥 Pemasukan" : "📤 Pengeluaran"}
            </button>
          ))}
        </div>

        <div className="space-y-3 mb-3">
          <input type="date" className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ background: C.bg, border: `1px solid ${C.divider}`, color: C.navy, fontFamily: "Inter, sans-serif" }} />

          <div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: C.gray }}>Rp</span>
              <input type="number" inputMode="numeric" placeholder="0" value={amount}
                onChange={(e) => { setAmount(e.target.value); setErrs((p) => ({ ...p, amount: false })); }}
                className="w-full pl-12 pr-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: C.bg, border: `1.5px solid ${errs.amount ? C.coral : C.divider}`, color: C.navy, fontFamily: "Inter, sans-serif" }} />
            </div>
            {errs.amount && <p className="text-xs mt-1 font-medium" style={{ color: C.coral, fontFamily: "Inter, sans-serif" }}>Nominal wajib diisi</p>}
          </div>
        </div>

        <p className="text-xs font-semibold mb-2" style={{ color: errs.category ? C.coral : C.gray, fontFamily: "Inter, sans-serif" }}>
          Kategori {errs.category && <span style={{ color: C.coral }}>— wajib dipilih</span>}
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {cats.map(({ l, e, color }) => (
            <button key={l} onClick={() => { setCategory(l); setErrs((p) => ({ ...p, category: false })); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                background: category === l ? color : C.tealLight,
                color: category === l ? C.white : C.teal,
                border: errs.category && !category ? `1.5px solid ${C.coral}` : "none",
                fontFamily: "Inter, sans-serif",
              }}>
              {e} {l}
            </button>
          ))}
        </div>

        <textarea placeholder="Catatan (opsional)" rows={2} value={note} onChange={(e) => setNote(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none mb-4"
          style={{ background: C.bg, border: `1px solid ${C.divider}`, color: C.navy, fontFamily: "Inter, sans-serif" }} />

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3.5 rounded-full text-sm font-semibold"
            style={{ border: `1.5px solid ${C.divider}`, color: C.gray, background: "transparent", fontFamily: "Inter, sans-serif" }}>
            Batalkan
          </button>
          <button onClick={handleSave} className="flex-1 py-3.5 rounded-full text-sm font-semibold text-white"
            style={{ background: C.teal, fontFamily: "Inter, sans-serif" }}>
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

// ── HOME TAB ──────────────────────────────────────────────
function HomeTab({ showToast, onScanStruk }: { showToast: (m: string) => void; onScanStruk: () => void }) {
  const [hidden, setHidden] = useState(false);
  const [filter, setFilter] = useState("1 Bulan");
  const [showSheet, setShowSheet] = useState(false);
  const filters = ["1 Hari", "1 Minggu", "1 Bulan", "1 Tahun", "Semua"];
  const data = chartData[filter];

  return (
    <div className="flex flex-col h-full relative" style={{ background: C.bg }}>
      <div className="px-5 pt-12 pb-5" style={{ background: `linear-gradient(160deg, ${C.teal} 0%, ${C.navy} 100%)` }}>
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            <span style={{ color: C.mint }}>F</span>inan<span style={{ color: C.mint }}>S</span>mart
          </h1>
          <div className="flex gap-3">
            <button onClick={() => setHidden((h) => !h)} title={hidden ? "Tampilkan saldo" : "Sembunyikan saldo"}>
              {hidden ? <EyeOff size={20} color="rgba(255,255,255,0.75)" /> : <Eye size={20} color="rgba(255,255,255,0.75)" />}
            </button>
            <button><Bell size={20} color="rgba(255,255,255,0.75)" /></button>
          </div>
        </div>
        <p className="text-white/60 text-sm mb-3" style={{ fontFamily: "Inter, sans-serif" }}>Halo, Budi 👋</p>
        <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)" }}>
          <p className="text-white/60 text-xs mb-1" style={{ fontFamily: "Inter, sans-serif" }}>Total Saldo</p>
          <p className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "Inter, sans-serif", fontVariantNumeric: "tabular-nums" }}>
            {hidden ? "Rp ••••••••" : "Rp 1.300.000"}
          </p>
          <div className="flex gap-3">
            {[
              { label: "Hari Ini Masuk", amount: "Rp 250.000", color: C.mint, icon: TrendingUp, bg: "rgba(95,217,180,0.2)" },
              { label: "Hari Ini Keluar", amount: "Rp 110.000", color: C.coral, icon: TrendingDown, bg: "rgba(255,107,94,0.2)" },
            ].map(({ label, amount, color, icon: Icon, bg }) => (
              <div key={label} className="flex-1 rounded-xl p-3" style={{ background: bg }}>
                <div className="flex items-center gap-1 mb-1">
                  <Icon size={12} color={color} />
                  <span className="text-[10px] text-white/60" style={{ fontFamily: "Inter, sans-serif" }}>{label}</span>
                </div>
                <p className="text-sm font-bold" style={{ color, fontFamily: "Inter, sans-serif" }}>
                  {hidden ? "••••••" : amount}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-28 space-y-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {filters.map((f) => <PillButton key={f} active={filter === f} onClick={() => setFilter(f)}>{f}</PillButton>)}
        </div>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold" style={{ color: C.navy, fontFamily: "Plus Jakarta Sans, sans-serif" }}>Statistik Overview</p>
            <div className="flex gap-3">
              {[{ c: C.mint, l: "Masuk" }, { c: C.coral, l: "Keluar" }].map(({ c, l }) => (
                <div key={l} className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                  <span className="text-[10px]" style={{ color: C.gray, fontFamily: "Inter, sans-serif" }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={data} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: C.gray }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: C.gray }} axisLine={false} tickLine={false}
                tickFormatter={(v) => v >= 1000000 ? `${v / 1000000}jt` : `${v / 1000}rb`} />
              <Tooltip contentStyle={{ background: C.navy, border: "none", borderRadius: 8, color: C.white, fontSize: 11 }}
                formatter={(v: number) => [formatRp(v), ""]} />
              <Area type="monotone" dataKey="outcome" stroke={C.coral} strokeWidth={2} fill={C.coral} fillOpacity={0.15} />
              <Area type="monotone" dataKey="income" stroke={C.mint} strokeWidth={2.5} fill={C.mint} fillOpacity={0.25} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold" style={{ color: C.navy, fontFamily: "Plus Jakarta Sans, sans-serif" }}>Aktivitas Hari Ini</p>
            <button className="text-xs font-medium" style={{ color: C.teal, fontFamily: "Inter, sans-serif" }}>Lihat Semua</button>
          </div>
          {recentActivity.map((item) => (
            <div key={item.id} className="flex items-center gap-3 py-3" style={{ borderBottom: `1px solid ${C.divider}` }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: item.type === "income" ? C.tealLight : "#FFF0EF" }}>
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: C.navy, fontFamily: "Inter, sans-serif" }}>{item.name}</p>
                <p className="text-xs" style={{ color: C.gray, fontFamily: "Inter, sans-serif" }}>{item.time}</p>
              </div>
              <p className="text-sm font-bold" style={{ color: item.type === "income" ? C.teal : C.coral, fontFamily: "Inter, sans-serif" }}>
                {item.amount > 0 ? "+" : ""}{formatRp(item.amount)}
              </p>
            </div>
          ))}
        </Card>
      </div>

      {/* FAB */}
      <button onClick={() => setShowSheet(true)}
        className="absolute bottom-24 right-5 w-14 h-14 rounded-full flex items-center justify-center z-30 border-0 outline-none"
        style={{ backgroundColor: C.teal, boxShadow: "0 6px 24px rgba(15,157,124,0.5)", border: "none" }}>
        <Plus size={26} color="#ffffff" strokeWidth={2.5} />
      </button>

      {showSheet && <TransactionSheet onClose={() => setShowSheet(false)} onSave={() => {}} showToast={showToast} />}
    </div>
  );
}

// ── MANAGE TAB ────────────────────────────────────────────
function ManageTab({ showToast, onScanStruk }: { showToast: (m: string) => void; onScanStruk: () => void }) {
  const [activeTab, setActiveTab] = useState<"income" | "expense">("income");
  const [search, setSearch] = useState("");
  const [incomeList, setIncomeList] = useState(initialIncome);
  const [expenseList, setExpenseList] = useState(initialExpense);
  const [swipedId, setSwipedId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TxItem | null>(null);
  const [editTarget, setEditTarget] = useState<TxItem | null>(null);
  const [showAddSheet, setShowAddSheet] = useState(false);

  const list = activeTab === "income" ? incomeList : expenseList;
  const setList = activeTab === "income" ? setIncomeList : setExpenseList;
  const filtered = list.filter((i) =>
    i.category.toLowerCase().includes(search.toLowerCase()) ||
    i.desc.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (item: TxItem) => {
    setList((prev) => prev.filter((i) => i.id !== item.id));
    setDeleteTarget(null);
    showToast("Transaksi berhasil dihapus");
  };

  return (
    <div className="flex flex-col h-full" style={{ background: C.bg }}>
      <div className="px-5 pt-12 pb-4" style={{ background: C.white, borderBottom: `1px solid ${C.divider}` }}>
        <h2 className="text-xl font-bold mb-3" style={{ color: C.navy, fontFamily: "Plus Jakarta Sans, sans-serif" }}>Kelola Transaksi</h2>
        <div className="flex rounded-xl p-1 mb-3" style={{ background: C.bg }}>
          {(["income", "expense"] as const).map((t) => (
            <button key={t} onClick={() => setActiveTab(t)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all"
              style={{ background: activeTab === t ? (t === "income" ? C.teal : C.coral) : "transparent", color: activeTab === t ? C.white : C.gray, fontFamily: "Inter, sans-serif" }}>
              {t === "income" ? "📥 Pemasukan" : "📤 Pengeluaran"}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: C.bg, border: `1px solid ${C.divider}` }}>
            <Search size={15} color={C.gray} />
            <input placeholder="Cari transaksi..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm outline-none bg-transparent" style={{ color: C.navy, fontFamily: "Inter, sans-serif" }} />
            {search && <button onClick={() => setSearch("")}><X size={14} color={C.gray} /></button>}
          </div>
          <button className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: C.tealLight }}>
            <Filter size={16} color={C.teal} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-1 pb-40">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-sm font-semibold mb-1" style={{ color: C.navy, fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              {search ? "Tidak ada transaksi ditemukan" : `Belum ada ${activeTab === "income" ? "pemasukan" : "pengeluaran"}`}
            </p>
            <p className="text-xs mb-4" style={{ color: C.gray, fontFamily: "Inter, sans-serif" }}>
              {search ? "Coba kata kunci lain" : "Mulai catat transaksi pertamamu"}
            </p>
            {!search && (
              <button onClick={() => setShowAddSheet(true)}
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-white"
                style={{ background: C.teal, fontFamily: "Inter, sans-serif" }}>
                + Tambah Sekarang
              </button>
            )}
          </div>
        ) : (
          filtered.map((item) => (
            <SwipeableItem key={item.id} item={item} type={activeTab}
              swipedId={swipedId} setSwipedId={setSwipedId}
              onEdit={(it) => setEditTarget(it)} onDelete={(it) => setDeleteTarget(it)} />
          ))
        )}
      </div>

      <div className="absolute bottom-20 left-0 right-0 px-5 py-3 space-y-2"
        style={{ background: C.white, borderTop: `1px solid ${C.divider}` }}>
        <button onClick={() => setShowAddSheet(true)}
          className="w-full py-3.5 rounded-full text-sm font-semibold text-white flex items-center justify-center gap-2"
          style={{ background: C.teal, fontFamily: "Inter, sans-serif" }}>
          <Plus size={16} /> {activeTab === "income" ? "Tambah Pemasukan" : "Tambah Pengeluaran"}
        </button>
        <button onClick={onScanStruk}
          className="w-full py-3 rounded-full text-sm font-semibold flex items-center justify-center gap-2"
          style={{ border: `1.5px solid ${C.teal}`, color: C.teal, background: "transparent", fontFamily: "Inter, sans-serif" }}>
          <Camera size={16} /> Scan Struk
        </button>
      </div>

      {showAddSheet && <TransactionSheet onClose={() => setShowAddSheet(false)} onSave={() => {}} showToast={showToast} />}
      {editTarget && <TransactionSheet prefill={editTarget} onClose={() => setEditTarget(null)} onSave={() => {}} showToast={showToast} />}

      {deleteTarget && (
        <ConfirmDialog
          title="Hapus Transaksi?"
          desc="Yakin hapus transaksi ini? Aksi ini tidak bisa dibatalkan."
          confirmLabel="Ya, Hapus" cancelLabel="Batalkan"
          onConfirm={() => handleDelete(deleteTarget)}
          onCancel={() => setDeleteTarget(null)} />
      )}
    </div>
  );
}

// ── OCR SCAN FLOW (H1: percentage, H9: fail state) ────────
function OcrFlow({ onClose, showToast }: { onClose: () => void; showToast: (m: string) => void }) {
  const [step, setStep] = useState<OcrStep>("method");
  const [pct, setPct] = useState(0);
  const [ocrItems, setOcrItems] = useState(ocrResultItems.map((i) => ({ ...i })));

  // H1: percentage counter during loading
  useEffect(() => {
    if (step !== "loading") { setPct(0); return; }
    const timer = setInterval(() => {
      setPct((p) => {
        const next = p + Math.floor(Math.random() * 9) + 3;
        if (next >= 100) { clearInterval(timer); return 100; }
        return next;
      });
    }, 80);
    return () => clearInterval(timer);
  }, [step]);

  useEffect(() => {
    if (pct >= 100) setTimeout(() => setStep("review"), 500);
  }, [pct]);

  const total = ocrItems.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="absolute inset-0 z-50 flex flex-col" style={{ background: C.bg }}>
      <div className="flex items-center gap-3 px-5 pt-12 pb-4" style={{ background: C.white, borderBottom: `1px solid ${C.divider}` }}>
        <button onClick={step === "method" ? onClose : () => setStep("method")} style={{ color: C.navy }}>
          <ChevronLeft size={26} />
        </button>
        <p className="text-base font-bold" style={{ color: C.navy, fontFamily: "Plus Jakarta Sans, sans-serif" }}>
          {step === "method" ? "Scan Struk" : step === "camera" ? "Arahkan Kamera" : step === "loading" ? `Memproses... ${pct}%` : step === "fail" ? "Gagal Membaca" : "Review Hasil"}
        </p>
      </div>

      {step === "method" && (
        <div className="flex-1 flex flex-col justify-center px-6 gap-4">
          <p className="text-sm text-center mb-2" style={{ color: C.gray, fontFamily: "Inter, sans-serif" }}>
            Pilih cara input struk belanjaan kamu
          </p>
          {[
            { icon: <Camera size={32} color={C.teal} />, label: "Ambil Foto Struk", sub: "Buka kamera untuk foto langsung", action: () => setStep("camera") },
            { icon: <ImageIcon size={32} color="#7C5CBF" />, label: "Upload dari Galeri", sub: "Pilih foto dari galeri HP", action: () => setStep("loading") },
          ].map(({ icon, label, sub, action }) => (
            <button key={label} onClick={action}
              className="flex items-center gap-4 p-5 rounded-2xl text-left"
              style={{ background: C.white, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: `1.5px solid ${C.divider}` }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: C.tealLight }}>{icon}</div>
              <div>
                <p className="text-sm font-bold" style={{ color: C.navy, fontFamily: "Plus Jakarta Sans, sans-serif" }}>{label}</p>
                <p className="text-xs" style={{ color: C.gray, fontFamily: "Inter, sans-serif" }}>{sub}</p>
              </div>
              <ChevronRight size={18} color={C.gray} style={{ marginLeft: "auto" }} />
            </button>
          ))}
          <button onClick={onClose} className="mt-2 py-3 rounded-full text-sm font-medium"
            style={{ border: `1.5px solid ${C.divider}`, color: C.gray, background: "transparent", fontFamily: "Inter, sans-serif" }}>
            Batalkan
          </button>
        </div>
      )}

      {step === "camera" && (
        <div className="flex-1 flex flex-col items-center justify-between py-8 px-6" style={{ background: "#0a1520" }}>
          <p className="text-white/70 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>Posisikan struk di dalam bingkai</p>
          <div className="relative w-full" style={{ aspectRatio: "3/4", maxHeight: 340 }}>
            <div className="absolute inset-0 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "2px dashed rgba(255,255,255,0.2)" }} />
            {["tl", "tr", "bl", "br"].map((pos) => (
              <div key={pos} className="absolute w-8 h-8"
                style={{
                  top: pos.startsWith("t") ? 0 : "auto", bottom: pos.startsWith("b") ? 0 : "auto",
                  left: pos.endsWith("l") ? 0 : "auto", right: pos.endsWith("r") ? 0 : "auto",
                  borderColor: C.teal, borderStyle: "solid", borderRadius: 4,
                  borderWidth: `${pos.startsWith("t") ? 3 : 0}px ${pos.endsWith("r") ? 3 : 0}px ${pos.startsWith("b") ? 3 : 0}px ${pos.endsWith("l") ? 3 : 0}px`,
                }} />
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white/30 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>📄 Area Struk</p>
            </div>
          </div>
          <div className="flex gap-4 w-full">
            <button onClick={onClose} className="flex-1 py-3.5 rounded-full text-sm font-medium"
              style={{ border: "1.5px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)", background: "transparent", fontFamily: "Inter, sans-serif" }}>
              Batalkan
            </button>
            <button onClick={() => setStep("loading")}
              className="flex-1 py-3.5 rounded-full text-sm font-semibold text-white flex items-center justify-center gap-2"
              style={{ background: C.teal, fontFamily: "Inter, sans-serif" }}>
              <Camera size={16} /> Ambil Foto
            </button>
          </div>
        </div>
      )}

      {step === "loading" && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mb-8" style={{ background: C.tealLight }}>
            <Sparkles size={40} color={C.teal} style={{ animation: "pulse 1s infinite" }} />
          </div>
          <h3 className="text-lg font-bold mb-2" style={{ color: C.navy, fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            AI Membaca Struk ✨
          </h3>
          <p className="text-sm mb-6" style={{ color: C.gray, fontFamily: "Inter, sans-serif" }}>Ini mungkin butuh beberapa detik...</p>

          {/* H1: Progress percentage */}
          <div className="w-full mb-3">
            <div className="flex justify-between mb-1.5">
              <span className="text-xs font-medium" style={{ color: C.teal, fontFamily: "Inter, sans-serif" }}>Memproses struk...</span>
              <span className="text-xs font-bold" style={{ color: C.teal, fontFamily: "Inter, sans-serif" }}>{pct}%</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: C.divider }}>
              <div className="h-full rounded-full transition-all duration-100"
                style={{ width: `${pct}%`, background: C.teal }} />
            </div>
          </div>
          <p className="text-xs" style={{ color: C.gray, fontFamily: "Inter, sans-serif" }}>
            {pct < 30 ? "Mendeteksi area teks..." : pct < 60 ? "Membaca nama item..." : pct < 90 ? "Mencocokkan harga..." : "Menyimpan hasil..."}
          </p>
        </div>
      )}

      {/* H9: OCR fail state */}
      {step === "fail" && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ background: "#FFF0EF" }}>
            <AlertTriangle size={36} color={C.coral} />
          </div>
          <h3 className="text-lg font-bold mb-2" style={{ color: C.navy, fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            Foto Kurang Jelas
          </h3>
          <p className="text-sm mb-8 leading-relaxed" style={{ color: C.gray, fontFamily: "Inter, sans-serif" }}>
            AI tidak bisa membaca struk dengan jelas. Pastikan foto tidak buram, pencahayaan cukup, dan seluruh struk terlihat.
          </p>
          <div className="flex flex-col gap-3 w-full">
            <button onClick={() => setStep("camera")}
              className="w-full py-4 rounded-full text-base font-semibold text-white flex items-center justify-center gap-2"
              style={{ background: C.teal, fontFamily: "Inter, sans-serif" }}>
              <Camera size={18} /> Foto Ulang
            </button>
            <button onClick={onClose} className="w-full py-3 rounded-full text-sm font-medium"
              style={{ border: `1.5px solid ${C.divider}`, color: C.gray, background: "transparent", fontFamily: "Inter, sans-serif" }}>
              Batalkan
            </button>
          </div>
        </div>
      )}

      {step === "review" && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3" style={{ background: C.tealLight }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: C.white }}>🧾</div>
            <div>
              <p className="text-sm font-bold" style={{ color: C.navy, fontFamily: "Plus Jakarta Sans, sans-serif" }}>Warteg Bu Sari</p>
              <p className="text-xs" style={{ color: C.gray, fontFamily: "Inter, sans-serif" }}>23 Jun 2024 · {ocrItems.length} item terdeteksi</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-3">
            <p className="text-xs font-semibold mb-3" style={{ color: C.gray, fontFamily: "Inter, sans-serif" }}>
              Periksa dan edit jika ada yang tidak tepat:
            </p>
            {ocrItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-3" style={{ borderBottom: `1px solid ${C.divider}` }}>
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: C.navy, fontFamily: "Inter, sans-serif" }}>{item.name}</p>
                  <p className="text-xs" style={{ color: C.gray, fontFamily: "Inter, sans-serif" }}>{item.category}</p>
                </div>
                <p className="text-sm font-bold" style={{ color: C.navy, fontFamily: "Inter, sans-serif" }}>{formatRp(item.amount)}</p>
                <button onClick={() => setOcrItems((prev) => prev.filter((i) => i.id !== item.id))}
                  className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#FFF0EF" }}>
                  <X size={14} color={C.coral} />
                </button>
              </div>
            ))}
            <button className="mt-3 flex items-center gap-2 text-xs font-semibold" style={{ color: C.teal, fontFamily: "Inter, sans-serif" }}>
              <Plus size={14} /> Tambah Item Manual
            </button>
          </div>

          <div className="px-5 py-4" style={{ background: C.white, borderTop: `1px solid ${C.divider}` }}>
            <div className="flex justify-between mb-4">
              <p className="text-sm font-semibold" style={{ color: C.navy, fontFamily: "Inter, sans-serif" }}>Total</p>
              <p className="text-base font-bold" style={{ color: C.teal, fontFamily: "Inter, sans-serif" }}>{formatRp(total)}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-3.5 rounded-full text-sm font-semibold"
                style={{ border: `1.5px solid ${C.divider}`, color: C.gray, background: "transparent", fontFamily: "Inter, sans-serif" }}>
                Batalkan
              </button>
              <button onClick={() => { showToast("Transaksi berhasil disimpan! 🎉"); onClose(); }}
                className="flex-1 py-3.5 rounded-full text-sm font-semibold text-white flex items-center justify-center gap-2"
                style={{ background: C.teal, fontFamily: "Inter, sans-serif" }}>
                <Check size={16} /> Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── CHAT TAB (H1: typing indicator, H10: cara pakai) ──────
type ChatMsg = { role: "ai" | "user"; text: string };

const aiGreeting: ChatMsg = {
  role: "ai",
  text: "Halo! Saya FinanSmart AI 👋\n\nSaya bisa bantu kamu:\n• Prediksi pengeluaran bulan depan\n• Analisis pola keuanganmu\n• Tips hemat berdasarkan kebiasaanmu\n• Cara pakai fitur FinanSmart\n\nMau mulai dari mana?",
};

const quickReplies = ["Prediksi bulan depan", "Analisis pengeluaranku", "Tips hemat", "Cara pakai app"];

function ChatTab() {
  const [messages, setMessages] = useState<ChatMsg[]>([aiGreeting]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const tl = text.toLowerCase();
      let reply = "Maaf, saya belum bisa menjawab itu. Coba tanya hal lain ya! 😊";
      if (tl.includes("prediksi")) {
        reply = "Berdasarkan 3 bulan terakhir, estimasi pengeluaranmu bulan depan sekitar Rp 1.800.000.\n\n📊 Rincian:\n• Makan & Minum: Rp 650.000 (+8%)\n• Transportasi: Rp 280.000\n• Hiburan: Rp 320.000 (⚠️ naik 15%)\n\nSaran: Kurangi budget hiburan sekitar Rp 50.000 untuk lebih aman. 💡";
      } else if (tl.includes("analisis")) {
        reply = "Pengeluaran terbesar bulan ini:\n• Makan & Minum: 35%\n• Hiburan: 20%\n• Transportasi: 15%\n\nDibanding bulan lalu, total pengeluaran naik 12%. Kamu masih aman! ✅";
      } else if (tl.includes("tips") || tl.includes("hemat")) {
        reply = "Tips hemat buat kamu:\n\n1. 🍜 Meal prep 2x seminggu → hemat Rp 100rb+\n2. 🚌 Pakai kartu transit vs ojol\n3. 🎬 Cap hiburan di Rp 200rb/bulan\n4. 📱 Audit subscription yang jarang dipakai\n\nPotensi hemat: Rp 250.000/bulan 🎯";
      } else if (tl.includes("cara") || tl.includes("pakai") || tl.includes("tutorial") || tl.includes("bantuan")) {
        reply = "Cara pakai FinanSmart:\n\n1. ➕ Tap tombol FAB (+) di Home untuk tambah transaksi cepat\n2. 📋 Tab Kelola → lihat & edit transaksi, geser kartu ke kiri untuk hapus\n3. 📷 Scan Struk → otomatis baca struk belanja via AI\n4. 📊 Tab Analitik → grafik pengeluaran berdasarkan periode\n5. ⚙️ Setelan → import/export data, kelola akun\n\nAda fitur lain yang ingin kamu pelajari? 😊";
      }
      setMessages((m) => [...m, { role: "ai", text: reply }]);
      setTyping(false);
    }, 1600);
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  return (
    <div className="flex flex-col h-full" style={{ background: C.bg }}>
      <div className="px-5 pt-12 pb-4 flex items-center gap-3" style={{ background: C.white, borderBottom: `1px solid ${C.divider}` }}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${C.teal}, #7C5CBF)` }}>
          <Sparkles size={18} color="white" />
        </div>
        <div>
          <p className="text-base font-bold" style={{ color: C.navy, fontFamily: "Plus Jakarta Sans, sans-serif" }}>FinanSmart AI</p>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: C.mint }} />
            <span className="text-xs" style={{ color: C.gray, fontFamily: "Inter, sans-serif" }}>Powered by AI · Online</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-end gap-2`}>
            {msg.role === "ai" && (
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${C.teal}, #7C5CBF)` }}>
                <Sparkles size={13} color="white" />
              </div>
            )}
            <div className="max-w-[78%] px-4 py-3 text-sm leading-relaxed"
              style={{
                background: msg.role === "ai" ? C.tealLight : C.teal,
                color: msg.role === "ai" ? C.navy : C.white,
                borderRadius: msg.role === "ai" ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
                fontFamily: "Inter, sans-serif", whiteSpace: "pre-line",
              }}>
              {msg.text}
            </div>
          </div>
        ))}

        {/* H1: Typing indicator */}
        {typing && (
          <div className="flex items-end gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${C.teal}, #7C5CBF)` }}>
              <Sparkles size={13} color="white" />
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: C.gray, fontFamily: "Inter, sans-serif" }}>AI sedang mengetik...</p>
              <div className="px-4 py-3 flex gap-1" style={{ background: C.tealLight, borderRadius: "4px 16px 16px 16px" }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-2 h-2 rounded-full"
                    style={{ background: C.teal, animation: `bounce 0.9s infinite ${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* H6/H7: Quick replies always visible below AI messages */}
        {!typing && messages[messages.length - 1]?.role === "ai" && (
          <div className="flex flex-wrap gap-2 mt-1">
            {quickReplies.map((q) => (
              <button key={q} onClick={() => sendMessage(q)}
                className="px-3 py-2 rounded-full text-xs font-medium transition-all"
                style={{ border: `1.5px solid ${C.teal}`, color: C.teal, background: C.white, fontFamily: "Inter, sans-serif" }}>
                {q}
              </button>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 py-3 flex items-center gap-3" style={{ background: C.white, borderTop: `1px solid ${C.divider}` }}>
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder="Tanya FinanSmart AI..."
          className="flex-1 px-4 py-2.5 rounded-full text-sm outline-none"
          style={{ background: C.bg, border: `1px solid ${C.divider}`, color: C.navy, fontFamily: "Inter, sans-serif" }} />
        <button onClick={() => sendMessage(input)}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
          style={{ background: input.trim() ? C.teal : C.divider }}>
          <Send size={16} color="white" />
        </button>
      </div>
    </div>
  );
}

// ── ANALYTICS TAB ─────────────────────────────────────────
function AnalyticsTab() {
  const [filter, setFilter] = useState("1 Tahun");
  const filters = ["1 Hari", "1 Minggu", "1 Bulan", "1 Tahun", "Semua"];
  const data = chartData[filter];

  return (
    <div className="flex flex-col h-full" style={{ background: C.bg }}>
      <div className="px-5 pt-12 pb-4" style={{ background: C.white, borderBottom: `1px solid ${C.divider}` }}>
        <h2 className="text-xl font-bold mb-3" style={{ color: C.navy, fontFamily: "Plus Jakarta Sans, sans-serif" }}>Analitik</h2>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {filters.map((f) => <PillButton key={f} active={filter === f} onClick={() => setFilter(f)}>{f}</PillButton>)}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-24 space-y-4">
        <Card>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold" style={{ color: C.navy, fontFamily: "Plus Jakarta Sans, sans-serif" }}>Statistik Overview</p>
            <div className="flex gap-3">
              {[{ c: C.mint, l: "Masuk" }, { c: C.coral, l: "Keluar" }].map(({ c, l }) => (
                <div key={l} className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                  <span className="text-[10px]" style={{ color: C.gray, fontFamily: "Inter, sans-serif" }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={data} margin={{ top: 5, right: 0, left: -30, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: C.gray }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: C.gray }} axisLine={false} tickLine={false}
                tickFormatter={(v) => v >= 1000000 ? `${v / 1000000}jt` : `${v / 1000}rb`} />
              <Tooltip contentStyle={{ background: C.navy, border: "none", borderRadius: 8, color: C.white, fontSize: 11 }}
                formatter={(v: number) => [formatRp(v), ""]} />
              <Area type="monotone" dataKey="outcome" stroke={C.coral} strokeWidth={2} fill={C.coral} fillOpacity={0.15} />
              <Area type="monotone" dataKey="income" stroke={C.mint} strokeWidth={2.5} fill={C.mint} fillOpacity={0.25} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          {[{ title: "Kategori Pengeluaran", pData: categoryExpense }, { title: "Kategori Pemasukan", pData: categoryIncome }].map(({ title, pData }) => (
            <Card key={title} className="!p-3">
              <p className="text-xs font-semibold mb-2" style={{ color: C.navy, fontFamily: "Plus Jakarta Sans, sans-serif" }}>{title}</p>
              <PieChart width={120} height={100}>
                <Pie data={pData} cx={60} cy={50} innerRadius={28} outerRadius={45} dataKey="value" strokeWidth={0}>
                  {pData.map((entry, idx) => <Cell key={`${title}-${idx}`} fill={entry.color} />)}
                </Pie>
              </PieChart>
              <div className="mt-1 space-y-1">
                {pData.slice(0, 3).map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                    <span className="text-[9px] truncate" style={{ color: C.gray, fontFamily: "Inter, sans-serif" }}>{d.name} {d.value}%</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <Card>
          <p className="text-sm font-semibold mb-3" style={{ color: C.navy, fontFamily: "Plus Jakarta Sans, sans-serif" }}>Pengeluaran Harian</p>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={dailyData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: C.gray }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: C.gray }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}rb`} />
              <Tooltip contentStyle={{ background: C.navy, border: "none", borderRadius: 8, color: C.white, fontSize: 11 }}
                formatter={(v: number) => [formatRp(v), "Pengeluaran"]} />
              <Bar dataKey="amount" fill={C.teal} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <p className="text-sm font-semibold mb-3" style={{ color: C.navy, fontFamily: "Plus Jakarta Sans, sans-serif" }}>Pengeluaran Bulanan</p>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={data} margin={{ top: 5, right: 0, left: -30, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: C.gray }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: C.gray }} axisLine={false} tickLine={false}
                tickFormatter={(v) => v >= 1000000 ? `${v / 1000000}jt` : `${v / 1000}rb`} />
              <Tooltip contentStyle={{ background: C.navy, border: "none", borderRadius: 8, color: C.white, fontSize: 11 }}
                formatter={(v: number) => [formatRp(v), ""]} />
              <Area type="monotone" dataKey="outcome" stroke={C.coral} strokeWidth={2} fill={C.coral} fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

// ── SETTINGS TAB ──────────────────────────────────────────
function SettingsTab({ showToast, onLogout }: { showToast: (m: string, type?: "success" | "error") => void; onLogout: () => void }) {
  const [darkMode, setDarkMode] = useState(false);
  const [notif, setNotif] = useState(true);
  const [hideBalance, setHideBalance] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [importConfirm, setImportConfirm] = useState(false);

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button onClick={onChange} className="w-12 h-6 rounded-full relative transition-all flex-shrink-0"
      style={{ background: value ? C.teal : C.divider }}>
      <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all"
        style={{ left: value ? "calc(100% - 22px)" : 2 }} />
    </button>
  );

  const Row = ({ icon, label, right, destructive = false, onClick }: {
    icon: React.ReactNode; label: string; right?: React.ReactNode; destructive?: boolean; onClick?: () => void;
  }) => (
    <button onClick={onClick} className="flex items-center gap-3 py-3.5 w-full text-left"
      style={{ borderBottom: `1px solid ${C.divider}` }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: destructive ? "#FFF0EF" : C.tealLight }}>
        {icon}
      </div>
      <p className="flex-1 text-sm font-medium" style={{ color: destructive ? C.coral : C.navy, fontFamily: "Inter, sans-serif" }}>{label}</p>
      {right !== undefined ? right : <ChevronRight size={16} color={C.gray} />}
    </button>
  );

  const Section = ({ title }: { title: string }) => (
    <p className="text-xs font-semibold uppercase tracking-wider mt-5 mb-1" style={{ color: C.gray, fontFamily: "Inter, sans-serif" }}>{title}</p>
  );

  return (
    <div className="flex flex-col h-full" style={{ background: C.bg }}>
      <div className="px-5 pt-12 pb-4" style={{ background: C.white, borderBottom: `1px solid ${C.divider}` }}>
        <h2 className="text-xl font-bold" style={{ color: C.navy, fontFamily: "Plus Jakarta Sans, sans-serif" }}>Pengaturan</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24">
        <div className="flex items-center gap-4 p-4 rounded-2xl mt-4"
          style={{ background: C.white, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
            style={{ background: `linear-gradient(135deg, ${C.teal}, ${C.mint})` }}>🧑</div>
          <div className="flex-1">
            <p className="text-base font-bold" style={{ color: C.navy, fontFamily: "Plus Jakarta Sans, sans-serif" }}>Budi Santoso</p>
            <p className="text-xs" style={{ color: C.gray, fontFamily: "Inter, sans-serif" }}>budi@email.com · Mahasiswa</p>
          </div>
          <button className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: C.tealLight }}>
            <Edit2 size={15} color={C.teal} />
          </button>
        </div>

        <Section title="Akun" />
        <div style={{ background: C.white, borderRadius: 16, padding: "0 16px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <Row icon={<Scan size={16} color={C.teal} />} label="Kelola Face Recognition" />
        </div>

        <Section title="Data" />
        <div style={{ background: C.white, borderRadius: 16, padding: "0 16px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <Row icon={<Upload size={16} color={C.teal} />} label="Import Data (.json / .csv)" onClick={() => setImportConfirm(true)} />
          <Row icon={<Download size={16} color={C.teal} />} label="Backup / Export Akun" onClick={() => showToast("Backup akun berhasil diunduh 📥")} />
          <Row icon={<FileJson size={16} color={C.teal} />} label="Export Pemasukan (.json)" onClick={() => showToast("Pemasukan.json berhasil diunduh 📥")} />
          <Row icon={<FileText size={16} color={C.teal} />} label="Export Pemasukan (.csv)" onClick={() => showToast("Pemasukan.csv berhasil diunduh 📥")} />
          <Row icon={<FileJson size={16} color={C.teal} />} label="Export Pengeluaran (.json)" onClick={() => showToast("Pengeluaran.json berhasil diunduh 📥")} />
          <Row icon={<FileText size={16} color={C.teal} />} label="Export Pengeluaran (.csv)" onClick={() => showToast("Pengeluaran.csv berhasil diunduh 📥")} />
        </div>

        <Section title="Preferensi" />
        <div style={{ background: C.white, borderRadius: 16, padding: "0 16px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <Row icon={darkMode ? <Moon size={16} color={C.teal} /> : <Sun size={16} color={C.teal} />} label="Tema Gelap"
            right={<Toggle value={darkMode} onChange={() => setDarkMode((v) => !v)} />} />
          <Row icon={<Globe size={16} color={C.teal} />} label="Bahasa"
            right={<span className="text-sm" style={{ color: C.gray, fontFamily: "Inter, sans-serif" }}>Indonesia</span>} />
          <Row icon={<BellRing size={16} color={C.teal} />} label="Notifikasi"
            right={<Toggle value={notif} onChange={() => setNotif((v) => !v)} />} />
          <Row icon={<Shield size={16} color={C.teal} />} label="Sembunyikan Saldo Otomatis"
            right={<Toggle value={hideBalance} onChange={() => setHideBalance((v) => !v)} />} />
        </div>

        <Section title="Bantuan" />
        <div style={{ background: C.white, borderRadius: 16, padding: "0 16px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <Row icon={<HelpCircle size={16} color={C.teal} />} label="Bantuan & FAQ" />
          <Row icon={<Info size={16} color={C.teal} />} label="Tentang FinanSmart" />
        </div>

        <div className="mt-5">
          <div style={{ background: C.white, borderRadius: 16, padding: "0 16px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <Row icon={<LogOut size={16} color={C.coral} />} label="Keluar Akun" destructive right={null} onClick={() => setLogoutConfirm(true)} />
          </div>
        </div>
        <p className="text-center text-xs my-5" style={{ color: C.gray, fontFamily: "Inter, sans-serif" }}>
          FinanSmart v1.0.0 · © 2024 FinanSmart
        </p>
      </div>

      {logoutConfirm && (
        <ConfirmDialog title="Keluar Akun?" desc="Kamu akan keluar dari FinanSmart. Data lokal tetap tersimpan."
          confirmLabel="Ya, Keluar" onConfirm={() => { setLogoutConfirm(false); onLogout(); }} onCancel={() => setLogoutConfirm(false)} />
      )}
      {importConfirm && (
        <ConfirmDialog title="Import Data?" desc="Data lama akan tertimpa dengan file baru. Pastikan sudah backup sebelumnya."
          confirmLabel="Ya, Import" danger={false}
          onConfirm={() => { setImportConfirm(false); showToast("Data berhasil diimport! ✅"); }}
          onCancel={() => setImportConfirm(false)} />
      )}
    </div>
  );
}

// ── APP SHELL ─────────────────────────────────────────────
function AppShell({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("home");
  const [ocrOpen, setOcrOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [coachStep, setCoachStep] = useState<number | null>(0); // start with coach mark

  const showToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  }, []);

  const handleCoachNext = () => {
    if (coachStep === null) return;
    if (coachStep >= coachSteps.length - 1) { setCoachStep(null); }
    else setCoachStep(coachStep + 1);
  };
  const handleCoachPrev = () => {
    if (coachStep === null || coachStep === 0) return;
    setCoachStep(coachStep - 1);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden relative" style={{ background: C.bg }}>
      <div className="flex-1 overflow-hidden relative">
        {([
          { id: "home" as Tab, el: <HomeTab showToast={showToast} onScanStruk={() => setOcrOpen(true)} /> },
          { id: "manage" as Tab, el: <ManageTab showToast={showToast} onScanStruk={() => setOcrOpen(true)} /> },
          { id: "chat" as Tab, el: <ChatTab /> },
          { id: "analytics" as Tab, el: <AnalyticsTab /> },
          { id: "settings" as Tab, el: <SettingsTab showToast={showToast} onLogout={onLogout} /> },
        ] as const).map(({ id, el }) => (
          <div key={id} className="absolute inset-0" style={{ display: tab === id ? "block" : "none" }}>{el}</div>
        ))}
      </div>
      <BottomNav active={tab} onChange={setTab} />

      {ocrOpen && <OcrFlow onClose={() => setOcrOpen(false)} showToast={showToast} />}
      <ToastContainer toasts={toasts} />

      {/* Coach Mark overlay */}
      {coachStep !== null && (
        <CoachMark step={coachStep} onNext={handleCoachNext} onPrev={handleCoachPrev} onSkip={() => setCoachStep(null)} />
      )}
    </div>
  );
}

// ── APP ROOT ──────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");

  return (
    <div className="flex items-center justify-center min-h-screen"
      style={{ background: "#111d1a", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes slideUpFade { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes progress { from { width: 0%; } to { width: 100%; } }
        .no-scrollbar::-webkit-scrollbar, *::-webkit-scrollbar { display: none; }
        .no-scrollbar, * { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>

      {/* Phone frame */}
      <div className="relative overflow-hidden"
        style={{
          width: 390, height: 844, borderRadius: 48, background: C.bg,
          boxShadow: "0 32px 80px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.1)",
        }}>
        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-7 z-[80] pointer-events-none" style={{ height: 44 }}>
          <span className="text-xs font-semibold" style={{ color: ["splash", "login"].includes(screen) ? "white" : C.navy, fontFamily: "Inter, sans-serif" }}>9:41</span>
          <div className="w-28 h-[22px] rounded-full" style={{ background: "rgba(0,0,0,0.9)" }} />
          <div className="w-5 h-3 rounded-sm flex items-center" style={{ border: `1.5px solid ${["splash", "login"].includes(screen) ? "rgba(255,255,255,0.6)" : C.navy}`, padding: 1 }}>
            <div className="h-full rounded-sm" style={{ background: ["splash", "login"].includes(screen) ? "rgba(255,255,255,0.6)" : C.navy, width: "70%" }} />
          </div>
        </div>

        <div className="absolute inset-0">
          {screen === "splash" && <SplashScreen onDone={() => setScreen("onboarding")} />}
          {screen === "onboarding" && <OnboardingScreen onDone={() => setScreen("login")} />}
          {screen === "login" && <LoginScreen onLogin={() => setScreen("app")} onRegister={() => setScreen("register")} />}
          {screen === "register" && <RegisterScreen onDone={() => setScreen("face-setup")} onBack={() => setScreen("login")} />}
          {screen === "face-setup" && <FaceSetupScreen onDone={() => setScreen("app")} />}
          {screen === "app" && <AppShell onLogout={() => setScreen("login")} />}
        </div>

        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
          style={{ width: 130, height: 5, background: "rgba(0,0,0,0.15)" }} />
      </div>
    </div>
  );
}
