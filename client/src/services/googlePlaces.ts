import { apiRequest } from "@/lib/queryClient";

export interface PlaceDetails {
  placeId: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  phone?: string;
  openingHours?: {
    weekday_text: string[];
    open_now?: boolean;
  };
  rating?: number;
  website?: string;
  types: string[];
}

export interface PlaceSuggestion {
  placeId: string;
  name: string;
  address: string;
  types: string[];
}

/**
 * Service pour l'intégration Google Places API
 * Gère les suggestions de magasins et la récupération des détails
 */
export class GooglePlacesService {
  
  /**
   * Recherche des suggestions de magasins basées sur une requête
   */
  static async searchStoreSuggestions(query: string, location?: { lat: number; lng: number }): Promise<PlaceSuggestion[]> {
    try {
      const params = new URLSearchParams({
        query,
        ...(location && { 
          latitude: location.lat.toString(), 
          longitude: location.lng.toString() 
        })
      });

      const response = await apiRequest("GET", `/api/places/search?${params}`);
      return response.suggestions || [];
    } catch (error) {
      console.error("Erreur lors de la recherche de suggestions:", error);
      return [];
    }
  }

  /**
   * Récupère les détails complets d'un magasin via son Place ID
   */
  static async getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
    try {
      const response = await apiRequest("GET", `/api/places/details?placeId=${placeId}`);
      return response.details || null;
    } catch (error) {
      console.error("Erreur lors de la récupération des détails:", error);
      return null;
    }
  }

  /**
   * Recherche des magasins d'une chaîne spécifique dans une zone
   */
  static async searchStoresByBrand(
    brand: string, 
    location: { lat: number; lng: number }, 
    radius: number = 5000
  ): Promise<PlaceSuggestion[]> {
    const brandQueries = {
      aldi: "Aldi supermarket",
      lidl: "Lidl supermarket", 
      delhaize: "Delhaize supermarket",
      carrefour: "Carrefour supermarket",
      okay: "Okay supermarket"
    };

    const query = brandQueries[brand.toLowerCase() as keyof typeof brandQueries] || `${brand} supermarket`;
    
    try {
      const params = new URLSearchParams({
        query,
        latitude: location.lat.toString(),
        longitude: location.lng.toString(),
        radius: radius.toString()
      });

      const response = await apiRequest("GET", `/api/places/search?${params}`);
      return response.suggestions || [];
    } catch (error) {
      console.error(`Erreur lors de la recherche ${brand}:`, error);
      return [];
    }
  }

  /**
   * Calcule la distance entre deux points géographiques
   */
  static calculateDistance(
    lat1: number, 
    lng1: number, 
    lat2: number, 
    lng2: number
  ): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRad(value: number): number {
    return value * Math.PI / 180;
  }

  /**
   * Détecte automatiquement la marque d'un magasin basé sur son nom
   */
  static detectStoreBrand(placeName: string): string {
    const name = placeName.toLowerCase();
    
    if (name.includes('aldi')) return 'aldi';
    if (name.includes('lidl')) return 'lidl'; 
    if (name.includes('delhaize')) return 'delhaize';
    if (name.includes('carrefour')) return 'carrefour';
    if (name.includes('okay')) return 'okay';
    
    return 'autre';
  }
}