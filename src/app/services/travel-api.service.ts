import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type PlaceCategory = 'sitio_turistico' | 'hotel' | 'restaurante';
export type UserRole = 'user' | 'admin';

export interface TravelUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  favorites: string[];
}

export interface ApiPlace {
  _id: string;
  name: string;
  category: PlaceCategory;
  description: string;
  address: string;
  province?: string;
  difficulty?: 'easy' | 'moderate' | 'hard';
  durationMinutes?: number;
  price?: number;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  images: string[];
}

export interface ApiWalk {
  _id: string;
  title: string;
  description: string;
  stops: (ApiPlace | string)[];
  route?: {
    type: 'LineString';
    coordinates: [number, number][];
  };
  plannedDate?: string;
  durationHours?: number;
  difficulty?: 'easy' | 'moderate' | 'hard';
  participants: number;
  preferences: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface AuthResponse {
  user: TravelUser;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class TravelApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api';

  register(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, { name, email, password });
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, { email, password });
  }

  getMe(token: string): Observable<{ user: TravelUser }> {
    return this.http.get<{ user: TravelUser }>(`${this.baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getPlaces(filters: {
    category?: PlaceCategory;
    province?: string;
    difficulty?: 'easy' | 'moderate' | 'hard';
    search?: string;
    sort?: 'recent' | 'name';
  } = {}): Observable<{ items: ApiPlace[]; page: number; limit: number; total: number }> {
    const params = new URLSearchParams({ limit: '100' });
    for (const [key, value] of Object.entries(filters)) {
      if (value) params.set(key, value);
    }
    return this.http.get<{ items: ApiPlace[]; page: number; limit: number; total: number }>(
      `${this.baseUrl}/places?${params.toString()}`
    );
  }

  getWalks(token: string): Observable<{ items: ApiWalk[] }> {
    return this.http.get<{ items: ApiWalk[] }>(`${this.baseUrl}/walks`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  createWalk(
    token: string,
    walk: {
      title: string;
      description: string;
      stops: string[];
      route?: { type: 'LineString'; coordinates: [number, number][] };
      plannedDate?: string;
      durationHours?: number;
      difficulty?: 'easy' | 'moderate' | 'hard';
      participants: number;
      preferences: string;
    }
  ): Observable<{ walk: ApiWalk }> {
    return this.http.post<{ walk: ApiWalk }>(`${this.baseUrl}/walks`, walk, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  updateWalk(token: string, id: string, walk: Partial<ApiWalk>): Observable<{ walk: ApiWalk }> {
    return this.http.patch<{ walk: ApiWalk }>(`${this.baseUrl}/walks/${id}`, walk, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  deleteWalk(token: string, id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/walks/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  setFavorite(token: string, placeId: string, favorite: boolean): Observable<{ user: TravelUser }> {
    const headers = { Authorization: `Bearer ${token}` };
    const url = `${this.baseUrl}/auth/favorites/${placeId}`;
    return favorite
      ? this.http.put<{ user: TravelUser }>(url, {}, { headers })
      : this.http.delete<{ user: TravelUser }>(url, { headers });
  }

  createPlace(
    token: string,
    place: {
      name: string;
      category: PlaceCategory;
      description: string;
      address: string;
      province?: string;
      difficulty?: 'easy' | 'moderate' | 'hard';
      durationMinutes?: number;
      price?: number;
      images?: string[];
      location: { type: 'Point'; coordinates: [number, number] };
    }
  ): Observable<{ place: ApiPlace }> {
    return this.http.post<{ place: ApiPlace }>(`${this.baseUrl}/places`, place, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}
