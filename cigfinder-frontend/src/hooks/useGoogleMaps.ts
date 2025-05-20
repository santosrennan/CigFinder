import { useJsApiLoader } from '@react-google-maps/api';
import { useState, useEffect } from 'react';

// Definição correta do tipo de bibliotecas para Google Maps
const libraries = ['places', 'geometry', 'visualization'] as ['places', 'geometry', 'visualization'];

// Obter a chave da API do arquivo .env
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY || '';

export function useGoogleMaps() {
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: libraries,
    version: 'weekly',
    language: 'pt-BR',
    region: 'BR',
    nonce: undefined,
    preventGoogleFontsLoading: false,
    // Adicionar parâmetros opcionais que podem ajudar com problemas específicos
    channel: 'cigfinder-app', // Ajuda a identificar tráfego no dashboard do Google Cloud
    authReferrerPolicy: 'origin' // Controle de segurança para referências
  });
  
  // Monitorar erros de carregamento e fornecer diagnósticos adicionais
  useEffect(() => {
    if (loadError) {
      console.error('Erro ao carregar Google Maps API:', loadError);
      
      let errorMessage = 'Erro desconhecido';
      
      // Tentar identificar o tipo de erro
      if (loadError.message) {
        if (loadError.message.includes('script error') || loadError.message.includes('network error')) {
          errorMessage = 'Erro de rede ao carregar o script do Google Maps API. Verifique sua conexão com a internet.';
        } else if (loadError.message.includes('api key')) {
          errorMessage = 'Problema com a chave da API do Google Maps. Verifique se a chave está correta e tem as permissões adequadas.';
        } else if (loadError.message.includes('billing')) {
          errorMessage = 'Problema com o faturamento do Google Maps API. Verifique seu console do Google Cloud para ativar o faturamento.';
        } else if (loadError.message.includes('referer') || loadError.message.includes('referrer')) {
          errorMessage = 'Problema com as restrições de origem da chave API. Adicione ' + window.location.origin + ' às origens permitidas.';
        } else {
          errorMessage = loadError.message;
        }
      }
      
      setErrorDetails(errorMessage);
      
      // Registrar informações úteis para debug
      console.debug('Informações do ambiente para debug:');
      console.debug('- URL atual:', window.location.href);
      console.debug('- Origem:', window.location.origin);
      console.debug('- Protocolo:', window.location.protocol);
      console.debug('- API Key (primeiros 5 caracteres):', apiKey.substring(0, 5) + '...');
    }
  }, [loadError]);
  
  return { isLoaded, loadError, errorDetails };
} 