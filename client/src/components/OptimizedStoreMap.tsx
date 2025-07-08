import { useState, useEffect, useCallback, useMemo } from "react";
import { MapPin, Store, Navigation, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GooglePlacesService } from "@/services/googlePlaces";
import type { StoreWithRating } from "@shared/schema";

interface OptimizedStoreMapProps {
  stores: StoreWithRating[];
  userLocation?: { lat: number; lng: number };
  onStoreSelect?: (store: StoreWithRating) => void;
  selectedStoreId?: number;
  showUserLocation?: boolean;
  className?: string;
}

/**
 * Composant de carte optimisé pour l'affichage des magasins
 * Version simplifiée avec liste des magasins triés par distance
 */
export function OptimizedStoreMap({
  stores,
  userLocation,
  onStoreSelect,
  selectedStoreId,
  showUserLocation = true,
  className = "h-96 w-full"
}: OptimizedStoreMapProps) {
  const [userPos, setUserPos] = useState(userLocation);

  // Détecter la géolocalisation si pas fournie
  useEffect(() => {
    if (!userPos && showUserLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPos({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          // Géolocalisation non disponible
          // Fallback sur Bruxelles
          setUserPos({ lat: 50.8503, lng: 4.3517 });
        }
      );
    }
  }, [userPos, showUserLocation]);

  // Calculer les distances et trier les magasins
  const storesWithDistance = useMemo(() => {
    if (!userPos) return stores;

    return stores.map(store => {
      const distance = GooglePlacesService.calculateDistance(
        userPos.lat,
        userPos.lng,
        parseFloat(store.latitude),
        parseFloat(store.longitude)
      );
      return { ...store, distance };
    }).sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }, [stores, userPos]);

  return (
    <Card className={className}>
      <CardContent className="p-4 h-full overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Magasins à proximité
            </h3>
            {userPos && (
              <Badge variant="outline" className="text-xs">
                <MapPin className="h-3 w-3 mr-1" />
                Position détectée
              </Badge>
            )}
          </div>
          
          {storesWithDistance.length === 0 ? (
            <div className="text-center py-8">
              <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Aucun magasin trouvé
              </p>
            </div>
          ) : (
            storesWithDistance.map((store, index) => (
              <div
                key={store.id}
                className={`p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                  selectedStoreId === store.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                onClick={() => onStoreSelect?.(store)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {index < 3 && (
                        <Badge 
                          variant={index === 0 ? "default" : "secondary"} 
                          className="text-xs"
                        >
                          #{index + 1}
                        </Badge>
                      )}
                      <Store className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{store.name}</span>
                      <Badge variant="secondary" className="text-xs capitalize">
                        {store.brand}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {store.address}, {store.city}
                    </p>
                    
                    {store.averageRating && store.averageRating !== "0" && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-gray-600">
                          {Number(store.averageRating || 0).toFixed(1)} ({store.ratingCount || 0})
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end space-y-1">
                    {store.distance && (
                      <div className="flex items-center gap-1 text-blue-600">
                        <Navigation className="h-3 w-3" />
                        <span className="text-sm font-medium">
                          {Number(store.distance || 0).toFixed(1)} km
                        </span>
                      </div>
                    )}
                    
                    <Button size="sm" variant="outline" className="text-xs">
                      Voir produits
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {userPos && storesWithDistance.length > 0 && (
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-2 border-t">
              Magasins triés par distance depuis votre position
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}