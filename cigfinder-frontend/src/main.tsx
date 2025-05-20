import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import Home from './pages/Home';
import './index.css';

const queryClient = new QueryClient();

function Fallback() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-2">Algo deu errado 😢</h1>
      <button
        className="px-4 py-2 bg-brand text-white rounded"
        onClick={() => window.location.reload()}
      >
        Recarregar
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={Fallback}>
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
