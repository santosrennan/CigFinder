import { create } from 'zustand';
import { startTransition } from 'react';
import type { Place } from '../types';
import { showToast } from '../components/Toast';

type FilterState = {
  brands: string[];
  accessories: string[];
  openNow: boolean;
  nearMe: boolean;
  userLoc?: { latitude: number; longitude: number };
};

type FilterActions = {
  toggle: (key: keyof Pick<FilterState, 'openNow' | 'nearMe'>) => void;
  setBrands: (brands: string[]) => void;
  addBrand: (brand: string) => void;
  removeBrand: (brand: string) => void;
  setAccessories: (accessories: string[]) => void;
  addAccessory: (accessory: string) => void;
  removeAccessory: (accessory: string) => void;
  reset: () => void;
  setUserLocation: (loc: { latitude: number; longitude: number } | undefined) => void;
  applyFilters: (places: Place[]) => Place[];
};

// Raio considerado "perto" em km
const NEARBY_RADIUS_KM = 5;

// Estado inicial
const initialState: FilterState = {
  brands: [],
  accessories: [],
  openNow: false,
  nearMe: false,
};

// Calcula a distância entre dois pontos (fórmula de Haversine)
const haversine = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distância em km
};

// Criação da store
export const useFilterStore = create<FilterState & FilterActions>((set, get) => ({
  ...initialState,

  // Alternância de estados booleanos
  toggle: (key) => {
    // Se estamos ativando o filtro de proximidade, verificamos a geolocalização
    if (key === 'nearMe') {
      const newValue = !get().nearMe;
      
      if (newValue && !get().userLoc) {
        // Verifica se o navegador suporta geolocalização
        if (!navigator.geolocation) {
          showToast('Seu navegador não suporta geolocalização.', 'error');
          return;
        }

        // Solicita a localização do usuário
        navigator.geolocation.getCurrentPosition(
          (position) => {
            set({
              userLoc: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              },
              nearMe: true
            });
            showToast('Localização obtida com sucesso!', 'success');
          },
          (error) => {
            console.error('Erro ao obter localização:', error);
            showToast('Não foi possível obter sua localização. Verifique as permissões do seu navegador.', 'error');
          },
          { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
        );
        return;
      }
    }
    
    // Para outros filtros, ou quando já temos a localização
    set((state) => ({ [key]: !state[key] }));
  },

  // Gerenciamento de marcas
  setBrands: (brands) => set({ brands }),
  
  addBrand: (brand) => set((state) => {
    if (state.brands.includes(brand)) return state;
    return { brands: [...state.brands, brand] };
  }),
  
  removeBrand: (brand) => set((state) => ({
    brands: state.brands.filter(b => b !== brand)
  })),

  // Gerenciamento de acessórios
  setAccessories: (accessories) => set({ accessories }),
  
  addAccessory: (accessory) => set((state) => {
    if (state.accessories.includes(accessory)) return state;
    return { accessories: [...state.accessories, accessory] };
  }),
  
  removeAccessory: (accessory) => set((state) => ({
    accessories: state.accessories.filter(a => a !== accessory)
  })),

  // Resetar filtros
  reset: () => set(initialState),

  // Definir localização do usuário
  setUserLocation: (loc) => set({ userLoc: loc }),

  // Aplicar filtros aos lugares
  applyFilters: (places) => {
    const { brands, accessories, openNow, nearMe, userLoc } = get();
    
    return places.filter((place) => {
      // Garantir que os arrays existam
      const availableBrands = place.available_brands || [];
      const availableAccessories = place.available_accessories || [];

      // Filtro por estado "aberto"
      if (openNow && place.open_status !== 'OPEN') {
        return false;
      }

      // Filtro por marcas
      if (brands.length > 0) {
        const hasMatchingBrand = brands.some(brand => 
          availableBrands.includes(brand)
        );
        if (!hasMatchingBrand) return false;
      }

      // Filtro por acessórios
      if (accessories.length > 0) {
        const hasMatchingAccessory = accessories.some(accessory => 
          availableAccessories.includes(accessory)
        );
        if (!hasMatchingAccessory) return false;
      }

      // Filtro por proximidade
      if (nearMe && userLoc) {
        const distance = haversine(
          userLoc.latitude,
          userLoc.longitude,
          place.latitude,
          place.longitude
        );
        
        if (distance > NEARBY_RADIUS_KM) return false;
      }

      return true;
    });
  }
}));

// Seletor para uso na UI - fornece API compatível com o useFilters anterior
export const useFiltersCompat = () => {
  const store = useFilterStore();
  
  // Função que envolve applyFilters com feedback para o usuário
  const enhancedApplyFilters = (places: Place[]) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    let results: Place[] = [];
    
    // Se a filtragem demorar mais de 50ms, mostrar toast de feedback
    timeoutId = setTimeout(() => showToast("Filtrando...", "info"), 50)
    
    // Usar startTransition para não bloquear a UI
    startTransition(() => {
      results = store.applyFilters(places);
      
      // Limpar o timeout se terminar antes dos 50ms
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    });
    
    return results;
  };
  
  return {
    // estado "legado"
    filters: {
      brands: store.brands,
      accessories: store.accessories,
      openNow: store.openNow,
      nearMe: store.nearMe,
    },
    
    // helpers de compatibilidade
    setFilters: (filters: Partial<FilterState>) => {
      if ('brands' in filters) store.setBrands(filters.brands || []);
      if ('accessories' in filters) store.setAccessories(filters.accessories || []);
      if ('openNow' in filters && filters.openNow !== store.openNow) store.toggle('openNow');
      if ('nearMe' in filters && filters.nearMe !== store.nearMe) store.toggle('nearMe');
    },
    
    // API principal
    applyFilters: enhancedApplyFilters,
    userLocation: store.userLoc,
    
    // atalhos requisitados pela Sidebar
    toggleOpenNow: () => store.toggle('openNow'),
    toggleNearMe: () => store.toggle('nearMe'),
    addBrand: store.addBrand,
    removeBrand: store.removeBrand,
    addAccessory: store.addAccessory,
    removeAccessory: store.removeAccessory,
    clearFilters: store.reset,
    
    // campo legado ainda usado em alguns componentes
    openOnly: store.openNow,
  };
};
