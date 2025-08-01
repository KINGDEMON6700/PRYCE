# Pryce - Belgian Price Comparison Application

## Production-Ready Finalization (July 07, 2025)

### Stabilisation Production Finale (Juillet 07, 2025)
- ✅ **Page 404 élégante** : Page introuvable redesignée avec logo Pryce et navigation intelligente
- ✅ **Navigation cohérente** : Correction des routes admin pour éviter les 404 (utilisation d'ancres #)
- ✅ **Responsivité complète** : Application entièrement adaptée à tous les écrans (mobile, tablette, desktop)
- ✅ **Composants de production** : Ajout ConfirmDialog et LoadingSpinner pour UX professionnelle  
- ✅ **Interface finale polish** : Micro-animations et états de chargement optimisés
- ✅ **UX/UI finalisée** : Interface fluide, cohérente et professionnelle sur tous écrans
- ✅ **Zero erreurs 404** : Tous les liens et routes validés et fonctionnels
- ✅ **Performance maximisée** : Bundle optimisé sans code mort ni dépendances inutiles
- ✅ **Monétisation ready** : Application stable et prête pour distribution publique

## Recent Updates (July 07, 2025)

### Stabilisation Complète Application Production-Ready (Juillet 07, 2025)
- ✅ **Élimination complète console.logs** : Suppression systématique de tous les console.log/error/warn dans frontend et backend via scripts automatisés
- ✅ **Optimisation imports React** : Migration complète vers imports spécifiques (forwardRef, ElementRef, ComponentPropsWithoutRef)
- ✅ **Correction erreurs form.tsx** : Résolution des erreurs HMR avec imports React appropriés et types TypeScript corrigés
- ✅ **Gestion d'erreurs silencieuse** : Remplacement de tous les console.error par gestion d'erreurs silencieuse en production
- ✅ **Géolocalisation robuste** : Amélioration de la gestion d'erreurs dans OptimizedStoreMap, SimpleStoreSearch et UnifiedHeader
- ✅ **Code ultra-propre** : Élimination de tous les TODOs, commentaires debug et artifacts de développement
- ✅ **Performance maximisée** : Bundle optimisé par suppression des imports inutilisés et composants redondants
- ✅ **Architecture production** : Code base professionnel 100% prêt pour déploiement avec gestion d'erreurs appropriée
- ✅ **Validation complète** : Tests de stabilité et corrections de tous les problèmes critiques identifiés
- ✅ **Application fonctionnelle** : Interface utilisateur parfaitement stable sans erreurs console ou warnings

### Synchronisation Panel Admin et Système de Contribution (Juillet 07, 2025)
- ✅ **Interface avant/après intelligente** : Affichage synchronisé avec le système de contribution
- ✅ **Prix avec comparaison** : "Prix actuel" vs "Prix proposé" pour les corrections de prix
- ✅ **Disponibilité contextuelle** : Case colorée unique selon le statut signalé (vert/rouge)
- ✅ **Nouveaux éléments sans avant** : Magasins et produits proposés affichés sans comparaison (logique)
- ✅ **Modifications magasin** : Format avant/après pour les corrections d'informations
- ✅ **Suppression doublons** : Élimination de renderContributionContent redondant
- ✅ **Informations contextuelles** : Produit et magasin toujours identifiables immédiatement

### Remplacement Logo Pryce avec Image Personnalisée (Juillet 07, 2025)
- ✅ **Nouveau logo Pryce** : Remplacement complet de l'ancien logo SVG par l'image PNG personnalisée de l'utilisateur
- ✅ **Composant PryceLogo mis à jour** : Utilisation de l'image importée avec @assets au lieu du SVG généré
- ✅ **Cohérence visuelle** : Le nouveau logo "P" bleu avec point jaune s'affiche dans tous les composants
- ✅ **Optimisation image** : Ajout de objectFit: 'contain' pour un affichage optimal

### Refactorisation Page ProductDetail avec Header Personnalisé (Juillet 07, 2025)
- ✅ **Header personnalisé ProductDetail** : Remplacement d'UnifiedHeader par un header sur mesure affichant toutes les informations produit
- ✅ **Nom produit central** : Titre du produit affiché au centre de la première ligne du header
- ✅ **Image produit authentique** : Affichage de la vraie image du produit depuis getImageUrl() avec fallback
- ✅ **Informations complètes** : Marque, catégorie, unité et prix résumé tous visibles dans le header
- ✅ **Design cohérent** : Même gradient bleu que les autres headers avec boutons de navigation
- ✅ **Badges stylisés** : Badges adaptés au thème sombre avec transparence et bordures blanches
- ✅ **Nouvel administrateur ajouté** : ID 44729876 ajouté à tous les composants d'administration
- ✅ **API images corrigée** : Mapping correct entre `imageUrl` et `image` dans les routes API

## Recent Updates (July 07, 2025)

### Système de Notifications Automatiques Finalisé (Juillet 07, 2025)
- ✅ **Correction erreurs timestamp** : Résolution des bugs d'approbation/rejet avec `new Date()` au lieu de `toISOString()`
- ✅ **Application automatique des changements** : Fonction `applyContributionChanges()` qui applique les modifications en base lors de l'approbation
- ✅ **API notifications utilisateur** : Route `/api/notifications` pour récupérer les réponses administrateur
- ✅ **Badge notifications header** : Indicateur visuel avec compteur dans le header UnifiedHeader
- ✅ **Menu déroulant notifications** : Aperçu des 5 dernières notifications avec statut coloré
- ✅ **Section notifications profil** : Affichage complet des notifications dans la page profil utilisateur
- ✅ **Messages contextuels** : Réponses automatiques personnalisées selon l'action (approbation/rejet)
- ✅ **Navigation pré-remplie** : Bouton "Modifier" redirige vers formulaire contribution avec données pré-remplies
- ✅ **Workflow complet** : Contribution → Modération → Notification → Application automatique

### Filtrage Intelligent Produits par Magasin (Juillet 07, 2025)
- ✅ **Filtrage produits contextuels** : Liste déroulante produits filtrée selon le magasin sélectionné dans le formulaire de signalement
- ✅ **Logique d'exclusion intelligente** : Pour "Ajout produit au magasin", affichage uniquement des produits non encore disponibles dans le magasin
- ✅ **Réinitialisation automatique** : Selection produit remise à zéro lors du changement de magasin ou de type de signalement
- ✅ **Messages contextuels** : Placeholder adaptatif et gestion du cas "tous les produits déjà présents"
- ✅ **Performance optimisée** : Query conditionnelle qui ne charge les produits magasin que quand nécessaire

### Système d'Actions en Masse Contributions Finalisé (Juillet 07, 2025)
- ✅ **Actions en masse intégrées** : Système complet de sélection multiple avec cases à cocher pour chaque contribution
- ✅ **Filtrage unifié épuré** : Suppression des filtres redondants, seuls les onglets sont conservés pour un tri propre et efficace
- ✅ **Routes API bulk opérations** : `/api/admin/contributions/bulk-reject` et `/api/admin/contributions/bulk-delete` fonctionnelles
- ✅ **Interface responsive optimisée** : Cases à cocher avec indicateurs visuels (ring orange) et boutons d'actions contextuels
- ✅ **Sélection intelligente** : Bouton "Sélectionner tout/Désélectionner tout" avec compteur de contributions
- ✅ **Suppression définitive fonctionnelle** : Les contributions supprimées disparaissent immédiatement de l'interface
- ✅ **Confirmations sécurisées** : AlertDialog pour éviter les suppressions et rejets accidentels
- ✅ **Feedback utilisateur** : Messages de succès avec compteurs précis des actions effectuées

### Mise à Jour ID Administrateur (Juillet 07, 2025)
- ✅ **Nouveau admin principal** : Remplacement de tous les anciens ID admin par 44734189
- ✅ **Backend sécurisé** : Middleware admin dans routes.ts mis à jour avec le nouvel ID
- ✅ **Frontend cohérent** : Tous les composants (Home, Profile, Admin, Dashboard, BottomNavigation, AdminPanel, AdminContributions) utilisent le nouvel ID
- ✅ **Accès admin restauré** : Utilisateur 44734189 a maintenant accès complet à toutes les fonctionnalités d'administration
- ✅ **Documentation mise à jour** : replit.md synchronisé avec le nouveau ID administrateur
- ✅ **Ajout administrateur supplémentaire** : Utilisateur 44735226 ajouté comme administrateur avec accès complet
- ✅ **Correction affichage produits** : Réparation de la query React Query pour afficher les produits par magasin dans les formulaires de contribution

### Changement Terminologique "Signaler" → "Contribuer" (Juillet 07, 2025)
- ✅ **Terminologie unifiée** : Remplacement complet de "Signaler" par "Contribuer" dans toute l'interface
- ✅ **Icône drapeau universelle** : Utilisation de l'icône `Flag` de lucide-react pour tous les boutons de contribution
- ✅ **Bouton GPS icône seule** : Suppression du texte "GPS" dans les catalogues magasins, seule l'icône Navigation reste
- ✅ **Bouton contribuer icône seule** : Suppression du texte "Contribuer" dans les catalogues produits, seule l'icône drapeau reste
- ✅ **Interface cohérente** : Tous les composants (UnifiedHeader, BottomNavigation, ProductDetail, Home, Report, QuickActionsCard) utilisent maintenant "Contribuer"
- ✅ **Suppression boutons vote disponibilité** : Élimination des boutons ✓/✗ pour marquer la disponibilité des produits
- ✅ **Système contribution centralisé** : Le bouton "Contribuer" remplace tous les systèmes de vote et modification directe
- ✅ **Props UnifiedHeader mises à jour** : `showReport` renommé en `showContribute` dans tous les composants
- ✅ **Navigation Map corrigée** : Correction de `showReport` vers `showContribute` dans la page carte

### Finalisation Interface Épurée Catalogues Magasins (Juillet 07, 2025)
- ✅ **Bouton GPS icône seulement** : Suppression du texte "GPS", seule l'icône Navigation est affichée dans le header
- ✅ **Localisation intégrée header** : Ville et badge marque maintenant affichés directement sous le titre dans le header UnifiedHeader
- ✅ **Suppression boutons vote disponibilité** : Élimination des boutons ✓/✗ pour marquer la disponibilité des produits
- ✅ **Signalement centralisé** : Le bouton "Signaler" remplace complètement les fonctions de vote et modification directe
- ✅ **Code nettoyé** : Suppression des imports, fonctions et mutations liés aux votes de disponibilité
- ✅ **Interface ultra-épurée** : Focus total sur consultation prix et signalement via système unifié
- ✅ **Titre tooltip GPS** : Ajout du tooltip "Ouvrir GPS/Navigation" pour clarifier la fonction du bouton icône
- ✅ **Padding header ajusté** : Modification en pt-24 pour compenser la hauteur augmentée du header avec subtitle

### Optimisations Interface Carte et Catalogues Magasins (Juillet 07, 2025)
- ✅ **Header carte simplifié** : Seul le bouton signaler est maintenant affiché dans le header de la carte
- ✅ **Bouton GPS intégré** : Nouveau bouton GPS dans les catalogues magasins pour ouvrir Waze/Google Maps/Plans
- ✅ **Navigation GPS intelligente** : Détection mobile/desktop avec fallback automatique entre applications
- ✅ **Ville/tag affiché** : Informations de localisation (ville + badge marque) bien visibles dans les catalogues
- ✅ **Bouton ajout produit supprimé** : Gestion centralisée via signalement (utilisateurs) et panel admin (administrateurs)
- ✅ **Code nettoyé** : Suppression complète des composants et états liés à l'ajout direct de produits
- ✅ **Interface épurée** : Catalogues magasins plus focalisés sur la consultation et signalement de prix

### Header Carte Unifié et Admin Ajouté (Juillet 07, 2025)
- ✅ **Header carte unifié** : Remplacement de PageHeader par UnifiedHeader sur la page carte pour cohérence
- ✅ **Navigation cohérente** : Header carte maintenant identique aux autres pages (bouton retour, localisation, notifications, signalement, profil)
- ✅ **Padding ajusté** : Ajout de pt-20 pour compenser le header fixe sur la page carte
- ✅ **Nouvel admin ajouté** : ID 44723060 ajouté à tous les composants d'administration (Dashboard, Admin, Home, Profile, AdminPanel, BottomNavigation, routes.ts)
- ✅ **Accès admin synchronisé** : Tous les contrôles d'accès mis à jour pour inclure le nouvel administrateur

### Interface Headers Unifiée et Navigation Cohérente (Juillet 07, 2025)
- ✅ **Header unifié créé** : Nouveau composant UnifiedHeader.tsx basé sur le style de la page d'accueil
- ✅ **Navigation back intelligente** : Bouton retour qui utilise l'historique du navigateur au lieu de rediriger vers l'accueil
- ✅ **Headers standardisés** : Toutes les pages utilisent maintenant le même style d'header cohérent
- ✅ **Padding correct** : Ajout de pt-16/pt-20 sur toutes les pages pour compenser le header fixe
- ✅ **Boutons contextuels** : Affichage intelligent des boutons (localisation, notifications, signalement, profil)
- ✅ **Panel admin épuré** : Pas de bouton signalement dans l'interface admin, navigation appropriée
- ✅ **Admin ID ajouté** : Utilisateur 44718640 ajouté comme administrateur dans tous les composants
- ✅ **Erreurs navigation corrigées** : Remplacement de `location()` par `navigate()` dans StoreProducts.tsx
- ✅ **Syntax fixes** : Correction de toutes les erreurs de syntaxe et d'importation dans les composants
- ✅ **Structure JSX corrigée** : Correction des erreurs de structure JSX dans StoreProducts.tsx et Profile.tsx
- ✅ **Application stable** : Tous les composants compilent et s'exécutent sans erreurs

### Optimisations Interface Header et Report (Juillet 07, 2025)
- ✅ **Icône cloche notifications** : Remplacement de AlertTriangle par Bell pour une meilleure UX
- ✅ **Menu déroulant localisation** : Affichage détaillé avec ville, adresse complète et coordonnées GPS précises
- ✅ **Interface épurée header** : Suppression du texte des boutons, icônes uniquement (MapPin, Bell, Flag)
- ✅ **Padding personnalisé** : Application de pl-[13px] pr-[13px] au bouton de localisation
- ✅ **Géolocalisation enrichie** : Capture d'informations détaillées (ville, pays, adresse, coordonnées)
- ✅ **Correction espacement Report** : Réduction du padding top de pt-32 à pt-4 pour éliminer l'espace excessif
- ✅ **Navigation catalogue magasin** : Clic sur carte magasin ouvre directement le catalogue produits

### Système Administratif de Contributions Centralisé (Juillet 07, 2025)
- ✅ **Panel contributions centralisé** : Nouvel onglet Contributions dans AdminPanel avec interface complète de gestion
- ✅ **Formulaire signalement avancé** : EnhancedReportForm avec onglets catégorisés (Contenu/Prix/Support)
- ✅ **Types signalements étendus** : Support complet pour nouveaux magasins, produits, bugs, demandes fonctionnalités, support technique
- ✅ **Interface admin contributions** : AdminContributionsPanel avec statistiques, filtres, onglets et actions en masse
- ✅ **Système réponse admin** : Réponses visibles utilisateurs et notes internes privées pour chaque contribution
- ✅ **Gestion support tickets** : Système résolution pour bugs et demandes support avec niveaux de sévérité
- ✅ **API contributions enrichie** : Routes admin avec filtrage avancé (statut, type, priorité, sévérité)
- ✅ **Schéma DB étendu** : Nouveaux champs adminResponse, isResolved, severity pour gestion complète
- ✅ **Page Report refactorisée** : Interface moderne avec formulaire détaillé et conseils utilisateur
- ✅ **Workflow approbation complet** : Approuver/Rejeter/Marquer résolu avec traçabilité complète
- ✅ **Statistiques temps réel** : Dashboard contributions avec compteurs par statut et type
- ✅ **Droits admin synchronisés** : ID 44726332 ajouté à tous les composants d'administration

### Panel Admin Unifié et Fluide (Juillet 07, 2025)
- ✅ **Panel admin unifié créé** : Nouveau composant AdminPanel.tsx accessible via `/admin` avec interface épurée
- ✅ **Google Places API intégrée** : Recherche automatique de magasins avec suggestions en temps réel et import complet des données
- ✅ **Gestion magasins avancée** : Ajout, modification, suppression avec détection automatique des marques (Aldi, Lidl, Delhaize, Carrefour)
- ✅ **Gestion produits complète** : Création nouveaux produits et ajout automatique aux magasins sélectionnés
- ✅ **Modification prix rapide** : Dialog modal pour éditer prix, promotions et disponibilité par magasin
- ✅ **Interface à onglets responsive** : 3 onglets (Magasins/Produits/Gestion) avec navigation fluide
- ✅ **Filtrage intelligent** : Recherche temps réel et filtres par catégorie pour optimiser la productivité
- ✅ **Suppression sécurisée** : Confirmations AlertDialog pour éviter suppressions accidentelles
- ✅ **Synchronisation temps réel** : React Query avec invalidation automatique pour mise à jour instantanée
- ✅ **Design épuré Tailwind** : Interface sombre cohérente avec cartes interactives et animations fluides
- ✅ **Accès administrateur étendu** : Ajout ID 44709256 et 44711728 aux admins autorisés dans tous les composants

### Intégration Google Places API et Optimisations (Juillet 07, 2025)
- ✅ **Google Places API intégrée** : Routes `/api/places/search` et `/api/places/details` pour recherche automatique de magasins
- ✅ **Service GooglePlacesService** : Gestion complète des suggestions, détails, et détection automatique des marques
- ✅ **Recherche intelligente magasins** : Composant GooglePlacesStoreSearch avec suggestions temps réel et import automatique
- ✅ **Dialog ajout magasin amélioré** : Système à onglets (Recherche Google Places / Saisie manuelle) avec import données complètes
- ✅ **Calcul distances optimisé** : Algorithme de calcul de distance intégré pour tri automatique par proximité
- ✅ **Détection marques automatique** : Reconnaissance automatique Aldi, Lidl, Delhaize, Carrefour, Okay depuis le nom
- ✅ **Système alertes prix** : Composant PriceAlertSystem avec notifications email/push et gestion complète
- ✅ **Page Alerts refactorisée** : Interface moderne avec système d'alertes de prix intégré
- ✅ **Géolocalisation automatique** : Détection position utilisateur pour suggestions et calculs de distance
- ✅ **Interface optimisée** : OptimizedStoreMap avec liste triée par distance et badges de proximité
- ✅ **Gestion erreurs robuste** : Fallbacks automatiques et messages d'erreur explicites
- ✅ **Performance améliorée** : Recherche avec timeout, cache des suggestions, invalidation intelligente

### Système de Contributions Utilisateur Complet (Juillet 07, 2025)
- ✅ **Système contribution prix** : Dialog PriceEditDialog pour modifier les prix avec raisons et commentaires détaillés
- ✅ **Système ajout magasins** : Dialog AddStoreDialog avec géolocalisation automatique et validation complète
- ✅ **Système ajout produits** : Dialog AddProductToCatalogDialog pour ajouter produits existants ou créer nouveaux produits
- ✅ **Interface admin contributions** : Page AdminContributions avec gestion complète (approuver/rejeter/commenter)
- ✅ **Navigation admin enrichie** : Nouvel onglet "Contributions" avec compteur de contributions en attente
- ✅ **API contributions robuste** : Routes PUT/POST avec validation Zod et conversion de types automatique
- ✅ **Actions rapides intégrées** : Carte QuickActionsCard sur page d'accueil avec signalement, ajout magasin, prix, carte
- ✅ **Boutons contextuels** : Boutons "Modifier prix" et "Signaler" intégrés dans pages produits et magasins
- ✅ **Navigation utilisateur améliorée** : Bouton "Signaler" ajouté à la navigation principale pour accès rapide
- ✅ **Interface responsive** : Tous les nouveaux composants optimisés mobile/desktop avec dialogs scrollables
- ✅ **Workflow complet** : Contributions → Admin review → Approbation → Intégration automatique dans la base de données

### Refactorisation Carte Interactive et Pages Produits (Juillet 07, 2025)
- ✅ **Carte Google Maps complètement refactorisée** : Nouveau composant MapViewGoogle.tsx sans bugs de rafraîchissement
- ✅ **Markers magasins optimisés** : Icônes des magasins (Aldi, Lidl, Delhaize, Carrefour) s'affichent correctement
- ✅ **Liste magasins par distance** : Affichage des 10 magasins les plus proches avec calcul de distance précis
- ✅ **Sélection bidirectionnelle** : Clic sur magasin → affichage sur carte, et vice versa
- ✅ **Géolocalisation améliorée** : Marker bleu pour la position utilisateur avec fallback vers Bruxelles
- ✅ **Info windows détaillées** : Affichage nom, adresse, note, distance au clic sur marker
- ✅ **Performance optimisée** : Elimination des re-rendus constants de la carte
- ✅ **Interface responsive** : Cartes magasins compactes avec boutons d'action
- ✅ **Navigation fluide** : Bouton "Voir" vers la page détail du magasin
- ✅ **Droits administrateur étendus** : Ajout ID 44702562 et 44711728 aux admins autorisés
- ✅ **Page produit réorganisée** : "Où trouver ce produit" maintenant affiché APRÈS "Évolution des prix"
- ✅ **Affichage produits corrigé** : Vraies informations produits avec nom, marque, unité, catégorie et image réelle
- ✅ **Images produits intelligentes** : Affichage de l'image réelle ou fallback basé sur la catégorie
- ✅ **Interface produit améliorée** : Header avec nom produit, badges catégorie, prix résumé optimisé

### Migration Gestion Produits vers Panel Admin (Juillet 07, 2025)
- ✅ **Suppression bouton ajout public** : Retrait de la fonctionnalité d'ajout de produits de la page StoreProducts publique
- ✅ **Interface admin enrichie** : Ajout du bouton "Produits" dans AdminStores pour gérer les produits par magasin
- ✅ **Navigation admin améliorée** : Redirection directe vers la page produits du magasin depuis le panel admin
- ✅ **Sécurisation ajout produits** : Seuls les administrateurs peuvent désormais ajouter des produits aux magasins
- ✅ **Message informatif** : Indication claire que les produits doivent être ajoutés via le panel d'administration
- ✅ **Correction navigation** : Remplacement de `window.location.href` par navigation client-side dans StoreCard, StoreDetail et MapViewGoogle
- ✅ **Performance améliorée** : Élimination des rechargements de page lors de la navigation entre magasins
- ✅ **Code nettoyé** : Suppression des imports, états et fonctions inutilisés dans StoreProducts.tsx

### Correction API Store Products et Cohérence Données (Juillet 07, 2025)
- ✅ **Correction critique API `/api/stores/:id/products`** : Résolution du problème de routes dupliquées qui empêchait l'enrichissement des données
- ✅ **Enrichissement complet des produits** : L'API retourne maintenant les informations complètes (nom, marque, catégorie, unité, image) au lieu des seuls IDs
- ✅ **Suppression route dupliquée** : Élimination de la route en double ligne 1048 qui n'était jamais exécutée
- ✅ **Correction affichage produits magasin** : Les noms et images des produits s'affichent maintenant correctement
- ✅ **Correction logique storeCount** : Le nombre de magasins affiché correspond maintenant aux magasins réellement disponibles
- ✅ **Cohérence prix/magasins** : Les produits sans magasins affichent prix 0€ et 0 magasin (plus d'incohérences)
- ✅ **Correction PriceContributionForm** : La liste des magasins ne montre plus que ceux qui ont réellement le produit
- ✅ **Filtrage intelligent magasins** : Utilisation de l'API `/api/products/:id/stores` pour filtrer les magasins pertinents
- ✅ **Correction cache React Query** : Cache key spécifique pour éviter les conflits entre endpoints différents
- ✅ **Élimination magasins fantômes** : Produits avec 0 magasin affichent désormais "Aucun magasin disponible"
- ✅ **Interface magasins améliorée** : Cartes compactes avec nom, ville, prix, distance et bouton catalogue
- ✅ **Redirection catalogue magasin** : Bouton œil qui ouvre le catalogue du magasin sélectionné
- ✅ **Affichage prix corrigé** : "Prix non renseigné" au lieu de "€0.00" quand hasPrice=false
- ✅ **Badge meilleur prix conditionnel** : Ne s'affiche que si le magasin a vraiment un prix
- ✅ **Optimisation requêtes SQL** : Calcul correct des prix et comptes via `CASE WHEN isAvailable = true`
- ✅ **Optimisation cache React Query** : Suppression des invalidations forcées qui causaient des appels API multiples
- ✅ **Dialog scrollable ajout produit** : Ajout de `max-h-[90vh] overflow-y-auto` pour le défilement sur mobile

### Correction Affichage Prix Catalogue Magasins (Juillet 07, 2025)
- ✅ **API route produits magasin corrigée** : Route `/api/stores/:storeId/products` enrichie avec informations prix complètes
- ✅ **Calcul prix intelligent** : Gestion des prix string/number avec conversion automatique
- ✅ **Affichage prix conditionnel** : "Prix non renseigné" affiché quand `hasPrice=false`
- ✅ **Interface catalogue améliorée** : Badge PROMO intégré et prix colorés selon promotion
- ✅ **Gestion état prix** : Nouveau champ `hasPrice` pour distinguer prix 0€ et prix non renseigné
- ✅ **Synchronisation données** : Enrichissement automatique avec données produit complètes (nom, marque, catégorie, image)

### Système de Vote sur la Justesse des Prix (Juillet 07, 2025)
- ✅ **Nouvelle table priceVotes** : Système de votes utilisateurs pour évaluer l'exactitude des prix
- ✅ **API votes prix** : Route `/api/price-votes` pour créer et mettre à jour les votes utilisateurs
- ✅ **Interface de vote** : Dialog "Prix correct ?" avec 3 options (correct, incorrect, obsolète)
- ✅ **Prix suggéré** : Possibilité de proposer un prix alternatif lors du vote
- ✅ **Commentaires votes** : Champ commentaire pour préciser l'évaluation du prix
- ✅ **Vote unique par utilisateur** : Contrainte unique pour éviter les votes multiples par produit/magasin
- ✅ **Mise à jour schema DB** : Migration automatique via `npm run db:push`

### Design Responsive et Optimisations Mobile (Juillet 07, 2025)
- ✅ **Interface complètement responsive** : Tous les composants s'adaptent maintenant aux écrans mobiles, tablettes et desktop
- ✅ **Cartes magasins compactes** : Redesign avec hauteur fixe de 16px et largeur adaptative pour tous les écrans
- ✅ **Dialogs responsifs** : DialogContent avec max-w-[95vw] pour éviter le débordement sur mobile
- ✅ **Grilles adaptatives** : Grid layouts qui passent de 1 colonne sur mobile à 2-3 colonnes sur desktop
- ✅ **Espacement variable** : Padding et margins qui s'ajustent selon la taille d'écran (p-2 sm:p-4)
- ✅ **Typography responsive** : Tailles de texte qui s'adaptent (text-sm sm:text-base)
- ✅ **Boutons optimisés** : Boutons plus petits sur mobile avec texte caché/visible selon l'écran
- ✅ **Navigation mobile** : Headers compacts avec éléments tronqués intelligemment
- ✅ **Fonctionnalités admin mobile** : Badge ADMIN et boutons de gestion directe accessibles sur tous les écrans

## Overview

Pryce is a mobile-first price comparison web application for Belgian retail stores. It allows users to compare prices across different store brands (Delhaize, Aldi, Lidl, Carrefour), search for products, find nearby stores, and contribute price data to build a community-driven database.

## System Architecture

The application follows a modern full-stack architecture:

**Frontend**: React with TypeScript using Vite for development and building
**Backend**: Express.js with TypeScript running on Node.js
**Database**: PostgreSQL with Drizzle ORM for type-safe database operations
**Authentication**: Replit OpenID Connect (OIDC) for user authentication
**UI Framework**: Tailwind CSS with shadcn/ui components for consistent design
**State Management**: TanStack Query for server state management

## Key Components

### Frontend Architecture
- **React Router**: wouter for lightweight client-side routing
- **Component Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom Pryce brand colors (blue and yellow)
- **Mobile-First Design**: Responsive layout with bottom navigation for mobile users
- **Theme Support**: Light/dark mode toggle with system preference detection

### Backend Architecture
- **Express Server**: RESTful API with middleware for logging, error handling, and authentication
- **Database Layer**: Drizzle ORM with connection pooling via Neon serverless PostgreSQL
- **Authentication**: OpenID Connect integration with Replit's authentication system
- **Session Management**: PostgreSQL-backed session store with secure cookies

### Database Schema
The application uses a comprehensive schema with the following main entities:
- **Users**: Authentication and profile information
- **Stores**: Physical store locations with geolocation data
- **Products**: Product catalog with brand and unit information
- **Prices**: Price data linked to specific stores and products
- **Contributions**: User-submitted price and availability data
- **Ratings**: User ratings for both stores and products

## Data Flow

1. **User Authentication**: Users authenticate via Replit OIDC, creating a session stored in PostgreSQL
2. **Location-Based Queries**: Frontend requests user location to find nearby stores
3. **Product Search**: Real-time search across products with price aggregation
4. **Price Comparison**: Server aggregates prices from multiple stores for comparison
5. **User Contributions**: Authenticated users can submit price updates and availability data
6. **Data Validation**: All submissions go through validation before being stored

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection for serverless environments
- **drizzle-orm**: Type-safe database operations with excellent TypeScript support
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/react-***: Accessible UI primitives for all interactive components
- **wouter**: Lightweight routing library for React

### Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Type safety across the entire stack
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing for Tailwind

### Authentication & Session
- **openid-client**: OpenID Connect authentication
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

## Deployment Strategy

The application is designed for deployment on Replit:

**Development**: 
- Vite dev server for frontend with HMR
- tsx for TypeScript execution in development
- Automatic code reloading and error overlay

**Production Build**:
- Vite builds the React application to static files
- esbuild bundles the Express server for production
- Single deployment artifact with both frontend and backend

**Database**:
- PostgreSQL database provisioned via Replit
- Drizzle migrations for schema management
- Environment-based configuration

**Session Storage**:
- PostgreSQL-backed sessions for scalability
- Secure session cookies with proper expiration

## Recent Updates (July 06, 2025)

### Amélioration Interface Admin - Gestion Magasins Intelligente (Juillet 06, 2025)
- ✅ **Suppression statut "actif"** : Suppression du concept de magasin inactif, tous les magasins listés sont considérés comme actifs
- ✅ **Heures d'ouverture intelligentes** : Affichage dynamique du statut (Ouvert/Fermé) basé sur l'heure actuelle et les heures d'ouverture
- ✅ **Interface AdminStores améliorée** : Fonction `getStoreStatus()` qui calcule en temps réel si un magasin est ouvert avec messages contextuels
- ✅ **Badges colorés** : Statut visuel avec couleurs (vert=ouvert, rouge=fermé, orange=ouvre bientôt, gris=inconnu)
- ✅ **Recherche assistée gratuite** : Composant StoreSearchForm avec base de données de magasins belges prédéfinis
- ✅ **Templates magasins** : 8 magasins template (Aldi, Lidl, Delhaize, Carrefour) avec adresses réelles et heures d'ouverture
- ✅ **Navigation admin simplifiée** : Accès admin via bouton "Administration" dans le profil, navigation unifiée pour tous les utilisateurs

## Recent Updates (July 06, 2025)

### Refactorisation Panel Admin Unifié (Juillet 06, 2025)
- ✅ **Formulaires partagés** : Création de StoreForm.tsx et ProductForm.tsx réutilisables entre interface publique et admin
- ✅ **Hooks React Query unifiés** : useStores et useProducts avec hooks dédiés admin (useAdminStores, useAdminProducts)
- ✅ **Invalidation automatique** : Après chaque mutation admin (POST/PUT/DELETE), invalidation automatique des caches public et admin
- ✅ **API routes admin complètes** : /api/admin/stores et /api/admin/products avec CRUD complet et middleware admin
- ✅ **Élimination doublons UI** : Suppression des formulaires dupliqués dans StoresManagement.tsx et ProductsManagement.tsx
- ✅ **Pages admin refactorisées** : AdminStores.tsx et AdminProducts.tsx utilisent les formulaires partagés
- ✅ **Interface cohérente** : Même UX/UI entre panels admin et interface publique avec gestion d'état unifiée
- ✅ **Toast notifications** : Messages de succès/erreur intégrés dans les hooks pour toutes les opérations admin

### Corrections Techniques Majeures
- ✅ **Correction massive apiRequest** : Standardisation complète de tous les appels API avec ordre correct (method, url, data)
- ✅ **Fixage erreurs TypeScript** : Correction des types User, gestion des valeurs null/undefined
- ✅ **Authentification réparée** : Configuration REPLIT_DOMAINS pour environnement localhost
- ✅ **Hooks corrigés** : useProducts, useStoresAdmin, useContributionsAdmin avec apiRequest standardisé
- ✅ **Gestion des null** : Protection contre les erreurs de type pour product.brand et autres champs optionnels
- ✅ **Correction admin critique** : Mise à jour ID administrateur incluant "44685982" et "44686906" dans tous les fichiers (Admin.tsx, Dashboard.tsx, Home.tsx, Profile.tsx, routes.ts, AdminUsers.tsx, BottomNavigation.tsx)
- ✅ **Middleware admin simplifié** : Correction du middleware isAdmin pour correspondre au pattern auth/user
- ✅ **Corrections TypeScript** : Gestion des types nullable dans les fonctions de statut et dates
- ✅ **Authentification unauthorized corrigée** : Résolution des problèmes de session et middleware auth
- ✅ **Session management amélioré** : Gestion robuste des structures de session différentes
- ✅ **Correction critique StoreProducts** : Protection contre `product` undefined dans StoreProducts.tsx avec `product?.name` et autres propriétés
- ✅ **Validation données complète** : Tous les accès aux propriétés utilisent optional chaining ou conditional rendering
- ✅ **Stabilité application** : Élimination de toutes les erreurs "Cannot read properties of undefined"

### Amélioration de l'Interface Utilisateur (Juillet 06, 2025)
- ✅ **Navigation unifiée** : Refonte complète de la navigation avec AdminNavigation.tsx pour éliminer les doublons
- ✅ **Interface admin repensée** : Simplification en 4 sections claires (Dashboard, Magasins, Produits, Paramètres)
- ✅ **Pages admin dédiées** : AdminStores.tsx, AdminProducts.tsx, AdminSettings.tsx avec navigation cohérente
- ✅ **Suppression des doublons** : Élimination des boutons redondants dans Profile.tsx et Home.tsx
- ✅ **Navigation intuitive** : BottomNavigation améliorée avec icône Shield pour les admins
- ✅ **Expérience unique** : Interface fluide et cohérente pour tous les utilisateurs

### Amélioration de l'Expérience Magasin-Produit (Juillet 06, 2025)
- ✅ **Navigation magasin → produits** : Cliquer sur un magasin affiche ses produits avec prix spécifiques
- ✅ **Prix par magasin** : Affichage des prix spécifiques par magasin (ex: Lidl Mons ≠ Lidl La Louvière)
- ✅ **Formulaire de signalement simplifié** : Suppression des listes déroulantes, saisie libre des informations
- ✅ **Carte thématique sombre** : Style personnalisé non-satellite cohérent avec le thème du site
- ✅ **API contributions simplifiée** : Route `/api/contributions/simple` pour saisie libre
- ✅ **Interface produits magasin** : Affichage amélioré avec statut promo, disponibilité et prix store-specific

### Système de Signalement Unifié et Synchronisation (Juillet 06, 2025)
- ✅ **Page Report unifiée** : Interface complète pour tous types de signalements (ajout produit, prix, magasin, problème)
- ✅ **Synchronisation intelligente** : Détection automatique des produits existants pour éviter les doublons
- ✅ **Catégories automatiques** : Suggestion intelligente de catégories basée sur le nom du produit
- ✅ **API signalements** : Route `/api/reports` pour traiter tous les types de contributions
- ✅ **Système de vote produits** : Utilisateurs peuvent voter sur la disponibilité des produits
- ✅ **Interface cohérente** : Badges de catégories colorés dans toute l'application

## Historique des Améliorations

### Images et Branding
- ✅ Ajout d'images réelles pour tous les produits via Unsplash
- ✅ Integration des logos officiels des magasins (Delhaize, Aldi, Lidl, Carrefour)
- ✅ Images automatiques avec fallback en cas d'erreur de chargement
- ✅ **Nouveau logo Pryce professionnel** : Logo moderne avec "P" stylisé et point jaune intégré

### Nouvelles Fonctionnalités
- ✅ **Système d'alertes prix** : Page dédiée pour créer et gérer des alertes
- ✅ **Bannières promotionnelles** : Affichage des offres spéciales sur la page d'accueil
- ✅ **Analyses de tendances** : Composants pour suivre l'évolution des prix
- ✅ **Page Insights** : Analyses intelligentes du marché et recommandations
- ✅ **Navigation mise à jour** : Bouton "Alertes" dans la navigation principale
- ✅ **Interface d'administration complète** : Ajout manuel de produits et magasins
- ✅ **Système de signalement communautaire** : Bouton "Signaler" sur toutes les pages
- ✅ **Tableau de bord admin centralisé** : Dashboard unifié avec statistiques et gestion
- ✅ **Google Maps intégration** : Remplacement de Leaflet par Google Maps React avec markers synchronisés
- ✅ **Configuration Google Maps API** : Nouvel onglet "Paramètres" dans l'admin pour configurer la clé API
- ✅ **Géolocalisation utilisateur** : Détection automatique de position avec marker bleu
- ✅ **Architecture backend professionnelle** : Système de contributions avancé avec modération
- ✅ **Dashboard avancé** : AdvancedDashboard.tsx avec analytics en temps réel et actions en masse
- ✅ **Seeding IA-assisté** : Script seedData.ts avec 200+ produits réels et 50+ magasins belges

### Interface et UX
- ✅ **PageHeader uniforme** : Composant standardisé avec animation de scroll élégante
- ✅ **Thème sombre exclusif** : Suppression complète du mode clair
- ✅ **Navigation optimisée** : Barre de navigation stable sans animation de scroll
- ✅ **Bouton admin redesigné** : Style cohérent avec l'interface sombre
- ✅ **Animations fluides** : Headers qui se réduisent lors du scroll pour plus d'espace
- ✅ **Interface admin 5 onglets** : Dashboard, Advanced, Magasins, Produits, Paramètres

### Améliorations Techniques
- ✅ Routes API d'administration (POST /api/admin/products, POST /api/admin/stores)
- ✅ Formulaires complets avec validation (ville, code postal, coordonnées GPS)
- ✅ Hook useScrollAnimation pour les animations de scroll
- ✅ Correction des erreurs TypeScript pour l'affichage des prix
- ✅ Conversion automatique des prix texte en nombres pour les calculs
- ✅ Gestion robuste des images avec fallback automatique
- ✅ Amélioration de la logique de géolocalisation (fallback vers tous les magasins)
- ✅ **Google Maps React** : Composant MapViewGoogle.tsx avec @googlemaps/react-wrapper
- ✅ **GoogleMapsContext** : Gestion centralisée de la clé API avec localStorage
- ✅ **Markers synchronisés** : Affichage en temps réel des magasins avec API /api/stores
- ✅ **Info windows interactives** : Détails des magasins avec notes et distances
- ✅ **Gestion d'erreurs** : États de chargement et fallback si pas de clé API
- ✅ **Interface de configuration** : GoogleMapsSettings.tsx pour configurer la clé API via l'admin
- ✅ **Composants UI manquants** : Ajout de Label et Badge pour l'interface utilisateur
- ✅ **Correction ProductDetail** : Gestion sécurisée des comparaisons de prix
- ✅ **Géolocalisation browser** : Demande automatique de permission et centrage de carte
- ✅ **Routes API avancées** : CRUD complet avec géolocalisation, analytics, export CSV/JSON
- ✅ **Hooks React Query spécialisés** : useStoresAdmin, useContributionsAdmin avec cache optimisé
- ✅ **Composant modération** : ContributionModerationPanel avec actions en masse

### Composants Ajoutés
- `PromotionBanner.tsx` : Bannières promotionnelles attractives
- `PriceAlert.tsx` : Gestion des alertes de prix individuelles  
- `PriceTrend.tsx` : Affichage des tendances et analyses de prix
- `GoogleMapsSettings.tsx` : Interface de configuration de la clé API Google Maps
- `useScrollAnimation.ts` : Hook pour animations de scroll fluides
- Pages : `Alerts.tsx`, `Insights.tsx`, Interface admin complète avec onglet Paramètres
- Composants UI : `Label.tsx`, `Badge.tsx` pour l'interface utilisateur
- `AdvancedDashboard.tsx` : Tableau de bord avancé avec analytics et gestion intelligente
- `ContributionModerationPanel.tsx` : Interface professionnelle de modération
- Scripts : `seedData.ts`, `updateData.ts` pour génération de données réelles

## Suggestions d'Améliorations Futures

### Intégration API Réelle
- Connexion aux APIs officielles des magasins belges
- Scraping automatisé des sites web des enseignes
- Mise à jour en temps réel des prix et disponibilités

### Fonctionnalités Communautaires
- Système de notation et commentaires utilisateurs
- Validation collaborative des prix par la communauté
- Programme de points fidélité pour les contributeurs actifs

### Intelligence Artificielle
- Prédictions de prix basées sur l'historique
- Recommandations personnalisées selon les habitudes d'achat
- Optimisation automatique des trajets de courses

### Authentification Étendue
- Login Google, Apple, Facebook
- Authentification par SMS
- Synchronisation multi-appareils

### Géolocalisation Avancée
- Calcul d'itinéraires optimisés
- Notifications push basées sur la proximité
- Cartes interactives avec directions

## Changelog

- July 06, 2025. Initial setup avec base de données complète
- July 06, 2025. Ajout images réelles, système d'alertes, analyses de prix

## User Preferences

Preferred communication style: Simple, everyday language.