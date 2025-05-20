import { useState } from 'react';
import { useFiltersCompat } from '../store/filterStore';
import { usePlaces } from '../hooks/usePlaces';
import { Button } from './ui/button';
import EmptyState from './EmptyState';
import { MultiSelect } from './ui/multi-select';
import type { Place } from '../types';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    filters, 
    applyFilters, 
    toggleOpenNow, 
    toggleNearMe,
    addBrand, 
    removeBrand, 
    addAccessory,
    removeAccessory,
    clearFilters 
  } = useFiltersCompat();
  const [isAccessoriesExpanded, setIsAccessoriesExpanded] = useState(false);
  const { data = [] } = usePlaces();
  const filtered = applyFilters(data);

  const cigaretteTypes = [
    { id: 'marlboro', name: 'Marlboro' },
    { id: 'lucky_strike', name: 'Lucky Strike' },
    { id: 'dunhill', name: 'Dunhill' },
    { id: 'parliament', name: 'Parliament' },
    { id: 'camel', name: 'Camel' },
    { id: 'winston', name: 'Winston' }
  ];

  const accessoryTypes = [
    { id: 'seda', name: 'Seda' },
    { id: 'piteira', name: 'Piteira' },
    { id: 'dechavador', name: 'Dechavador' },
    { id: 'isqueiro', name: 'Isqueiro' },
    { id: 'cinzeiro', name: 'Cinzeiro' }
  ];

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleAccessoryFilter = (value: string) => {
    if (filters.accessories.includes(value)) {
      removeAccessory(value);
    } else {
      addAccessory(value);
    }
  };

  const closeMenuOnSelect = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  const PlaceCard = ({ place }: { place: Place }) => (
    <div 
      key={place.place_id} 
      className="mb-3 p-4 bg-white dark:bg-gray-700 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-elevation-2"
    >
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1">{place.name}</h3>
        <span className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${
          place.open_status === 'OPEN'
            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
            : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
        }`}>
          {place.open_status === 'OPEN' ? 'Aberto' : 'Status desconhecido'}
        </span>
      </div>
      
      <div className="mt-2 flex items-center gap-3">
        <div className="flex items-center text-yellow-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="ml-1 text-sm">{place.google_rating}</span>
        </div>
        
        <div className="flex items-center text-gray-600 dark:text-gray-300">
          <span className="mr-1">🚬</span>
          <span className="text-sm">{place.cig_rating}</span>
        </div>
        
        <div className="text-gray-500 dark:text-gray-400 text-xs ml-auto">
          ~1.2 km
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Botão de menu mobile */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed bottom-6 left-6 z-40 w-12 h-12 rounded-full bg-brand text-white shadow-elevation-2 flex items-center justify-center"
        aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar principal */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-80 bg-white dark:bg-gray-800 shadow-elevation-2 transform transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:w-80 lg:flex-shrink-0 overflow-y-auto`}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Filtros</h2>
          
          {/* Opções rápidas (Topo) */}
          <div className="mb-6">
            <div className="flex flex-col space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="form-checkbox h-5 w-5 text-brand rounded border-gray-300 dark:border-gray-600"
                  checked={filters.openNow}
                  onChange={toggleOpenNow}
                />
                <span className="text-gray-700 dark:text-gray-300">Aberto agora</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="form-checkbox h-5 w-5 text-brand rounded border-gray-300 dark:border-gray-600"
                  checked={filters.nearMe}
                  onChange={toggleNearMe}
                />
                <span className="text-gray-700 dark:text-gray-300">Perto de mim</span>
              </label>
            </div>
          </div>
          
          {/* Seção de Cigarros */}
          <div className="mb-6">
            <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Marcas de Cigarro</h3>
            <MultiSelect 
              options={cigaretteTypes.map(type => ({ value: type.id, label: type.name }))}
              selected={filters.brands}
              onChange={(brands) => {
                const currentBrands = new Set(filters.brands);
                const newBrands = new Set(brands);
                
                // Identificar marcas adicionadas e removidas
                brands.forEach(brand => {
                  if (!currentBrands.has(brand)) {
                    addBrand(brand);
                  }
                });
                
                filters.brands.forEach(brand => {
                  if (!newBrands.has(brand)) {
                    removeBrand(brand);
                  }
                });
              }}
              placeholder="Selecione marcas..."
              className="text-gray-700 dark:text-gray-300"
            />
          </div>
          
          {/* Seção de Acessórios */}
          <div className="mb-6">
            <button 
              onClick={() => setIsAccessoriesExpanded(!isAccessoriesExpanded)}
              className="flex items-center justify-between w-full text-md font-semibold text-gray-900 dark:text-white mb-2"
            >
              <span>Acessórios</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 transition-transform ${isAccessoriesExpanded ? 'transform rotate-180' : ''}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {isAccessoriesExpanded && (
              <div className="space-y-2 mt-2 pl-1">
                {accessoryTypes.map((type) => (
                  <label key={type.id} className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="form-checkbox h-5 w-5 text-brand rounded border-gray-300 dark:border-gray-600"
                      checked={filters.accessories.includes(type.id)}
                      onChange={() => toggleAccessoryFilter(type.id)}
                    />
                    <span className="text-gray-700 dark:text-gray-300">{type.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          
          {/* Botões inferiores */}
          <div className="space-y-3">
            <button 
              onClick={clearFilters}
              className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Limpar filtros
            </button>
            
            <Button 
              onClick={closeMenuOnSelect}
              className="w-full"
            >
              Aplicar filtros
            </Button>
          </div>
          
          {/* Lista de resultados */}
          <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
              Resultados <span className="text-brand dark:text-brand-light">({filtered.length})</span>
            </h3>
            
            {filtered.length > 0 ? (
              <div className="space-y-3">
                {filtered.map((place) => (
                  <PlaceCard key={place.place_id} place={place} />
                ))}
              </div>
            ) : (
              <EmptyState 
                title="Sem resultados" 
                message="Tente ajustar seus filtros ou verificar outros estabelecimentos."
                action={
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={clearFilters}
                  >
                    Limpar filtros
                  </Button>
                }
              />
            )}
          </div>
        </div>
      </aside>
    </>
  );
} 