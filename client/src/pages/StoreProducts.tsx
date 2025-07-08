import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ShoppingCart, Star, MapPin, ThumbsUp, ThumbsDown, AlertTriangle, Edit, Navigation, Flag, Plus } from "lucide-react";
import { UnifiedHeader } from "@/components/UnifiedHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import { useToast } from "@/hooks/use-toast";
import { BottomNavigation } from "@/components/BottomNavigation";
import { PriceEditDialog } from "@/components/PriceEditDialog";

import { apiRequest } from "@/lib/queryClient";
import { getCategoryInfo } from "@/lib/categories";

import type { Store, Product, StoreProduct } from "@shared/schema";

interface StoreProductWithDetails extends StoreProduct {
  product: Product;
  price?: number | null;
  hasPrice?: boolean;
  isPromotion?: boolean;
  priceVotes?: {
    correct: number;
    incorrect: number;
    outdated: number;
  };
  userVote?: string | null;
}

export function StoreProducts() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [addPriceDialogProduct, setAddPriceDialogProduct] = useState<StoreProductWithDetails | null>(null);
  const [editPriceDialogProduct, setEditPriceDialogProduct] = useState<StoreProductWithDetails | null>(null);
  const [voteDialogProduct, setVoteDialogProduct] = useState<StoreProductWithDetails | null>(null);
  const [newPrice, setNewPrice] = useState("");
  const [newPriceComment, setNewPriceComment] = useState("");
  const [isPromotion, setIsPromotion] = useState(false);

  // Récupérer les détails du magasin
  const { data: store } = useQuery<Store>({
    queryKey: [`/api/stores/${id}`],
    enabled: !!id,
  });

  // Récupérer les produits du magasin
  const { data: storeProducts = [], isLoading } = useQuery<StoreProductWithDetails[]>({
    queryKey: [`/api/stores/${id}/products`],
    enabled: !!id,
  });





  // Mutation pour ajouter un prix
  const addPriceMutation = useMutation({
    mutationFn: async (priceData: any) => {
      return await apiRequest("POST", "/api/contributions", priceData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/stores/${id}/products`] });
      setAddPriceDialogProduct(null);
      setNewPrice("");
      setNewPriceComment("");
      setIsPromotion(false);
      toast({
        title: "Prix ajouté",
        description: "Votre contribution de prix a été enregistrée et sera vérifiée par notre équipe.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le prix.",
        variant: "destructive",
      });
    },
  });

  // Fonction pour naviguer vers le signalement avec données pré-remplies
  const handleReport = (storeProduct: any) => {


    
    const reportData = {
      type: "price_update", // Toujours price_update, que le prix existe ou non
      storeId: store?.id,
      productId: storeProduct.product?.id || storeProduct.productId,
      storeName: store?.name,
      productName: storeProduct.product?.name,
      currentPrice: storeProduct.price || "non_renseigne"
    };
    

    
    const queryParams = new URLSearchParams();
    Object.entries(reportData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
    
    const reportUrl = `/report?${queryParams.toString()}`;

    
    navigate(reportUrl);
  };

  // Fonction pour signaler un produit manquant
  const handleMissingProduct = () => {
    const reportData = {
      type: "add_product_to_store",
      storeId: store?.id,
      storeName: store?.name,
      comment: `Demande d'ajout de produit dans le magasin ${store?.name}`
    };
    
    const queryParams = new URLSearchParams();
    Object.entries(reportData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
    
    navigate(`/report?${queryParams.toString()}`);
  };

  // Fonction pour ouvrir les applications GPS
  const handleOpenGPS = () => {
    if (!store) return;
    
    const address = `${store.address}, ${store.city}`;
    const coordinates = `${store.latitude},${store.longitude}`;
    
    // Détecter si on est sur mobile ou desktop
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Sur mobile, essayer d'ouvrir les apps natives
      const apps = [
        { name: 'Waze', url: `https://waze.com/ul?ll=${coordinates}&navigate=yes&zoom=17` },
        { name: 'Google Maps', url: `https://maps.google.com/?q=${coordinates}&navigate=yes` },
        { name: 'Plans (iOS)', url: `maps://maps.google.com/?q=${coordinates}` }
      ];
      
      // Essayer d'ouvrir Waze en premier, puis Google Maps en fallback
      const wazeUrl = apps[0].url;
      const googleMapsUrl = apps[1].url;
      
      // Tentative d'ouverture de Waze
      const wazeWindow = window.open(wazeUrl, '_blank');
      
      // Si Waze ne s'ouvre pas après 2 secondes, ouvrir Google Maps
      setTimeout(() => {
        if (wazeWindow) {
          wazeWindow.close();
        }
        window.open(googleMapsUrl, '_blank');
      }, 2000);
    } else {
      // Sur desktop, ouvrir Google Maps dans un nouvel onglet
      window.open(`https://maps.google.com/?q=${coordinates}`, '_blank');
    }
    
    toast({
      title: "Navigation lancée",
      description: `Ouverture de l'itinéraire vers ${store.name}`,
    });
  };

  const handleAddPrice = () => {
    if (!addPriceDialogProduct || !id || !newPrice) return;
    
    const price = parseFloat(newPrice);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un prix valide.",
        variant: "destructive",
      });
      return;
    }

    const priceData = {
      type: "price",
      productId: addPriceDialogProduct.productId,
      storeId: parseInt(id),
      data: {
        price: price,
        isAvailable: true,
        isPromotion: isPromotion,
        productName: addPriceDialogProduct.product?.name,
        storeName: store?.name,
        comment: newPriceComment,
      },
    };

    addPriceMutation.mutate(priceData);
  };



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Chargement...
            </h1>
          </div>
        </div>
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 max-w-sm mx-auto w-full">
      <UnifiedHeader 
        title={store?.name || "Produits du magasin"}
        subtitle={
          <div className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-white/80">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{store?.city}</span>
            <Badge variant="secondary" className="capitalize text-xs flex-shrink-0 bg-white/20 text-white border-white/30">
              {store?.brand}
            </Badge>
          </div>
        }
        showBackButton={true}
        showContribute={true}
        customAction={
          <Button
            onClick={handleOpenGPS}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 transition-all duration-300 p-2"
            title="Ouvrir GPS/Navigation"
          >
            <Navigation className="h-5 w-5" />
          </Button>
        }
      />
      
      <div className="pt-24 px-2 sm:px-4 py-2 sm:py-3">
      </div>

      {/* Products List */}
      <div className="p-2 sm:p-4">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Catalogue des produits
            </h2>
            <Button
              onClick={handleMissingProduct}
              variant="outline"
              size="sm"
              className="text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 border-blue-600 dark:border-blue-400"
            >
              <Plus className="h-4 w-4 mr-2" />
              Un produit manquant?
            </Button>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {storeProducts.length} produit{storeProducts.length > 1 ? 's' : ''} référencé{storeProducts.length > 1 ? 's' : ''}
          </p>
        </div>

        {storeProducts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Aucun produit référencé
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Soyez le premier à ajouter des produits à ce magasin.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Les produits peuvent être ajoutés via le panel d'administration.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {storeProducts.map((storeProduct) => (
              <Card 
                key={storeProduct.id} 
                className="hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-900/20 border-gray-200 dark:border-gray-700"
                onClick={() => navigate(`/product/${storeProduct.product?.id || storeProduct.productId}`)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-2 sm:gap-3">
                    {/* Image du produit */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl flex-shrink-0 overflow-hidden relative shadow-inner">
                      {(storeProduct.product?.imageUrl || storeProduct.product?.image) ? (
                        <img 
                          src={storeProduct.product?.imageUrl || storeProduct.product?.image} 
                          alt={storeProduct.product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.parentNode?.querySelector('.fallback-icon') as HTMLDivElement;
                            if (fallback) {
                              fallback.style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      <div className={`fallback-icon absolute inset-0 w-full h-full flex items-center justify-center ${(storeProduct.product?.imageUrl || storeProduct.product?.image) ? 'hidden' : 'flex'}`}>
                        <ShoppingCart className="h-4 w-4 sm:h-6 sm:w-6 text-gray-400" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-base truncate">
                            {storeProduct.product?.name || 'Produit sans nom'}
                          </h3>
                          {storeProduct.product?.category && (
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${getCategoryInfo(storeProduct.product.category).color}`}
                            >
                              {getCategoryInfo(storeProduct.product.category).label}
                            </Badge>
                          )}
                        </div>
                        
                        {/* Prix spécifique à ce magasin */}
                        <div className="text-right">
                          {storeProduct.hasPrice && storeProduct.price ? (
                            <div className="space-y-1">
                              <div className={`font-bold text-lg ${storeProduct.isPromotion ? 'text-red-600' : 'text-blue-600'}`}>
                                €{Number(storeProduct.price).toFixed(2)}
                                {storeProduct.isPromotion && (
                                  <Badge variant="destructive" className="text-xs ml-1">PROMO</Badge>
                                )}
                              </div>
                              

                            </div>
                          ) : (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Prix non renseigné
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {storeProduct.product?.brand && (
                          <span className="truncate text-blue-600 dark:text-blue-400 font-medium">{storeProduct.product.brand}</span>
                        )}
                        {storeProduct.product?.unit && (
                          <span className="truncate font-medium">• {storeProduct.product.unit}</span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-wrap">
                          <Badge 
                            variant={storeProduct.isAvailable ? "default" : "destructive"}
                            className="text-xs font-medium"
                          >
                            {storeProduct.isAvailable ? "En stock" : "Rupture"}
                          </Badge>
                          {storeProduct.lastChecked && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Vérifié le {new Date(storeProduct.lastChecked).toLocaleDateString('fr-BE')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Dialog de vote sur les prix */}
      <Dialog open={!!voteDialogProduct} onOpenChange={(open) => !open && setVoteDialogProduct(null)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Évaluer le prix</DialogTitle>
          </DialogHeader>
          
          {voteDialogProduct && (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium">{voteDialogProduct.product?.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{store?.name}</p>
                <p className="text-lg font-bold text-blue-600">
                  €{Number(voteDialogProduct.price).toFixed(2)}
                </p>
              </div>

              <div className="space-y-3">
                <Label>Ce prix vous semble-t-il correct ?</Label>
                
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    onClick={() => handlePriceVote("correct")}
                    disabled={priceVoteMutation.isPending}
                    className="justify-start"
                    variant="outline"
                  >
                    <ThumbsUp className="h-4 w-4 mr-2 text-green-600" />
                    Oui, le prix est correct
                  </Button>
                  
                  <Button
                    onClick={() => handlePriceVote("incorrect")}
                    disabled={priceVoteMutation.isPending}
                    className="justify-start"
                    variant="outline"
                  >
                    <ThumbsDown className="h-4 w-4 mr-2 text-red-600" />
                    Non, le prix est incorrect
                  </Button>
                  
                  <Button
                    onClick={() => handlePriceVote("outdated")}
                    disabled={priceVoteMutation.isPending}
                    className="justify-start"
                    variant="outline"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2 text-orange-600" />
                    Le prix est obsolète
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="suggestedPrice">
                  Prix suggéré (optionnel)
                </Label>
                <Input
                  id="suggestedPrice"
                  type="number"
                  step="0.01"
                  placeholder="ex: 2.99"
                  value={suggestedPrice}
                  onChange={(e) => setSuggestedPrice(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">
                  Commentaire (optionnel)
                </Label>
                <Textarea
                  id="comment"
                  placeholder="Précisions sur votre évaluation..."
                  value={voteComment}
                  onChange={(e) => setVoteComment(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog pour ajouter un prix */}
      <Dialog open={!!addPriceDialogProduct} onOpenChange={() => setAddPriceDialogProduct(null)}>
        <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter un prix</DialogTitle>
          </DialogHeader>
          
          {addPriceDialogProduct && (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium">{addPriceDialogProduct.product?.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{store?.name}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPrice">
                  Prix (€) *
                </Label>
                <Input
                  id="newPrice"
                  type="number"
                  step="0.01"
                  placeholder="ex: 2.99"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPromo"
                  checked={isPromotion}
                  onChange={(e) => setIsPromotion(e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="isPromo">
                  Ce produit est en promotion
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPriceComment">
                  Commentaire (optionnel)
                </Label>
                <Textarea
                  id="newPriceComment"
                  placeholder="Précisions sur le prix..."
                  value={newPriceComment}
                  onChange={(e) => setNewPriceComment(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={handleAddPrice}
                  disabled={addPriceMutation.isPending || !newPrice}
                  className="flex-1"
                >
                  {addPriceMutation.isPending ? "Ajout..." : "Ajouter le prix"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setAddPriceDialogProduct(null)}
                  disabled={addPriceMutation.isPending}
                >
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Price Edit Dialog */}
      {editPriceDialogProduct && store && (
        <PriceEditDialog
          isOpen={!!editPriceDialogProduct}
          onClose={() => setEditPriceDialogProduct(null)}
          product={{
            id: editPriceDialogProduct.productId,
            name: editPriceDialogProduct.product?.name || '',
            brand: editPriceDialogProduct.product?.brand,
            category: editPriceDialogProduct.product?.category,
            image: editPriceDialogProduct.product?.imageUrl || editPriceDialogProduct.product?.image
          }}
          store={{
            id: store.id,
            name: store.name,
            brand: store.brand
          }}
          currentPrice={editPriceDialogProduct.price ? Number(editPriceDialogProduct.price) : undefined}
          isPromotion={editPriceDialogProduct.isPromotion}
        />
      )}



      <BottomNavigation />
    </div>
  );
}

export default StoreProducts;