import { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MapView from '../components/MapView';
import PlaceModal from '../components/PlaceModal';
import QuickCheckInDialog from '../components/QuickCheckInDialog';
import AgeVerificationModal from '../components/AgeVerificationModal';
import { ToastContainer } from '../components/Toast';
import { usePlaces } from '../hooks/usePlaces';
import type { Place } from '../types';

export default function Home() {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const { isLoading, error } = usePlaces();
  
  const handlePlaceSelect = (place: Place) => {
    setSelectedPlace(place);
  };
  
  const handlePlaceClose = () => {
    setSelectedPlace(null);
  };

  // Overlay de loading / erro
  const renderOverlay = () => {
    if (error) {
      return (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-white bg-opacity-60 dark:bg-gray-900 dark:bg-opacity-60">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-elevation-2 max-w-md">
            <div className="text-red-600 dark:text-red-400 mb-2">
              {/* ícone de erro */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Erro ao carregar dados</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Não foi possível carregar os dados. Tente novamente mais tarde.
            </p>
            <div className="mt-4 text-center">
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-brand hover:bg-brand-light text-white rounded-md transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    if (isLoading) {
      return (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-white bg-opacity-60 dark:bg-gray-900 dark:bg-opacity-60">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin" />
            <p className="mt-3 text-gray-700 dark:text-gray-300">Carregando mapa...</p>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <AgeVerificationModal />
      <Header />

      {/* Container flex: sidebar + mapa ocupando 100% do restante */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 relative">
          {renderOverlay()}

          <MapView onPlaceSelect={handlePlaceSelect} />
          <QuickCheckInDialog />

          {selectedPlace && (
            <PlaceModal place={selectedPlace} onClose={handlePlaceClose} />
          )}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}
