import { Star, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import type { StoreWithRating } from "@shared/schema";
import { getStoreStatus, getStatusClasses } from "@/lib/storeUtils";

interface StoreCardProps {
  store: StoreWithRating;
  onClick?: () => void;
}

const storeBrandLogos = {
  delhaize: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Delhaize_logo.svg/200px-Delhaize_logo.svg.png",
  aldi: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Aldi_logo.svg/200px-Aldi_logo.svg.png",
  lidl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Lidl-Logo.svg/200px-Lidl-Logo.svg.png",
  carrefour: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Carrefour_logo.svg/200px-Carrefour_logo.svg.png",
};

const storeBrandColors = {
  delhaize: "bg-red-500",
  aldi: "bg-blue-600",
  lidl: "bg-yellow-500",
  carrefour: "bg-blue-500",
};

export function StoreCard({ store, onClick }: StoreCardProps) {
  const [, setLocation] = useLocation();
  const brandColor = storeBrandColors[store.brand as keyof typeof storeBrandColors] || "bg-gray-500";
  const brandLogo = storeBrandLogos[store.brand as keyof typeof storeBrandLogos];
  
  // Calcul du statut en temps réel
  const storeStatus = getStoreStatus(store.openingHours);
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setLocation(`/stores/${store.id}/products`);
    }
  };
  
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700"
      onClick={handleClick}
    >
      <CardContent className="p-3 sm:p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
            <div className={`w-12 h-12 sm:w-14 sm:h-14 ${brandColor} rounded-xl flex items-center justify-center overflow-hidden shadow-lg flex-shrink-0`}>
              {brandLogo ? (
                <img 
                  src={brandLogo} 
                  alt={store.brand}
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain p-1"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLDivElement;
                    if (fallback) fallback.style.display = 'block';
                  }}
                />
              ) : null}
              <div className={`text-white font-bold text-xs sm:text-sm ${brandLogo ? 'hidden' : 'block'}`}>
                {store.brand.substring(0, 2).toUpperCase()}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg truncate">
                {store.name}
              </h3>
              <div className="flex items-center text-gray-600 dark:text-gray-300 mt-1">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-blue-500 flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base truncate">
                  {store.distance && store.distance > 0 ? `${Number(store.distance).toFixed(1)} km` : store.city}
                </span>
              </div>
              <div className="flex items-center space-x-1 mt-1">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-2 w-2 sm:h-3 sm:w-3 ${
                        i < Math.floor(Number(store.averageRating) || 0) ? "fill-current" : ""
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {Number(store.averageRating || 0).toFixed(1)}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            {store.averageDiscount && Number(store.averageDiscount) > 0 && (
              <div className="text-xs sm:text-sm font-medium text-blue-600">
                -{Number(store.averageDiscount).toFixed(0)}%
              </div>
            )}

            <div className="flex items-center space-x-1 mt-1 justify-end">
              <div className={`w-2 h-2 rounded-full ${getStatusClasses(storeStatus.color)}`}></div>
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {storeStatus.status}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
