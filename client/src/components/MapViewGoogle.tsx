import { useState, useEffect, useCallback, useMemo } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { useLocation } from "wouter";
import { useStores } from "@/hooks/useStores";
import { useGoogleMaps } from "@/contexts/GoogleMapsContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Star, Eye } from "lucide-react";
import type { StoreWithRating } from "@shared/schema";

// Calcul de distance entre deux points géographiques
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Icônes des magasins
function getStoreIcon(brand: string): string {
  const icons: { [key: string]: string } = {
    'aldi': 'https://upload.wikimedia.org/wikipedia/commons/4/44/Aldi_logo.svg',
    'lidl': 'https://upload.wikimedia.org/wikipedia/commons/9/91/Lidl-Logo.svg',
    'delhaize': 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Delhaize_logo.svg',
    'carrefour': 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Carrefour_logo.svg',
  };
  return icons[brand.toLowerCase()] || 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
}

// Interface pour les props du composant Map
interface MapProps {
  center: google.maps.LatLngLiteral;
  zoom: number;
  stores: StoreWithRating[];
  selectedStore: StoreWithRating | null;
  userLocation: google.maps.LatLngLiteral | null;
  navigate: (path: string) => void;
}

// Composant GoogleMap optimisé
function GoogleMap({ center, zoom, stores, selectedStore, userLocation, navigate }: MapProps) {
  const [map, setMap] = useState<google.maps.Map>();
  const [markers, setMarkers] = useState<Map<number, google.maps.Marker>>(new Map<number, google.maps.Marker>());
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow>();

  // Initialisation de la carte (une seule fois)
  useEffect(() => {
    if (!map && center && center.lat && center.lng && typeof center.lat === 'number' && typeof center.lng === 'number') {
      const newMap = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center,
        zoom,
        styles: [
          {
            featureType: "all",
            elementType: "geometry",
            stylers: [{ color: "#1f2937" }],
          },
          {
            featureType: "all",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d1d5db" }],
          },
          {
            featureType: "all",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#1f2937" }],
          },
          {
            featureType: "administrative",
            elementType: "geometry.stroke",
            stylers: [{ color: "#374151" }],
          },
          {
            featureType: "landscape",
            elementType: "geometry",
            stylers: [{ color: "#374151" }],
          },
          {
            featureType: "poi",
            elementType: "geometry",
            stylers: [{ color: "#4b5563" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#6b7280" }],
          },
          {
            featureType: "road.arterial",
            elementType: "geometry",
            stylers: [{ color: "#4b5563" }],
          },
          {
            featureType: "road.local",
            elementType: "geometry",
            stylers: [{ color: "#374151" }],
          },
          {
            featureType: "transit",
            elementType: "geometry",
            stylers: [{ color: "#374151" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#1e40af" }],
          },
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });
      
      setMap(newMap);
      setInfoWindow(new google.maps.InfoWindow());
    }
  }, [center, zoom]);

  // Gestion des markers des magasins
  useEffect(() => {
    if (!map || !infoWindow) return;

    // Nettoyer les anciens markers
    markers.forEach(marker => marker.setMap(null));
    const newMarkers = new Map<number, google.maps.Marker>();

    // Créer les nouveaux markers
    stores.forEach(store => {
      // Vérifier que les coordonnées sont valides
      const lat = Number(store.latitude);
      const lng = Number(store.longitude);
      
      if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {

        return;
      }

      const marker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map,
        title: store.name,
        icon: {
          url: getStoreIcon(store.brand),
          scaledSize: new google.maps.Size(32, 32),
        }
      });

      // Événement de clic sur le marker - navigation directe vers le catalogue
      marker.addListener('click', () => {
        // Navigation directe vers le catalogue du magasin
        navigate(`/stores/${store.id}/products`);
      });

      newMarkers.set(store.id, marker);
    });

    setMarkers(newMarkers);
  }, [map, stores, navigate]);

  // Marker utilisateur
  useEffect(() => {
    if (!map || !userLocation) return;

    new google.maps.Marker({
      position: userLocation,
      map,
      title: "Votre position",
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="6" fill="#3b82f6" stroke="white" stroke-width="3"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(20, 20),
        anchor: new google.maps.Point(10, 10)
      }
    });
  }, [map, userLocation]);

  // Mise en évidence du magasin sélectionné
  useEffect(() => {
    if (!selectedStore || !map) return;

    // Centrer la carte sur le magasin sélectionné
    const storePosition = { lat: selectedStore.latitude, lng: selectedStore.longitude };
    map.panTo(storePosition);
    map.setZoom(15);

    // Ouvrir l'info window du magasin sélectionné
    const marker = markers.get(selectedStore.id);
    if (marker && infoWindow) {
      const rating = Number(selectedStore.averageRating) || 0;
      const distance = selectedStore.distance ? Number(selectedStore.distance).toFixed(1) : 'N/A';
      const ratingCount = Number(selectedStore.ratingCount) || 0;
      
      infoWindow.setContent(`
        <div class="p-3 max-w-xs">
          <h3 class="font-semibold text-lg text-gray-900">${selectedStore.name}</h3>
          <p class="text-gray-600 capitalize">${selectedStore.brand}</p>
          <p class="text-sm text-gray-500">${selectedStore.address}</p>
          <div class="flex items-center mt-2">
            <span class="text-yellow-500">★</span>
            <span class="ml-1 text-sm">${rating.toFixed(1)} (${ratingCount} avis)</span>
          </div>
          ${distance !== 'N/A' ? `<p class="text-sm text-blue-600 mt-1">📍 ${distance} km</p>` : ''}
        </div>
      `);
      infoWindow.open(map, marker);
    }
  }, [selectedStore, map, markers, infoWindow]);

  return <div id="map" className="w-full h-full rounded-lg" />;
}

