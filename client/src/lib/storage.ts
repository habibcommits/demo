import { UserPreferences, STORAGE_KEYS } from "@shared/schema";

// Get user preferences from localStorage
export function getUserPreferences(): UserPreferences {
  const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse user preferences", e);
    }
  }
  
  return {
    favorites: [],
    recentlyUsed: [],
    theme: "light",
  };
}

// Save user preferences to localStorage
export function saveUserPreferences(preferences: UserPreferences): void {
  localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
}

// Toggle favorite tool
export function toggleFavorite(toolId: string): void {
  const prefs = getUserPreferences();
  const index = prefs.favorites.indexOf(toolId);
  
  if (index > -1) {
    prefs.favorites.splice(index, 1);
  } else {
    prefs.favorites.push(toolId);
  }
  
  saveUserPreferences(prefs);
}

// Add tool to recently used
export function addToRecentlyUsed(toolId: string): void {
  const prefs = getUserPreferences();
  
  // Remove if already exists
  const index = prefs.recentlyUsed.indexOf(toolId);
  if (index > -1) {
    prefs.recentlyUsed.splice(index, 1);
  }
  
  // Add to beginning
  prefs.recentlyUsed.unshift(toolId);
  
  // Keep only last 10
  prefs.recentlyUsed = prefs.recentlyUsed.slice(0, 10);
  
  saveUserPreferences(prefs);
}

// Check if tool is favorited
export function isFavorite(toolId: string): boolean {
  const prefs = getUserPreferences();
  return prefs.favorites.includes(toolId);
}

// Get favorites
export function getFavorites(): string[] {
  const prefs = getUserPreferences();
  return prefs.favorites;
}

// Get recently used tools
export function getRecentlyUsed(): string[] {
  const prefs = getUserPreferences();
  return prefs.recentlyUsed;
}
