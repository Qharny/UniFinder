export interface University {
  name: string;
  country: string;
  alpha_two_code: string;
  domains: string[];
  web_pages: string[];
  state_province?: string;
}

export interface UniversitySearchResponse {
  data: University[];
  loading: boolean;
  error: string | null;
}

export interface FavoriteUniversity extends University {
  id: string;
  addedAt: Date;
}

export interface Country {
  name: string;
  code: string;
} 