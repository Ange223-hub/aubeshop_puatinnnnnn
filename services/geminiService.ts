
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const verifyStudentId = async (base64Image: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
        { text: "Extrais les informations de cette carte d'étudiant de l'Université Aube Nouvelle (U-AUBEN). Retourne uniquement un JSON avec: full_name, student_id, major, expiry_date. Si ce n'est pas une carte U-AUBEN valide, retourne 'invalid'." }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          full_name: { type: Type.STRING },
          student_id: { type: Type.STRING },
          major: { type: Type.STRING },
          expiry_date: { type: Type.STRING },
          isValid: { type: Type.BOOLEAN }
        },
        required: ["full_name", "student_id", "isValid"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    return { isValid: false };
  }
};

export const getZoneFromCoordinates = async (lat: number, lng: number) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Tu es un expert du campus de l'Université Aube Nouvelle à Ouagadougou. Voici des coordonnées GPS : Lat ${lat}, Lng ${lng}. 
    Traduis ces coordonnées en un nom de zone compréhensible pour les étudiants (ex: Pavillon G, Faso Kanu, Administration, Entrée Principale, Cafétéria). 
    Réponds uniquement par le nom de la zone.`,
  });
  return response.text?.trim() || "Zone Inconnue";
};

export const parseSchedule = async (base64Image: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
        { text: "Analyse cette image d'emploi du temps étudiant. Identifie précisément les créneaux où l'étudiant a cours. Retourne un objet JSON contenant une liste 'busy_slots' où chaque élément a 'day' (Lundi, Mardi, etc.), 'start_time' et 'end_time'. Ajoute aussi une analyse textuelle 'ai_advice' suggérant les meilleurs moments pour faire des livraisons." }
      ]
    },
    config: {
      responseMimeType: "application/json",
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Erreur de parsing IA:", e);
    return null;
  }
};

export const getSmartRoute = async (origin: string, destination: string) => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `En tant qu'expert en trafic à Ouagadougou près de l'Université Aube Nouvelle, propose 3 raccourcis ou conseils de trajet pour aller de ${origin} à ${destination} en évitant les embouteillages classiques.`,
        config: {
            tools: [{ googleSearch: {} }]
        }
    });
    return response.text;
};
