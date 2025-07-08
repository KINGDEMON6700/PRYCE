import { Search, MapPin, Tag, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterChange?: (filters: string[]) => void;
}

export function SearchBar({ onSearch, onFilterChange }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>(["proximity"]);

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const toggleFilter = (filter: string) => {
    const newFilters = activeFilters.includes(filter)
      ? activeFilters.filter(f => f !== filter)
      : [...activeFilters, filter];
    
    setActiveFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return (
    <div className="p-2 sm:p-4 bg-pryce-gray dark:bg-gray-800">
      <div className="relative">
        <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
        <Input
          type="text"
          placeholder="Rechercher un produit..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pryce-blue focus:border-transparent text-sm sm:text-base"
        />
      </div>


    </div>
  );
}
