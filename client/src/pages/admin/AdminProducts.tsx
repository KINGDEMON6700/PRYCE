import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ProductForm } from "@/components/forms/ProductForm";
import { Plus, Edit, Trash2, Package, Barcode } from "lucide-react";
import { useAdminProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/useProducts";
import { getCategoryInfo } from "@/lib/categories";
import type { Product, InsertProduct } from "@shared/schema";
import { PageHeader } from "@/components/PageHeader";
import { AdminNavigation } from "@/components/AdminNavigation";

export default function AdminProducts() {
  const [, setLocation] = useLocation();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Hooks pour la gestion des produits
  const { data: products = [], isLoading } = useAdminProducts();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const handleCreateProduct = (data: InsertProduct) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setShowCreateDialog(false);
      },
    });
  };

  const handleUpdateProduct = (data: InsertProduct) => {
    if (!selectedProduct) return;
    updateMutation.mutate({ id: selectedProduct.id, data }, {
      onSuccess: () => {
        setShowEditDialog(false);
        setSelectedProduct(null);
      },
    });
  };

  const handleDeleteProduct = (product: Product) => {
    deleteMutation.mutate(product.id, {
      onSuccess: () => {
        // Succès géré par le hook
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <PageHeader 
        title="Gestion des Produits"
        icon={<Package className="h-6 w-6" />}
      />

      <AdminNavigation 
        statsCount={{
          stores: 0,
          products: products.length,
          pendingContributions: 0
        }}
      />

      <main className="container mx-auto px-4 py-8 pt-32">
        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold">
              {products.length} produit{products.length > 1 ? 's' : ''} total
            </h2>
          </div>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un produit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nouveau Produit</DialogTitle>
              </DialogHeader>
              <ProductForm
                onSubmit={handleCreateProduct}
                onCancel={() => setShowCreateDialog(false)}
                isLoading={createMutation.isPending}
                showTitle={false}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-600 rounded mb-2"></div>
                    <div className="h-3 bg-gray-600 rounded mb-4 w-3/4"></div>
                    <div className="h-3 bg-gray-600 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-white mb-2">{product.name}</CardTitle>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {product.brand && (
                          <Badge variant="outline" className="text-xs">
                            {product.brand}
                          </Badge>
                        )}
                        {product.category && (
                          <Badge className={`text-xs ${getCategoryInfo(product.category).color}`}>
                            {getCategoryInfo(product.category).label}
                          </Badge>
                        )}
                        {product.unit && (
                          <Badge variant="secondary" className="text-xs">
                            {product.unit}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Dialog open={showEditDialog && selectedProduct?.id === product.id} onOpenChange={(open) => {
                        if (!open) {
                          setShowEditDialog(false);
                          setSelectedProduct(null);
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowEditDialog(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Modifier {product.name}</DialogTitle>
                          </DialogHeader>
                          <ProductForm
                            product={selectedProduct || undefined}
                            onSubmit={handleUpdateProduct}
                            onCancel={() => {
                              setShowEditDialog(false);
                              setSelectedProduct(null);
                            }}
                            isLoading={updateMutation.isPending}
                            showTitle={false}
                          />
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer le produit</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer "{product.name}" ? Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteProduct(product)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {product.imageUrl && (
                      <div className="w-full h-32 bg-gray-700 rounded-lg overflow-hidden">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    {product.description && (
                      <p className="text-sm text-gray-300 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    {product.barcode && (
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Barcode className="h-4 w-4 flex-shrink-0" />
                        <span className="font-mono">{product.barcode}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <Badge variant={product.isActive !== false ? "default" : "secondary"}>
                        {product.isActive !== false ? "Actif" : "Inactif"}
                      </Badge>
                      
                      <div className="text-sm text-gray-400">
                        ID: {product.id}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3"
                      onClick={() => setLocation(`/products/${product.id}`)}
                    >
                      Voir les détails
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && products.length === 0 && (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-12 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Aucun produit</h3>
              <p className="text-gray-400 mb-4">Commencez par ajouter votre premier produit.</p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un produit
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}