interface MapApiHelpProps {
  apiKey?: string;
  errorDetails?: string;
}

export default function MapApiHelp({ apiKey, errorDetails }: MapApiHelpProps) {
  const displayApiKey = apiKey && apiKey.length > 8 
    ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`
    : 'Chave não definida';
    
  const exampleApiKey = import.meta.env.MODE === 'development' 
    ? 'YOUR_API_KEY_EXAMPLE'
    : displayApiKey;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-elevation-3 w-full max-w-md p-5">
        <div className="text-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-brand" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <h2 className="text-2xl font-bold mt-4 text-gray-900 dark:text-white">Erro na API do Google Maps</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Foram detectados problemas com a chave da API do Google Maps. Siga as instruções abaixo para corrigir.
          </p>
          {errorDetails && (
            <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm rounded">
              <p className="font-medium">Detalhes do erro:</p>
              <p>{errorDetails}</p>
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">Como resolver:</h3>
          
          <div className="space-y-4">
            <div className="flex">
              <div className="w-10 text-brand flex-shrink-0">
                <span className="flex items-center justify-center h-7 w-7 rounded-full bg-brand bg-opacity-20 text-brand">1</span>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-300">Acesse o <a href="https://console.cloud.google.com/apis/dashboard" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">Console do Google Cloud</a></p>
              </div>
            </div>
            
            <div className="flex">
              <div className="w-10 text-brand flex-shrink-0">
                <span className="flex items-center justify-center h-7 w-7 rounded-full bg-brand bg-opacity-20 text-brand">2</span>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-300">Selecione seu projeto e vá para "Credenciais"</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="w-10 text-brand flex-shrink-0">
                <span className="flex items-center justify-center h-7 w-7 rounded-full bg-brand bg-opacity-20 text-brand">3</span>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-300">Encontre sua chave de API e clique em "Editar"</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="w-10 text-brand flex-shrink-0">
                <span className="flex items-center justify-center h-7 w-7 rounded-full bg-brand bg-opacity-20 text-brand">4</span>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-300">Em "Restrições de API", verifique se "Maps JavaScript API" está ativada</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="w-10 text-brand flex-shrink-0">
                <span className="flex items-center justify-center h-7 w-7 rounded-full bg-brand bg-opacity-20 text-brand">5</span>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-300">Em "Restrições de Aplicação", adicione seu domínio:</p>
                <ul className="list-disc list-inside text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <li>Para desenvolvimento local: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">localhost</code> e <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">127.0.0.1</code></li>
                  <li>Para produção: seu domínio (ex: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">meusite.com</code>)</li>
                </ul>
              </div>
            </div>
            
            <div className="flex">
              <div className="w-10 text-brand flex-shrink-0">
                <span className="flex items-center justify-center h-7 w-7 rounded-full bg-brand bg-opacity-20 text-brand">6</span>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-300">Verifique se o faturamento está ativado (obrigatório mesmo para uso gratuito)</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="w-10 text-brand flex-shrink-0">
                <span className="flex items-center justify-center h-7 w-7 rounded-full bg-brand bg-opacity-20 text-brand">7</span>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-300">Lembre-se que pode levar alguns minutos para que as alterações tenham efeito</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 p-3 rounded">
            <p className="font-medium mb-1">Sua chave de API atual:</p>
            <code>{exampleApiKey}</code>
          </div>
          
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-brand hover:bg-brand-light text-white font-medium rounded-lg transition-colors duration-200"
            >
              Recarregar página
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 