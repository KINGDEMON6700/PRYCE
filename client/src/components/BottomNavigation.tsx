import { Home, Search, Map, Plus, User, Bell, Flag, ShoppingCart } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export function BottomNavigation() {
  const [location] = useLocation();
  const { user } = useAuth();
  
  // Vérifier si l'utilisateur est admin
  const isAdmin = user && ["44734189", "44735226", "44737331"].includes(user.id);

  const baseNavItems = [
    { icon: Home, label: "Accueil", path: "/" },
    { icon: Search, label: "Rechercher", path: "/search" },
    { icon: ShoppingCart, label: "Listes", path: "/shopping-list" },
    { icon: Map, label: "Carte", path: "/map" },
    { icon: Flag, label: "Contribuer", path: "/report" },
  ];

  const navItems = isAdmin 
    ? [...baseNavItems, { icon: User, label: "Profil", path: "/profile" }]
    : [...baseNavItems.slice(0, 4), { icon: User, label: "Profil", path: "/profile" }];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-t border-gray-600 px-2 py-3 z-50 shadow-2xl">
      <div className="flex justify-around items-center max-w-sm mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <Link key={item.path} href={item.path}>
              <button className={`flex flex-col items-center space-y-1 p-2 sm:p-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? "text-white bg-blue-600 shadow-lg transform scale-110" 
                  : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}>
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs font-semibold">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
