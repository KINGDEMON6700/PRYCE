import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Store, 
  Package, 
  Settings, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  MapPin, 
  Phone, 
  Clock, 
  Star,
  Building,
  Tag,
  DollarSign,
  TrendingUp,
  Users,
  Eye,
  Save,
  X,
  Cog,
  MessageSquare
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { GooglePlacesStoreSearch } from "@/components/GooglePlacesStoreSearch";
import { StoreForm } from "@/components/forms/StoreForm";
import { UnifiedHeader } from "@/components/UnifiedHeader";
import { BottomNavigation } from "@/components/BottomNavigation";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import type { Store as StoreType, Product as ProductType, InsertStore, InsertProduct } from "@shared/schema";
import { AdminContributionsPanel } from "@/components/AdminContributionsPanel";
import { AdminProductBarcodeManager } from "@/components/AdminProductBarcodeManager";
import { AdminStoreHoursManager } from "@/components/AdminStoreHoursManager";

interface StoreWithRating extends StoreType {
  averageRating: number;
  ratingCount: number;
  distance?: number;
  averageDiscount?: number;
  averagePrice?: number;
  productCount?: number;
}

interface ProductWithPrice extends ProductType {
  lowestPrice: number;
  storeCount: number;
  averageRating: number;
  ratingCount: number;
}

interface StoreProduct {
  id: number;
  storeId: number;
  productId: number;
  price: number;
  isAvailable: boolean;
  isPromotion: boolean;
  updatedAt: string;
  product: ProductType;
  hasPrice: boolean;
}

