import React, { useState, useEffect } from 'react';
import { XMarkIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const ChatbotJotForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Carrega o script do JotForm quando o componente é montado
    const script = document.createElement('script');
    script.src = 'https://cdn.jotfor.ms/agent/embedjs/019a12e0fc20710682ac5ddc13b9f8512a4a/embed.js';
    script.async = true;
    
    script.onload = () => {
      setIsLoaded(true);
      console.log('JotForm Agent carregado com sucesso');
    };

    script.onerror = () => {
      console.error('Erro ao carregar o JotForm Agent');
    };

    document.body.appendChild(script);

    // Cleanup
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Botão Flutuante */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-primary rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        aria-label="Abrir chat de atendimento"
      >
        <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
        
        {/* Efeito de pulsação */}
        <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20"></div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full mb-2 right-0 bg-dark text-white text-xs py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Precisa de ajuda?
        </div>
      </button>

      {/* Container do Chat */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
          
          {/* Header do Chat */}
          <div className="bg-primary rounded-t-2xl p-4 text-white flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Michely Massoterapia</h3>
                <p className="text-xs text-white text-opacity-80">Assistente Virtual</p>
              </div>
            </div>
            
            <button
              onClick={toggleChat}
              className="w-6 h-6 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors flex items-center justify-center"
              aria-label="Fechar chat"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Container do Embed JotForm */}
          <div className="flex-1 rounded-b-2xl overflow-hidden">
            {isLoaded ? (
              <div 
                id="jotform-agent-embed-019a12e0fc20710682ac5ddc13b9f8512a4a"
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-light">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-dark text-sm">Carregando atendimento...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotJotForm;