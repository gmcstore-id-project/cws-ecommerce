import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Plus, Edit2, Trash2, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function SellerProducts() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [showForm, setShowForm] = useState(false);

  const { data: products = [], isLoading, refetch } = trpc.products.list.useQuery(
    { limit: 50 },
    { enabled: user?.role === "seller" }
  );

  const deleteProductMutation = trpc.products.delete.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Produk berhasil dihapus");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal menghapus produk");
    },
  });

  if (user?.role !== "seller") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Akses Ditolak</h1>
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
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate("/seller/dashboard")}
              className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Kembali
            </button>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-slate-900">Kelola Produk</h1>
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Produk
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Product Form */}
        {showForm && (
          <Card className="p-6 mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Tambah Produk Baru</h2>
            <div className="space-y-4">
              <p className="text-slate-600">Form untuk menambah produk akan diimplementasikan di sini</p>
              <Button
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Tutup
              </Button>
            </div>
          </Card>
        )}

        {/* Products List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="h-24 bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">Anda belum memiliki produk</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Produk Pertama
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product: any) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-slate-200 overflow-hidden">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900 line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-blue-600">
                      Rp {parseFloat(product.price.toString()).toLocaleString("id-ID")}
                    </span>
                    <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                      Stok: {product.stock}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1"
                      onClick={() => {
                        if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
                          deleteProductMutation.mutate({ id: product.id });
                        }
                      }}
                      disabled={deleteProductMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
