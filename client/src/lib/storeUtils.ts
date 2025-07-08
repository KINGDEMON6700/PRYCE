export interface StoreStatus {
  status: string;
  text: string;
  color: "green" | "red" | "orange" | "gray";
}

/**
 * Calcule le statut d'un magasin en temps réel basé sur ses heures d'ouverture
 */
export function getStoreStatus(hours: any): StoreStatus {
  if (!hours || typeof hours !== 'object') {
    return { status: "Inconnu", text: "Heures non renseignées", color: "gray" };
  }
  
  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.getHours() * 100 + now.getMinutes(); // Format HHMM
  
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const todayKey = days[currentDay];
  const todayHours = hours[todayKey];
  
  if (!todayHours || todayHours === "Fermé") {
    return { status: "Fermé", text: "Fermé aujourd'hui", color: "red" };
  }
  
  // Parser les heures (ex: "09:00-18:00")
  const timeRange = todayHours.match(/(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})/);
  if (timeRange) {
    const openTime = parseInt(timeRange[1]) * 100 + parseInt(timeRange[2]);
    const closeTime = parseInt(timeRange[3]) * 100 + parseInt(timeRange[4]);
    
    if (currentTime >= openTime && currentTime <= closeTime) {
      return { status: "Ouvert", text: `Ouvert jusqu'à ${timeRange[3]}:${timeRange[4]}`, color: "green" };
    } else if (currentTime < openTime) {
      return { status: "Fermé", text: `Ouvre à ${timeRange[1]}:${timeRange[2]}`, color: "orange" };
    } else {
      return { status: "Fermé", text: `Fermé (ouvre demain)`, color: "red" };
    }
  }
  
  return { status: "Ouvert", text: todayHours, color: "green" };
}

/**
 * Retourne les classes CSS pour l'affichage du statut
 */
export function getStatusClasses(color: StoreStatus['color']) {
  switch (color) {
    case "green":
      return "bg-green-500";
    case "red":
      return "bg-red-500";
    case "orange":
      return "bg-orange-500";
    case "gray":
    default:
      return "bg-gray-500";
  }
}