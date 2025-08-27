import { FavoriteUniversity, University } from '@/types/university';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@unifinder_favorites';

export class FavoritesService {
  static async getFavorites(): Promise<FavoriteUniversity[]> {
    try {
      const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY);
      if (favoritesJson) {
        const favorites = JSON.parse(favoritesJson);
        return favorites.map((fav: any) => ({
          ...fav,
          addedAt: new Date(fav.addedAt)
        }));
      }
      return [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  }

  static async addToFavorites(university: University): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const newFavorite: FavoriteUniversity = {
        ...university,
        id: `${university.name}-${university.country}-${Date.now()}`,
        addedAt: new Date()
      };
      
      const updatedFavorites = [...favorites, newFavorite];
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  }

  static async removeFromFavorites(universityId: string): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const updatedFavorites = favorites.filter(fav => fav.id !== universityId);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  }

  static async isFavorite(university: University): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      return favorites.some(fav => 
        fav.name === university.name && 
        fav.country === university.country
      );
    } catch (error) {
      console.error('Error checking if favorite:', error);
      return false;
    }
  }
} 