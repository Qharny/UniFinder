import { University } from '@/types/university';

const BASE_URL = 'http://universities.hipolabs.com';

export class UniversityApiService {
  static async searchUniversities(country: string): Promise<University[]> {
    try {
      const response = await fetch(`${BASE_URL}/search?country=${encodeURIComponent(country)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data as University[];
    } catch (error) {
      console.error('Error fetching universities:', error);
      throw error;
    }
  }

  static async getAllUniversities(): Promise<University[]> {
    try {
      const response = await fetch(`${BASE_URL}/search`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data as University[];
    } catch (error) {
      console.error('Error fetching all universities:', error);
      throw error;
    }
  }
} 