export default function AdminPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  
  // Check if user is admin
  const isAdmin = user && ["44734189", "44735226", "44737331"].includes(user.id);
  
  // Redirect if not admin
  if (!isAdmin) {
    navigate("/profile");
    return null;
  }
  const [activeTab, setActiveTab] = useState("stores");
  const [selectedStore, setSelectedStore] = useState<StoreWithRating | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithPrice | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [managementSearchTerm, setManagementSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceEditData, setPriceEditData] = useState<{
    storeId: number;
    productId: number;
    price: number;
    isPromotion: boolean;
    isAvailable: boolean;
  } | null>(null);
  const [storeEditData, setStoreEditData] = useState<StoreWithRating | null>(null);

  // Fetch stores
  const { data: stores = [], isLoading: storesLoading } = useQuery<StoreWithRating[]>({
    queryKey: ["/api/stores"],
  });

  // Fetch products
  const { data: products = [], isLoading: productsLoading } = useQuery<ProductWithPrice[]>({
    queryKey: ["/api/products"],
  });

  // Fetch store products when store is selected
  const { data: storeProducts = [], isLoading: storeProductsLoading } = useQuery<StoreProduct[]>({
    queryKey: [`/api/stores/${selectedStore?.id}/products`],
    enabled: !!selectedStore,
  });



  if (!isAdmin) {
    navigate("/profile");
    return null;
  }

  // Mutations
  const createStoreMutation = useMutation({
    mutationFn: (data: InsertStore) => apiRequest("POST", "/api/stores", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stores"] });
      toast({ title: "Succès", description: "Magasin créé avec succès" });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: "Erreur lors de la création du magasin", variant: "destructive" });
    },
  });

  const updateStoreMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertStore> }) => 
      apiRequest("PUT", `/api/stores/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stores"] });
      toast({ title: "Succès", description: "Magasin mis à jour avec succès" });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: "Erreur lors de la mise à jour du magasin", variant: "destructive" });
    },
  });

  const deleteStoreMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/stores/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stores"] });
      toast({ title: "Succès", description: "Magasin supprimé avec succès" });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: "Erreur lors de la suppression du magasin", variant: "destructive" });
    },
  });

  const createProductMutation = useMutation({
    mutationFn: (data: InsertProduct) => apiRequest("POST", "/api/products", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Succès", description: "Produit créé avec succès" });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: "Erreur lors de la création du produit", variant: "destructive" });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertProduct> }) => 
      apiRequest("PUT", `/api/products/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Succès", description: "Produit mis à jour avec succès" });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: "Erreur lors de la mise à jour du produit", variant: "destructive" });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Succès", description: "Produit supprimé avec succès" });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: "Erreur lors de la suppression du produit", variant: "destructive" });
    },
  });

  const updatePriceMutation = useMutation({
    mutationFn: (data: { storeId: number; productId: number; price: number; isPromotion: boolean; isAvailable: boolean }) =>
      apiRequest("PUT", `/api/stores/${data.storeId}/products/${data.productId}`, {
        price: data.price,
        isPromotion: data.isPromotion,
        isAvailable: data.isAvailable,
      }),
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/stores/${data.storeId}/products`] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stores"] });
      toast({ title: "Succès", description: "Prix mis à jour avec succès" });
      setPriceEditData(null);
    },
    onError: (error) => {
      toast({ title: "Erreur", description: "Erreur lors de la mise à jour du prix", variant: "destructive" });
    },
  });

  const addProductToStoreMutation = useMutation({
    mutationFn: ({ storeId, productId, price }: { storeId: number; productId: number; price: number }) =>
      apiRequest("POST", `/api/stores/${storeId}/products`, {
        productId,
        price,
        isAvailable: true,
        isPromotion: false,
      }),
    onSuccess: (_, { storeId }) => {
      queryClient.invalidateQueries({ queryKey: [`/api/stores/${storeId}/products`] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stores"] });
      toast({ title: "Succès", description: "Produit ajouté au magasin avec succès" });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: "Erreur lors de l'ajout du produit au magasin", variant: "destructive" });
    },
  });

  const removeProductFromStoreMutation = useMutation({
    mutationFn: ({ storeId, productId }: { storeId: number; productId: number }) =>
      apiRequest("DELETE", `/api/stores/${storeId}/products/${productId}`),
    onSuccess: (_, { storeId }) => {
      queryClient.invalidateQueries({ queryKey: [`/api/stores/${storeId}/products`] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stores"] });
      toast({ title: "Succès", description: "Produit retiré du catalogue avec succès" });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: "Erreur lors de la suppression du produit du catalogue", variant: "destructive" });
    },
  });

  // Filter functions
  const filteredStores = stores.filter(store =>
    store?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store?.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store?.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = products.filter(product => {
    const matchesSearch = product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product?.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product?.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || product?.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const filteredStoreProducts = storeProducts.filter(sp =>
    sp.product?.name?.toLowerCase().includes(managementSearchTerm.toLowerCase()) ||
    sp.product?.brand?.toLowerCase().includes(managementSearchTerm.toLowerCase())
  );

  // Categories
  const categories = Array.from(new Set(products.map(p => p?.category).filter(Boolean)));

  // Store brand detection
  const detectBrand = (name: string): string => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes("aldi")) return "aldi";
    if (nameLower.includes("lidl")) return "lidl";
    if (nameLower.includes("delhaize")) return "delhaize";
    if (nameLower.includes("carrefour")) return "carrefour";
    if (nameLower.includes("okay")) return "okay";
    return "autre";
  };

  const getBrandColor = (brand: string): string => {
    switch (brand) {
      case "aldi": return "bg-blue-500";
      case "lidl": return "bg-yellow-500";
      case "delhaize": return "bg-red-500";
      case "carrefour": return "bg-blue-600";
      case "okay": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("fr-BE", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <UnifiedHeader 
        title="Panel Administrateur"
        showBackButton={true}
        showProfile={true}
      />
      <div className="max-w-6xl mx-auto p-4 pt-20 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-gray-700">
            <TabsTrigger 
              value="stores" 
              className="data-[state=active]:bg-gray-600 data-[state=active]:text-white"
            >
              <Store className="h-4 w-4 mr-2" />
              Magasins
            </TabsTrigger>
            <TabsTrigger 
              value="products" 
              className="data-[state=active]:bg-gray-600 data-[state=active]:text-white"
            >
              <Package className="h-4 w-4 mr-2" />
              Produits
            </TabsTrigger>
            <TabsTrigger 
              value="contributions" 
              className="data-[state=active]:bg-gray-600 data-[state=active]:text-white"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Contributions
            </TabsTrigger>
            <TabsTrigger 
              value="management" 
              className="data-[state=active]:bg-gray-600 data-[state=active]:text-white"
            >
              <Settings className="h-4 w-4 mr-2" />
              Gestion
            </TabsTrigger>
          </TabsList>

          {/* Stores Tab */}
          <TabsContent value="stores" className="mt-6">
            <div className="space-y-4">
              {/* Search and Add */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher un magasin..."
                    className="pl-10 bg-gray-800 border-gray-700 text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <GooglePlacesStoreSearch 
                    onStoreAdded={(store) => {
                      createStoreMutation.mutate(store);
                    }}
                  />
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Créer manuellement
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800 border-gray-700 max-w-md max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-white">Créer un nouveau magasin</DialogTitle>
                      </DialogHeader>
                      <StoreForm 
                        onSubmit={(data) => createStoreMutation.mutate(data)}
                        showTitle={false}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Stores Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {storesLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="animate-pulse space-y-3">
                          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                          <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  filteredStores.map((store) => (
                    <Card key={store.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${getBrandColor(store.brand)}`}></div>
                            <h3 className="font-semibold text-white truncate">{store.name}</h3>
                          </div>
                          <Badge variant="outline" className="text-xs capitalize">
                            {store.brand}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-300">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{store?.address || ''}, {store?.city || ''}</span>
                          </div>
                          {store?.phone && (
                            <div className="flex items-center space-x-2">
                              <Phone className="h-3 w-3" />
                              <span>{store.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2">
                            <Building className="h-3 w-3" />
                            <span>{store?.productCount || 0} produits</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span className="text-sm text-gray-300">
                              {Number(store.averageRating || 0).toFixed(1)} ({store.ratingCount || 0})
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => navigate(`/stores/${store?.id}/products`)}
                              title="Voir le catalogue côté utilisateur"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-blue-400 hover:text-blue-300"
                              onClick={() => setStoreEditData(store)}
                              title="Modifier les informations du magasin"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-green-400 hover:text-green-300"
                              onClick={() => {
                                setSelectedStore(store);
                                setActiveTab("management");
                                setManagementSearchTerm("");
                              }}
                              title="Gérer le catalogue et les prix"
                            >
                              <Cog className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-gray-800 border-gray-700">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-white">Supprimer le magasin</AlertDialogTitle>
                                  <AlertDialogDescription className="text-gray-300">
                                    Êtes-vous sûr de vouloir supprimer "{store?.name || 'ce magasin'}" ? Cette action est irréversible.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                                    Annuler
                                  </AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => deleteStoreMutation.mutate(store.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="mt-6">
            <div className="space-y-4">
              {/* Search and Add */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher un produit..."
                    className="pl-10 bg-gray-800 border-gray-700 text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="all">Toutes</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat!}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Nouveau Produit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800 border-gray-700 max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-white">Créer un nouveau produit</DialogTitle>
                      </DialogHeader>
                      <ProductForm onSubmit={createProductMutation.mutate} />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {productsLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="animate-pulse space-y-3">
                          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                          <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  filteredProducts.map((product) => (
                    <Card key={product.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-white truncate">{product?.name || 'Produit sans nom'}</h3>
                            {product?.brand && (
                              <p className="text-sm text-gray-400">{product.brand}</p>
                            )}
                          </div>
                          {product?.category && (
                            <Badge variant="outline" className="text-xs">
                              {product.category}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-300">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-3 w-3" />
                            <span>
                              {(product?.lowestPrice || 0) > 0 ? formatPrice(product.lowestPrice) : "Prix non défini"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Building className="h-3 w-3" />
                            <span>{product?.storeCount || 0} magasins</span>
                          </div>
                          {product?.unit && (
                            <div className="flex items-center space-x-2">
                              <Tag className="h-3 w-3" />
                              <span>{product.unit}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span className="text-sm text-gray-300">
                              {Number(product.averageRating || 0).toFixed(1)} ({product.ratingCount || 0})
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="ghost">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-gray-800 border-gray-700 max-w-md">
                                <DialogHeader>
                                  <DialogTitle className="text-white">Modifier le produit</DialogTitle>
                                </DialogHeader>
                                <ProductForm 
                                  product={product} 
                                  onSubmit={(data) => updateProductMutation.mutate({ id: product.id, data })} 
                                />
                              </DialogContent>
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-gray-800 border-gray-700">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-white">Supprimer le produit</AlertDialogTitle>
                                  <AlertDialogDescription className="text-gray-300">
                                    Êtes-vous sûr de vouloir supprimer "{product?.name || 'ce produit'}" ? Cette action est irréversible.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                                    Annuler
                                  </AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => deleteProductMutation.mutate(product.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          {/* Contributions Tab */}
          <TabsContent value="contributions" className="mt-6">
            <AdminContributionsPanel />
          </TabsContent>

          {/* Management Tab */}
          <TabsContent value="management" className="mt-6">
            <div className="space-y-4">
              {/* Store Selection */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Gestion des prix par magasin</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select 
                    value={selectedStore?.id?.toString() || ''} 
                    onValueChange={(value) => {
                      const store = stores.find(s => s?.id === parseInt(value)) || null;

                      setSelectedStore(store);
                    }}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Sélectionner un magasin" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {stores.map((store) => (
                        <SelectItem key={store?.id || Math.random()} value={store?.id?.toString() || ''}>
                          {store?.name || 'Magasin sans nom'} - {store?.city || 'Ville inconnue'} ({store?.productCount || 0} produits)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedStore && (
                    <div className="mt-2 text-sm text-gray-400">
                      Magasin sélectionné: {selectedStore.name} (ID: {selectedStore.id})
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Store Products */}
              {selectedStore && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Produits de {selectedStore?.name || 'ce magasin'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Search */}
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Rechercher un produit..."
                          className="pl-10 bg-gray-700 border-gray-600 text-white"
                          value={managementSearchTerm}
                          onChange={(e) => setManagementSearchTerm(e.target.value)}
                        />
                      </div>

                      {/* Add Product */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="bg-green-600 hover:bg-green-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter un produit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-800 border-gray-700 max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-white">Ajouter un produit au magasin</DialogTitle>
                          </DialogHeader>
                          <AddProductToStoreForm 
                            store={selectedStore}
                            products={products}
                            onSubmit={addProductToStoreMutation.mutate}
                          />
                        </DialogContent>
                      </Dialog>

                      {/* Products List */}
                      <div className="space-y-2">
                        {/* Debug Info */}
                        <div className="text-xs text-gray-400 p-2 bg-gray-900 rounded">
                          Debug: {storeProducts.length} produits trouvés • Loading: {storeProductsLoading ? 'Oui' : 'Non'} • Store ID: {selectedStore?.id}
                        </div>
                        
                        {storeProductsLoading ? (
                          Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="animate-pulse p-4 bg-gray-700 rounded">
                              <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                              <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                            </div>
                          ))
                        ) : storeProducts.length === 0 ? (
                          <div className="p-4 bg-gray-700 rounded text-center">
                            <p className="text-gray-300">Aucun produit trouvé pour ce magasin</p>
                            <p className="text-xs text-gray-400 mt-1">Utilisez le bouton "Ajouter un produit" pour en ajouter</p>
                          </div>
                        ) : (
                          filteredStoreProducts.map((sp) => (
                            <div key={sp.id} className="flex items-center justify-between p-4 bg-gray-700 rounded">
                              <div className="flex-1">
                                <h4 className="font-medium text-white">{sp?.product?.name || 'Produit sans nom'}</h4>
                                <div className="flex items-center space-x-4 mt-1">
                                  <span className="text-sm text-gray-300">
                                    {sp?.hasPrice ? formatPrice(sp?.price || 0) : "Prix non défini"}
                                  </span>
                                  {sp?.isPromotion && (
                                    <Badge variant="secondary" className="bg-yellow-600 text-white">
                                      PROMO
                                    </Badge>
                                  )}
                                  <Badge variant={sp?.isAvailable ? "default" : "destructive"}>
                                    {sp?.isAvailable ? "Disponible" : "Indisponible"}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => setPriceEditData({
                                    storeId: sp?.storeId || 0,
                                    productId: sp?.productId || 0,
                                    price: sp?.price || 0,
                                    isPromotion: sp?.isPromotion || false,
                                    isAvailable: sp?.isAvailable || false,
                                  })}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                  onClick={() => {
                                    if (confirm(`Êtes-vous sûr de vouloir retirer "${sp?.product?.name}" du catalogue de ce magasin ?`)) {
                                      removeProductFromStoreMutation.mutate({
                                        storeId: sp?.storeId || 0,
                                        productId: sp?.productId || 0,
                                      });
                                    }
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Price Edit Dialog */}
      <Dialog open={!!priceEditData} onOpenChange={() => setPriceEditData(null)}>
        <DialogContent className="bg-gray-800 border-gray-700 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Modifier le prix</DialogTitle>
          </DialogHeader>
          {priceEditData && (
            <PriceEditForm 
              data={priceEditData}
              onSubmit={updatePriceMutation.mutate}
              onCancel={() => setPriceEditData(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Store Edit Dialog */}
      <Dialog open={!!storeEditData} onOpenChange={() => setStoreEditData(null)}>
        <DialogContent className="bg-gray-800 border-gray-700 max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Modifier le magasin</DialogTitle>
          </DialogHeader>
          {storeEditData && (
            <StoreEditForm 
              store={storeEditData}
              onSubmit={(data) => updateStoreMutation.mutate({ id: storeEditData.id, data })}
              onCancel={() => setStoreEditData(null)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <BottomNavigation />
    </div>
  );
}

// Product Form Component
function ProductForm({ 
  product, 
  onSubmit 
}: { 
  product?: ProductType; 
  onSubmit: (data: InsertProduct) => void; 
}) {
  const [name, setName] = useState(product?.name || "");
  const [brand, setBrand] = useState(product?.brand || "");
  const [category, setCategory] = useState(product?.category || "");
  const [unit, setUnit] = useState(product?.unit || "");
  const [description, setDescription] = useState(product?.description || "");
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      brand: brand || null,
      category: category || null,
      unit: unit || null,
      description: description || null,
      imageUrl: imageUrl || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-white">Nom du produit</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-gray-700 border-gray-600 text-white"
          required
        />
      </div>
      <div>
        <Label htmlFor="brand" className="text-white">Marque</Label>
        <Input
          id="brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="bg-gray-700 border-gray-600 text-white"
        />
      </div>
      <div>
        <Label htmlFor="category" className="text-white">Catégorie</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="Sélectionner une catégorie" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="alimentation">Alimentation</SelectItem>
            <SelectItem value="boissons">Boissons</SelectItem>
            <SelectItem value="produits-laitiers">Produits laitiers</SelectItem>
            <SelectItem value="viande-poisson">Viande et poisson</SelectItem>
            <SelectItem value="fruits-legumes">Fruits et légumes</SelectItem>
            <SelectItem value="boulangerie">Boulangerie</SelectItem>
            <SelectItem value="hygiene">Hygiène</SelectItem>
            <SelectItem value="maison">Maison</SelectItem>
            <SelectItem value="autres">Autres</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="unit" className="text-white">Unité</Label>
        <Input
          id="unit"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="bg-gray-700 border-gray-600 text-white"
          placeholder="kg, l, pièce, etc."
        />
      </div>
      <div>
        <Label htmlFor="description" className="text-white">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-gray-700 border-gray-600 text-white"
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="imageUrl" className="text-white">URL de l'image</Label>
        <Input
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="bg-gray-700 border-gray-600 text-white"
          placeholder="https://..."
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          {product ? "Modifier" : "Créer"}
        </Button>
      </div>
    </form>
  );
}

// Store Edit Form Component
function StoreEditForm({ 
  store, 
  onSubmit,
  onCancel 
}: { 
  store: StoreWithRating; 
  onSubmit: (data: InsertStore) => void; 
  onCancel: () => void;
}) {
  const [name, setName] = useState(store?.name || "");
  const [brand, setBrand] = useState(store?.brand || "");
  const [address, setAddress] = useState(store?.address || "");
  const [city, setCity] = useState(store?.city || "");
  const [postalCode, setPostalCode] = useState(store?.postalCode || "");
  const [phone, setPhone] = useState(store?.phone || "");
  const [latitude, setLatitude] = useState(store?.latitude?.toString() || "");
  const [longitude, setLongitude] = useState(store?.longitude?.toString() || "");
  const [openingHours, setOpeningHours] = useState(store?.openingHours || "");
  const [tags, setTags] = useState(store?.tags?.join(", ") || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      brand: brand || null,
      address,
      city,
      postalCode: postalCode || null,
      phone: phone || null,
      latitude: latitude ? parseFloat(latitude) : 0,
      longitude: longitude ? parseFloat(longitude) : 0,
      openingHours: openingHours || null,
      tags: tags ? tags.split(",").map(tag => tag.trim()).filter(Boolean) : [],
    });
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-white">Nom du magasin</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-gray-700 border-gray-600 text-white"
          required
        />
      </div>
      <div>
        <Label htmlFor="brand" className="text-white">Enseigne</Label>
        <Select value={brand} onValueChange={setBrand}>
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="Sélectionner une enseigne" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="aldi">Aldi</SelectItem>
            <SelectItem value="lidl">Lidl</SelectItem>
            <SelectItem value="delhaize">Delhaize</SelectItem>
            <SelectItem value="carrefour">Carrefour</SelectItem>
            <SelectItem value="colruyt">Colruyt</SelectItem>
            <SelectItem value="okay">Okay</SelectItem>
            <SelectItem value="autre">Autre</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="address" className="text-white">Adresse</Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="bg-gray-700 border-gray-600 text-white"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city" className="text-white">Ville</Label>
          <Input
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>
        <div>
          <Label htmlFor="postalCode" className="text-white">Code postal</Label>
          <Input
            id="postalCode"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="phone" className="text-white">Téléphone</Label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="bg-gray-700 border-gray-600 text-white"
          placeholder="+32 XX XX XX XX"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="latitude" className="text-white">Latitude</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
        <div>
          <Label htmlFor="longitude" className="text-white">Longitude</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="openingHours" className="text-white">Heures d'ouverture</Label>
        <Textarea
          id="openingHours"
          value={openingHours}
          onChange={(e) => setOpeningHours(e.target.value)}
          className="bg-gray-700 border-gray-600 text-white"
          placeholder="Lun-Ven: 8h-20h, Sam: 8h-19h, Dim: 9h-18h"
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="tags" className="text-white">Tags (séparés par des virgules)</Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="bg-gray-700 border-gray-600 text-white"
          placeholder="parking, drive, bio, halal"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} className="border-gray-600 text-gray-300">
          Annuler
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          Modifier
        </Button>
      </div>
    </form>
  );
}

// Add Product to Store Form Component
function AddProductToStoreForm({ 
  store, 
  products, 
  onSubmit 
}: { 
  store: StoreWithRating; 
  products: ProductType[]; 
  onSubmit: (data: { storeId: number; productId: number; price: number }) => void; 
}) {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [price, setPrice] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProductId && price) {
      onSubmit({
        storeId: store?.id || 0,
        productId: selectedProductId,
        price: parseFloat(price),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="product" className="text-white">Produit</Label>
        <Select onValueChange={(value) => setSelectedProductId(parseInt(value))}>
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="Sélectionner un produit" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            {products.map((product) => (
              <SelectItem key={product?.id || Math.random()} value={product?.id?.toString() || ''}>
                {product?.name || 'Produit sans nom'} {product?.brand && `(${product.brand})`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="price" className="text-white">Prix (€)</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="bg-gray-700 border-gray-600 text-white"
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="submit" className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </div>
    </form>
  );
}

// Price Edit Form Component
function PriceEditForm({ 
  data, 
  onSubmit, 
  onCancel 
}: { 
  data: { storeId: number; productId: number; price: number; isPromotion: boolean; isAvailable: boolean };
  onSubmit: (data: { storeId: number; productId: number; price: number; isPromotion: boolean; isAvailable: boolean }) => void;
  onCancel: () => void;
}) {
  const [price, setPrice] = useState(data.price.toString());
  const [isPromotion, setIsPromotion] = useState(data.isPromotion);
  const [isAvailable, setIsAvailable] = useState(data.isAvailable);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      storeId: data.storeId,
      productId: data.productId,
      price: parseFloat(price),
      isPromotion,
      isAvailable,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="price" className="text-white">Prix (€)</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="bg-gray-700 border-gray-600 text-white"
          required
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="promotion"
          checked={isPromotion}
          onCheckedChange={setIsPromotion}
        />
        <Label htmlFor="promotion" className="text-white">En promotion</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="available"
          checked={isAvailable}
          onCheckedChange={setIsAvailable}
        />
        <Label htmlFor="available" className="text-white">Disponible</Label>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Annuler
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          Sauvegarder
        </Button>
      </div>
    </form>
  );
}