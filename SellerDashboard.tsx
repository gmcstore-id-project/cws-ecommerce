import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, Package, ShoppingCart, DollarSign } from "lucide-react";
import { useLocation } from "wouter";

export default function SellerDashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const { data: stats } = trpc.sellers.stats.useQuery(
    undefined,
    { enabled: user?.role === "seller" }
  );

  // Mock top products for now
  const topProducts: any[] = [];

  // Mock data untuk grafik
  const chartData = [
    { name: "Jan", revenue: 4000, orders: 24 },
    { name: "Feb", revenue: 3000, orders: 13 },
    { name: "Mar", revenue: 2000, orders: 9 },
    { name: "Apr", revenue: 2780, orders: 39 },
    { name: "May", revenue: 1890, orders: 23 },
    { name: "Jun", revenue: 2390, orders: 34 },
  ];

  if (user?.role !== "seller") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Akses Ditolak</h1>
          <p className="text-slate-600 mb-4">Hanya penjual yang dapat mengakses halaman ini</p>
          <Button onClick={() => navigate("/")}>Kembali ke Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-slate-900">Dashboard Seller</h1>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => navigate("/seller/products")}>
                Kelola Produk
              </Button>
              <Button onClick={() => navigate("/seller/orders")}>
                Pesanan
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Pendapatan</p>
                <p className="text-3xl font-bold text-slate-900">
                  Rp {stats?.totalRevenue ? parseFloat(stats.totalRevenue.toString()).toLocaleString("id-ID") : 0}
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Pesanan</p>
                <p className="text-3xl font-bold text-slate-900">
                  {stats?.totalOrders || 0}
                </p>
              </div>
              <ShoppingCart className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Produk</p>
                <p className="text-3xl font-bold text-slate-900">
                  {stats ? Object.keys(stats).length : 0}
                </p>
              </div>
              <Package className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Rating</p>
                <p className="text-3xl font-bold text-slate-900">
                  {stats?.rating ? parseFloat(stats.rating.toString()).toFixed(1) : "0"}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-yellow-600 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Pendapatan Bulanan</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#2563eb" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Orders Chart */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Pesanan Bulanan</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Top Products */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Produk Terlaris</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Produk</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Terjual</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Pendapatan</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Rating</th>
                </tr>
              </thead>
              <tbody>
                {topProducts && topProducts.length > 0 ? topProducts.map((product: any) => (
                  <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-900">{product.name}</td>
                    <td className="py-3 px-4 text-slate-600">{product.sales || 0}</td>
                    <td className="py-3 px-4 text-slate-900 font-medium">
                      Rp {product.revenue ? parseFloat(product.revenue.toString()).toLocaleString("id-ID") : 0}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-yellow-500">★ {product.rating ? parseFloat(product.rating.toString()).toFixed(1) : "0"}</span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="py-3 px-4 text-center text-slate-600">
                      Belum ada produk
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
