import {
  Component,
  OnInit,
  PLATFORM_ID,
  computed,
  inject,
  signal
} from '@angular/core';
import { DecimalPipe, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { TravelApiService, type ApiPlace, type ApiWalk, type PlaceCategory, type TravelUser } from './services/travel-api.service';

interface Destination {
  id?: string;
  name: string;
  category: PlaceCategory;
  description: string;
  address: string;
  province?: string;
  difficulty?: 'easy' | 'moderate' | 'hard';
  durationMinutes?: number;
  price?: number;
  image?: string;
  coordinates: [number, number];
}

const categoryLabels: Record<PlaceCategory, string> = {
  sitio_turistico: 'Naturaleza',
  hotel: 'Hospedaje',
  restaurante: 'Gastronomía'
};

@Component({
  imports: [DecimalPipe, FormsModule],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html'
})
export class App implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly api = inject(TravelApiService);
  private token: string | null = null;

  readonly places = signal<Destination[]>([]);
  readonly user = signal<TravelUser | null>(null);
  readonly savedWalks = signal<ApiWalk[]>([]);
  readonly selectedRoute = signal<string[]>([]);
  readonly activeCategory = signal<'all' | PlaceCategory>('all');
  readonly authModalOpen = signal(false);
  readonly authMode = signal<'login' | 'register'>('login');
  readonly mobileMenuOpen = signal(false);
  readonly authError = signal('');
  readonly walkMessage = signal('');
  readonly apiMessage = signal('Cargando destinos publicados.');
  readonly isSubmitting = signal(false);
  readonly isLoadingPlaces = signal(true);
  readonly isLoadingWalks = signal(false);
  readonly favoriteUpdating = signal<string | null>(null);
  readonly editingWalkId = signal<string | null>(null);
  readonly detailPlace = signal<Destination | null>(null);
  readonly isAdminFormOpen = signal(false);
  readonly routePlaces = computed(() =>
    this.places().filter((place) => this.selectedRoute().includes(this.placeKey(place)))
  );

  searchTerm = '';
  loginEmail = '';
  loginPassword = '';
  registerName = '';
  registerEmail = '';
  registerPassword = '';
  walkTitle = '';
  walkDescription = '';
  plannedDate = '';
  readonly minPlannedDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  durationHours = 4;
  walkDifficulty: 'easy' | 'moderate' | 'hard' = 'moderate';
  participants = 1;
  preferences = '';
  adminPlaceName = '';
  adminPlaceCategory: PlaceCategory = 'sitio_turistico';
  adminPlaceAddress = '';
  adminPlaceProvince = '';
  adminPlaceDescription = '';
  adminPlaceDifficulty: 'easy' | 'moderate' | 'hard' | '' = '';
  adminPlaceDuration = '';
  adminPlacePrice = '';
  adminPlaceImage = '';
  adminLatitude = '';
  adminLongitude = '';

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.loadPlaces();
    this.restoreSession();
    if (new URLSearchParams(window.location.search).get('login') === '1') this.openAuth('login');
  }

  get filteredPlaces(): Destination[] {
    const query = this.searchTerm.trim().toLocaleLowerCase();
    return this.places().filter((place) => {
      const matchesCategory = this.activeCategory() === 'all' || place.category === this.activeCategory();
      const matchesSearch =
        !query ||
        place.name.toLocaleLowerCase().includes(query) ||
        place.address.toLocaleLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }

  get selectedRouteNames(): string[] {
    return this.routePlaces().map((place) => place.name);
  }

  categoryName(category: PlaceCategory): string {
    return categoryLabels[category];
  }

  encodeURIComponent(value: string): string {
    return encodeURIComponent(value);
  }

  placeKey(place: Destination): string {
    return place.id ?? place.name;
  }

  toggleRoutePlace(place: Destination): void {
    const key = this.placeKey(place);
    this.selectedRoute.update((selected) =>
      selected.includes(key) ? selected.filter((item) => item !== key) : [...selected, key]
    );
    this.walkMessage.set('');
  }

  isFavorite(place: Destination): boolean {
    return !!place.id && (this.user()?.favorites ?? []).includes(place.id);
  }

  toggleFavorite(place: Destination): void {
    if (!place.id) return;
    if (!this.token || !this.user()) {
      this.openAuth('login');
      return;
    }

    this.favoriteUpdating.set(place.id);
    this.api.setFavorite(this.token, place.id, !this.isFavorite(place)).subscribe({
      next: ({ user }) => {
        this.user.set(user);
        this.favoriteUpdating.set(null);
      },
      error: (error: unknown) => {
        this.apiMessage.set(this.errorMessage(error, 'No se pudo actualizar el favorito.'));
        this.favoriteUpdating.set(null);
      }
    });
  }

  isOnRoute(place: Destination): boolean {
    return this.selectedRoute().includes(this.placeKey(place));
  }

  setCategory(category: 'all' | PlaceCategory): void {
    this.activeCategory.set(category);
  }

  scrollTo(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    this.mobileMenuOpen.set(false);
  }

  openAuth(mode: 'login' | 'register' = 'login'): void {
    this.authMode.set(mode);
    this.authError.set('');
    this.authModalOpen.set(true);
    this.mobileMenuOpen.set(false);
  }

  closeAuth(): void {
    this.authModalOpen.set(false);
    this.authError.set('');
  }

  submitAuth(): void {
    this.authError.set('');
    this.isSubmitting.set(true);
    const request =
      this.authMode() === 'register'
        ? this.api.register(this.registerName, this.registerEmail, this.registerPassword)
        : this.api.login(this.loginEmail, this.loginPassword);

    request.subscribe({
      next: (response) => {
        this.token = response.token;
        localStorage.setItem('senderos_token', response.token);
        this.user.set(response.user);
        this.isSubmitting.set(false);
        this.closeAuth();
        this.resetAuthForm();
        this.loadWalks();
      },
      error: (error: unknown) => {
        this.authError.set(this.errorMessage(error, 'No pudimos iniciar sesión. Revisa tus datos e inténtalo de nuevo.'));
        this.isSubmitting.set(false);
      }
    });
  }

  logout(): void {
    localStorage.removeItem('senderos_token');
    this.token = null;
    this.user.set(null);
    this.savedWalks.set([]);
    this.selectedRoute.set([]);
    this.editingWalkId.set(null);
  }

  saveWalk(): void {
    if (!this.token || !this.user()) {
      this.openAuth();
      return;
    }

    const selected = this.routePlaces();
    if (!selected.length) {
      this.walkMessage.set('Añade al menos un destino a tu caminata.');
      return;
    }
    if (selected.some((place) => !place.id)) {
      this.walkMessage.set('Solo puedes guardar destinos registrados en el catálogo.');
      return;
    }
    if (!this.plannedDate || new Date(`${this.plannedDate}T00:00:00`).getTime() < new Date(new Date().toDateString()).getTime()) {
      this.walkMessage.set('Selecciona una fecha de hoy o posterior.');
      return;
    }
    if (this.walkTitle.trim().length < 2) {
      this.walkMessage.set('Dale un nombre a tu caminata antes de guardarla.');
      return;
    }
    if (!Number.isFinite(this.durationHours) || this.durationHours < 0.5 || this.durationHours > 168) {
      this.walkMessage.set('La duración debe estar entre 0,5 y 168 horas.');
      return;
    }
    if (!Number.isInteger(this.participants) || this.participants < 1 || this.participants > 50) {
      this.walkMessage.set('Indica entre 1 y 50 participantes.');
      return;
    }

    this.isSubmitting.set(true);
    this.walkMessage.set('');
    const walk = {
      title: this.walkTitle.trim(),
      description: this.walkDescription.trim(),
      stops: selected.flatMap((place) => (place.id ? [place.id] : [])),
      plannedDate: this.plannedDate || undefined,
      durationHours: this.durationHours,
      difficulty: this.walkDifficulty,
      participants: this.participants,
      preferences: this.preferences.trim()
    };
    const editingId = this.editingWalkId();
    const request = editingId
      ? this.api.updateWalk(this.token, editingId, walk)
      : this.api.createWalk(this.token, walk);
    request.subscribe({
        next: ({ walk }) => {
          this.savedWalks.update((walks) => [
            walk,
            ...walks.filter((item) => item._id !== walk._id)
          ]);
          this.resetWalkForm();
          this.walkMessage.set('Tu planificación quedó guardada en tu cuenta.');
          this.isSubmitting.set(false);
        },
        error: (error: unknown) => {
          this.walkMessage.set(this.errorMessage(error, 'No se pudo guardar la caminata.'));
          this.isSubmitting.set(false);
        }
      });
  }

  editWalk(walk: ApiWalk): void {
    this.editingWalkId.set(walk._id);
    this.walkTitle = walk.title;
    this.walkDescription = walk.description;
    this.plannedDate = walk.plannedDate ? walk.plannedDate.slice(0, 10) : '';
    this.durationHours = walk.durationHours ?? 4;
    this.walkDifficulty = walk.difficulty ?? 'moderate';
    this.participants = walk.participants ?? 1;
    this.preferences = walk.preferences ?? '';
    this.selectedRoute.set(walk.stops.map((stop) => typeof stop === 'string' ? stop : stop._id));
    this.walkMessage.set('Editando tu planificación.');
    this.scrollTo('caminatas');
  }

  cancelWalkEdit(): void {
    this.resetWalkForm();
    this.walkMessage.set('');
  }

  deleteWalk(walk: ApiWalk): void {
    if (!this.token || !window.confirm(`¿Eliminar la caminata «${walk.title}»?`)) return;
    this.isSubmitting.set(true);
    this.api.deleteWalk(this.token, walk._id).subscribe({
      next: () => {
        this.savedWalks.update((walks) => walks.filter((item) => item._id !== walk._id));
        if (this.editingWalkId() === walk._id) this.resetWalkForm();
        this.walkMessage.set('La caminata se eliminó.');
        this.isSubmitting.set(false);
      },
      error: (error: unknown) => {
        this.walkMessage.set(this.errorMessage(error, 'No se pudo eliminar la caminata.'));
        this.isSubmitting.set(false);
      }
    });
  }

  updateWalkStatus(walk: ApiWalk, status: ApiWalk['status']): void {
    if (!this.token) return;
    this.api.updateWalk(this.token, walk._id, { status }).subscribe({
      next: ({ walk: updatedWalk }) => {
        this.savedWalks.update((walks) => walks.map((item) => item._id === updatedWalk._id ? updatedWalk : item));
      },
      error: (error: unknown) => this.walkMessage.set(this.errorMessage(error, 'No se pudo actualizar el estado.'))
    });
  }

  statusLabel(status: ApiWalk['status']): string {
    return {
      planned: 'Planificada',
      in_progress: 'En curso',
      completed: 'Completada',
      cancelled: 'Cancelada'
    }[status];
  }

  createPlace(): void {
    if (!this.token) return;
    if (!this.adminLatitude.trim() || !this.adminLongitude.trim()) {
      this.walkMessage.set('Ingresa las coordenadas verificadas del lugar antes de publicarlo.');
      return;
    }
    const latitude = Number(this.adminLatitude);
    const longitude = Number(this.adminLongitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
      this.walkMessage.set('Revisa las coordenadas: latitud entre -90 y 90, longitud entre -180 y 180.');
      return;
    }

    this.isSubmitting.set(true);
    this.api
      .createPlace(this.token, {
        name: this.adminPlaceName.trim(),
        category: this.adminPlaceCategory,
        description: this.adminPlaceDescription.trim(),
        address: this.adminPlaceAddress.trim(),
        province: this.adminPlaceProvince.trim() || undefined,
        difficulty: this.adminPlaceDifficulty || undefined,
        durationMinutes: this.adminPlaceDuration.trim() ? Number(this.adminPlaceDuration) : undefined,
        price: this.adminPlacePrice.trim() ? Number(this.adminPlacePrice) : undefined,
        images: this.adminPlaceImage.trim() ? [this.adminPlaceImage.trim()] : [],
        location: { type: 'Point', coordinates: [longitude, latitude] }
      })
      .subscribe({
        next: ({ place }) => {
          this.places.update((places) => [this.toDestination(place), ...places]);
          this.adminPlaceName = '';
          this.adminPlaceDescription = '';
          this.adminPlaceAddress = '';
          this.adminPlaceProvince = '';
          this.adminPlaceDifficulty = '';
          this.adminPlaceDuration = '';
          this.adminPlacePrice = '';
          this.adminPlaceImage = '';
          this.isAdminFormOpen.set(false);
          this.isSubmitting.set(false);
          this.apiMessage.set('Lugar añadido al mapa.');
        },
        error: (error: unknown) => {
          this.walkMessage.set(this.errorMessage(error, 'No se pudo añadir el lugar.'));
          this.isSubmitting.set(false);
        }
      });
  }

  formatDate(date: string): string {
    return new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date));
  }

  private loadPlaces(): void {
    this.api.getPlaces().subscribe({
      next: ({ items }) => {
        this.places.set(items.map((place) => this.toDestination(place)));
        this.apiMessage.set(items.length
          ? 'Lugares publicados desde nuestra guía.'
          : 'Aún no hay destinos publicados en el catálogo.');
        this.isLoadingPlaces.set(false);
      },
      error: (error: unknown) => {
        console.error('No se pudo cargar el catálogo de destinos.', error);
        this.places.set([]);
        this.apiMessage.set('No pudimos conectar con el catálogo. Inténtalo más tarde.');
        this.isLoadingPlaces.set(false);
      }
    });
  }

  private restoreSession(): void {
    const storedToken = localStorage.getItem('senderos_token');
    if (!storedToken) return;

    this.token = storedToken;
    this.api.getMe(storedToken).subscribe({
      next: ({ user }) => {
        this.user.set(user);
        this.loadWalks();
      },
      error: () => this.logout()
    });
  }

  private loadWalks(): void {
    if (!this.token) return;
    this.isLoadingWalks.set(true);
    this.api.getWalks(this.token).subscribe({
      next: ({ items }) => {
        this.savedWalks.set(items);
        this.isLoadingWalks.set(false);
      },
      error: (error: unknown) => {
        this.walkMessage.set(this.errorMessage(error, 'No se pudieron cargar tus caminatas.'));
        this.isLoadingWalks.set(false);
      }
    });
  }

  private toDestination(place: ApiPlace): Destination {
    return {
      id: place._id,
      name: place.name,
      category: place.category,
      description: place.description,
      address: place.address,
      province: place.province,
      difficulty: place.difficulty,
      durationMinutes: place.durationMinutes,
      price: place.price,
      image: place.images[0],
      coordinates: [place.location.coordinates[1], place.location.coordinates[0]],
    };
  }

  private resetWalkForm(): void {
    this.editingWalkId.set(null);
    this.walkTitle = '';
    this.walkDescription = '';
    this.plannedDate = '';
    this.durationHours = 4;
    this.walkDifficulty = 'moderate';
    this.participants = 1;
    this.preferences = '';
    this.selectedRoute.set([]);
  }

  private resetAuthForm(): void {
    this.loginEmail = '';
    this.loginPassword = '';
    this.registerName = '';
    this.registerEmail = '';
    this.registerPassword = '';
  }

  private errorMessage(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse && typeof error.error === 'object' && error.error !== null) {
      const message = (error.error as { error?: unknown }).error;
      if (typeof message === 'string') return message;
    }
    return fallback;
  }

}
