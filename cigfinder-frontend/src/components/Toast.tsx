import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}

const Toast = ({ message, type = 'info', duration = 3000, onClose }: ToastProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) setTimeout(onClose, 300); // Delay para a animação de saída
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // Determina as classes de cor com base no tipo
  const getTypeClasses = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      default:
        return 'bg-brand text-white';
    }
  };

  // Determina o ícone com base no tipo
  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const toastClasses = `
    fixed bottom-4 left-1/2 transform -translate-x-1/2 
    max-w-md px-4 py-2 rounded-lg shadow-lg
    flex items-center space-x-2
    transition-all duration-300
    ${getTypeClasses()}
    ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
  `;

  // Usa createPortal para renderizar o toast no topo da hierarquia DOM
  return createPortal(
    <div 
      className={toastClasses}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex-shrink-0">
        {getIcon()}
      </div>
      <div>
        {message}
      </div>
      <button 
        onClick={() => {
          setVisible(false);
          if (onClose) setTimeout(onClose, 300);
        }}
        className="ml-2 text-white opacity-70 hover:opacity-100"
        aria-label="Fechar notificação"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>,
    document.body
  );
};

// Sistema de Toast global para fácil uso em qualquer componente
let toastId = 0;
const toasts: { id: number; props: ToastProps }[] = [];
let setToastsState: React.Dispatch<React.SetStateAction<{ id: number; props: ToastProps }[]>> | null = null;

// Componente de container para os toasts
export const ToastContainer = () => {
  const [toastsState, setToastsStateLocal] = useState<{ id: number; props: ToastProps }[]>([]);
  
  // Armazena o setState para uso global
  useEffect(() => {
    setToastsState = setToastsStateLocal;
    return () => {
      setToastsState = null;
    };
  }, []);

  return (
    <>
      {toastsState.map(({ id, props }) => (
        <Toast
          key={id}
          {...props}
          onClose={() => {
            const newToasts = toastsState.filter(t => t.id !== id);
            setToastsStateLocal(newToasts);
          }}
        />
      ))}
    </>
  );
};

// Funções para exibir toasts facilmente
export const showToast = (message: string, type: ToastType = 'info', duration?: number) => {
  const id = ++toastId;
  // Define duração default com base no tipo
  const defaultDuration = type === 'info' ? 2000 : 3000;
  const finalDuration = duration ?? defaultDuration;
  
  const newToast = { id, props: { message, type, duration: finalDuration } };
  
  if (setToastsState) {
    setToastsState(prev => [...prev, newToast]);
  } else {
    toasts.push(newToast);
    // Se o componente ToastContainer não estiver montado ainda, armazena para exibir depois
  }
  
  return id;
};

export const closeToast = (id: number) => {
  if (setToastsState) {
    setToastsState(prev => prev.filter(t => t.id !== id));
  }
};

export default Toast; 