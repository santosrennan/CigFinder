import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function AgeVerificationModal() {
  const [show, setShow] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Verifica se o usuário já aceitou antes
    const hasAccepted = localStorage.getItem('ageVerified') === 'true';
    
    if (!hasAccepted) {
      setShow(true);
      // Pequeno atraso para a animação
      setTimeout(() => {
        setIsVisible(true);
      }, 100);
    }
  }, []);

  // Focus trap e navegação por teclado
  useEffect(() => {
    if (!show) return;

    // Captura o elemento ativo atual para restaurar depois
    const previousActiveElement = document.activeElement as HTMLElement;
    
    // Foca o diálogo quando aberto
    if (dialogRef.current) {
      setTimeout(() => {
        const firstFocusableElement = dialogRef.current?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement;
        
        if (firstFocusableElement) {
          firstFocusableElement.focus();
        }
      }, 100);
    }

    // Handler para a tecla ESC
    const handleKeyDown = (e: KeyboardEvent) => {
      // Não permitimos fechar este modal com ESC, já que é essencial
      
      // Trap de foco para manter o foco dentro do modal
      if (e.key === 'Tab' && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
        
        // Shift+Tab volta para o último elemento quando no primeiro
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } 
        // Tab no último elemento vai para o primeiro
        else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      
      // Restaura o foco ao elemento anterior quando o modal é fechado
      if (previousActiveElement) {
        setTimeout(() => {
          previousActiveElement.focus();
        }, 0);
      }
    };
  }, [show]);

  const handleAccept = () => {
    setIsVisible(false);
    localStorage.setItem('ageVerified', 'true');
    
    setTimeout(() => {
      setShow(false);
    }, 300);
  };

  if (!show) return null;

  return createPortal(
    <div 
      className={`fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      role="dialog" 
      aria-modal="true"
      aria-labelledby="age-verification-title"
    >
      <div 
        ref={dialogRef}
        className={`bg-white dark:bg-gray-800 rounded-xl shadow-elevation-3 w-full max-w-md p-5 transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <div className="text-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-brand" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <h2 id="age-verification-title" className="text-2xl font-bold mt-4 text-gray-900 dark:text-white">Aviso de Idade</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Este site contém informações sobre produtos relacionados ao tabaco e é destinado apenas para maiores de 18 anos.
          </p>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
            Ao clicar em "Continuar", você confirma que tem pelo menos 18 anos de idade.
          </p>
          
          <div className="flex justify-center">
            <button
              onClick={handleAccept}
              className="px-6 py-2 bg-brand hover:bg-brand-light text-white font-medium rounded-lg transition-colors duration-200"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
} 