// Composant principal MapViewGoogle
export default function MapViewGoogle() {
  const [, navigate] = useLocation();
  const { data: stores = [], isLoading } = useStores();
  const { apiKey } = useGoogleMaps();
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [selectedStore, setSelectedStore] = useState<StoreWithRating | null>(null);

  // Géolocalisation de l'utilisateur
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPos);
        },
        (error) => {

          // Position par défaut (Bruxelles)
          setUserLocation({ lat: 50.8503, lng: 4.3517 });
        }
      );
    } else {
      // Position par défaut (Bruxelles)
      setUserLocation({ lat: 50.8503, lng: 4.3517 });
    }
  }, []);

  // Calcul des magasins avec distance
  const storesWithDistance = useMemo(() => {
    if (!userLocation) return stores;

    return stores.map(store => ({
      ...store,
      distance: calculateDistance(
        userLocation.lat,
        userLocation.lng,
        store.latitude,
        store.longitude
      )
    })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }, [stores, userLocation]);

  const handleViewStore = useCallback((store: StoreWithRating) => {
    navigate(`/stores/${store.id}/products`);
  }, [navigate]);

  const renderMap = () => {
    if (!apiKey) {
      return (
        <div className="w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Clé API Google Maps non configurée</p>
          </div>
        </div>
      );
    }

    const center = userLocation || { lat: 50.8503, lng: 4.3517 };
    



    return (
      <Wrapper apiKey={apiKey} render={(status) => {
        if (status === Status.LOADING) {
          return (
            <div className="w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Chargement de la carte...</p>
              </div>
            </div>
          );
        }
        if (status === Status.FAILURE) {
          return (
            <div className="w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <p className="text-red-400">Erreur de chargement de la carte</p>
              </div>
            </div>
          );
        }
        return null;
      }}>
        <div className="w-full h-96 rounded-lg overflow-hidden">
          {center && (
            <GoogleMap
              center={center}
              zoom={12}
              stores={storesWithDistance}
              selectedStore={selectedStore}

              userLocation={userLocation}
              navigate={navigate}
            />
          )}
        </div>
      </Wrapper>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="w-full h-96 bg-gray-800 rounded-lg animate-pulse"></div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-800 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Carte */}
      <div className="w-full">
        {renderMap()}
      </div>

      {/* Liste des magasins les plus proches */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Navigation className="h-5 w-5 mr-2" />
            Magasins les plus proches
            {userLocation && (
              <Badge variant="secondary" className="ml-2">
                {storesWithDistance.length} magasins
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {storesWithDistance.slice(0, 10).map(store => (
              <div
                key={store.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedStore?.id === store.id
                    ? 'border-blue-500 bg-blue-900/20'
                    : 'border-gray-600 bg-gray-700/50 hover:bg-gray-700'
                }`}
                onClick={() => handleViewStore(store)}
              >
                <div className="w-full">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-white">{store.name}</h3>
                    <Badge variant="outline" className="text-xs bg-gray-600 text-gray-200 border-gray-500">
                      {store.brand}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{store.address}</p>
                  <div className="flex items-center space-x-4">
                    {store.distance && (
                      <div className="flex items-center text-sm text-blue-400">
                        <MapPin className="h-4 w-4 mr-1" />
                        {store.distance.toFixed(1)} km
                      </div>
                    )}
                    <div className="flex items-center text-sm text-yellow-400">
                      <Star className="h-4 w-4 mr-1" />
                      {Number(store.averageRating || 0).toFixed(1)} ({store.ratingCount || 0})
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}