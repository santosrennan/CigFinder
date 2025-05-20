import { useState, useEffect, useCallback } from 'react';
import { showToast } from '../components/Toast';
import type { Place } from '../types';

interface FilterState {
  brands: string[];
  accessories: string[];
  openNow: boolean;
  nearMe: boolean;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

// Estado inicial
const initialState: FilterState = {
  brands: [],
  accessories: [],
  openNow: false,
  nearMe: false
};

// Raio máximo considerado "perto" (em km)
const NEARBY_RADIUS_KM = 5;

export function useFilters() {
  const [filters, setFilters] = useState<FilterState>(initialState);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);

  // Helpers para manipulação encapsulada de filtros
  const toggleOpenNow = useCallback(() => {
    setFilters(prev => ({ ...prev, openNow: !prev.openNow }));
  }, []);

  const addBrand = useCallback((brand: string) => {
    setFilters(prev => {
      if (prev.brands.includes(brand)) return prev;
      return { ...prev, brands: [...prev.brands, brand] };
    });
  }, []);

  const removeBrand = useCallback((brand: string) => {
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.filter(b => b !== brand)
    }));
  }, []);

  const addAccessory = useCallback((accessory: string) => {
    setFilters(prev => {
      if (prev.accessories.includes(accessory)) return prev;
      return { ...prev, accessories: [...prev.accessories, accessory] };
    });
  }, []);

  const removeAccessory = useCallback((accessory: string) => {
    setFilters(prev => ({
      ...prev,
      accessories: prev.accessories.filter(a => a !== accessory)
    }));
  }, []);

  const toggleNearMe = useCallback(() => {
    setFilters(prev => ({ ...prev, nearMe: !prev.nearMe }));
  }, []);

  // Reseta todos os filtros para o estado inicial
  const clearFilters = useCallback(() => {
    setFilters(initialState);
  }, []);

  // Atualiza um filtro específico (para compatibilidade)
  const updateFilter = useCallback(<K extends keyof FilterState>(
    key: K, 
    value: FilterState[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  // Obter localização do usuário quando o filtro nearMe for ativado (com otimização)
  useEffect(() => {
    // Só buscar localização se o usuário ativou o filtro e ainda não temos a localização
    if (filters.nearMe && !userLocation) {
      // Verificar se o navegador suporta geolocalização
      if (!navigator.geolocation) {
        console.error('Geolocalização não suportada pelo navegador');
        setFilters(prev => ({ ...prev, nearMe: false }));
        showToast('Seu navegador não suporta geolocalização. O filtro "Perto de mim" foi desativado.', 'error');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          showToast('Localização obtida com sucesso!', 'success');
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          // Desativa o filtro se a localização falhar
          setFilters(prev => ({ ...prev, nearMe: false }));
          showToast('Não foi possível obter sua localização. Verifique as permissões do seu navegador.', 'error');
        },
        // Opções para melhorar a experiência do usuário
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
      );
    }
  }, [filters.nearMe, userLocation]);

  // Calcula a distância entre dois pontos (fórmula de Haversine)
  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distância em km
  }, []);

  const applyFilters = useCallback((places: Place[]) => {
    return places.filter(place => {
      // Garantir que os arrays existam mesmo se não estiverem definidos
      const availableBrands = place.available_brands || [];
      const availableAccessories = place.available_accessories || [];

      // Filtro "Aberto agora"
      if (filters.openNow && place.open_status !== 'OPEN') {
        return false;
      }

      // Filtro por marcas de cigarros
      if (filters.brands.length > 0) {
        const hasMatchingBrand = filters.brands.some(brand => 
          availableBrands.includes(brand)
        );
        if (!hasMatchingBrand) return false;
      }

      // Filtro por acessórios
      if (filters.accessories.length > 0) {
        const hasMatchingAccessory = filters.accessories.some(accessory => 
          availableAccessories.includes(accessory)
        );
        if (!hasMatchingAccessory) return false;
      }

      // Filtro "Perto de mim" - utilizando geolocalização
      if (filters.nearMe && userLocation) {
        const distance = calculateDistance(
          userLocation.latitude, 
          userLocation.longitude,
          place.latitude,
          place.longitude
        );
        
        // Considera "perto" lugares até o raio definido
        if (distance > NEARBY_RADIUS_KM) return false;
      }

      return true;
    });
  }, [filters, userLocation, calculateDistance]);

  return {
    // Dados do estado
    filters,
    userLocation,
    
    // Métodos encapsulados para manipulação
    toggleOpenNow,
    addBrand,
    removeBrand,
    addAccessory,
    removeAccessory,
    toggleNearMe,
    clearFilters,
    
    // Métodos de aplicação de filtros
    applyFilters,
    
    // Para compatibilidade com código anterior
    setFilters,
    updateFilter,
    openOnly: filters.openNow
  };
} 