import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { StoreForm } from "@/components/forms/StoreForm";
import { SimpleStoreSearch } from "@/components/SimpleStoreSearch";
import { Plus, Edit, Trash2, MapPin, Phone, Clock, Search, Store as StoreIcon, Package } from "lucide-react";
import { useAdminStores, useCreateStore, useUpdateStore, useDeleteStore } from "@/hooks/useStores";
import type { Store, InsertStore } from "@shared/schema";
import { PageHeader } from "@/components/PageHeader";
import { AdminNavigation } from "@/components/AdminNavigation";
import { getStoreStatus, getStatusClasses } from "@/lib/storeUtils";

export default function AdminStores() {
  const [, setLocation] = useLocation();
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showSearchDialog, setShowSearchDialog] = useState(false);

  // Hooks pour la gestion des magasins
  const { data: stores = [], isLoading } = useAdminStores();
  const createMutation = useCreateStore();
  const updateMutation = useUpdateStore();
  const deleteMutation = useDeleteStore();

  const handleCreateStore = async (storeData: InsertStore) => {
    try {
      await createMutation.mutateAsync(storeData);
      setShowCreateDialog(false);
    } catch (error) {

    }
  };

  const handleEditStore = (store: Store) => {
    setSelectedStore(store);
    setShowEditDialog(true);
  };

  const handleUpdateStore = async (storeData: Partial<InsertStore>) => {
    if (!selectedStore) return;
    
    try {
      await updateMutation.mutateAsync({ id: selectedStore.id, data: storeData });
      setShowEditDialog(false);
      setSelectedStore(null);
    } catch (error) {

    }
  };

  const handleDeleteStore = async (store: Store) => {
    try {
      await deleteMutation.mutateAsync(store.id);
    } catch (error) {

    }
  };



  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <PageHeader 
        title="Gestion des Magasins"
        icon={<StoreIcon className="h-6 w-6" />}
      />

      <AdminNavigation 
        statsCount={{
          stores: stores.length,
          products: 0,
          pendingContributions: 0
        }}
      />

      <main className="container mx-auto px-4 py-8 pt-32">
        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold">
              {stores.length} magasin{stores.length > 1 ? 's' : ''} total
            </h2>
          </div>

          <div className="flex space-x-3">
            <Button 
              variant="outline"
              onClick={() => setShowSearchDialog(true)}
            >
              <Search className="h-4 w-4 mr-2" />
              Recherche assistée
            </Button>

            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un magasin
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nouveau Magasin</DialogTitle>
              </DialogHeader>
              <StoreForm
                onSubmit={handleCreateStore}
                onCancel={() => setShowCreateDialog(false)}
                isLoading={createMutation.isPending}
                showTitle={false}
              />
            </DialogContent>
          </Dialog>
          </div>
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
        ) : stores.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-8 text-center">
              <StoreIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2 text-white">Aucun magasin</h3>
              <p className="text-gray-400 mb-4">Commencez par ajouter votre premier magasin.</p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un magasin
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Stores Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => {
              const storeStatus = getStoreStatus(store.openingHours);
              
              return (
                <Card key={store.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-white mb-1">{store.name}</CardTitle>
                        <p className="text-sm text-gray-400 capitalize">{store.brand}</p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`${
                          storeStatus.color === 'green' ? 'border-green-500 text-green-400' :
                          storeStatus.color === 'orange' ? 'border-orange-500 text-orange-400' :
                          storeStatus.color === 'red' ? 'border-red-500 text-red-400' :
                          'border-gray-500 text-gray-400'
                        }`}
                      >
                        {storeStatus.status}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {/* Adresse */}
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="text-gray-300">{store.address}</p>
                          <p className="text-gray-400">{store.postalCode} {store.city}</p>
                        </div>
                      </div>

                      {/* Téléphone */}
                      {store.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <p className="text-sm text-gray-300">{store.phone}</p>
                        </div>
                      )}

                      {/* Heures d'ouverture */}
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <p className="text-sm text-gray-300">{storeStatus.text}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2 mt-4 pt-4 border-t border-gray-700">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditStore(store)}
                          className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Modifier
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setLocation(`/stores/${store.id}/products`)}
                          className="flex-1 border-blue-600 text-blue-400 hover:bg-blue-900/20"
                        >
                          <Package className="h-3 w-3 mr-1" />
                          Produits
                        </Button>
                      </div>
                      
                      <div className="flex justify-center">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-600 text-red-400 hover:bg-red-900/20"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Supprimer
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-gray-800 border-gray-700">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-white">Supprimer le magasin</AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-300">
                                Êtes-vous sûr de vouloir supprimer "{store.name}" ? Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600">
                                Annuler
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteStore(store)}
                                className="bg-red-600 hover:bg-red-700 text-white"
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
              );
            })}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifier le Magasin</DialogTitle>
            </DialogHeader>
            {selectedStore && (
              <StoreForm
                store={selectedStore}
                onSubmit={handleUpdateStore}
                onCancel={() => {
                  setShowEditDialog(false);
                  setSelectedStore(null);
                }}
                isLoading={updateMutation.isPending}
                showTitle={false}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Simple Store Search Dialog */}
        <SimpleStoreSearch
          open={showSearchDialog}
          onOpenChange={setShowSearchDialog}
          onSelect={handleCreateStore}
        />
      </main>
    </div>
  );
}