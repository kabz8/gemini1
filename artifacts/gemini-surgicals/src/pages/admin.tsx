import { useState, useEffect } from "react";
import { 
  useGetAdminStats, 
  useListProducts, 
  useListOrders, 
  useUpdateOrderStatus,
  useCreateProduct,
  useDeleteProduct,
  useListCategories
} from "@workspace/api-client-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Package, ShoppingCart, DollarSign, AlertCircle, Trash2, Plus, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "orders">("dashboard");
  const { toast } = useToast();

  useEffect(() => {
    if (localStorage.getItem("admin_token") === "admin123") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      localStorage.setItem("admin_token", "admin123");
      setIsAuthenticated(true);
    } else {
      toast({ title: "Error", description: "Invalid password", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-border w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-6 text-center text-slate-900">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter admin password"
                className="w-full p-3 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full h-12">Login</Button>
          </form>
          <p className="text-xs text-center mt-4 text-muted-foreground">Demo password: admin123</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      
      {/* Admin Nav */}
      <div className="bg-slate-900 text-white sticky top-20 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 gap-4">
            <h1 className="text-xl font-bold">Admin Portal</h1>
            <div className="flex gap-2 bg-slate-800 p-1 rounded-lg overflow-x-auto w-full sm:w-auto">
              {(["dashboard", "products", "orders"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-md text-sm font-medium capitalize whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-primary text-white shadow' : 'text-slate-300 hover:text-white hover:bg-slate-700'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && <DashboardView />}
        {activeTab === "products" && <ProductsView />}
        {activeTab === "orders" && <OrdersView />}
      </div>
    </div>
  );
}

function DashboardView() {
  const { data: stats, isLoading } = useGetAdminStats();

  if (isLoading) return <div className="animate-pulse flex gap-4 h-32"><div className="flex-1 bg-slate-200 rounded-2xl"></div><div className="flex-1 bg-slate-200 rounded-2xl"></div></div>;

  const statCards = [
    { label: "Total Revenue", value: formatPrice(stats?.totalRevenue || 0), icon: DollarSign, color: "text-green-600 bg-green-100" },
    { label: "Total Orders", value: stats?.totalOrders || 0, icon: ShoppingCart, color: "text-blue-600 bg-blue-100" },
    { label: "Pending Orders", value: stats?.pendingOrders || 0, icon: AlertCircle, color: "text-amber-600 bg-amber-100" },
    { label: "Products", value: stats?.totalProducts || 0, icon: Package, color: "text-purple-600 bg-purple-100" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
      <h2 className="text-2xl font-bold text-slate-900">Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-border flex items-center gap-4">
             <div className={`p-4 rounded-xl ${stat.color}`}>
               <stat.icon className="h-6 w-6" />
             </div>
             <div>
               <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
               <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductsView() {
  const { data: productsData, isLoading } = useListProducts({ limit: 100 });
  const deleteProduct = useDeleteProduct();
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Deleted", description: "Product removed successfully" });
          // In real app, invalidate queries here
        }
      });
    }
  };

  if (isLoading) return <div>Loading products...</div>;

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Products Inventory</h2>
        {/* Full Add form omitted for brevity, representing the state */}
        <Button><Plus className="h-4 w-4 mr-2" /> Add Product</Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 font-semibold">Price (KES)</th>
                <th className="px-6 py-4 font-semibold">Stock</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {Array.isArray(productsData?.products)
                ? productsData.products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{p.name}</div>
                        <div className="text-xs text-slate-500">{p.categoryName}</div>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {p.discountPrice ? (
                          <>
                            <span className="line-through text-slate-400 mr-2">{p.price}</span>
                            <span className="text-primary">{p.discountPrice}</span>
                          </>
                        ) : (
                          p.price
                        )}
                      </td>
                      <td className="px-6 py-4">{p.stock}</td>
                      <td className="px-6 py-4">
                        {p.inStock ? (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">In Stock</span>
                        ) : (
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">Out of Stock</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(p.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function OrdersView() {
  const { data: orders, isLoading } = useListOrders();
  const updateStatus = useUpdateOrderStatus();
  const { toast } = useToast();

  const handleStatusChange = (id: number, status: string) => {
    updateStatus.mutate({ id, data: { status: status as any } }, {
      onSuccess: () => {
        toast({ title: "Updated", description: `Order #${id} status changed to ${status}` });
      }
    });
  };

  if (isLoading) return <div>Loading orders...</div>;

  return (
    <div className="space-y-6 animate-in fade-in">
      <h2 className="text-2xl font-bold text-slate-900">Recent Orders</h2>

      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders?.map(o => (
                <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium">#{o.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{o.customerName}</div>
                    <div className="text-xs text-slate-500">{o.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{format(new Date(o.createdAt), "MMM dd, yyyy")}</td>
                  <td className="px-6 py-4 font-bold text-primary">{formatPrice(o.totalAmount)}</td>
                  <td className="px-6 py-4">
                    <select 
                      className="bg-slate-50 border border-border rounded px-2 py-1 text-xs font-bold uppercase outline-none focus:ring-2 ring-primary/20"
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      disabled={updateStatus.isPending}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
