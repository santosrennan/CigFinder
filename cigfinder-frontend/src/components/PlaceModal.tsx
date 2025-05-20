import { useState, useEffect } from 'react';
import type { Place } from '../types';
import QuickCheckInDialog from './QuickCheckInDialog';
import { showToast } from './Toast';

interface PlaceModalProps {
  place: Place | null;
  onClose: () => void;
}

export default function PlaceModal({ place, onClose }: PlaceModalProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'cigarettes' | 'reviews'>('info');
  const [isVisible, setIsVisible] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);

  // Animação de entrada
  useEffect(() => {
    if (place) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 50);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [place]);

  // Fecha o modal com animação
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleCreateRoute = () => {
    // Em uma implementação real, isso abriria o Google Maps ou outra app de navegação
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${place?.latitude},${place?.longitude}`, '_blank');
  };

  const handleLike = () => {
    // Em uma implementação real, isso enviaria a avaliação para a API
    showToast('Obrigado por avaliar este local!', 'success');
  };

  const handleDislike = () => {
    // Em uma implementação real, isso enviaria a avaliação para a API
    showToast('Obrigado pelo feedback! Vamos melhorar.', 'info');
  };

  const handleOpenRating = () => {
    setIsRatingOpen(true);
  };

  const handleCloseRating = () => {
    setIsRatingOpen(false);
  };

  if (!place) return null;

  // Dados mockados de avaliações para demonstração
  const reviews = [
    { id: 1, userName: 'João Silva', rating: 4, text: 'Excelente variedade de cigarros e atendimento rápido!', date: '2 dias atrás' },
    { id: 2, userName: 'Maria Oliveira', rating: 5, text: 'Sempre tem todas as marcas que procuro.', date: '1 semana atrás' },
    { id: 3, userName: 'Carlos Santos', rating: 3, text: 'Bom lugar, mas às vezes falta Marlboro.', date: '2 semanas atrás' },
  ];

  return (
    <div>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300"
        style={{ opacity: isVisible ? 1 : 0 }}
        onClick={handleClose}
      >
        <div 
          className={`bg-white dark:bg-gray-800 rounded-xl shadow-elevation-3 w-full max-w-md overflow-hidden transition-all duration-300 ${
            isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header com imagem de fundo e título */}
          <div className="relative bg-brand/10 dark:bg-brand/20 h-36">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 flex flex-col justify-end p-4">
              <div className="flex justify-between items-start w-full">
                <h2 className="text-2xl font-bold text-white drop-shadow-sm">{place.name}</h2>
                <button 
                  onClick={handleClose}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div className="flex gap-2 mt-2">
                <span className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${
                  place.open_status === 'OPEN'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-500 text-white'
                }`}>
                  {place.open_status === 'OPEN' ? 'Aberto agora' : 'Status desconhecido'}
                </span>
                <span className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  1,2 km
                </span>
              </div>
            </div>
          </div>
          
          {/* Avaliações e ações rápidas */}
          <div className="flex justify-between items-center px-4 py-3 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-medium">{place.google_rating}</span>
              </div>
              <span className="mx-2 text-gray-300">|</span>
              <div className="flex items-center bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-2 py-1 rounded">
                <span className="mr-1">🚬</span>
                <span className="font-medium">{place.cig_rating}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button 
                onClick={handleLike}
                className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full transition-colors"
                title="Gostei deste local"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
              </button>
              <button 
                onClick={handleDislike}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                title="Não gostei deste local"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                </svg>
              </button>
              <button 
                onClick={handleOpenRating}
                className="text-sm text-brand dark:text-brand-light font-medium hover:underline"
              >
                Avaliar
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b dark:border-gray-700">
            <button
              className={`flex-1 py-3 font-medium text-center transition-colors duration-200 ${
                activeTab === 'info' 
                  ? 'text-brand dark:text-brand-light border-b-2 border-brand dark:border-brand-light' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('info')}
            >
              Informações
            </button>
            <button
              className={`flex-1 py-3 font-medium text-center transition-colors duration-200 ${
                activeTab === 'cigarettes' 
                  ? 'text-brand dark:text-brand-light border-b-2 border-brand dark:border-brand-light' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('cigarettes')}
            >
              Cigarros
            </button>
            <button
              className={`flex-1 py-3 font-medium text-center transition-colors duration-200 ${
                activeTab === 'reviews' 
                  ? 'text-brand dark:text-brand-light border-b-2 border-brand dark:border-brand-light' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              Avaliações
            </button>
          </div>
          
          {/* Conteúdo da Tab */}
          <div className="p-4 max-h-[60vh] overflow-y-auto">
            {activeTab === 'info' && (
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Detalhes do Local</h3>
                
                <div className="space-y-4">
                  <div className="flex">
                    <div className="w-10 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-600 dark:text-gray-300">{place.address}</p>
                      <div className="flex gap-2 mt-1">
                        <button 
                          onClick={handleCreateRoute}
                          className="text-sm text-brand dark:text-brand-light font-medium hover:underline flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
                          </svg>
                          Criar rota
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="w-10 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-300">
                        {place.open_status === 'OPEN'
                          ? 'Aberto agora • Fecha às 22:00'
                          : 'Horário de funcionamento desconhecido'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="w-10 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-300">(11) 5555-1234</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'cigarettes' && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-900 dark:text-white">Cigarros Disponíveis</h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Atualizado há 2h</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {['Marlboro', 'Lucky Strike', 'Dunhill', 'Parliament', 'Camel', 'Winston'].map((brand, index) => (
                    <div 
                      key={brand} 
                      className={`p-3 rounded-lg border ${
                        index < 4 
                          ? 'border-green-100 dark:border-green-800 bg-green-50 dark:bg-green-900/20' 
                          : 'border-red-100 dark:border-red-900 bg-red-50 dark:bg-red-900/20'
                      }`}
                    >
                      <div className="flex items-center">
                        {index < 4 ? (
                          <span className="w-5 h-5 mr-2 text-green-600 dark:text-green-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </span>
                        ) : (
                          <span className="w-5 h-5 mr-2 text-red-600 dark:text-red-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                        <span className={index < 4 ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}>
                          {brand}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Acessórios Disponíveis</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {['Seda', 'Isqueiro', 'Piteira', 'Dechavador'].map((accessory) => (
                      <div 
                        key={accessory} 
                        className="p-3 rounded-lg border border-green-100 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
                      >
                        <div className="flex items-center">
                          <span className="w-5 h-5 mr-2 text-green-600 dark:text-green-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </span>
                          <span className="text-green-800 dark:text-green-200">
                            {accessory}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between">
                  <button className="text-sm text-brand dark:text-brand-light font-medium hover:underline">
                    Ver mais marcas
                  </button>
                  <button className="text-sm bg-brand hover:bg-brand-light text-white px-3 py-1 rounded-full transition-colors">
                    Atualizar
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-900 dark:text-white">Avaliações dos Usuários</h3>
                  
                  <button 
                    onClick={handleOpenRating}
                    className="text-sm bg-brand hover:bg-brand-light text-white px-3 py-1 rounded-full transition-colors"
                  >
                    Avaliar
                  </button>
                </div>
                
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b dark:border-gray-700 pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 mr-2">
                              {review.userName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{review.userName}</p>
                              <div className="flex items-center">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <span key={star} className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}>
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{review.date}</span>
                        </div>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">{review.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">Ainda não há avaliações para este local.</p>
                    <button 
                      onClick={handleOpenRating}
                      className="mt-3 text-sm text-brand dark:text-brand-light font-medium hover:underline"
                    >
                      Seja o primeiro a avaliar
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {isRatingOpen && (
        <QuickCheckInDialog 
          place={place}
          isRating={true}
          onClose={handleCloseRating}
        />
      )}
    </div>
  );
} 