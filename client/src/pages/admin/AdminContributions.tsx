import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Clock, Euro, Store } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Contribution } from "@shared/schema";

export function AdminContributions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<string>("pending");

  const { data: contributions = [], isLoading } = useQuery<Contribution[]>({
    queryKey: ["/api/admin/contributions", filter],
    queryFn: () => fetch(`/api/admin/contributions?status=${filter}`).then(res => res.json()),
  });

  const approveMutation = useMutation({
    mutationFn: async (contributionId: number) => {
      const response = await apiRequest("POST", `/api/admin/contributions/${contributionId}/approve`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Contribution approuvée",
        description: "La contribution a été approuvée et intégrée.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contributions"] });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'approuver la contribution.",
        variant: "destructive",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (contributionId: number) => {
      const response = await apiRequest("POST", `/api/admin/contributions/${contributionId}/reject`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Contribution rejetée",
        description: "La contribution a été rejetée.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contributions"] });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de rejeter la contribution.",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="text-orange-600"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      case "approved":
        return <Badge variant="outline" className="text-green-600"><CheckCircle className="w-3 h-3 mr-1" />Approuvé</Badge>;
      case "rejected":
        return <Badge variant="outline" className="text-red-600"><XCircle className="w-3 h-3 mr-1" />Rejeté</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "price_update":
        return "Mise à jour prix";
      case "availability_update":
        return "Disponibilité";
      case "new_product":
        return "Nouveau produit";
      case "store_info":
        return "Info magasin";
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Contributions</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant={filter === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("pending")}
            >
              En attente
            </Button>
            <Button
              variant={filter === "approved" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("approved")}
            >
              Approuvées
            </Button>
            <Button
              variant={filter === "rejected" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("rejected")}
            >
              Rejetées
            </Button>
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              Toutes
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contributions.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Aucune contribution {filter !== "all" ? filter : ""} trouvée.
              </p>
            ) : (
              contributions.map((contribution) => (
                <div key={contribution.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{getTypeLabel(contribution.type)}</Badge>
                      {getStatusBadge(contribution.status || "pending")}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(contribution.createdAt).toLocaleDateString('fr-BE')}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Utilisateur</p>
                      <p className="text-sm">{contribution.userId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Produit ID</p>
                      <p className="text-sm">{contribution.productId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Magasin ID</p>
                      <p className="text-sm">{contribution.storeId}</p>
                    </div>
                  </div>

                  {contribution.reportedPrice && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                      <div className="flex items-center space-x-2">
                        <Euro className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Prix signalé: €{contribution.reportedPrice}</span>
                      </div>
                    </div>
                  )}

                  {contribution.comment && (
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Commentaire:</p>
                      <p className="text-sm">{contribution.comment}</p>
                    </div>
                  )}

                  {contribution.status === "pending" && (
                    <div className="flex space-x-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => approveMutation.mutate(contribution.id)}
                        disabled={approveMutation.isPending}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approuver
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => rejectMutation.mutate(contribution.id)}
                        disabled={rejectMutation.isPending}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Rejeter
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}