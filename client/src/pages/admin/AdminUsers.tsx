import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Search, Edit, Trash2, UserPlus, Mail, Calendar } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { User } from "@shared/schema";

export function AdminUsers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    queryFn: () => fetch("/api/admin/users").then(res => res.json()),
  });

  const updateUserMutation = useMutation({
    mutationFn: async (userData: { id: string; email?: string; firstName?: string; lastName?: string }) => {
      const response = await apiRequest("PUT", `/api/admin/users/${userData.id}`, userData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Utilisateur modifié",
        description: "Les informations de l'utilisateur ont été mises à jour.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setIsEditDialogOpen(false);
      setSelectedUser(null);
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'utilisateur.",
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiRequest("DELETE", `/api/admin/users/${userId}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur.",
        variant: "destructive",
      });
    },
  });

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.includes(searchTerm)
  );

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = (formData: FormData) => {
    if (!selectedUser) return;

    const userData = {
      id: selectedUser.id,
      email: formData.get("email") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
    };

    updateUserMutation.mutate(userData);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
          <CardTitle>Gestion des Utilisateurs</CardTitle>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par email, nom ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="outline" className="whitespace-nowrap">
              {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Aucun utilisateur trouvé.
              </p>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {user.profileImageUrl ? (
                        <img
                          src={user.profileImageUrl}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-500 font-medium">
                            {user.firstName?.[0] || user.email?.[0] || '?'}
                          </span>
                        </div>
                      )}
                      
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {user.firstName || user.lastName ? 
                            `${user.firstName || ''} ${user.lastName || ''}`.trim() : 
                            'Nom non défini'
                          }
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Mail className="w-3 h-3" />
                          <span>{user.email || 'Email non défini'}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>ID: {user.id}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>Inscrit le {user.createdAt ? new Date(user.createdAt.toString()).toLocaleDateString('fr-BE') : 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Modifier
                      </Button>
                      {!["44685982", "44686906"].includes(user.id) && ( // Ne pas permettre de supprimer les admins
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
                              deleteUserMutation.mutate(user.id);
                            }
                          }}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Supprimer
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog de modification */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleUpdateUser(formData);
            }} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Email
                </label>
                <Input
                  name="email"
                  type="email"
                  defaultValue={selectedUser.email || ""}
                  placeholder="email@exemple.com"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Prénom
                </label>
                <Input
                  name="firstName"
                  defaultValue={selectedUser.firstName || ""}
                  placeholder="Prénom"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Nom
                </label>
                <Input
                  name="lastName"
                  defaultValue={selectedUser.lastName || ""}
                  placeholder="Nom de famille"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  type="submit"
                  disabled={updateUserMutation.isPending}
                  className="flex-1"
                >
                  {updateUserMutation.isPending ? "Modification..." : "Modifier"}
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={updateUserMutation.isPending}
                >
                  Annuler
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}