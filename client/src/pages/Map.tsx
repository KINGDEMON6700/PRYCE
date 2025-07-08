import { MapPin } from "lucide-react";
import { UnifiedHeader } from "@/components/UnifiedHeader";
import { BottomNavigation } from "@/components/BottomNavigation";
import MapViewGoogle from "@/components/MapViewGoogle";
import { useLocation } from "wouter";

export default function Map() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gray-900 text-white max-w-sm mx-auto w-full">
      <UnifiedHeader 
        title="Carte des magasins"
        showBackButton={true}
        showLocation={false}
        showNotifications={false}
        showContribute={true}
        showProfile={false}
        onBack={() => navigate("/")}
      />
      
      <div className="p-2 sm:p-4 pt-20">
        <MapViewGoogle />
      </div>

      <BottomNavigation />
    </div>
  );
}