import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { UserPlus, ArrowRight, Check } from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "https://cws-ecommerce-api.nadiracemilan25.workers.dev";

export default function Register() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const benefits = [
    {
      icon: "🛍️",
      title: "Belanja Mudah",
      description: "Jelajahi ribuan produk dari seller terpercaya",
    },
    {
      icon: "🏪",
      title: "Buka Toko Anda",
      description: "Menjadi seller dan mulai berjualan dengan mudah",
    },
    {
      icon: "🔒",
      title: "Aman & Terpercaya",
      description: "Transaksi aman dengan sistem pembayaran terpercaya",
    },
    {
      icon: "⭐",
      title: "Rating & Review",
      description: "Lihat rating jujur dari pembeli lain",
    },
  ];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Email dan password wajib diisi");
      return;
    }
    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }
    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password, name: name.trim() }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Gagal mendaftar. Coba lagi.");
        setIsLoading(false);
        return;
      }

      // Registration succeeded; backend register endpoint doesn't auto-login,
      // so log the user in immediately with the same credentials.
      const loginRes = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const loginData = await loginRes.json();

      if (!loginRes.ok || loginData.error) {
        // Account created but auto-login failed; send to login page instead.
        setLocation("/login");
        return;
      }

      window.location.href = "/";
    } catch (err) {
      setError("Gagal terhubung ke server. Coba lagi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Navigation */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/manus-storage/icon_cws_mantap.png" alt="CWS Mantap" className="w-10 h-10" />
            <h1 className="text-2xl font-bold text-slate-900">CWS Mantap</h1>
          </div>
          <Button
            onClick={() => setLocation("/")}
            variant="ghost"
            className="text-slate-700 hover:bg-slate-100"
          >
            Kembali ke Beranda
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Benefits */}
          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Bergabunglah dengan CWS Mantap
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Daftar sekarang dan nikmati pengalaman berbelanja terbaik atau mulai berjualan produk Anda.
            </p>

            <div className="space-y-4">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="text-3xl flex-shrink-0">{benefit.icon}</div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-slate-600 text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Registration Card */}
          <div>
            <Card className="p-8 shadow-lg border-0">
              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    Mulai Sekarang
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Pendaftaran gratis dan mudah hanya dalam beberapa klik
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nama Anda"
                      autoComplete="name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      autoComplete="email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <Input
                      id="reg-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      autoComplete="new-password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Konfirmasi Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                {/* Registration Features */}
                <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-900">Akun Terverifikasi</p>
                      <p className="text-sm text-slate-600">Keamanan terjamin dengan sistem kami</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-900">Profil Lengkap</p>
                      <p className="text-sm text-slate-600">Atur profil dan preferensi Anda</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-900">Siap Berjualan</p>
                      <p className="text-sm text-slate-600">Upgrade ke seller kapan saja</p>
                    </div>
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                    {error}
                  </p>
                )}

                {/* Register Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-base"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sedang mendaftar...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Daftar
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>

                {/* Login Link */}
                <div className="text-center">
                  <p className="text-slate-600 text-sm">
                    Sudah punya akun?{" "}
                    <button
                      type="button"
                      onClick={() => setLocation("/login")}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      Masuk di sini
                    </button>
                  </p>
                </div>
              </form>
            </Card>

            {/* Trust Badges */}
            <div className="mt-6 flex items-center justify-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-1">
                <span>🔒</span>
                <span>Aman & Terpercaya</span>
              </div>
              <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
              <div className="flex items-center gap-1">
                <span>✓</span>
                <span>Gratis Selamanya</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
