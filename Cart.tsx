import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Trash2, ChevronLeft } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Cart() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const { data: cartItems = [], isLoading, refetch } = trpc.cart.list.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const removeFromCartMutation = trpc.cart.remove.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Item dihapus dari keranjang");
    },
  });

  const updateCartMutation = trpc.cart.update.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Silakan masuk terlebih dahulu</h1>
          <Button asChild>
            <a href={getLoginUrl()}>Masuk</a>
          </Button>
        </div>
      </div>
    );
  }

  const total = cartItems.reduce((sum, item: any) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate("/marketplace")}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-1 mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali
          </button>
          <h1 className="text-3xl font-bold text-slate-900">Keranjang Belanja</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="h-24 bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">Keranjang Anda kosong</p>
            <Button onClick={() => navigate("/marketplace")}>
              Lanjut Belanja
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item: any) => (
                <Card key={item.id} className="p-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product?.image && (
                        <img
                          src={item.product.image}
                          alt={item.product?.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-1">
                        {item.product?.name}
                      </h3>
                      <p className="text-sm text-slate-600 mb-2">
                        Rp {item.product ? parseFloat(item.product.price.toString()).toLocaleString("id-ID") : 0}
                      </p>

                      {/* Quantity Control */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateCartMutation.mutate({
                              id: item.id,
                              quantity: Math.max(1, item.quantity - 1),
                            })
                          }
                          className="px-2 py-1 border border-slate-300 rounded hover:bg-slate-100"
                        >
                          −
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateCartMutation.mutate({
                              id: item.id,
                              quantity: item.quantity + 1,
                            })
                          }
                          className="px-2 py-1 border border-slate-300 rounded hover:bg-slate-100"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Price & Remove */}
                    <div className="text-right">
                      <p className="font-bold text-slate-900 mb-2">
                        Rp {item.product ? (parseFloat(item.product.price.toString()) * item.quantity).toLocaleString("id-ID") : 0}
                      </p>
                      <button
                        onClick={() => removeFromCartMutation.mutate({ id: item.id })}
                        className="text-red-600 hover:text-red-700 flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Hapus
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-4">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Ringkasan</h2>
                <div className="space-y-3 mb-4 pb-4 border-b border-slate-200">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>Rp {total.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Ongkir</span>
                    <span>Rp 0</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Diskon</span>
                    <span>Rp 0</span>
                  </div>
                </div>
                <div className="flex justify-between text-lg font-bold text-slate-900 mb-6">
                  <span>Total</span>
                  <span>Rp {total.toLocaleString("id-ID")}</span>
                </div>
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => navigate("/checkout")}
                >
                  Lanjut ke Checkout
                </Button>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
