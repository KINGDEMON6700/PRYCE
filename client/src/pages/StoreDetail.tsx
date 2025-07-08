import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { UnifiedHeader } from "@/components/UnifiedHeader";
import { ProductCard } from "@/components/ProductCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Clock, Star, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import type { Store, ProductWithPrice } from "@shared/schema";

interface ProductWithStorePrice extends ProductWithPrice {
  storePrice: number | null;
  isAvailable: boolean;
  isPromotion: boolean;
}

interface StoreWithProducts extends Store {
  averageRating: number;
  ratingCount: number;
  distance?: number;
  products: ProductWithStorePrice[];
}

export default function StoreDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();

  const { data: store, isLoading } = useQuery<StoreWithProducts>({
    queryKey: ['/api/stores', id],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Magasin non trouvé</h1>
            <Link href="/stores">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux magasins
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatOpeningHours = (hours: any) => {
    if (typeof hours === 'string') return hours;
    if (typeof hours === 'object' && hours !== null) {
      const today = new Date().toLocaleLowerCase().slice(0, 3); // 'mon', 'tue', etc.
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      const frenchDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
      
      return days.map((day, index) => (
        <div key={day} className={`flex justify-between ${today === day.slice(0, 3) ? 'font-bold text-blue-400' : ''}`}>
          <span>{frenchDays[index]}</span>
          <span>{hours[day] || 'Fermé'}</span>
        </div>
      ));
    }
    return 'Horaires non disponibles';
  };

  const getBrandColor = (brand?: string) => {
    if (!brand) return 'bg-gray-600';
    switch (brand.toLowerCase()) {
      case 'delhaize': return 'bg-red-600';
      case 'aldi': return 'bg-blue-600';
      case 'lidl': return 'bg-yellow-600';
      case 'carrefour': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <UnifiedHeader 
        title={store.name}
        showBackButton={true}
        showProfile={true}
      />

      <main className="container mx-auto px-4 py-6 pt-20 space-y-6">
        {/* Store Information */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">

                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{Number(store.averageRating).toFixed(1)}</span>
                  <span className="text-gray-400">({store.ratingCount} avis)</span>
                </div>
              </div>
              {store.distance && (
                <Badge variant="outline" className="border-blue-600 text-blue-400">
                  {store.distance.toFixed(1)} km
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Address */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-300">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium">Adresse</span>
                </div>
                <p className="text-gray-400 ml-6">
                  {store.address}<br />
                  {store.postalCode} {store.city}
                </p>
              </div>

              {/* Phone */}
              {store.phone && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Phone className="w-4 h-4" />
                    <span className="font-medium">Téléphone</span>
                  </div>
                  <p className="text-gray-400 ml-6">
                    <a href={`tel:${store.phone}`} className="hover:text-blue-400 transition-colors">
                      {store.phone}
                    </a>
                  </p>
                </div>
              )}
            </div>

            {/* Opening Hours */}
            {store.openingHours && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-300">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">Horaires d'ouverture</span>
                </div>
                <div className="ml-6 space-y-1 text-sm">
                  {formatOpeningHours(store.openingHours)}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Products */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Produits disponibles</span>
              <Badge variant="outline" className="text-blue-400 border-blue-600">
                {store.products?.length || 0} produits
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {store.products && store.products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {store.products.map((product) => (
                  <Card key={product.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
                        onClick={() => setLocation(`/product/${product.id}`)}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                          <img 
                            src={product.image || `/api/placeholder/64/64`} 
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `/api/placeholder/64/64`;
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium truncate">{product.name}</h3>
                          <p className="text-gray-400 text-sm">
                            {product.brand && `${product.brand} • `}{product.unit || 'unité'}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-2">
                              {product.storePrice ? (
                                <span className={`text-lg font-bold ${product.isPromotion ? 'text-red-400' : 'text-green-400'}`}>
                                  {product.storePrice}€
                                </span>
                              ) : (
                                <span className="text-gray-500">Prix non disponible</span>
                              )}
                              {product.isPromotion && (
                                <Badge variant="destructive" className="text-xs">
                                  PROMO
                                </Badge>
                              )}
                            </div>
                            <Badge variant={product.isAvailable ? "default" : "secondary"} className="text-xs">
                              {product.isAvailable ? "Disponible" : "Rupture"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>Aucun produit disponible pour ce magasin</p>
                <p className="text-sm mt-2">Les produits seront bientôt ajoutés</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}