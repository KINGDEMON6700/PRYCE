import { PageHeader } from "@/components/PageHeader";
import { Settings, User, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleMapsSettings } from "@/components/GoogleMapsSettings";
import { BrandConfigManager } from "@/components/BrandConfigManager";
import { AdminNavigation } from "@/components/AdminNavigation";

export default function AdminSettings() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gray-900">
      <PageHeader 
        title="Paramètres" 
        icon={<Settings className="h-6 w-6" />}
        showProfileButton={false}
        customAction={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/profile')}
            className="text-white hover:bg-white/20"
          >
            <User className="h-4 w-4 mr-1" />
            Profil
          </Button>
        }
      />
      
      <AdminNavigation 
        statsCount={{
          stores: 0,
          products: 0,
          pendingContributions: 0
        }}
      />

      <main className="p-4 pt-32">
        <div className="space-y-6">
          {/* Configuration Google Maps */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Configuration Google Maps
              </CardTitle>
              <p className="text-gray-400 text-sm">
                Configurez votre clé API Google Maps pour afficher les cartes interactives
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <GoogleMapsSettings />
            </CardContent>
          </Card>

          {/* Configuration des marques */}
          <BrandConfigManager />

          {/* Autres paramètres */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Paramètres généraux
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-gray-400">
                <p>Configuration générale de l'application.</p>
                <p className="text-sm mt-2">D'autres paramètres seront ajoutés ici prochainement.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}